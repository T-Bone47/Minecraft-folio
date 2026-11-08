# Vehicle state and telemetry

Authoritative active state is `DriveableF1Car`'s simulation ref, advanced by `stepDrive` at fixed 1/60 s. Render transforms, front wheels, cockpit wheel, texture, camera and recording consume that state. Zustand publishes a 10 Hz snapshot for HTML UI; it does not run a second simulation. Control inputs are clamped into state before telemetry capture.

Telemetry schema 2 adds yaw for replay. Samples include timestamp, x/z, yaw, speed, acceleration, smoothed steering, throttle, brake, progress, sector and lap time. Positions are metres, time seconds, steering/yaw radians, inputs fractions. Recording is bounded at 6000 samples. Four gates must be crossed in order before a lap is complete. The reference uses the same integrator and gate logic.

Debrief includes speed/reference traces, brake, throttle and steering traces, sector comparison, JSON export and a 10 Hz recorded top-down replay with steering indicator. Replay reads stored samples and cannot modify the vehicle. Its visual steering ratio matches the wheel; it is not a full 3D replay. No real motorsport data is implied. This single-lap educational model has no gear, engine, tyre or aero simulation.
