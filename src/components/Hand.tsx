import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'
import { useStore } from '../hooks/useStore'

export const Hand = () => {
  const activeItem = useStore((state) => state.activeItem)

  if (activeItem !== 'sword' && activeItem !== 'pickaxe') {
    return null
  }

  return <HandModel activeItem={activeItem} />
}

const HandModel = ({ activeItem }: { activeItem: string }) => {
  const { camera } = useThree()
  const meshRef = useRef<Mesh>(null!)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position)
      meshRef.current.rotation.copy(camera.rotation)
      meshRef.current.updateMatrix()
      meshRef.current.translateZ(-0.5)
      meshRef.current.translateX(0.3)
      meshRef.current.translateY(-0.3)
      meshRef.current.rotation.x += 0.5 // Tilt it forward a bit
    }
  })

  return (
    <mesh ref={meshRef} matrixAutoUpdate={false}>
      <boxGeometry args={[0.05, 0.4, 0.05]} />
      <meshStandardMaterial color={activeItem === 'sword' ? '#d1d1d1' : '#7d7d7d'} />
    </mesh>
  )
}
