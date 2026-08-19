import React from "react";

export function HUD({ score, coins, best, status }) {
  if (status === "gameover") return null;

  return (
    <div className="hud">
      <div className="hud-score">{score}</div>
      <div className="hud-badges">
        {status === "playing" && <span className="hud-best">BEST: {best}</span>}
        <span className="hud-coins">🪙 {coins}</span>
      </div>
    </div>
  );
}

