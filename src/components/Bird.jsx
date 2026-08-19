import React from "react";
import { BIRD_SIZE } from "../utils/physics";

export function Bird({ x, y, rotation, status }) {
  const isFlapping = status === "playing" || status === "ready";

  return (
    <div
      className={`bird ${isFlapping ? "flapping" : "falling"}`}
      style={{
        width: `${BIRD_SIZE}px`,
        height: `${BIRD_SIZE}px`,
        left: `${x}px`,
        top: `${y}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <img
        className="bird-image"
        src="/images/player.png"
        alt="Player character"
      />
    </div>
  );
}
