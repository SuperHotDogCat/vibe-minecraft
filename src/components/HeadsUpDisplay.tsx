import { useEffect } from 'react'
import { useStore } from '../hooks/useStore'

export const HeadsUpDisplay = () => {
  const health = useStore((state) => state.health)
  const hunger = useStore((state) => state.hunger)
  const tickStats = useStore((state) => state.tickStats)

  useEffect(() => {
    const interval = setInterval(() => {
      tickStats()
    }, 1000)
    return () => clearInterval(interval)
  }, [tickStats])

  return (
    <div className="absolute hud">
      <div className="stats-container">
        <div className="health-bar bar">
          <span className="label">HP:</span>
          <div className="progress" style={{ width: `${(health / 20) * 100}%`, backgroundColor: 'red' }}></div>
        </div>
        <div className="hunger-bar bar">
          <span className="label">Food:</span>
          <div className="progress" style={{ width: `${(hunger / 20) * 100}%`, backgroundColor: 'orange' }}></div>
        </div>
      </div>
      <div className="controls-hint">
        <p>Left Click: Break | Right Click: Place</p>
        <p>1-5: Blocks | 6: Sword | 7: Pickaxe</p>
        <p>E: Crafting | WASD: Move | Space: Jump</p>
      </div>
    </div>
  )
}
