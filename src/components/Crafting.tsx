import { useEffect, useState } from 'react'
import { useStore } from '../hooks/useStore'

export const Crafting = () => {
  const [isOpen, setIsOpen] = useState(false)
  const inventory = useStore((state) => state.inventory)
  const craftWood = useStore((state) => state.craftWood)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isOpen) return null

  return (
    <div className="absolute centered crafting-menu">
      <h2>Crafting (Press E to close)</h2>
      <div className="inventory-display">
        <p>Log: {inventory.log}</p>
        <p>Planks: {inventory.wood}</p>
        <p>Iron: {inventory.iron}</p>
        <p>Leaves: {inventory.leaves}</p>
        <p>Dirt: {inventory.dirt}</p>
        <p>Grass: {inventory.grass}</p>
        <p>Water: {inventory.water}</p>
      </div>
      <div className="recipes">
        <button
          onClick={() => craftWood()}
          disabled={inventory.log < 1}
        >
          Craft 4 Wood Planks (Costs 1 Log)
        </button>
      </div>
    </div>
  )
}
