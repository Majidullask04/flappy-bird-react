import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bird } from "./components/Bird";
import { Pipe } from "./components/Pipe";
import { Coin } from "./components/Coin";
import { HUD } from "./components/HUD";
import { GameOverModal } from "./components/GameOverModal";
import { Controls } from "./components/Controls";
import { useGameAudio } from "./hooks/useGameAudio";
import {
  BIRD_X,
  FLAP_VELOCITY,
  GAME_HEIGHT,
  GAME_WIDTH,
  GRAVITY,
  PIPE_SPAWN_INTERVAL,
  PIPE_SPEED,
  checkCollision,
  checkCoinCollection,
  createPipe,
  createCoinForPipe,
} from "./utils/physics";

export default function App() {
  const [status, setStatus] = useState("ready"); // "ready" | "playing" | "gameover"
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(() => {
    const saved = localStorage.getItem("flappy-react-coins");
    return saved ? Number(saved) : 0;
  });
  const [best, setBest] = useState(() => {
    const saved = localStorage.getItem("flappy-react-best");
    return saved ? Number(saved) : 0;
  });
  const [isNewHigh, setIsNewHigh] = useState(false);

  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2 - 20);
  const [rotation, setRotation] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [coinsList, setCoinsList] = useState([]);

  // Loop & physics refs
  const frameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const birdYRef = useRef(GAME_HEIGHT / 2 - 20);
  const velocityRef = useRef(0);
  const pipesRef = useRef([]);
  const coinsRef = useRef([]);
  const pipeIdRef = useRef(1);
  const coinIdRef = useRef(1);
  const scoreRef = useRef(0);
  const coinsCountRef = useRef(0);

  const audio = useGameAudio();

  const resetGame = useCallback(() => {
    pipeIdRef.current = 1;
    coinIdRef.current = 1;
    const firstPipe = createPipe(pipeIdRef.current++, GAME_WIDTH + 80);
    const firstCoin = createCoinForPipe(coinIdRef.current++, firstPipe.x, firstPipe.gapY);

    birdYRef.current = GAME_HEIGHT / 2 - 20;
    velocityRef.current = 0;
    pipesRef.current = [firstPipe];
    coinsRef.current = [firstCoin];
    spawnTimerRef.current = 0;
    lastTimeRef.current = 0;
    scoreRef.current = 0;
    coinsCountRef.current = 0;
    audio.stopGameplayLoop();

    setBirdY(GAME_HEIGHT / 2 - 20);
    setRotation(0);
    setPipes([firstPipe]);
    setCoinsList([firstCoin]);
    setScore(0);
    setCoins(0);
    setIsNewHigh(false);
    setStatus("ready");
  }, []);

  const flap = useCallback(() => {
    if (status === "gameover") return;

    audio.playFlap();
    velocityRef.current = FLAP_VELOCITY;

    if (status === "ready") {
      setStatus("playing");
    }
  }, [audio, status]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        flap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flap]);

  // Main requestAnimationFrame Game Loop
  useEffect(() => {
    const tick = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      // Delta time in seconds, capped at 0.033s (30fps min limit to avoid teleports)
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.033);
      lastTimeRef.current = timestamp;

      if (status === "ready") {
        // Subtle floating motion on start screen
        const floatY = GAME_HEIGHT / 2 - 20 + Math.sin(timestamp / 250) * 8;
        setBirdY(floatY);
        setRotation(0);
      } else if (status === "playing") {
        // 1. Update Physics
        velocityRef.current += GRAVITY * dt;
        birdYRef.current += velocityRef.current * dt;

        // Rotation dynamic pitch
        const nextRotation = Math.min(
          85,
          Math.max(-25, velocityRef.current * 0.12)
        );

        // 2. Pipe & Coin Spawning
        spawnTimerRef.current += dt;
        if (spawnTimerRef.current >= PIPE_SPAWN_INTERVAL) {
          spawnTimerRef.current = 0;
          const newPipe = createPipe(pipeIdRef.current++, GAME_WIDTH + 20);
          const newCoin = createCoinForPipe(coinIdRef.current++, newPipe.x, newPipe.gapY);
          pipesRef.current.push(newPipe);
          coinsRef.current.push(newCoin);
        }

        // 3. Move Pipes
        let gainedPoints = 0;
        const updatedPipes = [];

        for (const pipe of pipesRef.current) {
          const nextX = pipe.x - PIPE_SPEED * dt;

          let passed = pipe.passed;
          if (!passed && nextX + 60 < BIRD_X) {
            passed = true;
            gainedPoints += 1;
          }

          if (nextX > -80) {
            updatedPipes.push({
              ...pipe,
              x: nextX,
              passed,
            });
          }
        }
        pipesRef.current = updatedPipes;

        // 4. Move Coins & Check Pickup Collisions
        const updatedCoins = [];
        for (const coin of coinsRef.current) {
          const nextX = coin.x - PIPE_SPEED * dt;
          let collected = coin.collected;

          if (!collected && checkCoinCollection(birdYRef.current, { ...coin, x: nextX })) {
            collected = true;
            coinsCountRef.current += 1;
            scoreRef.current += 2; // Bonus score for collecting coins!
            setCoins(coinsCountRef.current);
            setScore(scoreRef.current);

            setTotalCoins((prev) => {
              const nextTotal = prev + 1;
              localStorage.setItem("flappy-react-coins", String(nextTotal));
              if (nextTotal % 10 === 0) {
                audio.playCoinCollect();
              }
              return nextTotal;
            });
          }

          if (nextX > -60) {
            updatedCoins.push({
              ...coin,
              x: nextX,
              collected,
            });
          }
        }
        coinsRef.current = updatedCoins;

        // 5. Handle Pipe Score Increment
        if (gainedPoints > 0) {
          scoreRef.current += gainedPoints;
          setScore(scoreRef.current);
          audio.playGameplayLoop();
          audio.playScore();

          if (scoreRef.current > best) {
            setBest(scoreRef.current);
            setIsNewHigh(true);
            localStorage.setItem("flappy-react-best", String(scoreRef.current));
          }
        }

        // 6. Check Collisions
        if (checkCollision(birdYRef.current, updatedPipes)) {
          audio.stopGameplayLoop();
          audio.playHit();
          setTimeout(() => audio.playDie(), 150);
          audio.playGameOver();
          setStatus("gameover");
        }

        // 7. Update UI States
        setBirdY(birdYRef.current);
        setRotation(nextRotation);
        setPipes(updatedPipes);
        setCoinsList(updatedCoins);
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [audio, best, status]);

  return (
    <div className="page">
      <header className="header-title">
        <span>🐦</span> FLAPPY BIRD
      </header>

      <main className="game-shell" onPointerDown={flap}>
        {/* Background Clouds */}
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />

        {/* Dynamic Pipes */}
        {pipes.map((pipe) => (
          <Pipe key={pipe.id} pipe={pipe} />
        ))}

        {/* Shiny Coins */}
        {coinsList.map((coin) => (
          <Coin key={coin.id} coin={coin} />
        ))}

        {/* Player Bird */}
        <Bird x={BIRD_X} y={birdY} rotation={rotation} status={status} />

        {/* Ground */}
        <div className={`ground ${status === "playing" ? "moving" : ""}`}>
          <div className="ground-grass" />
        </div>

        {/* Score & Coins HUD */}
        <HUD score={score} coins={coins} best={best} status={status} />

        {/* Start Overlay */}
        {status === "ready" && (
          <div className="overlay ready-overlay">
            <div className="ready-card">
              <h1 className="ready-title">READY?</h1>
              <div className="ready-prompt">Click, Tap or press Space</div>
              <button
                className="btn-start"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={flap}
              >
                START
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {status === "gameover" && (
          <GameOverModal
            score={score}
            coins={coins}
            totalCoins={totalCoins}
            best={best}
            isNewHigh={isNewHigh}
            onRestart={resetGame}
          />
        )}
      </main>

      {/* Controls & Sound Bar */}
      <Controls muted={audio.muted} onToggleMute={audio.toggleMute} />
    </div>
  );
}
