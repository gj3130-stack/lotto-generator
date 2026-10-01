import React, { useState } from 'react';
import { BarChart3, TrendingUp, Flame, Snowflake, PieChart, Award, Calendar } from 'lucide-react';
import { LOTTO_STATISTICS, RECENT_DRAWS } from '../data/historyData';
import LottoBall from './LottoBall';
import { formatKRW } from '../utils/taxCalculator';

export default function HistoryTab() {
  const [selectedDrawIndex, setSelectedDrawIndex] = useState(0);
  const currentDraw = RECENT_DRAWS[selectedDrawIndex];

  // Frequency Ranking
  const freqEntries = Object.entries(LOTTO_STATISTICS.numberFrequency)
    .map(([num, count]) => ({ num: Number(num), count }))
    .sort((a, b) => b.count - a.count);

  const top10 = freqEntries.slice(0, 10);
  const bottom5 = freqEntries.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Latest Draw Highlight Banner */}
      <div className="glass-panel-gold rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 font-outfit">
                제 {currentDraw.round} 회차
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {currentDraw.date} 추첨
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              최신 회차 1등 당첨 결과
            </h2>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">1등 1인당 수령액 ({currentDraw.firstWinnerCount}명)</p>
            <p className="text-xl md:text-2xl font-black gold-gradient-text font-outfit">
              {formatKRW(currentDraw.firstPrizeAmount)}
            </p>
          </div>
        </div>

        {/* Lotto Balls Display with Bonus Ball */}
        <div className="py-5 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {currentDraw.numbers.map((num) => (
            <LottoBall key={num} number={num} size="lg" />
          ))}
          <div className="text-amber-400 text-2xl font-black px-1">+</div>
          <div className="flex flex-col items-center">
            <LottoBall number={currentDraw.bonus} size="lg" isBonus={true} />
            <span className="text-[11px] font-bold text-amber-300 mt-1">보너스</span>
          </div>
        </div>

        {/* Round Selector Dropdown Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2">
          {RECENT_DRAWS.map((draw, idx) => (
            <button
              key={draw.round}
              onClick={() => setSelectedDrawIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-outfit font-bold whitespace-nowrap transition-all ${
                selectedDrawIndex === idx
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {draw.round}회
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Hot & Cold Numbers Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hot Numbers */}
        <div className="glass-panel-gold rounded-2xl p-5 border border-amber-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="font-bold text-white text-base">최근 급상승 HOT 번호</h3>
            </div>
            <span className="text-xs text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30 font-bold">
              골드 다출현
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {LOTTO_STATISTICS.hotNumbers.map((num) => (
              <div key={num} className="flex flex-col items-center gap-1 bg-slate-950/70 p-2 rounded-xl border border-amber-500/20">
                <LottoBall number={num} size="sm" />
                <span className="text-[10px] text-amber-300 font-bold">
                  {LOTTO_STATISTICS.numberFrequency[num]}회
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            역대 출현 빈도와 최근 회차에서 연속으로 당첨권에 진입한 황금 강세 번호군입니다.
          </p>
        </div>

        {/* Cold Numbers */}
        <div className="glass-panel-gray rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-slate-300" />
              <h3 className="font-bold text-white text-base">장기 미출현 COLD 번호</h3>
            </div>
            <span className="text-xs text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-600 font-bold">
              티타늄 실버 반등
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {LOTTO_STATISTICS.coldNumbers.map((num) => (
              <div key={num} className="flex flex-col items-center gap-1 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                <LottoBall number={num} size="sm" />
                <span className="text-[10px] text-slate-300 font-bold">
                  15회+ 미출
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            최근 15회차 이상 출현하지 않은 장기 휴면 번호로 통계적 평균 회귀 노림수에 활용됩니다.
          </p>
        </div>
      </div>

      {/* Cumulative Frequency TOP 10 Chart */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base md:text-lg">
              역대 1회 ~ {LOTTO_STATISTICS.totalDraws}회 누적 출현 순위 TOP 10
            </h3>
          </div>
          <span className="text-xs text-slate-400">기준: 보너스 번호 제외 1등 본번호</span>
        </div>

        <div className="space-y-3">
          {top10.map(({ num, count }, index) => {
            const percentage = ((count / 200) * 100).toFixed(0);
            return (
              <div key={num} className="flex items-center gap-3">
                <span className="w-6 text-center text-xs font-bold font-outfit text-amber-400">
                  #{index + 1}
                </span>
                <LottoBall number={num} size="xs" />
                <div className="flex-1 bg-slate-900/90 rounded-full h-4 overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-outfit font-bold text-slate-200 w-12 text-right">
                  {count} 회
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Odd/Even & Sum Pattern Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-white text-sm">역대 홀짝(Odd:Even) 분포 비율</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-300">홀수 3 : 짝수 3 (가장 높은 빈도)</span>
              <span className="font-bold text-amber-400">33.5% (최다)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-300">홀수 2 : 짝수 4</span>
              <span className="font-bold text-slate-200">24.2%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-300">홀수 4 : 짝수 2</span>
              <span className="font-bold text-slate-200">23.8%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">홀수 1 : 짝수 5 or 5:1</span>
              <span className="font-bold text-slate-400">14.1%</span>
            </div>
            <div className="flex justify-between py-1 text-slate-500">
              <span>올홀수(6:0) or 올짝수(0:6)</span>
              <span>4.4% (극단적 비권장)</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">역대 당첨번호 6개 합계 구간</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-300">합계 121 ~ 160 (황금 구간)</span>
              <span className="font-bold text-emerald-400">48.2% (절반 육박)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-300">합계 101 ~ 120</span>
              <span className="font-bold text-slate-200">21.5%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-300">합계 161 ~ 180</span>
              <span className="font-bold text-slate-200">18.7%</span>
            </div>
            <div className="flex justify-between py-1 text-slate-500">
              <span>합계 100 이하 or 181 이상</span>
              <span>11.6% (비권장 편중)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
