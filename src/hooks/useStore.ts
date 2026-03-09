import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { createNoise2D } from 'simplex-noise'

export type TextureType = 'dirt' | 'grass' | 'glass' | 'wood' | 'log' | 'sword' | 'pickaxe' | 'water' | 'iron' | 'leaves'

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
  water: number
  iron: number
  leaves: number
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
  const size = 15
  const waterLevel = 3

  for (let x = -size; x < size; x++) {
    for (let z = -size; z < size; z++) {
      const noiseValue = noise2D(x * 0.08, z * 0.08)
      const height = Math.floor(noiseValue * 6) + 6

      // Basic terrain
      for (let y = 0; y < height; y++) {
        let texture: TextureType = 'dirt'
        if (y === height - 1) {
          texture = (y <= waterLevel + 1) ? 'dirt' : 'grass'
        }

        cubes.push({
          key: nanoid(),
          pos: [x, y, z],
          texture
        })
      }

      // Add Sea/Water bodies
      if (height <= waterLevel) {
        for (let y = height; y <= waterLevel; y++) {
          cubes.push({
            key: nanoid(),
            pos: [x, y, z],
            texture: 'water'
          })
        }
      }

      // Random Iron ore (underground)
      if (Math.random() < 0.1) {
        cubes.push({
          key: nanoid(),
          pos: [x, Math.floor(Math.random() * 5), z],
          texture: 'iron'
        })
      }

      // Structures: Trees (only on grass)
      if (x % 9 === 0 && z % 9 === 0 && height > waterLevel + 1 && Math.random() > 0.4) {
        // Trunk
        for (let h = 0; h < 4; h++) {
          cubes.push({
            key: nanoid(),
            pos: [x, height + h, z],
            texture: 'log'
          })
        }
        // Leaves
        for (let lx = -2; lx <= 2; lx++) {
          for (let lz = -2; lz <= 2; lz++) {
            for (let ly = 0; ly <= 2; ly++) {
              if (Math.abs(lx) + Math.abs(lz) + Math.abs(ly) > 3) continue
              if (lx === 0 && lz === 0 && ly < 2) continue
              cubes.push({
                key: nanoid(),
                pos: [x + lx, height + 3 + ly, z + lz],
                texture: 'leaves'
              })
            }
          }
        }
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
    water: 0,
    iron: 0,
    leaves: 0,
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
  resetWorld: () => set(() => {
    const cubes = generateTerrain()
    setLocalStorage('cubes', cubes)
    return {
      cubes,
      inventory: { dirt: 10, grass: 10, glass: 10, wood: 10, log: 10, sword: 1, pickaxe: 1, water: 0, iron: 0, leaves: 0 },
      health: 20,
      hunger: 20
    }
  }),
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
