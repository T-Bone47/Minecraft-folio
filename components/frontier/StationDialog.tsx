"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function StationDialog({ title, onClose, children }: {
    title: string;
    onClose: () => void;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const close = useRef(onClose);
    close.current = onClose;
    useEffect(() => { const previous = document.activeElement as HTMLElement | null; if (document.pointerLockElement)
        document.exitPointerLock(); ref.current?.focus(); const key = (e: KeyboardEvent) => { if (e.key === "Escape") {
        e.stopImmediatePropagation();
        close.current();
    } if (e.key === "Tab") {
        const elements = ref.current?.querySelectorAll<HTMLElement>('button,a[href],select,input,[tabindex="0"]');
        if (!elements?.length)
            return;
        const first = elements[0], last = elements[elements.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
            e.preventDefault();
            last.focus();
        }
        else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    } }; window.addEventListener("keydown", key, true); return () => { window.removeEventListener("keydown", key, true); previous?.focus(); }; }, []);
    return <div className="frontier-backdrop"><div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="frontier-station"><header><div><small>ASISH / ENGINEERING FIELD STATION</small><h2>{title}</h2></div><button onClick={onClose} aria-label="Close station">✕</button></header>{children}</div></div>;
}
