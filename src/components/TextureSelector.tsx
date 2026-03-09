import { useEffect, useState } from 'react'
import { useStore } from '../hooks/useStore'
import { useKeyboard } from '../hooks/useKeyboard'
import { dirtImg, grassImg, glassImg, woodImg, logImg } from '../images/images'

const images = {
  dirt: dirtImg,
  grass: grassImg,
  glass: glassImg,
  wood: woodImg,
  log: logImg,
}

export const TextureSelector = () => {
  const [visible, setVisible] = useState(false)
  const activeTexture = useStore((state) => state.texture)
  const setTexture = useStore((state) => state.setTexture)

  const { dirt, grass, glass, wood, log } = useKeyboard()

  useEffect(() => {
    const textures = { dirt, grass, glass, wood, log }
    const pressedTexture = Object.entries(textures).find(([_, v]) => v)
    if (pressedTexture) {
      setTexture(pressedTexture[0] as any)
    }
  }, [dirt, grass, glass, wood, log, setTexture])

  useEffect(() => {
    setVisible(true)
    const visibilityTimeout = setTimeout(() => {
      setVisible(false)
    }, 2000)
    return () => {
      clearTimeout(visibilityTimeout)
    }
  }, [activeTexture])

  if (!visible) return null

  return (
    <div className="absolute centered texture-selector">
      {Object.entries(images).map(([k, src]) => {
        return (
          <img
            key={k}
            src={src}
            alt={k}
            className={`${k === activeTexture ? 'active' : ''}`}
          />
        )
      })}
    </div>
  )
}
