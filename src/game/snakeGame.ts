export const GRID_WIDTH = 14
export const GRID_HEIGHT = 14
export const INITIAL_TICK_MS = 160

export type Direction = 'up' | 'down' | 'left' | 'right'
export type GameStatus = 'running' | 'over'

export type Position = {
  x: number
  y: number
}

export type GameState = {
  snake: Position[]
  direction: Direction
  queuedDirection: Direction
  food: Position
  score: number
  status: GameStatus
}

const DIRECTION_VECTORS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

export function createInitialGame(randomIndex = Math.random): GameState {
  const snake = [
    { x: 6, y: 7 },
    { x: 5, y: 7 },
    { x: 4, y: 7 },
  ]

  return {
    snake,
    direction: 'right',
    queuedDirection: 'right',
    food: placeFood(snake, randomIndex),
    score: 0,
    status: 'running',
  }
}

export function getDirectionFromKey(key: string): Direction | null {
  const normalizedKey = key.toLowerCase()
  const keyMap: Record<string, Direction> = {
    arrowup: 'up',
    w: 'up',
    arrowdown: 'down',
    s: 'down',
    arrowleft: 'left',
    a: 'left',
    arrowright: 'right',
    d: 'right',
  }

  return keyMap[normalizedKey] ?? null
}

export function changeDirection(current: Direction, requested: Direction): Direction {
  if (OPPOSITE_DIRECTIONS[current] === requested) {
    return current
  }

  return requested
}

export function stepGame(
  state: GameState,
  requestedDirection?: Direction,
  randomIndex = Math.random,
): GameState {
  if (state.status === 'over') {
    return state
  }

  const direction = requestedDirection
    ? changeDirection(state.direction, requestedDirection)
    : state.queuedDirection
  const vector = DIRECTION_VECTORS[direction]
  const nextHead = {
    x: state.snake[0].x + vector.x,
    y: state.snake[0].y + vector.y,
  }
  const eatingFood = positionsEqual(nextHead, state.food)
  const bodyToCheck = eatingFood ? state.snake : state.snake.slice(0, -1)

  if (isOutsideBoard(nextHead) || isOnSnake(nextHead, bodyToCheck)) {
    return {
      ...state,
      direction,
      queuedDirection: direction,
      status: 'over',
    }
  }

  const nextSnake = [nextHead, ...state.snake]

  if (!eatingFood) {
    nextSnake.pop()
  }

  return {
    snake: nextSnake,
    direction,
    queuedDirection: direction,
    food: eatingFood ? placeFood(nextSnake, randomIndex) : state.food,
    score: eatingFood ? state.score + 1 : state.score,
    status: 'running',
  }
}

export function placeFood(
  snake: Position[],
  randomIndex = Math.random,
  width = GRID_WIDTH,
  height = GRID_HEIGHT,
): Position {
  const openCells: Position[] = []

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = { x, y }
      if (!isOnSnake(cell, snake)) {
        openCells.push(cell)
      }
    }
  }

  if (openCells.length === 0) {
    return snake[0]
  }

  const index = Math.min(openCells.length - 1, Math.floor(randomIndex() * openCells.length))
  return openCells[index]
}

export function isOutsideBoard(position: Position, width = GRID_WIDTH, height = GRID_HEIGHT): boolean {
  return position.x < 0 || position.y < 0 || position.x >= width || position.y >= height
}

export function isOnSnake(position: Position, snake: Position[]): boolean {
  return snake.some((segment) => positionsEqual(segment, position))
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y
}
