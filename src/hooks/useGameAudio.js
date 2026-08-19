import { useCallback, useEffect, useRef, useState } from "react";

export function useGameAudio() {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem("flappy-muted") === "true";
  });

  const audioCtxRef = useRef(null);
  const gameOverAudioRef = useRef(null);
  const gameplayAudioRef = useRef(null);
  const coinCollectAudioRef = useRef(null);

  useEffect(() => {
    const gameOverAudio = new Audio("/audio/game-over.mp3");
    gameOverAudio.preload = "auto";
    gameOverAudioRef.current = gameOverAudio;

    const gameplayAudio = new Audio("/audio/gameplay-loop.mp3");
    gameplayAudio.loop = true;
    gameplayAudio.preload = "auto";
    gameplayAudioRef.current = gameplayAudio;

    const coinCollectAudio = new Audio("/audio/coin-collect.mp3");
    coinCollectAudio.preload = "auto";
    coinCollectAudioRef.current = coinCollectAudio;

    return () => {
      gameOverAudio.pause();
      gameplayAudio.pause();
      coinCollectAudio.pause();
      gameOverAudioRef.current = null;
      gameplayAudioRef.current = null;
      coinCollectAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (muted && gameplayAudioRef.current) {
      gameplayAudioRef.current.pause();
    }
    if (muted && coinCollectAudioRef.current) {
      coinCollectAudioRef.current.pause();
    }
  }, [muted]);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;

    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    ({ freqStart, freqEnd, duration, type = "sine", volume = 0.08 }) => {
      if (muted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        const now = ctx.currentTime;

        osc.frequency.setValueAtTime(freqStart, now);
        if (freqEnd && freqEnd !== freqStart) {
          osc.frequency.exponentialRampToValueAtTime(
            Math.max(20, freqEnd),
            now + duration
          );
        }

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      } catch (err) {
        // Audio play error ignored gracefully
      }
    },
    [getAudioContext, muted]
  );

  const playFlap = useCallback(() => {
    playTone({
      freqStart: 420,
      freqEnd: 780,
      duration: 0.09,
      type: "square",
      volume: 0.05,
    });
  }, [playTone]);

  const playScore = useCallback(() => {
    // Two-tone chime
    playTone({
      freqStart: 587.33, // D5
      freqEnd: 587.33,
      duration: 0.08,
      type: "sine",
      volume: 0.07,
    });
    setTimeout(() => {
      playTone({
        freqStart: 880, // A5
        freqEnd: 880,
        duration: 0.15,
        type: "sine",
        volume: 0.08,
      });
    }, 60);
  }, [playTone]);

  const playHit = useCallback(() => {
    playTone({
      freqStart: 160,
      freqEnd: 40,
      duration: 0.18,
      type: "sawtooth",
      volume: 0.1,
    });
  }, [playTone]);

  const playDie = useCallback(() => {
    playTone({
      freqStart: 400,
      freqEnd: 90,
      duration: 0.35,
      type: "sawtooth",
      volume: 0.08,
    });
  }, [playTone]);

  const playGameOver = useCallback(() => {
    if (muted || !gameOverAudioRef.current) return;

    try {
      const gameOverAudio = gameOverAudioRef.current;
      gameOverAudio.currentTime = 0;
      gameOverAudio.play().catch(() => {
        // Browser autoplay errors are ignored gracefully.
      });
    } catch (err) {
      // Audio play errors are ignored gracefully.
    }
  }, [muted]);

  const playGameplayLoop = useCallback(() => {
    if (muted || !gameplayAudioRef.current) return;

    try {
      const gameplayAudio = gameplayAudioRef.current;
      if (gameplayAudio.paused) {
        gameplayAudio.play().catch(() => {
          // Browser autoplay errors are ignored gracefully.
        });
      }
    } catch (err) {
      // Audio play errors are ignored gracefully.
    }
  }, [muted]);

  const stopGameplayLoop = useCallback(() => {
    if (!gameplayAudioRef.current) return;

    gameplayAudioRef.current.pause();
    gameplayAudioRef.current.currentTime = 0;
  }, []);

  const playCoinCollect = useCallback(() => {
    if (muted || !coinCollectAudioRef.current) return;

    try {
      const coinCollectAudio = coinCollectAudioRef.current;
      coinCollectAudio.currentTime = 0;
      coinCollectAudio.play().catch(() => {
        // Browser autoplay errors are ignored gracefully.
      });
    } catch (err) {
      // Audio play errors are ignored gracefully.
    }
  }, [muted]);

  const playMedal = useCallback(() => {
    playTone({
      freqStart: 523.25,
      freqEnd: 659.25,
      duration: 0.2,
      type: "triangle",
      volume: 0.08,
    });
  }, [playTone]);

  const playCoin = useCallback(() => {
    // Bright sparkling coin chime
    playTone({
      freqStart: 987.77, // B5
      freqEnd: 1318.51, // E6
      duration: 0.12,
      type: "sine",
      volume: 0.09,
    });
  }, [playTone]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem("flappy-muted", String(next));
      return next;
    });
  }, []);

  return {
    muted,
    toggleMute,
    playFlap,
    playScore,
    playCoin,
    playHit,
    playDie,
    playGameOver,
    playGameplayLoop,
    stopGameplayLoop,
    playCoinCollect,
    playMedal,
  };
}
