import { keepHighest, rollKeepHighestSum, rollOverkill, sum } from "./random"

enum DamageType {
  Kinetic = "kinetic",
  Explosive = "explosive",
  Energy = "energy",
  Heat = "heat",
  Burn = "burn",
}

enum MountSize {
  Auxiliary = "auxiliary",
  Main = "main",
  Heavy = "heavy",
  Superheavy = "superheavy",
}

enum WeaponType {
  Melee = "melee",
  CQB = "cqb",
  Rifle = "rifle",
  Launcher = "launcher",
  Cannon = "cannon",
  Nexus = "nexus",
}

enum PatternType {
  Line = "line",
  Cone = "cone",
  Blast = "blast",
  Burst = "burst",
}

enum WeaponTags {
  Accurate = "accurate",
  Arcing = "arcing",
  ArmorPiercing = "armorPiercing",
  HeatX = "heat",
  Inaccurate = "inaccurate",
  KnockbackX = "knockback",
  Limited = "limited",
  Loading = "loading",
  Ordnance = "ordnance",
  Overkill = "overkill",
  Overshield = "overshield",
  ReliableX = "reliable",
  Seeking = "seeking",
  Smart = "smart",
  ThrownX = "thrown",
  Unique = "unique",
}

type Tag = {
  name: WeaponTags
  value?: number
}

type Damage = {
  [key in DamageType]: number
}

type DamageRoll = {
  number: number
  size: number
  flat?: number
  type: DamageType
}

type WeaponStats = {
  size: MountSize
  type: WeaponType
  range?: number
  threat?: number
  pattern?: PatternType
  radius?: number
  damage: DamageRoll[]
  tags: Tag[]
}

interface IWeapon {
  rollDamage(critical: boolean): Damage
  hasTag(tag: WeaponTags): boolean
  getTagValue(tag: WeaponTags): number
  setTagValue(tag: WeaponTags, value: number): void
  get destroyed()
  set destroyed(destroyed: boolean)
  getStats(): WeaponStats
}

class Weapon implements IWeapon {
  private archetype: string
  private stats: WeaponStats
  private _destroyed: boolean
  // TODO pointer to owner for heat, abilities, etc.

  constructor(archetype: string, stats: WeaponStats) {
    this.archetype = archetype
    // hacky way to deep copy, stats should be normal serializable objects anyway
    this.stats = JSON.parse(JSON.stringify(stats))
    this._destroyed = false
  }

  get name() {
    return this.archetype
  }

  get destroyed(): boolean {
    return this._destroyed
  }
  set destroyed(destroyed: boolean) {
    // handle destruction
    this._destroyed = destroyed
  }

  rollDamage(critical = false) {
    const damage: Damage = {
      kinetic: 0,
      explosive: 0,
      energy: 0,
      heat: 0,
      burn: 0,
    }
    // Roll damage dice
    for (const damageRoll of this.stats.damage) {
      const { number, size, flat, type } = damageRoll
      let diceToRoll = critical ? 2 * number : number
      let amount: number
      // handle Overkill weapons
      if (this.hasTag(WeaponTags.Overkill)) {
        const { finishedRolls, onesRolled } = rollOverkill(diceToRoll, size)
        amount = sum(keepHighest(finishedRolls, number))
        // TODO: inflict onesRolled heat
        if (onesRolled > 0)
          console.log(`mech using this weapon takes ${onesRolled} heat`)
      } else {
        // if diceToRoll == number, we just get our original roll. Otherwise, it's a crit roll
        amount = rollKeepHighestSum(diceToRoll, size, number)
      }
      if (flat) amount += flat
      damage[type] += amount
    }

    // Handle Reliable weapons
    if (this.hasTag(WeaponTags.ReliableX)) {
      const sumDamage =
        damage.kinetic +
        damage.explosive +
        damage.energy +
        damage.heat +
        damage.burn
      const reliableDamage = this.getTagValue(WeaponTags.ReliableX)
      if (sumDamage < reliableDamage) {
        // "fill up" the missing damage
        // implicitly treat first damageRoll as primary damage type
        damage[this.stats.damage[0].type] += reliableDamage - sumDamage
      }
    }
    return damage
  }

  private getTag(searchTag: WeaponTags) {
    for (const tag of this.stats.tags) {
      if (tag.name === searchTag) return tag
    }
    return undefined
  }

  hasTag(searchTag: WeaponTags) {
    return this.getTag(searchTag) ? true : false
  }

  getTagValue(searchTag: WeaponTags) {
    const tag = this.getTag(searchTag)
    if (!tag)
      throw new Error(
        `Attempted to get value of non-existent tag: ${searchTag}`
      )
    if (!tag.value)
      throw new Error(`Attempted to get value of valueless tag: ${searchTag}`)
    return tag.value
  }

  setTagValue(searchTag: WeaponTags, value: number) {
    const tag = this.getTag(searchTag)
    if (!tag)
      throw new Error(
        `Attempted to set value of non-existent tag: ${searchTag}`
      )
    tag.value = value
  }

  getStats() {
    return this.stats
  }
}

export { Weapon, WeaponStats, WeaponTags, Damage, DamageType }
