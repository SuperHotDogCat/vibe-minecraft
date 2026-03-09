import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { createNoise2D } from 'simplex-noise'

export type TextureType = 'dirt' | 'grass' | 'glass' | 'wood' | 'log' | 'sword' | 'pickaxe'

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
  sword: number
  pickaxe: number
}

interface State {
  texture: TextureType
  cubes: Cube[]
  inventory: Inventory
  health: number
  hunger: number
  activeItem: TextureType
  addCube: (x: number, y: number, z: number) => void
  removeCube: (x: number, y: number, z: number) => void
  setTexture: (texture: TextureType) => void
  saveWorld: () => void
  resetWorld: () => void
  craftWood: () => void
  takeDamage: (amount: number) => void
  eat: (amount: number) => void
  tickStats: () => void
}

const generateTerrain = () => {
  const noise2D = createNoise2D()
  const cubes: Cube[] = []
  const size = 10
  for (let x = -size; x < size; x++) {
    for (let z = -size; z < size; z++) {
      const height = Math.floor(noise2D(x * 0.1, z * 0.1) * 3) + 1
      for (let y = 0; y < height; y++) {
        cubes.push({
          key: nanoid(),
          pos: [x, y, z],
          texture: y === height - 1 ? 'grass' : 'dirt'
        })
      }
    }
  }
  return cubes
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
  cubes: getLocalStorage('cubes') || generateTerrain(),
  inventory: getLocalStorage('inventory') || {
    dirt: 10,
    grass: 10,
    glass: 10,
    wood: 10,
    log: 10,
    sword: 1,
    pickaxe: 1,
  },
  health: 20,
  hunger: 20,
  activeItem: 'dirt',
  addCube: (x, y, z) => {
    set((prev) => {
      const activeTexture = prev.texture
      if (prev.inventory[activeTexture] <= 0) return prev
      return {
        cubes: [...prev.cubes, { key: nanoid(), pos: [x, y, z], texture: activeTexture }],
        inventory: { ...prev.inventory, [activeTexture]: prev.inventory[activeTexture] - 1 },
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
      return {
        cubes: prev.cubes.filter((cube) => cube.key !== cubeToRemove.key),
        inventory: { ...prev.inventory, [cubeToRemove.texture]: prev.inventory[cubeToRemove.texture] + 1 },
      }
    })
  },
  setTexture: (texture) => set(() => ({ texture, activeItem: texture })),
  saveWorld: () => {
    set((prev) => {
      setLocalStorage('cubes', prev.cubes)
      setLocalStorage('inventory', prev.inventory)
      return prev
    })
  },
  resetWorld: () => set(() => ({
    cubes: generateTerrain(),
    inventory: { dirt: 10, grass: 10, glass: 10, wood: 10, log: 10, sword: 1, pickaxe: 1 },
    health: 20,
    hunger: 20
  })),
  craftWood: () => {
    set((prev) => {
      if (prev.inventory.log >= 1) {
        return { inventory: { ...prev.inventory, log: prev.inventory.log - 1, wood: prev.inventory.wood + 4 } }
      }
      return prev
    })
  },
  takeDamage: (amount) => set((prev) => ({ health: Math.max(0, prev.health - amount) })),
  eat: (amount) => set((prev) => ({ hunger: Math.min(20, prev.hunger + amount) })),
  tickStats: () => set((prev) => {
    let { health, hunger } = prev
    if (hunger > 0) hunger -= 0.01
    if (hunger >= 18 && health < 20) health += 0.01
    if (hunger <= 0 && health > 0) health -= 0.01
    return { health, hunger }
  })
}))
