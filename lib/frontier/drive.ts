/** Metres, seconds and radians. A teaching model, not a professional vehicle simulator. */
export const TRACK_RADIUS = 45;
export const TRACK_HALF_WIDTH = 2.5;
export const FIXED_DT = 1 / 60;
export interface DriveInput {
    throttle: number;
    brake: number;
    steering: number;
}
export interface TelemetrySample {
    timestamp: number; yaw: number;
    x: number;
    z: number;
    speed: number;
    acceleration: number;
    throttle: number;
    brake: number;
    steering: number;
    lapProgress: number;
    sector: number;
    lapTime: number;
}
export interface DriveState { throttle: number; brake: number;
    x: number;
    z: number;
    yaw: number;
    speed: number;
    steering: number;
    time: number;
    progress: number;
    nextGate: number;
    sectors: number[];
    gateTime: number;
    completed: boolean;
    collisions: number;
}
export function newDrive(): DriveState { return { throttle:0, brake:0, x: -TRACK_RADIUS, z: 0, yaw: 0, speed: 0, steering: 0, time: 0, progress: 0, nextGate: 1, sectors: [], gateTime: 0, completed: false, collisions: 0 }; }
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
export function trackPhase(x: number, z: number) { return (Math.atan2(z, -x) + Math.PI * 2) % (Math.PI * 2); }
export function stepDrive(previous: DriveState, input: DriveInput, dt = FIXED_DT): {
    state: DriveState;
    sample: TelemetrySample;
} {
    const s = { ...previous, sectors: [...previous.sectors] };
    dt = clamp(dt, 0, 1 / 30);
    if (!s.completed) {
        const throttle = clamp(input.throttle, -1, 1), brake = clamp(input.brake, 0, 1); s.throttle=throttle;s.brake=brake;
        s.steering += (clamp(input.steering, -1, 1) * 0.55 / (1 + Math.abs(s.speed) * 0.025) - s.steering) * Math.min(1, dt * 9);
        const drag = 0.015 * s.speed * Math.abs(s.speed) + 0.35 * Math.sign(s.speed);
        s.speed = clamp(s.speed + (throttle * 8 - drag) * dt, -5, 22);
        s.speed = Math.sign(s.speed) * Math.max(0, Math.abs(s.speed) - brake * 18 * dt);
        s.yaw += s.speed / 2.8 * Math.tan(s.steering) * dt;
        s.x += Math.sin(s.yaw) * s.speed * dt;
        s.z += Math.cos(s.yaw) * s.speed * dt;
        const radius = Math.hypot(s.x, s.z), safeRadius = clamp(radius, TRACK_RADIUS - TRACK_HALF_WIDTH + 0.8, TRACK_RADIUS + TRACK_HALF_WIDTH - 0.8);
        if (radius !== safeRadius) {
            s.x *= safeRadius / radius;
            s.z *= safeRadius / radius;
            s.speed *= 0.75;
            s.collisions++;
        }
        const delta = Math.atan2(Math.sin(trackPhase(s.x, s.z) - trackPhase(previous.x, previous.z)), Math.cos(trackPhase(s.x, s.z) - trackPhase(previous.x, previous.z)));
        s.progress += delta;
        s.time += dt;
        if (s.nextGate <= 4 && s.progress >= s.nextGate * Math.PI / 2) {
            s.sectors.push(s.time - s.gateTime);
            s.gateTime = s.time;
            s.nextGate++;
            if (s.nextGate === 5)
                s.completed = true;
        }
    }
    return { state: s, sample: { timestamp: s.time, yaw:s.yaw, x: s.x, z: s.z, speed: s.speed, acceleration: dt ? (s.speed - previous.speed) / dt : 0, throttle: s.throttle, brake: s.brake, steering: s.steering, lapProgress: clamp(s.progress / (Math.PI * 2), 0, 1), sector: Math.min(4, s.nextGate), lapTime: s.time } };
}
/** Feedback controller used to generate a reproducible, checkpoint-valid reference. */
export function referenceInput(s: DriveState): DriveInput {
    const phase = trackPhase(s.x, s.z) + 0.18;
    const tx = -TRACK_RADIUS * Math.cos(phase), tz = TRACK_RADIUS * Math.sin(phase);
    const desired = Math.atan2(tx - s.x, tz - s.z);
    const error = Math.atan2(Math.sin(desired - s.yaw), Math.cos(desired - s.yaw));
    return { throttle: s.speed < 13 ? 1 : 0, brake: 0, steering: clamp(error * 2.5, -1, 1) };
}
export interface LapRecord {
    state: DriveState;
    samples: TelemetrySample[];
    source: "visitor" | "reference";
}
export function generateReference(): LapRecord {
    let state = newDrive();
    const samples: TelemetrySample[] = [];
    for (let i = 0; i < 60 * 120 && !state.completed; i++) {
        const result = stepDrive(state, referenceInput(state));
        state = result.state;
        if (i % 6 === 0 || state.completed)
            samples.push(result.sample);
    }
    if (!state.completed)
        throw new Error("Reference lap failed validation");
    return { state, samples, source: "reference" };
}

