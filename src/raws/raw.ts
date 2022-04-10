import fs from "fs"
import path from "path"
import { isA } from "ts-type-checked"
import { FrameStats } from "../game/units"

interface FrameRaw {
  [key: string]: FrameStats
}

const AvailableFrames = new Map<string, FrameStats>()

function loadFrames() {
  // try loading Frames raw
  const framesData = fs.readFileSync(path.join(__dirname, "frames.json"))
  let frames: FrameRaw
  try {
    frames = JSON.parse(framesData.toString())
  } catch (error) {
    console.error("Failed to parse FrameRaw", error)
    return
  }

  // populate AvailableFrames
  for (const [name, frameStats] of Object.entries(frames)) {
    if (!isA<FrameStats>(frameStats)) {
      console.error(`Failed to parse "${name}" frame stats`)
      continue
    }
    AvailableFrames.set(name, frameStats)
  }
  return AvailableFrames
}

export { loadFrames }
