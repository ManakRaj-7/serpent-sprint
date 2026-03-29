import { describe, expect, it } from 'vitest'
import {
  changeDirection,
  createInitialGame,
  placeFood,
  stepGame,
  type GameState,
} from './snakeGame'

describe('snakeGame', () => {
  it('moves the snake one cell in its current direction', () => {
    const game = createInitialGame(() => 0)

    const next = stepGame(game)

    expect(next.snake[0]).toEqual({ x: 7, y: 7 })
    expect(next.snake).toHaveLength(3)
  })

  it('ignores an illegal reverse direction', () => {
    expect(changeDirection('right', 'left')).toBe('right')
  })

  it('grows the snake and increases the score after eating food', () => {
    const game: GameState = {
      snake: [
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 2, y: 4 },
      ],
      direction: 'right',
      queuedDirection: 'right',
      food: { x: 5, y: 4 },
      score: 0,
      status: 'running',
    }

    const next = stepGame(game, undefined, () => 0)

    expect(next.snake).toHaveLength(4)
    expect(next.snake[0]).toEqual({ x: 5, y: 4 })
    expect(next.score).toBe(1)
    expect(next.food).not.toEqual({ x: 5, y: 4 })
  })

  it('ends the game when the snake hits a wall', () => {
    const game: GameState = {
      snake: [{ x: 13, y: 5 }],
      direction: 'right',
      queuedDirection: 'right',
      food: { x: 0, y: 0 },
      score: 0,
      status: 'running',
    }

    const next = stepGame(game)

    expect(next.status).toBe('over')
  })

  it('ends the game when the snake collides with itself', () => {
    const game: GameState = {
      snake: [
        { x: 3, y: 2 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 4, y: 2 },
      ],
      direction: 'down',
      queuedDirection: 'down',
      food: { x: 0, y: 0 },
      score: 0,
      status: 'running',
    }

    const next = stepGame(game, 'left')

    expect(next.status).toBe('over')
  })

  it('never places food on the snake body', () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ]

    const food = placeFood(snake, () => 0, 2, 2)

    expect(food).toEqual({ x: 1, y: 1 })
  })

  it('restarts to the initial playable state', () => {
    const game = createInitialGame(() => 0.5)

    expect(game.status).toBe('running')
    expect(game.score).toBe(0)
    expect(game.snake).toEqual([
      { x: 6, y: 7 },
      { x: 5, y: 7 },
      { x: 4, y: 7 },
    ])
  })
})
