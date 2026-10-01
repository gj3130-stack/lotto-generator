// Korea Lottery Tax & Net Payout Flex Calculator

export function calculateLotteryTax(amount) {
  const numericAmount = Math.max(0, Number(amount) || 0);

  if (numericAmount <= 2000000) {
    return {
      grossAmount: numericAmount,
      taxAmount: 0,
      netAmount: numericAmount,
      effectiveTaxRate: 0,
      taxBreakdown: '200만원 이하 전액 비과세'
    };
  }

  let tax = 0;
  if (numericAmount <= 300000000) {
    // Up to 300M KRW: 22% (Income 20% + Local 2%)
    tax = numericAmount * 0.22;
  } else {
    // 300M KRW is taxed at 22% = 66,000,000 KRW
    // Over 300M KRW is taxed at 33% (Income 30% + Local 3%)
    const excess = numericAmount - 300000000;
    tax = (300000000 * 0.22) + (excess * 0.33);
  }

  const net = numericAmount - tax;
  const effectiveRate = ((tax / numericAmount) * 100).toFixed(1);

  // Bank Deposit Monthly Interest Estimation (3.5% APY with 15.4% interest tax)
  const annualGrossInterest = net * 0.035;
  const annualNetInterest = annualGrossInterest * (1 - 0.154);
  const monthlyNetInterest = Math.round(annualNetInterest / 12);

  // Flex Items
  const flexItems = [
    { label: '은행 예금 시 매월 숨만 쉬어도 받는 이자', value: `월 ${formatKRW(monthlyNetInterest)}`, icon: '🏦' },
    { label: '포르쉐 911 (1.8억 기준)', value: `${Math.floor(net / 180000000).toLocaleString()} 대`, icon: '🏎️' },
    { label: '최고급 프리미엄 치킨 (2.5만원)', value: `${Math.floor(net / 25000).toLocaleString()} 마리`, icon: '🍗' },
    { label: '아이폰 16 프로 (170만원)', value: `${Math.floor(net / 1700000).toLocaleString()} 대`, icon: '📱' }
  ];

  return {
    grossAmount: numericAmount,
    taxAmount: Math.round(tax),
    netAmount: Math.round(net),
    effectiveTaxRate: effectiveRate,
    monthlyNetInterest,
    flexItems
  };
}

export function formatKRW(val) {
  const num = Math.round(val);
  if (num >= 100000000) {
    const eok = Math.floor(num / 100000000);
    const man = Math.floor((num % 100000000) / 10000);
    return man > 0 ? `${eok.toLocaleString()}억 ${man.toLocaleString()}만원` : `${eok.toLocaleString()}억원`;
  }
  if (num >= 10000) {
    return `${Math.floor(num / 10000).toLocaleString()}만원`;
  }
  return `${num.toLocaleString()}원`;
}
