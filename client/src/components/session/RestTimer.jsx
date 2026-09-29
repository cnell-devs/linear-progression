/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";

const PRESETS = [60, 90, 120, 180];

// Counts down from the moment a set is checked off. Pinned above the bottom
// nav so it stays visible while the user scrolls through their exercises.
export const RestTimer = ({ startedAt, duration, onDismiss, onSetDuration }) => {
  const [remaining, setRemaining] = useState(duration);
  const alerted = useRef(false);

  useEffect(() => {
    alerted.current = false;
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(duration - elapsed);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [startedAt, duration]);

  // Vibrate once when rest is up — the phone is usually face-down on a bench.
  useEffect(() => {
    if (remaining <= 0 && !alerted.current) {
      alerted.current = true;
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, [remaining]);

  const done = remaining <= 0;
  const display = done
    ? "Rest done"
    : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
  const progress = done
    ? 100
    : Math.min(100, ((duration - remaining) / duration) * 100);

  return (
    <div
      className={`fixed bottom-16 left-0 right-0 z-30 border-t px-4 py-2 transition-colors ${
        done ? "bg-success text-success-content" : "bg-base-200"
      }`}
    >
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <span className="material-icons text-xl">timer</span>
        <span className="min-w-[4.5rem] font-mono text-lg font-bold tabular-nums">
          {display}
        </span>

        <div className="flex-1">
          <progress
            className={`progress w-full ${done ? "" : "progress-primary"}`}
            value={progress}
            max="100"
          />
        </div>

        <div className="hidden gap-1 sm:flex">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              className={`btn btn-xs ${
                duration === preset ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => onSetDuration(preset)}
            >
              {preset < 120 ? `${preset}s` : `${preset / 60}m`}
            </button>
          ))}
        </div>

        <button
          className="btn btn-sm btn-ghost btn-square"
          onClick={onDismiss}
          aria-label="Dismiss rest timer"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
    </div>
  );
};
