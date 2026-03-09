import { useFrame } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { useRef } from 'react'
import { Vector3 } from 'three'

export const Mob = ({ position }: { position: [number, number, number] }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    type: 'Dynamic',
  }))

  const velocity = useRef([0, 0, 0])
  useFrame((state) => {
    const playerPos = state.camera.position
    const mobPos = new Vector3(...(ref.current?.position.toArray() || [0, 0, 0]))

    const direction = new Vector3()
    direction.subVectors(playerPos, mobPos).normalize()

    // Move towards player but only on XZ plane
    api.velocity.set(direction.x * 2, velocity.current[1], direction.z * 2)
  })

  return (
    <mesh ref={ref as any}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  )
}
