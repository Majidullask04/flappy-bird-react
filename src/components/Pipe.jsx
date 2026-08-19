import React from "react";
import { GAME_HEIGHT, GROUND_HEIGHT, PIPE_GAP, PIPE_WIDTH } from "../utils/physics";

export function Pipe({ pipe }) {
  const topHeight = pipe.gapY;
  const bottomTop = pipe.gapY + PIPE_GAP;
  const bottomHeight = GAME_HEIGHT - GROUND_HEIGHT - bottomTop;

  return (
    <div className="pipe-pair" style={{ left: `${pipe.x}px`, width: `${PIPE_WIDTH}px` }}>
      {/* Top Pipe */}
      <div
        className="pipe pipe-top"
        style={{
          height: `${topHeight}px`,
        }}
      >
        <div className="pipe-cap" />
      </div>

      {/* Bottom Pipe */}
      <div
        className="pipe pipe-bottom"
        style={{
          top: `${bottomTop}px`,
          height: `${Math.max(0, bottomHeight)}px`,
        }}
      >
        <div className="pipe-cap" />
      </div>
    </div>
  );
}
