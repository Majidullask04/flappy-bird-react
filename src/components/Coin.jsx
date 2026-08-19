import React from "react";
import { COIN_SIZE } from "../utils/physics";

export function Coin({ coin }) {
  if (coin.collected) return null;

  return (
    <div
      className="coin"
      style={{
        width: `${COIN_SIZE}px`,
        height: `${COIN_SIZE}px`,
        left: `${coin.x}px`,
        top: `${coin.y}px`,
      }}
    >
      <div className="coin-inner">⭐</div>
    </div>
  );
}
