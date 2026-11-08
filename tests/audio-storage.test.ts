import test from "node:test";
import assert from "node:assert/strict";
import { WorldSoundManager } from "../lib/audio";

test("denied audio preference storage does not prevent mute or volume controls", () => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() { throw new Error("Browser storage denied"); },
    });
    const audio = new WorldSoundManager();
    assert.equal(audio.getIsMuted(), true);
    assert.doesNotThrow(() => audio.setMuted(false));
    assert.equal(audio.getIsMuted(), false);
    audio.setVolume(.3);
    assert.equal(audio.getVolume(), .3);
    assert.doesNotThrow(() => audio.setMuted(true));
    assert.equal(audio.getIsMuted(), true);
  } finally {
    if (windowDescriptor) Object.defineProperty(globalThis, "window", windowDescriptor);
    else Reflect.deleteProperty(globalThis, "window");
    if (storageDescriptor) Object.defineProperty(globalThis, "localStorage", storageDescriptor);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
