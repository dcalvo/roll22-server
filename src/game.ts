import { Frame } from "./game/frame"
import { Weapon } from "./game/weapon"
import loadRaws from "./raws/raw"

enum TileType {
  Floor,
  Wall,
}

class HexMap {
  private width: number = 0
  private height: number = 0
  private map: TileType[] = []

  private xyIndex(x: number, y: number) {
    return x + y * this.width
  }

  public newMap(width: number, height: number) {
    this.width = width
    this.height = height
    this.map = Array(width * height).fill(TileType.Floor)

    // create an area with walls around the perimeter
    for (let x = 0; x < this.width; x++) {
      this.map[this.xyIndex(x, 0)] = TileType.Wall
      this.map[this.xyIndex(x, this.height - 1)] = TileType.Wall
    }
    for (let y = 0; y < this.height; y++) {
      this.map[this.xyIndex(0, y)] = TileType.Wall
      this.map[this.xyIndex(this.width - 1, y)] = TileType.Wall
    }
  }

  public debugPrint() {
    console.log("Debug Map")
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.map[this.xyIndex(x, y)]
        let glyph: string
        switch (tile) {
          case TileType.Floor:
            glyph = "."
            break
          case TileType.Wall:
            glyph = "#"
            break
          default:
            glyph = "?"
            break
        }
        process.stdout.write(glyph)
      }
      process.stdout.write("\n")
    }
  }
}

export function test(payload: { [key: string]: any }) {
  const hexMap = new HexMap()
  hexMap.newMap(payload.width, payload.height)
  hexMap.debugPrint()
  const { AvailableFrames, AvailableWeapons } = loadRaws()
  const frames: Frame[] = []
  const weapons: Weapon[] = []
  AvailableFrames?.forEach((frameStats, name) => {
    frames.push(new Frame(name, frameStats))
  })
  AvailableWeapons?.forEach((weaponStats, name) =>
    weapons.push(new Weapon(name, weaponStats))
  )
  const damage = weapons[0].rollDamage(true)
  console.log(frames[0].getCurrentStats())
  console.log(damage)
  frames[0].takeDamage(damage)
  console.log(frames[0].getCurrentStats())
}
