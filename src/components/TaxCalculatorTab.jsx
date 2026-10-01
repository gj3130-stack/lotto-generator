import React, { useState } from 'react';
import { Calculator, Coins, TrendingUp, Sparkles, Building2, Flame } from 'lucide-react';
import { calculateLotteryTax, formatKRW } from '../utils/taxCalculator';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

const PRESET_AMOUNTS = [
  { label: '10억', val: 1000000000 },
  { label: '20억', val: 2000000000 },
  { label: '25억 (평균)', val: 2500000000 },
  { label: '35억', val: 3500000000 },
  { label: '50억 (대박)', val: 5000000000 },
  { label: '100억 (역대급)', val: 10000000000 }
];

export default function TaxCalculatorTab() {
  const [amount, setAmount] = useState(2500000000);
  const taxResult = calculateLotteryTax(amount);

  const handleSelectPreset = (val) => {
    sound.playClick();
    triggerHaptic(15);
    setAmount(val);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Input */}
      <div className="glass-panel-gold rounded-2xl p-5 md:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              가상 1등 당첨금 실수령액 & 플렉스 시뮬레이터
            </h2>
          </div>
          <span className="text-xs text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            대한민국 세법(22%·33%) 기준
          </span>
        </div>

        {/* Amount Input & Presets */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="text-xs text-slate-300 whitespace-nowrap">당첨금 직접 입력 (원):</label>
            <input
              type="number"
              step="100000000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full sm:flex-1 bg-slate-900 border border-amber-500/30 text-amber-300 font-outfit text-lg font-bold px-4 py-2.5 rounded-xl outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {PRESET_AMOUNTS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleSelectPreset(item.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  amount === item.val
                    ? 'bg-amber-400 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calculation Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Gross */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">총 당첨금 (세전)</span>
          <p className="text-xl md:text-2xl font-black text-white font-outfit">
            {formatKRW(taxResult.grossAmount)}
          </p>
          <p className="text-[11px] text-slate-500">당첨 공고 금액</p>
        </div>

        {/* Tax */}
        <div className="glass-panel rounded-2xl p-5 border border-rose-500/20 space-y-1">
          <span className="text-xs text-rose-400">공제 세금 ({taxResult.effectiveTaxRate}%)</span>
          <p className="text-xl md:text-2xl font-black text-rose-400 font-outfit">
            - {formatKRW(taxResult.taxAmount)}
          </p>
          <p className="text-[11px] text-slate-500">
            3억 이하 22% + 3억 초과분 33%
          </p>
        </div>

        {/* Net (Highlight) */}
        <div className="glass-panel-gold rounded-2xl p-5 border border-amber-400/50 shadow-xl space-y-1">
          <span className="text-xs text-amber-300 font-bold">실제 내 통장 입금액 (세후)</span>
          <p className="text-2xl md:text-3xl font-black gold-gradient-text font-outfit">
            {formatKRW(taxResult.netAmount)}
          </p>
          <p className="text-[11px] text-amber-200/80">농협 본점 방문 즉시 수령</p>
        </div>
      </div>

      {/* Flex Simulator Section (Dopamine Trigger) */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          <h3 className="font-bold text-white text-base">
            당첨금 {formatKRW(taxResult.netAmount)}으로 누리는 인생 역전 플렉스
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {taxResult.flexItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3.5 hover:border-amber-500/30 transition"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <span className="text-xs text-slate-400 block">{item.label}</span>
                <strong className="text-base text-amber-300 font-outfit font-black">
                  {item.value}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
