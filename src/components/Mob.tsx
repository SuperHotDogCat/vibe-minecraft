import { useFrame } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { useRef, useEffect, useState } from 'react'
import { Vector3 } from 'three'
import { useStore, type MobType } from '../hooks/useStore'
import * as textures from '../images/textures'

export const Mob = ({ type, position }: { id: string, type: MobType, position: [number, number, number] }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    type: 'Dynamic',
    fixedRotation: true,
  }))

  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v))
  }, [api.velocity])

  const [targetPos, setTargetPos] = useState(new Vector3(...position))
  const lastUpdate = useRef(0)

  useFrame((state, _) => {
    if (!ref.current) return

    const playerPos = state.camera.position
    const mobPos = new Vector3(...(ref.current as any).position.toArray())

    const direction = new Vector3()

    if (type === 'zombie') {
      // Zombie tracks player
      direction.subVectors(playerPos, mobPos).normalize()
      api.velocity.set(direction.x * 2, velocity.current[1], direction.z * 2)

      // Damage player if close
      if (mobPos.distanceTo(playerPos) < 1.5) {
        useStore.getState().takeDamage(0.1)
      }
    } else {
      // Villager wanders randomly
      if (state.clock.elapsedTime - lastUpdate.current > 3) {
        setTargetPos(new Vector3(
          mobPos.x + (Math.random() - 0.5) * 10,
          mobPos.y,
          mobPos.z + (Math.random() - 0.5) * 10
        ))
        lastUpdate.current = state.clock.elapsedTime
      }
      direction.subVectors(targetPos, mobPos).normalize()
      if (mobPos.distanceTo(targetPos) > 1) {
        api.velocity.set(direction.x * 1, velocity.current[1], direction.z * 1)
      } else {
        api.velocity.set(0, velocity.current[1], 0)
      }
    }

    // Face the direction of movement
    if (Math.abs(direction.x) > 0.1 || Math.abs(direction.z) > 0.1) {
       const angle = Math.atan2(direction.x, direction.z)
       api.rotation.set(0, angle, 0)
    }
  })

  const texture = (textures as any)[type + 'Texture']

  return (
    <mesh
      ref={ref as any}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (e.button === 0) { // Left click to attack
           api.velocity.set(0, 5, 0) // Knockback
        }
      }}
    >
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
