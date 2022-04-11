import { Damage, DamageType } from "./weapon"

type FrameStats = {
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

const { Kinetic, Explosive, Energy, Heat, Burn } = DamageType

interface IFrame {
  takeDamage(damage: Damage, armorPiercing: boolean): void
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

  takeDamage(damage: Damage, armorPiercing = false): void {
    let { kinetic, explosive, energy, heat, burn } = damage
    // TODO: implement exposed status
    if (false) {
      kinetic *= 2
      explosive *= 2
      energy *= 2
    }

    // Handle armor application
    // TODO implement shredded
    if (!armorPiercing && this.currentStats.armor > 0) {
      // figure out where armor will have the most effect
      const kineticAfterResist = this.hasResistance(Kinetic)
        ? kinetic / 2
        : kinetic
      const explosiveAfterResist = this.hasResistance(Explosive)
        ? explosive / 2
        : explosive
      const energyAfterResist = this.hasResistance(Energy) ? energy / 2 : energy
      // we want to minimize damage to the frame, so we apply armor to the largest value after resist
      if (
        kineticAfterResist >= explosiveAfterResist &&
        kineticAfterResist >= energyAfterResist
      )
        kinetic -= this.currentStats.armor
      else if (
        explosiveAfterResist >= kineticAfterResist &&
        explosiveAfterResist >= energyAfterResist
      )
        explosive -= this.currentStats.armor
      else energy -= this.currentStats.armor
    }

    // Apply resistances
    // TODO implement shredded
    if (true && this.hasResistance(Kinetic)) kinetic /= 2
    if (true && this.hasResistance(Explosive)) explosive /= 2
    if (true && this.hasResistance(Energy)) energy /= 2
    if (true && this.hasResistance(Heat)) heat /= 2
    if (true && this.hasResistance(Burn)) burn /= 2

    this.inflictDamage(kinetic + explosive + energy)
    // TODO implement burn
    this.inflictHeat(heat + burn)
  }

  private inflictDamage(value: number) {
    this.currentStats.hp -= value
    // reduce structure and apply excess damage
    while (this.currentStats.hp <= 0) {
      const structure = this.takeStructureDamage()
      if (structure) this.currentStats.hp += this.baseStats.hp
      else break
    }
  }

  private inflictHeat(value: number) {
    this.currentStats.heat += value
    // reduce stress and apply excess heat
    while (this.currentStats.heat >= this.baseStats.heat) {
      const stress = this.takeStressDamage()
      if (stress) this.currentStats.heat -= this.baseStats.heat
      else break
    }
  }

  private takeStructureDamage() {
    this.currentStats.structure -= 1
    console.log(`your structure was set to ${this.currentStats.structure}`)
    if (this.currentStats.structure <= 0) {
      console.log("you've died to structure damage")
    }
    return this.currentStats.structure
  }

  private takeStressDamage() {
    this.currentStats.stress -= 1
    console.log(`your stress was set to ${this.currentStats.stress}`)
    if (this.currentStats.stress <= 0) {
      console.log("you've died to stress damage")
    }
    return this.currentStats.stress
  }

  private hasResistance(damageType: DamageType) {
    switch (damageType) {
      case Kinetic:
        return false
      case Explosive:
      case Energy:
      case Heat:
      case Burn:
      default:
        return true // wow so tank
    }
  }

  getBaseStats() {
    return this.baseStats
  }

  getCurrentStats() {
    return this.currentStats
  }
}

export { Frame, FrameStats }
