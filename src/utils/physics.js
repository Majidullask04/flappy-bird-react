export const GAME_WIDTH = 360;
export const GAME_HEIGHT = 640;
export const GROUND_HEIGHT = 70;

export const BIRD_X = 70;
export const BIRD_SIZE = 30;

// Easier Physics Controls
export const GRAVITY = 1100; // pixels / second^2 (gentler gravity)
export const FLAP_VELOCITY = -380; // pixels / second (smooth jump impulse)

export const PIPE_WIDTH = 60;
export const PIPE_GAP = 180; // Wider gap for easier gameplay
export const PIPE_SPEED = 145; // Slower scroll speed for better reaction time
export const PIPE_SPAWN_INTERVAL = 1.6; // Seconds between pipe spawns

export const COIN_SIZE = 24;

export function randomGapY() {
  const min = 100;
  const max = GAME_HEIGHT - GROUND_HEIGHT - 100 - PIPE_GAP;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createPipe(id, startX) {
  const gapY = randomGapY();
  return {
    id,
    x: startX,
    gapY,
    passed: false,
  };
}

export function createCoinForPipe(id, pipeX, gapY) {
  return {
    id,
    x: pipeX + (PIPE_WIDTH - COIN_SIZE) / 2,
    y: gapY + (PIPE_GAP - COIN_SIZE) / 2,
    collected: false,
  };
}

export function checkCollision(birdY, pipes) {
  const birdLeft = BIRD_X;
  const birdRight = BIRD_X + BIRD_SIZE;
  const birdTop = birdY;
  const birdBottom = birdY + BIRD_SIZE;

  // Ceiling or Ground collision
  if (birdTop <= 0 || birdBottom >= GAME_HEIGHT - GROUND_HEIGHT) {
    return true;
  }

  // Pipe collisions
  for (const pipe of pipes) {
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + PIPE_WIDTH;

    // Check X overlap
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      const gapTop = pipe.gapY;
      const gapBottom = pipe.gapY + PIPE_GAP;

      if (birdTop < gapTop || birdBottom > gapBottom) {
        return true;
      }
    }
  }

  return false;
}

export function checkCoinCollection(birdY, coin) {
  if (coin.collected) return false;

  const birdLeft = BIRD_X;
  const birdRight = BIRD_X + BIRD_SIZE;
  const birdTop = birdY;
  const birdBottom = birdY + BIRD_SIZE;

  const coinLeft = coin.x;
  const coinRight = coin.x + COIN_SIZE;
  const coinTop = coin.y;
  const coinBottom = coin.y + COIN_SIZE;

  return (
    birdRight > coinLeft &&
    birdLeft < coinRight &&
    birdBottom > coinTop &&
    birdTop < coinBottom
  );
}

