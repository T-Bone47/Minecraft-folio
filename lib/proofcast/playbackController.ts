/**
 * FRONTIER PROOFCAST — PLAYBACK CONTROLLER
 * State management and event loop for interactive engineering documentary playback.
 */

import type { PlaybackState, ProofCastBeat, ProofCastStory } from "./types";

export type PlaybackListener = (state: PlaybackState) => void;

export class ProofCastPlaybackController {
  private story: ProofCastStory;
  private state: PlaybackState;
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<PlaybackListener> = new Set();
  private lastTick: number = 0;

  constructor(story: ProofCastStory) {
    this.story = story;
    this.state = {
      isPlaying: false,
      currentTime: 0,
      activeBeatIndex: 0,
      playbackSpeed: 1,
      isInspecting: false,
      inspectedBeat: null,
      mode: story.mode,
      role: story.role,
    };
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }

  public getState(): PlaybackState {
    return { ...this.state };
  }

  public getStory(): ProofCastStory {
    return this.story;
  }

  public getActiveBeat(): ProofCastBeat {
    return this.story.beats[this.state.activeBeatIndex] || this.story.beats[0];
  }

  public play(): void {
    if (this.state.isPlaying) return;
    this.state.isPlaying = true;
    this.state.isInspecting = false;
    this.lastTick = performance.now();

    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 50);
    this.notify();
  }

  public pause(): void {
    if (!this.state.isPlaying) return;
    this.state.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public togglePlay(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(seconds: number): void {
    const boundedTime = Math.max(0, Math.min(seconds, this.story.totalDurationSeconds));
    this.state.currentTime = boundedTime;
    this.updateActiveBeatIndex();
    this.notify();
  }

  public jumpToChapter(chapterIndex: number): void {
    const targetBeat = this.story.beats[chapterIndex];
    if (targetBeat) {
      this.seek(targetBeat.timestampStart);
    }
  }

  public inspectBeat(beat?: ProofCastBeat): void {
    this.pause();
    this.state.isInspecting = true;
    this.state.inspectedBeat = beat || this.getActiveBeat();
    this.notify();
  }

  public closeInspection(): void {
    this.state.isInspecting = false;
    this.state.inspectedBeat = null;
    this.notify();
  }

  public setSpeed(speed: number): void {
    this.state.playbackSpeed = speed;
    this.notify();
  }

  public updateStory(newStory: ProofCastStory): void {
    this.pause();
    this.story = newStory;
    this.state.currentTime = 0;
    this.state.activeBeatIndex = 0;
    this.state.mode = newStory.mode;
    this.state.role = newStory.role;
    this.state.inspectedBeat = null;
    this.state.isInspecting = false;
    this.notify();
  }

  public dispose(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.listeners.clear();
  }

  private tick(): void {
    const now = performance.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    const nextTime = this.state.currentTime + dt * this.state.playbackSpeed;
    if (nextTime >= this.story.totalDurationSeconds) {
      this.state.currentTime = this.story.totalDurationSeconds;
      this.updateActiveBeatIndex();
      this.pause();
    } else {
      this.state.currentTime = nextTime;
      this.updateActiveBeatIndex();
      this.notify();
    }
  }

  private updateActiveBeatIndex(): void {
    const time = this.state.currentTime;
    let index = 0;
    for (let i = 0; i < this.story.beats.length; i++) {
      const b = this.story.beats[i];
      if (time >= b.timestampStart && time < b.timestampStart + b.duration) {
        index = i;
        break;
      }
      if (time >= b.timestampStart + b.duration && i === this.story.beats.length - 1) {
        index = i;
      }
    }
    if (this.state.activeBeatIndex !== index) {
      this.state.activeBeatIndex = index;
    }
  }
}

