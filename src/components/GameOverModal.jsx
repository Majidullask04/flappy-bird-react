import React from "react";

export function GameOverModal({ score, coins, totalCoins, best, isNewHigh, onRestart }) {
  let medal = null;
  let medalClass = "";

  if (score >= 50) {
    medal = "💎 Platinum";
    medalClass = "medal-platinum";
  } else if (score >= 25) {
    medal = "🥇 Gold";
    medalClass = "medal-gold";
  } else if (score >= 10) {
    medal = "🥈 Silver";
    medalClass = "medal-silver";
  } else if (score >= 5) {
    medal = "🥉 Bronze";
    medalClass = "medal-bronze";
  }

  return (
    <div className="overlay modal-overlay">
      <div className="score-card">
        <h2 className="game-over-title">GAME OVER</h2>

        <div className="score-board">
          <div className="medal-section">
            <span className="label">MEDAL</span>
            {medal ? (
              <div className={`medal-badge ${medalClass}`}>{medal}</div>
            ) : (
              <div className="medal-none">None</div>
            )}
            <div className="modal-coins-badge">🪙 +{coins} Coins</div>
          </div>

          <div className="scores-section">
            <div className="score-item">
              <span className="label">SCORE</span>
              <span className="val">{score}</span>
            </div>

            <div className="score-item">
              <span className="label">BEST</span>
              <span className="val">
                {best} {isNewHigh && <span className="new-badge">NEW!</span>}
              </span>
            </div>

            <div className="score-item">
              <span className="label">TOTAL COINS</span>
              <span className="val coin-val">🪙 {totalCoins}</span>
            </div>
          </div>
        </div>

        <button
          className="btn-restart"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onRestart}
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}

