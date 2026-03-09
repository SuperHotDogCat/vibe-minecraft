import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type TextureType = 'dirt' | 'grass' | 'glass' | 'wood' | 'log'

export interface Cube {
  key: string
  pos: [number, number, number]
  texture: TextureType
}

interface Inventory {
  dirt: number
  grass: number
  glass: number
  wood: number
  log: number
}

interface State {
  texture: TextureType
  cubes: Cube[]
  inventory: Inventory
  addCube: (x: number, y: number, z: number) => void
  removeCube: (x: number, y: number, z: number) => void
  setTexture: (texture: TextureType) => void
  saveWorld: () => void
  resetWorld: () => void
  craftWood: () => void
}

const getLocalStorage = (key: string) => {
  const value = window.localStorage.getItem(key)
  if (value) return JSON.parse(value)
  return null
}

const setLocalStorage = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const useStore = create<State>((set) => ({
  texture: 'dirt',
  cubes: getLocalStorage('cubes') || [
    { key: nanoid(), pos: [1, 0, -5], texture: 'dirt' },
    { key: nanoid(), pos: [2, 0, -5], texture: 'grass' },
    { key: nanoid(), pos: [3, 0, -5], texture: 'glass' },
    { key: nanoid(), pos: [4, 0, -5], texture: 'wood' },
    { key: nanoid(), pos: [5, 0, -5], texture: 'log' },
  ],
  inventory: getLocalStorage('inventory') || {
    dirt: 10,
    grass: 10,
    glass: 10,
    wood: 10,
    log: 10,
  },
  addCube: (x, y, z) => {
    set((prev) => {
      const activeTexture = prev.texture
      if (prev.inventory[activeTexture] <= 0) {
        console.log(`Not enough ${activeTexture} in inventory`)
        return prev
      }
      return {
        cubes: [
          ...prev.cubes,
          {
            key: nanoid(),
            pos: [x, y, z],
            texture: activeTexture,
          },
        ],
        inventory: {
          ...prev.inventory,
          [activeTexture]: prev.inventory[activeTexture] - 1,
        },
      }
    })
  },
  removeCube: (x, y, z) => {
    set((prev) => {
      const cubeToRemove = prev.cubes.find((cube) => {
        const [cx, cy, cz] = cube.pos
        return cx === x && cy === y && cz === z
      })
      if (!cubeToRemove) return prev

      const texture = cubeToRemove.texture
      return {
        cubes: prev.cubes.filter((cube) => cube.key !== cubeToRemove.key),
        inventory: {
          ...prev.inventory,
          [texture]: prev.inventory[texture] + 1,
        },
      }
    })
  },
  setTexture: (texture) => {
    set(() => ({
      texture,
    }))
  },
  saveWorld: () => {
    set((prev) => {
      setLocalStorage('cubes', prev.cubes)
      setLocalStorage('inventory', prev.inventory)
      return prev
    })
  },
  resetWorld: () => {
    set(() => ({
      cubes: [],
      inventory: {
        dirt: 10,
        grass: 10,
        glass: 10,
        wood: 10,
        log: 10,
      },
    }))
  },
  craftWood: () => {
    set((prev) => {
      if (prev.inventory.log >= 1) {
        return {
          inventory: {
            ...prev.inventory,
            log: prev.inventory.log - 1,
            wood: prev.inventory.wood + 4,
          },
        }
      }
      return prev
    })
  }
}))
