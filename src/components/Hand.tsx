import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { Mesh } from 'three'
import { useStore } from '../hooks/useStore'
import * as textures from '../images/textures'

export const Hand = () => {
  const activeItem = useStore((state) => state.activeItem)
  return <HandModel activeItem={activeItem} />
}

const HandModel = ({ activeItem }: { activeItem: string }) => {
  const { camera } = useThree()
  const meshRef = useRef<Mesh>(null!)
  const [isSwinging, setIsSwinging] = useState(false)
  const swingTime = useRef(0)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click
        setIsSwinging(true)
        swingTime.current = 0
      }
    }
    window.addEventListener('mousedown', handleMouseDown)
    return () => window.removeEventListener('mousedown', handleMouseDown)
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position)
      meshRef.current.rotation.copy(camera.rotation)
      meshRef.current.updateMatrix()

      meshRef.current.translateZ(-0.5)
      meshRef.current.translateX(0.3)
      meshRef.current.translateY(-0.3)

      if (isSwinging) {
        swingTime.current += delta * 10
        if (swingTime.current > Math.PI) {
          setIsSwinging(false)
          swingTime.current = 0
        }
        meshRef.current.rotation.x -= Math.sin(swingTime.current) * 0.8
      } else {
        meshRef.current.rotation.x += 0.5
      }
    }
  })

  // Get texture if it's a block
  const texture = (textures as any)[activeItem + 'Texture']

  return (
    <mesh ref={meshRef} matrixAutoUpdate={false}>
      {activeItem === 'sword' || activeItem === 'pickaxe' ? (
        <>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color={activeItem === 'sword' ? '#d1d1d1' : '#7d7d7d'} />
        </>
      ) : (
        <>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial map={texture} />
        </>
      )}
    </mesh>
  )
}
