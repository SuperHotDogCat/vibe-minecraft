import { NearestFilter, TextureLoader } from 'three'
import {
  dirtImg,
  grassImg,
  glassImg,
  woodImg,
  logImg,
  groundImg,
  waterImg,
  ironImg,
  leavesImg,
  swordImg,
  pickaxeImg,
} from './images'

const dirtTexture = new TextureLoader().load(dirtImg)
const grassTexture = new TextureLoader().load(grassImg)
const glassTexture = new TextureLoader().load(glassImg)
const woodTexture = new TextureLoader().load(woodImg)
const logTexture = new TextureLoader().load(logImg)
const groundTexture = new TextureLoader().load(groundImg)
const waterTexture = new TextureLoader().load(waterImg)
const ironTexture = new TextureLoader().load(ironImg)
const leavesTexture = new TextureLoader().load(leavesImg)
const swordTexture = new TextureLoader().load(swordImg)
const pickaxeTexture = new TextureLoader().load(pickaxeImg)

dirtTexture.magFilter = NearestFilter
grassTexture.magFilter = NearestFilter
glassTexture.magFilter = NearestFilter
woodTexture.magFilter = NearestFilter
logTexture.magFilter = NearestFilter
groundTexture.magFilter = NearestFilter
waterTexture.magFilter = NearestFilter
ironTexture.magFilter = NearestFilter
leavesTexture.magFilter = NearestFilter
swordTexture.magFilter = NearestFilter
pickaxeTexture.magFilter = NearestFilter

export {
  dirtTexture,
  grassTexture,
  glassTexture,
  woodTexture,
  logTexture,
  groundTexture,
  waterTexture,
  ironTexture,
  leavesTexture,
  swordTexture,
  pickaxeTexture,
}
