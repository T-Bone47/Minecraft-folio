export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ARIA live region announcement helper
export function announceToScreenReader(message: string): void {
  if (typeof document === "undefined") return;

  let announcer = document.getElementById("a11y-announcer");
  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "a11y-announcer";
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    document.body.appendChild(announcer);
  }

  announcer.textContent = "";
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 50);
}
