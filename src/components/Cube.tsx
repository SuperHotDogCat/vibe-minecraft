import { useBox } from '@react-three/cannon'
import { useState } from 'react'
import { useStore } from '../hooks/useStore'
import * as textures from '../images/textures'

interface CubeProps {
  position: [number, number, number]
  texture: string
}

export const Cube = ({ position, texture }: CubeProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
  }))

  const addCube = useStore((state) => state.addCube)
  const removeCube = useStore((state) => state.removeCube)
  const activeItem = useStore((state) => state.activeItem)

  const activeTexture = (textures as any)[texture + 'Texture']

  return (
    <mesh
      ref={ref as any}
      onPointerMove={(e) => {
        e.stopPropagation()
        setIsHovered(true)
      }}
      onPointerOut={() => {
        setIsHovered(false)
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        const clickedFace = Math.floor(e.faceIndex! / 2)
        const { x, y, z } = ref.current!.position

        // Left click (0) to remove, Right click (2) to add
        if (e.button === 0) {
          removeCube(x, y, z)
        } else if (e.button === 2) {
          if (activeItem === 'sword' || activeItem === 'pickaxe') return
          if (clickedFace === 0) addCube(x + 1, y, z)
          else if (clickedFace === 1) addCube(x - 1, y, z)
          else if (clickedFace === 2) addCube(x, y + 1, z)
          else if (clickedFace === 3) addCube(x, y - 1, z)
          else if (clickedFace === 4) addCube(x, y, z + 1)
          else if (clickedFace === 5) addCube(x, y, z - 1)
        }
      }}
    >
      <boxGeometry attach="geometry" />
      <meshStandardMaterial
        color={isHovered ? 'grey' : 'white'}
        map={activeTexture}
        transparent={texture === 'glass'}
        opacity={texture === 'glass' ? 0.6 : 1}
        attach="material"
      />
    </mesh>
  )
}
