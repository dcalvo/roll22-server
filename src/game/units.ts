export interface FrameStats {
  structure: number
  stress: number
  armor: number
  hp: number
  evasion: number
  eDefense: number
  heat: number
  sensors: number
  techAttack: number
  repairCap: number
  saveTarget: number
  speed: number
  systemPoints: number
}

interface IFrame {
  inflictDamage(value: number): number
  inflictHeat(value: number): number
  takeStructureDamage(): number
  takeStressDamage(): number
  getBaseStats(): FrameStats
  getCurrentStats(): FrameStats
}

class Frame implements IFrame {
  private archetype: string
  private baseStats: FrameStats
  private currentStats: FrameStats

  constructor(archetype: string, stats: FrameStats) {
    this.archetype = archetype
    // hacky way to deep copy, stats should be normal serializable objects anyway
    this.baseStats = JSON.parse(JSON.stringify(stats))
    this.currentStats = JSON.parse(JSON.stringify(stats))
    this.currentStats.heat = 0
  }

  get name() {
    return this.archetype
  }

  inflictDamage(value: number) {
    this.currentStats.hp -= value
    // reduce structure and apply excess damage
    while (this.currentStats.hp <= 0) {
      const structure = this.takeStructureDamage()
      if (structure) this.currentStats.hp += this.baseStats.hp
      else break
    }
    return this.currentStats.hp
  }

  inflictHeat(value: number) {
    this.currentStats.heat += value
    // reduce stress and apply excess heat
    while (this.currentStats.heat >= this.baseStats.heat) {
      const stress = this.takeStressDamage()
      if (stress) this.currentStats.heat -= this.baseStats.heat
      else break
    }
    return this.currentStats.heat
  }

  takeStructureDamage() {
    this.currentStats.structure -= 1
    console.log(`your structure was set to ${this.currentStats.structure}`)
    if (this.currentStats.structure <= 0) {
      console.log("you've died to structure damage")
    }
    return this.currentStats.structure
  }

  takeStressDamage() {
    this.currentStats.stress -= 1
    console.log(`your stress was set to ${this.currentStats.stress}`)
    if (this.currentStats.stress <= 0) {
      console.log("you've died to stress damage")
    }
    return this.currentStats.stress
  }

  getBaseStats() {
    return this.baseStats
  }

  getCurrentStats() {
    return this.currentStats
  }
}

export { Frame }
