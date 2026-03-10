import { useStore } from '../hooks/useStore'
import { Mob } from './Mob'

export const Mobs = () => {
  const mobs = useStore((state) => state.mobs)
  return (
    <>
      {mobs.map((mob) => (
        <Mob
          key={mob.id}
          id={mob.id}
          type={mob.type}
          position={mob.pos}
        />
      ))}
    </>
  )
}
