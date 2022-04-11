import fs from "fs"
import path from "path"
import { isA } from "ts-type-checked"
import { FrameStats } from "../game/frame"
import { WeaponStats } from "../game/weapon"

interface FrameRaw {
  [key: string]: FrameStats
}

interface WeaponRaw {
  [key: string]: WeaponStats
}

function loadWeapons() {
  const AvailableWeapons = new Map<string, WeaponStats>()
  // try loading raws
  const weaponsData = fs.readFileSync(path.join(__dirname, "weapons.json"))
  let weapons: WeaponRaw
  try {
    weapons = JSON.parse(weaponsData.toString())
  } catch (error) {
    console.error("Failed to parse WeaponRaw", error)
    return
  }

  // populate raws
  for (const [name, WeaponStats] of Object.entries(weapons)) {
    if (!isA<WeaponStats>(WeaponStats)) {
      console.error(`Failed to parse "${name}" weapon stats`)
      continue
    }
    AvailableWeapons.set(name, WeaponStats)
  }
  return AvailableWeapons
}

function loadFrames() {
  const AvailableFrames = new Map<string, FrameStats>()
  // try loading raws
  const framesData = fs.readFileSync(path.join(__dirname, "frames.json"))
  let frames: FrameRaw
  try {
    frames = JSON.parse(framesData.toString())
  } catch (error) {
    console.error("Failed to parse FrameRaw", error)
    return
  }

  // populate raws
  for (const [name, frameStats] of Object.entries(frames)) {
    if (!isA<FrameStats>(frameStats)) {
      console.error(`Failed to parse "${name}" frame stats`)
      continue
    }
    AvailableFrames.set(name, frameStats)
  }
  return AvailableFrames
}

export default function loadRaws() {
  // order DOES matter
  const AvailableWeapons = loadWeapons()
  const AvailableFrames = loadFrames()
  return { AvailableWeapons, AvailableFrames }
}
