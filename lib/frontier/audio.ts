const unit = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
/** Speed-driven sound synthesis; these values do not represent drivetrain RPM. */
export function drivingSoundTargets(speedRatio: number, throttle: number) {
  const speed = unit(speedRatio), power = unit(Math.abs(throttle));
  return { frequency: 65 + speed * 320, cutoff: 300 + power * 1200 + speed * 800, gain: .18 + power * .18 };
}
