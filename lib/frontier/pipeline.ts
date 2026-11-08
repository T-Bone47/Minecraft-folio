export const pipelineStages = ["Data source", "Ingestion adapter", "Parsing", "Normalisation", "Validation", "Processing", "Storage", "API", "WebSocket delivery", "Visualisation"] as const;
export type FaultId = "malformed" | "duplicates" | "out-of-order" | "delayed" | "backlog" | "schema" | "missing";
export type RepairId = "none" | "quarantine" | "deduplicate" | "reorder" | "wait" | "scale" | "adapter";
export interface WireEvent {
    arrival: number;
    payload: string;
}
export interface CanonicalEvent {
    id: string;
    timestamp: number;
    speed: number;
}
export const incidents: Record<FaultId, {
    title: string;
    stage: number;
    hint: string;
}> = {
    malformed: { title: "Incident A / parser halt", stage: 2, hint: "Processing stops at event 12. Compare the raw payload with its neighbours." },
    duplicates: { title: "Incident B / inflated counts", stage: 4, hint: "Storage contains more records than the source sequence. Inspect event identities." },
    "out-of-order": { title: "Incident C / time moves backwards", stage: 3, hint: "All payloads are valid, but the consumer sees decreasing timestamps." },
    delayed: { title: "Incident D / late arrivals", stage: 1, hint: "The source emits 60 events; the delivery deadline expires before all reach ingestion." },
    backlog: { title: "Incident E / queue pressure", stage: 5, hint: "Input cadence exceeds processing capacity. Increasing validation strictness will not drain a queue." },
    schema: { title: "Incident F / provider change", stage: 1, hint: "Version 2 sends velocity rather than speed. Inspect provider data before changing consumers." },
    missing: { title: "Incident G / incomplete sample", stage: 4, hint: "One payload is valid JSON but lacks a required numeric channel." }
};
export const repairs: Record<RepairId, string> = { none: "Observe without changes", quarantine: "Quarantine invalid records and continue", deduplicate: "Deduplicate by stable event ID", reorder: "Buffer and order by event timestamp", wait: "Extend the bounded arrival deadline", scale: "Increase processing capacity", adapter: "Map provider v2 into canonical v1" };
export function makeIncident(id: FaultId): WireEvent[] {
    const events = Array.from({ length: 60 }, (_, i) => ({ arrival: i * 10, payload: JSON.stringify({ version: 1, id: `evt-${i}`, timestamp: i * 10, speed: 20 + i % 12 }) }));
    if (id === "malformed")
        events.splice(12, 0, { arrival: 120, payload: '{"id": broken-json' });
    if (id === "missing")
        events.splice(12, 0, { arrival: 120, payload: JSON.stringify({ version: 1, id: "incomplete", timestamp: 120 }) });
    if (id === "duplicates")
        events.splice(12, 0, { ...events[11], arrival: 120 });
    if (id === "out-of-order") {
        const temp = events[12].payload;
        events[12].payload = events[30].payload;
        events[30].payload = temp;
    }
    if (id === "delayed")
        events.forEach((e, i) => { if (i >= 40)
            e.arrival += 4000; });
    if (id === "schema")
        events.forEach(e => { const v = JSON.parse(e.payload); e.payload = JSON.stringify({ version: 2, id: v.id, timestamp: v.timestamp, velocity: v.speed }); });
    return events;
}
export interface PipelineResult {
    processed: number;
    rejected: number;
    validationFailures: number;
    backlog: number;
    latency: number;
    throughput: number;
    recovered: boolean;
    output: CanonicalEvent[];
    trace: string[];
    stageCounts: number[];
    duration: number;
    undelivered: number;
}
export function runPipeline(fault: FaultId, repair: RepairId): PipelineResult {
    const wire = makeIncident(fault), deadline = repair === "wait" ? 7000 : 2000, service = fault === "backlog" && repair !== "scale" ? 100 : 20, trace: string[] = [], output: CanonicalEvent[] = [], queue: {
        event: CanonicalEvent;
        arrival: number;
    }[] = [], seen = new Set<string>();
    let rejected = 0, validationFailures = 0, halted = false, clock = 0, totalLatency = 0;
    for (const item of wire) {
        if (item.arrival > deadline)
            continue;
        let raw: Record<string, unknown>;
        try {
            raw = JSON.parse(item.payload);
        }
        catch {
            validationFailures++;
            trace.push(`Parsing: malformed payload at arrival ${item.arrival} ms`);
            if (repair === "quarantine") {
                rejected++;
                continue;
            }
            halted = true;
            break;
        }
        if (repair === "adapter" && raw.version === 2) {
            raw = { ...raw, version: 1, speed: raw.velocity };
        }
        if (raw.version !== 1 || typeof raw.id !== "string" || typeof raw.timestamp !== "number" || !Number.isFinite(raw.timestamp) || typeof raw.speed !== "number" || !Number.isFinite(raw.speed)) {
            validationFailures++;
            trace.push(`Validation: schema mismatch for ${String(raw.id)}`);
            if (repair === "quarantine") {
                rejected++;
                continue;
            }
            halted = true;
            break;
        }
        const event: CanonicalEvent = { id: raw.id, timestamp: raw.timestamp, speed: raw.speed };
        if (repair === "deduplicate" && seen.has(event.id)) {
            rejected++;
            trace.push(`Validation: duplicate ${event.id} rejected`);
            continue;
        }
        seen.add(event.id);
        queue.push({ event, arrival: item.arrival });
    }
    if (repair === "reorder")
        queue.sort((a, b) => a.event.timestamp - b.event.timestamp);
    // A reordering repair deliberately waits for this finite batch before serving.
    if (repair === "reorder")
        clock = Math.max(0, ...queue.map(q => q.arrival));
    for (const item of queue) {
        clock = Math.max(clock, item.arrival) + service;
        if (clock > deadline)
            break;
        output.push(item.event);
        totalLatency += clock - item.arrival;
    }
    const backlog = queue.length - output.length, unique = new Set(output.map(e => e.id)), ordered = output.every((e, i) => i === 0 || e.timestamp >= output[i - 1].timestamp), undelivered = wire.filter(e => e.arrival > deadline).length;
    const recovered = !halted && unique.size === 60 && output.length === 60 && ordered && backlog === 0 && undelivered === 0;
    trace.push(`Storage: ${output.length} records / ${unique.size} unique IDs`, `Consumer timestamps: ${ordered ? "monotonic" : "out of order"}`, `Queue: ${backlog}; late arrivals: ${undelivered}`, `Invariant: exactly 60 unique, ordered source events ${recovered ? "PASS" : "FAIL"}`);
    return { processed: output.length, rejected, validationFailures, backlog, latency: output.length ? totalLatency / output.length : 0, throughput: output.length / (deadline / 1000), recovered, output, trace, stageCounts: [wire.length, wire.length - undelivered, queue.length, queue.length, queue.length, output.length, output.length, output.length, output.length, output.length], duration: deadline, undelivered };
}
