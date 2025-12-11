import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';

const ROAD_COLUMNS = 8;
const COLUMN_WIDTH = 45;
const ROAD_HEIGHT = 230;

// Replace emojis with image filenames
const PLAYER_CAR_IMG = 'Player_Car.png';
const OBSTACLE_CAR_IMAGES = [
  'Obstacle_Car_1.png',
  'Obstacle_Car_2.png',
  'Obstacle_Car_3.png',
  'Obstacle_Car_4.png',
  'Obstacle_Car_5.png',
  'Obstacle_Car_6.png',
  'Obstacle_Car_7.png',
  'Obstacle_Car_8.png'
];

const CAR_WIDTH = 40;   // Uniform size for all cars
const CAR_HEIGHT = 40;

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const { gameState, score, level, gameSpeed, updateScore, endGame } = useGame();
  
  const [playerPosition, setPlayerPosition] = useState(Math.floor(ROAD_COLUMNS / 2));
  const [obstacles, setObstacles] = useState([]);
  const [lastSpawnTime, setLastSpawnTime] = useState(0);
  const [lastScoreTime, setLastScoreTime] = useState(Date.now());

  // Load images
  const playerImg = useRef(new Image());
  playerImg.current.src = process.env.PUBLIC_URL + '/Cars/' + PLAYER_CAR_IMG;

  const obstacleImgs = useRef(OBSTACLE_CAR_IMAGES.map(name => {
    const img = new Image();
    img.src = process.env.PUBLIC_URL + '/Cars/' + name;
    return img;
  }));

  // Initialize player position
  useEffect(() => {
    setPlayerPosition(Math.floor(ROAD_COLUMNS / 2));
  }, [gameState]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft') setPlayerPosition(prev => Math.max(0, prev - 1));
      else if (e.key === 'ArrowRight') setPlayerPosition(prev => Math.min(ROAD_COLUMNS - 1, prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Spawn obstacles
  const spawnObstacle = useCallback(() => {
    const column = Math.floor(Math.random() * ROAD_COLUMNS);
    const typeIndex = Math.floor(Math.random() * OBSTACLE_CAR_IMAGES.length);
    const obstacle = {
      id: Date.now() + Math.random(),
      column,
      y: -CAR_HEIGHT,
      speed: 2 + (level - 1) * 1.2,
      typeIndex
    };
    setObstacles(prev => [...prev, obstacle]);
  }, [level]);

  // Game update with collision
  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;
    const now = Date.now();

    if (now - lastScoreTime >= 1000) {
      updateScore(score + 1);
      setLastScoreTime(now);
    }

    if (now - lastSpawnTime > 1200 / gameSpeed) {
      spawnObstacle();
      setLastSpawnTime(now);
    }

    // Player hitbox
    const playerX = playerPosition * COLUMN_WIDTH + COLUMN_WIDTH / 2;
    const playerY = ROAD_HEIGHT - CAR_HEIGHT / 2;
    const playerLeft = playerX - CAR_WIDTH / 2;
    const playerRight = playerX + CAR_WIDTH / 2;
    const playerTop = playerY - CAR_HEIGHT / 2;
    const playerBottom = playerY + CAR_HEIGHT / 2;

    setObstacles(prev => 
      prev.map(obs => ({ ...obs, y: obs.y + obs.speed * gameSpeed }))
          .filter(obs => {
            const obsX = obs.column * COLUMN_WIDTH + COLUMN_WIDTH / 2;
            const obsY = obs.y;
            const obsLeft = obsX - CAR_WIDTH / 2;
            const obsRight = obsX + CAR_WIDTH / 2;
            const obsTop = obsY - CAR_HEIGHT / 2;
            const obsBottom = obsY + CAR_HEIGHT / 2;

            // Collision detection
            const isHit =
              playerLeft < obsRight &&
              playerRight > obsLeft &&
              playerTop < obsBottom &&
              playerBottom > obsTop;

            if (isHit) {
              endGame();
              return false;
            }

            return obs.y < ROAD_HEIGHT + CAR_HEIGHT;
          })
    );
  }, [gameState, lastSpawnTime, lastScoreTime, score, gameSpeed, spawnObstacle, playerPosition, updateScore, endGame]);

  // Game loop
  useEffect(() => {
    let frameId;
    const loop = () => {
      updateGame();
      frameId = requestAnimationFrame(loop);
    };
    if (gameState === 'playing') frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState, updateGame]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const totalWidth = ROAD_COLUMNS * COLUMN_WIDTH;
    const centeringOffset = (canvas.width - totalWidth) / 2;

    // Road background
    const gradient = ctx.createLinearGradient(0, 0, 0, ROAD_HEIGHT);
    gradient.addColorStop(0, '#111827');
    gradient.addColorStop(1, '#1f2937');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, ROAD_HEIGHT);

    // Lane center
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, ROAD_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Column lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 1; i < ROAD_COLUMNS; i++) {
      const x = centeringOffset + i * COLUMN_WIDTH;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ROAD_HEIGHT);
      ctx.stroke();
    }

    // Motion lines
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    const lineOffset = (Date.now() / 15) % 20;
    for (let i = -20; i < ROAD_HEIGHT; i += 40) {
      const y = (i + lineOffset) % ROAD_HEIGHT;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 4, y);
      ctx.lineTo(canvas.width / 2 + 4, y);
      ctx.stroke();
    }

    // Draw obstacles
    obstacles.forEach(obs => {
      const x = centeringOffset + obs.column * COLUMN_WIDTH + COLUMN_WIDTH / 2 - CAR_WIDTH / 2;
      const y = obs.y - CAR_HEIGHT / 2;
      ctx.drawImage(obstacleImgs.current[obs.typeIndex], x, y, CAR_WIDTH, CAR_HEIGHT);
    });

    // Draw player
    const playerX = centeringOffset + playerPosition * COLUMN_WIDTH + COLUMN_WIDTH / 2 - CAR_WIDTH / 2;
    const playerY = ROAD_HEIGHT - CAR_HEIGHT;
    ctx.drawImage(playerImg.current, playerX, playerY, CAR_WIDTH, CAR_HEIGHT);

    // Road borders
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    ctx.strokeRect(centeringOffset, 0, totalWidth, ROAD_HEIGHT);
  }, [playerPosition, obstacles]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={ROAD_COLUMNS * COLUMN_WIDTH * 1.2}
        height={ROAD_HEIGHT}
        className="w-full rounded-lg"
      />
    </div>
  );
};

export default GameCanvas;
