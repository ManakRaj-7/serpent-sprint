import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  INITIAL_TICK_MS,
  changeDirection,
  createInitialGame,
  getDirectionFromKey,
  stepGame,
  type GameState,
} from './game/snakeGame'

function App() {
  const [game, setGame] = useState<GameState>(() => createInitialGame())
  const [tickMs] = useState(INITIAL_TICK_MS)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const nextDirection = getDirectionFromKey(event.key)

      if (!nextDirection) {
        return
      }

      event.preventDefault()
      setGame((current) => ({
        ...current,
        queuedDirection: changeDirection(current.direction, nextDirection),
      }))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (game.status !== 'running') {
      return
    }

    const timer = window.setInterval(() => {
      setGame((current) => stepGame(current))
    }, tickMs)

    return () => window.clearInterval(timer)
  }, [game.status, tickMs])

  const cells = useMemo(() => {
    const snakeCells = new Set(game.snake.map(({ x, y }) => `${x},${y}`))
    const headKey = `${game.snake[0].x},${game.snake[0].y}`
    const foodKey = `${game.food.x},${game.food.y}`

    return Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, (_, index) => {
      const x = index % GRID_WIDTH
      const y = Math.floor(index / GRID_WIDTH)
      const key = `${x},${y}`

      let className = 'board__cell'
      if (snakeCells.has(key)) {
        className += key === headKey ? ' board__cell--head' : ' board__cell--snake'
      } else if (key === foodKey) {
        className += ' board__cell--food'
      }

      return <div key={key} className={className} />
    })
  }, [game.food.x, game.food.y, game.snake])

  return (
    <main className="shell">
      <section className="panel">
        <header className="panel__header">
          <div>
            <p className="eyebrow">Classic Arcade</p>
            <h1>Snake</h1>
          </div>
          <div className="scorecard">
            <span>Score</span>
            <strong>{game.score}</strong>
          </div>
        </header>

        <p className="panel__copy">
          Use arrow keys or WASD to steer. Eat food, avoid walls, and don&apos;t double back
          into yourself.
        </p>

        <div
          className="board"
          style={
            {
              '--grid-width': GRID_WIDTH,
              '--grid-height': GRID_HEIGHT,
            } as CSSProperties
          }
        >
          {cells}
        </div>

        <div className="status-row">
          <p className="status-text">
            {game.status === 'over'
              ? 'Game over. Restart to play again.'
              : 'Running. The snake advances every tick.'}
          </p>
          <button type="button" className="restart-button" onClick={() => setGame(createInitialGame())}>
            Restart
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
