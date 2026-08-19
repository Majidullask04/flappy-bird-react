import React from "react";

export function Controls({ muted, onToggleMute }) {
  return (
    <footer className="controls-bar">
      <button
        className={`audio-btn ${muted ? "muted" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleMute();
        }}
        title={muted ? "Unmute Sound" : "Mute Sound"}
        aria-label={muted ? "Unmute Sound" : "Mute Sound"}
      >
        {muted ? "🔇 Sound Off" : "🔊 Sound On"}
      </button>

      <div className="instructions-badge">
        <span>Controls:</span> <code>Space</code> / <code>↑</code> / <code>Click</code> / <code>Tap</code>
      </div>
    </footer>
  );
}
