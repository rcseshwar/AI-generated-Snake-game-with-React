import { useState, useEffect, useCallback, useRef } from 'react';
import { Coordinate, Direction, GameStatus } from '../types';
import { GRID_SIZE, GAME_SPEED_MS } from '../constants';

const getRandomCoordinate = (): Coordinate => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Coordinate[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Coordinate>(getRandomCoordinate());
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  
  // Use ref for direction to prevent rapid double-key presses causing self-collision
  const directionRef = useRef<Direction>(Direction.RIGHT);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomCoordinate());
    setDirection(Direction.RIGHT);
    directionRef.current = Direction.RIGHT;
    setScore(0);
    setStatus(GameStatus.RUNNING);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (status !== GameStatus.RUNNING) {
      if ((e.key === 'Enter' || e.code === 'Space') && status !== GameStatus.PAUSED) {
         // Optionally start game logic could go here, but we handle it via buttons mostly
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (directionRef.current !== Direction.DOWN) {
           setDirection(Direction.UP);
           directionRef.current = Direction.UP;
        }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (directionRef.current !== Direction.UP) {
           setDirection(Direction.DOWN);
           directionRef.current = Direction.DOWN;
        }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (directionRef.current !== Direction.RIGHT) {
           setDirection(Direction.LEFT);
           directionRef.current = Direction.LEFT;
        }
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (directionRef.current !== Direction.LEFT) {
           setDirection(Direction.RIGHT);
           directionRef.current = Direction.RIGHT;
        }
        break;
    }
  }, [status]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (status !== GameStatus.RUNNING) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case Direction.UP: newHead.y -= 1; break;
          case Direction.DOWN: newHead.y += 1; break;
          case Direction.LEFT: newHead.x -= 1; break;
          case Direction.RIGHT: newHead.x += 1; break;
        }

        // Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setStatus(GameStatus.GAME_OVER);
          return prevSnake;
        }

        // Self Collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
           setStatus(GameStatus.GAME_OVER);
           return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          setFood(getRandomCoordinate());
          // Grow snake (don't pop tail)
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED_MS);
    return () => clearInterval(gameLoop);
  }, [status, direction, food]);

  return {
    snake,
    food,
    status,
    score,
    setStatus,
    resetGame,
  };
};
