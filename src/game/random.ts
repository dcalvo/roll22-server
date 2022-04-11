/**
 * Sum an array of dice rolls
 * @param rolls array of dice rolls
 * @returns sum of dice rolls
 */
function sum(rolls: number[]) {
  return rolls.reduce((partialSum, a) => partialSum + a, 0)
}

/**
 * Roll [number]d[size] dice
 * @param number number of dice to roll
 * @param size size of dice to roll
 * @returns array of all dice rolled
 */
function roll(number: number, size: number) {
  const rolls: number[] = []
  for (let i = 0; i < number; i++) {
    rolls.push(Math.floor(Math.random() * size) + 1)
  }
  return rolls
}

/**
 * Roll [number]d[size] dice and sum their total
 * @param number number of dice to roll
 * @param size size of dice to roll
 * @returns sum of all dice rolled
 */
function rollSum(number: number, size: number) {
  return sum(roll(number, size))
}

/**
 * Keep highest [highest] dice from [rolls]
 * @param rolls dice pool to inspect
 * @param highest number of highest dice to keep
 * @returns array of highest dice rolled
 */
function keepHighest(rolls: number[], highest: number) {
  // sort descending
  return rolls.sort((a, b) => b - a).slice(0, highest)
}

/**
 * Roll [number]d[size] dice and keep highest [highest]
 * @param number number of dice to roll
 * @param size size of dice to roll
 * @param highest number of highest dice to keep
 * @returns array of highest dice rolled
 */
function rollKeepHighest(number: number, size: number, highest: number) {
  return keepHighest(roll(number, size), highest)
}

/**
 * Roll [number]d[size] dice, keep highest [highest], and sum their total
 * @param number number of dice to roll
 * @param size size of dice to roll
 * @param highest number of highest dice to keep
 * @returns sum of highest dice rolled
 */
function rollKeepHighestSum(number: number, size: number, highest: number) {
  return sum(rollKeepHighest(number, size, highest))
}

/**
 * Keep lowest [lowest] dice from [rolls]
 * @param rolls dice pool to inspect
 * @param lowest number of highest dice to keep
 * @returns array of highest dice rolled
 */
function keepLowest(rolls: number[], lowest: number) {
  // sort ascending
  return rolls.sort((a, b) => a - b).slice(0, lowest)
}

/**
 * Roll [number]d[size] dice and keep lowest [lowest]
 * @param number number of dice to roll
 * @param size size of dice to roll
 * @param lowest number of lowest dice to keep
 * @returns array of lowest dice rolled
 */
function rollKeepLowest(number: number, size: number, lowest: number) {
  return keepLowest(roll(number, size), lowest)
}

/**
 * Roll [number]d[size] dice, keep lowest [lowest], and sum their total
 * @param number number of dice to roll
 * @param size size of dice to roll
 * @param lowest number of lowest dice to keep
 * @returns sum of lowest dice rolled
 */
function rollKeepLowestSum(number: number, size: number, lowest: number) {
  return sum(rollKeepLowest(number, size, lowest))
}

/**
 * Roll [number]d[size] dice, rerolling any 1s until no 1s remain
 * @param number number of dice to roll
 * @param size size of dice to roll
 * @returns [array of all dice rolled, number of ones rolled]
 */
function rollOverkill(number: number, size: number) {
  const finishedRolls: number[] = []
  let onesRolled = 0
  while (finishedRolls.length != number) {
    const rolls = roll(number - finishedRolls.length, size)
    rolls.forEach((roll) => {
      if (roll !== 1) finishedRolls.push(roll)
      else onesRolled += 1
    })
  }
  return { finishedRolls, onesRolled }
}

export {
  sum,
  roll,
  rollSum,
  keepHighest,
  rollKeepHighest,
  rollKeepHighestSum,
  keepLowest,
  rollKeepLowest,
  rollKeepLowestSum,
  rollOverkill,
}
