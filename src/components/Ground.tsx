import { usePlane } from '@react-three/cannon'
import { NearestFilter, RepeatWrapping } from 'three'
import { groundTexture } from '../images/textures'
import { useStore } from '../hooks/useStore'

export const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }))

  const addCube = useStore((state) => state.addCube)

  groundTexture.magFilter = NearestFilter
  groundTexture.wrapS = RepeatWrapping
  groundTexture.wrapT = RepeatWrapping
  groundTexture.repeat.set(100, 100)

  const activeItem = useStore((state) => state.activeItem)

  return (
    <mesh
      onPointerDown={(e) => {
        e.stopPropagation()
        if (e.button !== 2) return // Right click only for ground
        if (activeItem === 'sword' || activeItem === 'pickaxe') return
        const [x, y, z] = Object.values(e.point).map((val) => Math.round(val))
        addCube(x, y, z)
      }}
      ref={ref as any}
    >
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" map={groundTexture} />
    </mesh>
  )
}
