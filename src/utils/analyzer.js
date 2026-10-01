// Lotto Combination Diagnosis & Winning Checker

import { RECENT_DRAWS, LOTTO_STATISTICS } from '../data/historyData';

/**
 * Check rank for a combination against a specific draw
 */
export function checkWinningRank(myNumbers, winNumbers, bonusNumber) {
  const mySet = new Set(myNumbers);
  const matched = winNumbers.filter(num => mySet.has(num));
  const hasBonus = mySet.has(bonusNumber);

  let rank = '낙첨';
  let prizeText = '다음 기회에!';

  if (matched.length === 6) {
    rank = '1등';
    prizeText = '🎉 인생역전! 1등 당첨!';
  } else if (matched.length === 5 && hasBonus) {
    rank = '2등';
    prizeText = '🥈 대박! 2등 당첨!';
  } else if (matched.length === 5) {
    rank = '3등';
    prizeText = '🥉 축하합니다! 3등 당첨!';
  } else if (matched.length === 4) {
    rank = '4등';
    prizeText = '⭐ 4등 당첨 (고정 5만원)';
  } else if (matched.length === 3) {
    rank = '5등';
    prizeText = '✨ 5등 당첨 (고정 5천원)';
  }

  return {
    matchedCount: matched.length,
    matchedNumbers: matched,
    hasBonus,
    rank,
    prizeText
  };
}

/**
 * Diagnose a 6-number combination
 */
export function diagnoseCombination(numbers) {
  if (!numbers || numbers.length !== 6) {
    return null;
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);

  // Odd / Even
  const oddCount = sorted.filter(n => n % 2 !== 0).length;
  const evenCount = 6 - oddCount;

  // High / Low (1~22: Low, 23~45: High)
  const lowCount = sorted.filter(n => n <= 22).length;
  const highCount = 6 - lowCount;

  // Color / Range distribution
  const ranges = {
    yellow: sorted.filter(n => n <= 10).length, // 1~10
    blue: sorted.filter(n => n >= 11 && n <= 20).length, // 11~20
    red: sorted.filter(n => n >= 21 && n <= 30).length, // 21~30
    gray: sorted.filter(n => n >= 31 && n <= 40).length, // 31~40
    green: sorted.filter(n => n >= 41).length // 41~45
  };

  // Consecutive numbers
  let consecutivePairs = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] === sorted[i] + 1) {
      consecutivePairs++;
    }
  }

  // Calculate Balance Score (0 ~ 100)
  let score = 100;

  // Sum check (Ideal: 100 ~ 175)
  if (sum < 90 || sum > 185) {
    score -= 20;
  } else if (sum < 100 || sum > 175) {
    score -= 10;
  }

  // Odd:Even balance (Ideal: 3:3 or 2:4 or 4:2)
  if (oddCount === 0 || oddCount === 6) {
    score -= 25;
  } else if (oddCount === 1 || oddCount === 5) {
    score -= 10;
  }

  // High:Low balance
  if (lowCount === 0 || lowCount === 6) {
    score -= 20;
  }

  // Consecutive penalty
  if (consecutivePairs >= 3) {
    score -= 20;
  } else if (consecutivePairs === 2) {
    score -= 5;
  }

  // Non-appearance in any section penalty
  const emptyRanges = Object.values(ranges).filter(c => c === 0).length;
  if (emptyRanges >= 3) {
    score -= 15;
  }

  score = Math.max(25, Math.min(100, score));

  // Past Historical simulation against RECENT_DRAWS
  const matchHistory = {
    rank1: 0,
    rank2: 0,
    rank3: 0,
    rank4: 0,
    rank5: 0
  };

  RECENT_DRAWS.forEach(draw => {
    const res = checkWinningRank(sorted, draw.numbers, draw.bonus);
    if (res.rank === '1등') matchHistory.rank1++;
    else if (res.rank === '2등') matchHistory.rank2++;
    else if (res.rank === '3등') matchHistory.rank3++;
    else if (res.rank === '4등') matchHistory.rank4++;
    else if (res.rank === '5등') matchHistory.rank5++;
  });

  return {
    numbers: sorted,
    sum,
    sumStatus: (sum >= 100 && sum <= 175) ? '최적 구간 (100~175)' : (sum < 100 ? '낮은 합계 구간' : '높은 합계 구간'),
    oddEven: `${oddCount} : ${evenCount}`,
    oddEvenStatus: (oddCount >= 2 && oddCount <= 4) ? '황금 비율' : '극단적 편중',
    highLow: `${lowCount} : ${highCount}`,
    ranges,
    consecutivePairs,
    score,
    matchHistory
  };
}
