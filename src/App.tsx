import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Ground } from './components/Ground'
import { Player } from './components/Player'
import { FPV } from './components/FPV'
import { Cubes } from './components/Cubes'
import { TextureSelector } from './components/TextureSelector'
import { useStore } from './hooks/useStore'

function App() {
  const saveWorld = useStore((state) => state.saveWorld)
  const resetWorld = useStore((state) => state.resetWorld)

  return (
    <>
      <Canvas>
        <Sky sunPosition={[100, 100, 20]} />
        <ambientLight intensity={0.5} />
        <FPV />
        <Physics>
          <Player />
          <Cubes />
          <Ground />
        </Physics>
      </Canvas>
      <div className="absolute centered cursor">+</div>
      <TextureSelector />
      <div className="menu absolute">
        <button onClick={() => saveWorld()}>Save</button>
        <button onClick={() => resetWorld()}>Reset</button>
      </div>
    </>
  )
}

export default App
