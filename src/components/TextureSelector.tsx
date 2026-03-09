import { useEffect } from 'react'
import { useStore } from '../hooks/useStore'
import { useKeyboard } from '../hooks/useKeyboard'
import { dirtImg, grassImg, glassImg, woodImg, logImg, waterImg, ironImg, leavesImg } from '../images/images'

const swordImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAD9JREFUOE9jZKAQMFKon2HUAKIBpBvAsAFEA0g3gGEDiAaQbgDDBhANIA0Nhg0gGkAaGgwbeDDAyDj6AwMDAC97EAs9p9GBAAAAAElFTkSuQmCC' // Simple grey pixel for sword
const pickaxeImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAD9JREFUOE9jZKAQMFKon2HUAKIBpBvAsAFEA0g3gGEDiAaQbgDDBhANIA0Nhg0gGkAaGgwbeDDAyDj6AwMDAC97EAs9p9GBAAAAAElFTkSuQmCC' // Same for pickaxe for now

const images = {
  dirt: dirtImg,
  grass: grassImg,
  glass: glassImg,
  wood: woodImg,
  log: logImg,
  sword: swordImg,
  pickaxe: pickaxeImg,
  water: waterImg,
  iron: ironImg,
  leaves: leavesImg,
}

export const TextureSelector = () => {
  const activeTexture = useStore((state) => state.texture)
  const setTexture = useStore((state) => state.setTexture)
  const inventory = useStore((state) => state.inventory)

  const { dirt, grass, glass, wood, log, sword, pickaxe, water, iron, leaves } = useKeyboard()

  useEffect(() => {
    const textures = { dirt, grass, glass, wood, log, sword, pickaxe, water, iron, leaves }
    const pressedTexture = Object.entries(textures).find(([_, v]) => (v as boolean))
    if (pressedTexture) {
      setTexture(pressedTexture[0] as any)
    }
  }, [dirt, grass, glass, wood, log, sword, pickaxe, water, iron, leaves, setTexture])

  return (
    <div className="absolute centered texture-selector">
      {Object.entries(images).map(([k, src]) => {
        const count = inventory[k as keyof typeof inventory]
        const isTool = k === 'sword' || k === 'pickaxe'

        return (
          <div
            key={k}
            className={`texture-slot ${k === activeTexture ? 'active' : ''}`}
            onClick={() => setTexture(k as any)}
          >
            <img
              src={src}
              alt={k}
            />
            {!isTool && <span className="texture-count">{count}</span>}
          </div>
        )
      })}
    </div>
  )
}
