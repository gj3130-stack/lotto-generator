// Premium 6/45 Lotto Combination Engine with 5 Smart Modes

import { LOTTO_STATISTICS } from '../data/historyData';

// Cryptographically Secure Random Integer [min, max]
function getSecureRandomInt(min, max) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const range = max - min + 1;
    const maxValid = Math.floor(4294967296 / range) * range;
    const array = new Uint32Array(1);
    let rand;
    do {
      window.crypto.getRandomValues(array);
      rand = array[0];
    } while (rand >= maxValid);
    return min + (rand % range);
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check Balance Filter: Sum (100~175), Odd/Even (2:4, 3:3, 4:2), Max Consecutive <= 2
export function isBalancedCombination(numbers) {
  const sum = numbers.reduce((acc, cur) => acc + cur, 0);
  if (sum < 100 || sum > 175) return false;

  const oddCount = numbers.filter(n => n % 2 !== 0).length;
  if (oddCount < 2 || oddCount > 4) return false;

  // Consecutive sequence check
  const sorted = [...numbers].sort((a, b) => a - b);
  let consecutiveCount = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] === sorted[i] + 1) {
      consecutiveCount++;
      if (consecutiveCount >= 3) return false;
    } else {
      consecutiveCount = 1;
    }
  }

  return true;
}

/**
 * Generate a single 6-number lotto game
 * @param {string} engineMode - 'balanced' | 'hot' | 'cold' | 'hybrid' | 'random'
 * @param {number[]} lockedNumbers - Fixed numbers (1 ~ 5)
 * @param {number[]} excludedNumbers - Excluded numbers
 */
export function generateSingleGame(engineMode = 'balanced', lockedNumbers = [], excludedNumbers = []) {
  const lockedSet = new Set(lockedNumbers.filter(n => n >= 1 && n <= 45));
  const excludedSet = new Set(excludedNumbers.filter(n => n >= 1 && n <= 45));

  // If locked numbers contain excluded ones, ignore exclusion for locked
  const validExcluded = new Set([...excludedSet].filter(n => !lockedSet.has(n)));

  // Available candidate pool
  const candidatePool = [];
  for (let i = 1; i <= 45; i++) {
    if (!lockedSet.has(i) && !validExcluded.has(i)) {
      candidatePool.push(i);
    }
  }

  const neededCount = 6 - lockedSet.size;
  if (neededCount <= 0) {
    return [...lockedSet].slice(0, 6).sort((a, b) => a - b);
  }

  // Pre-configured weighting for Hot/Cold
  const hotList = LOTTO_STATISTICS.hotNumbers.filter(n => candidatePool.includes(n));
  const coldList = LOTTO_STATISTICS.coldNumbers.filter(n => candidatePool.includes(n));

  let attempts = 0;
  const maxAttempts = 150;

  while (attempts < maxAttempts) {
    attempts++;
    const chosen = new Set(lockedSet);

    if (engineMode === 'hot') {
      // Prioritize hot numbers
      const hotPoolWeighted = [];
      candidatePool.forEach(num => {
        const weight = hotList.includes(num) ? 4 : (LOTTO_STATISTICS.numberFrequency[num] > 180 ? 2 : 1);
        for (let w = 0; w < weight; w++) hotPoolWeighted.push(num);
      });

      while (chosen.size < 6 && hotPoolWeighted.length > 0) {
        const idx = getSecureRandomInt(0, hotPoolWeighted.length - 1);
        chosen.add(hotPoolWeighted[idx]);
      }
    } else if (engineMode === 'cold') {
      // Prioritize cold numbers
      const coldPoolWeighted = [];
      candidatePool.forEach(num => {
        const weight = coldList.includes(num) ? 5 : (LOTTO_STATISTICS.numberFrequency[num] < 170 ? 3 : 1);
        for (let w = 0; w < weight; w++) coldPoolWeighted.push(num);
      });

      while (chosen.size < 6 && coldPoolWeighted.length > 0) {
        const idx = getSecureRandomInt(0, coldPoolWeighted.length - 1);
        chosen.add(coldPoolWeighted[idx]);
      }
    } else if (engineMode === 'hybrid') {
      // 2~3 Hot + 1~2 Cold + Rest Random
      const shuffledHot = [...hotList].sort(() => Math.random() - 0.5);
      const shuffledCold = [...coldList].sort(() => Math.random() - 0.5);

      shuffledHot.slice(0, 2).forEach(n => { if (chosen.size < 6) chosen.add(n); });
      shuffledCold.slice(0, 2).forEach(n => { if (chosen.size < 6) chosen.add(n); });

      const remainingPool = candidatePool.filter(n => !chosen.has(n));
      while (chosen.size < 6 && remainingPool.length > 0) {
        const idx = getSecureRandomInt(0, remainingPool.length - 1);
        chosen.add(remainingPool.splice(idx, 1)[0]);
      }
    } else if (engineMode === 'balanced') {
      // Pick random candidates and check balance filter
      const poolCopy = [...candidatePool];
      while (chosen.size < 6 && poolCopy.length > 0) {
        const idx = getSecureRandomInt(0, poolCopy.length - 1);
        chosen.add(poolCopy.splice(idx, 1)[0]);
      }

      const candidateArr = Array.from(chosen);
      if (isBalancedCombination(candidateArr)) {
        return candidateArr.sort((a, b) => a - b);
      }
      continue; // Retry to satisfy balanced filter
    } else {
      // Pure Random Mode
      const poolCopy = [...candidatePool];
      while (chosen.size < 6 && poolCopy.length > 0) {
        const idx = getSecureRandomInt(0, poolCopy.length - 1);
        chosen.add(poolCopy.splice(idx, 1)[0]);
      }
    }

    if (chosen.size === 6) {
      return Array.from(chosen).sort((a, b) => a - b);
    }
  }

  // Fallback if strict filter exhausted attempts
  const fallback = new Set(lockedSet);
  const fallbackPool = candidatePool.filter(n => !fallback.has(n));
  while (fallback.size < 6 && fallbackPool.length > 0) {
    const idx = getSecureRandomInt(0, fallbackPool.length - 1);
    fallback.add(fallbackPool.splice(idx, 1)[0]);
  }

  return Array.from(fallback).sort((a, b) => a - b);
}

/**
 * Generate multiple games (1 to 5 games)
 */
export function generateMultipleGames(count = 5, engineMode = 'balanced', lockedNumbers = [], excludedNumbers = []) {
  const games = [];
  for (let i = 0; i < count; i++) {
    games.push(generateSingleGame(engineMode, lockedNumbers, excludedNumbers));
  }
  return games;
}
