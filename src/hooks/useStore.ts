import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type TextureType = 'dirt' | 'grass' | 'glass' | 'wood' | 'log'

export interface Cube {
  key: string
  pos: [number, number, number]
  texture: TextureType
}

interface State {
  texture: TextureType
  cubes: Cube[]
  addCube: (x: number, y: number, z: number) => void
  removeCube: (x: number, y: number, z: number) => void
  setTexture: (texture: TextureType) => void
  saveWorld: () => void
  resetWorld: () => void
}

const getLocalStorage = (key: string) => {
  const value = window.localStorage.getItem(key)
  if (value) return JSON.parse(value)
  return [
    { key: nanoid(), pos: [1, 0, -5], texture: 'dirt' },
    { key: nanoid(), pos: [2, 0, -5], texture: 'grass' },
    { key: nanoid(), pos: [3, 0, -5], texture: 'glass' },
    { key: nanoid(), pos: [4, 0, -5], texture: 'wood' },
    { key: nanoid(), pos: [5, 0, -5], texture: 'log' },
  ]
}

const setLocalStorage = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const useStore = create<State>((set) => ({
  texture: 'dirt',
  cubes: getLocalStorage('cubes'),
  addCube: (x, y, z) => {
    set((prev) => ({
      cubes: [
        ...prev.cubes,
        {
          key: nanoid(),
          pos: [x, y, z],
          texture: prev.texture,
        },
      ],
    }))
  },
  removeCube: (x, y, z) => {
    set((prev) => ({
      cubes: prev.cubes.filter((cube) => {
        const [cx, cy, cz] = cube.pos
        return cx !== x || cy !== y || cz !== z
      }),
    }))
  },
  setTexture: (texture) => {
    set(() => ({
      texture,
    }))
  },
  saveWorld: () => {
    set((prev) => {
      setLocalStorage('cubes', prev.cubes)
      return prev
    })
  },
  resetWorld: () => {
    set(() => ({
      cubes: [],
    }))
  },
}))
