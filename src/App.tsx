import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Suspense } from 'react'
import { Ground } from './components/Ground'
import { Player } from './components/Player'
import { FPV } from './components/FPV'
import { Cubes } from './components/Cubes'
import { TextureSelector } from './components/TextureSelector'
import { Crafting } from './components/Crafting'
import { Mobs } from './components/Mobs'
import { HeadsUpDisplay } from './components/HeadsUpDisplay'
import { Hand } from './components/Hand'
import { useStore } from './hooks/useStore'

function App() {
  const saveWorld = useStore((state) => state.saveWorld)
  const resetWorld = useStore((state) => state.resetWorld)

  return (
    <>
      <Canvas shadows>
        <Sky sunPosition={[100, 20, 20]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[100, 100, 50]} intensity={1.5} castShadow />
        <FPV />
        <Suspense fallback={null}>
          <Physics>
            <Player />
            <Hand />
            <Cubes />
            <Mobs />
            <Ground />
          </Physics>
        </Suspense>
      </Canvas>
      <div className="absolute centered cursor">+</div>
      <TextureSelector />
      <Crafting />
      <HeadsUpDisplay />
      <div className="menu absolute">
        <button onClick={() => saveWorld()}>Save</button>
        <button onClick={() => resetWorld()}>Reset</button>
      </div>
    </>
  )
}

export default App
