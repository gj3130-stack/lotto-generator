import React, { useState } from 'react';
import { Search, Sparkles, HeartHandshake, Award, Activity } from 'lucide-react';
import { LOTTO_STATISTICS, RECENT_DRAWS } from '../data/historyData';
import LottoBall from './LottoBall';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function NumberExplorerTab() {
  const [selectedNum, setSelectedNum] = useState(7);

  const freq = LOTTO_STATISTICS.numberFrequency[selectedNum] || 0;
  const companions = LOTTO_STATISTICS.companionNumbers[selectedNum] || [1, 2, 3];
  const isHot = LOTTO_STATISTICS.hotNumbers.includes(selectedNum);
  const isCold = LOTTO_STATISTICS.coldNumbers.includes(selectedNum);

  // Calculate rank
  const sortedFreq = Object.entries(LOTTO_STATISTICS.numberFrequency)
    .sort((a, b) => b[1] - a[1]);
  const rank = sortedFreq.findIndex(([num]) => Number(num) === selectedNum) + 1;

  // Draws containing this number
  const relatedDraws = RECENT_DRAWS.filter(d => d.numbers.includes(selectedNum) || d.bonus === selectedNum);

  const handleSelect = (num) => {
    sound.playClick();
    triggerHaptic(15);
    setSelectedNum(num);
  };

  return (
    <div className="space-y-6">
      {/* 1 ~ 45 Number Selection Board */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              1 ~ 45번 번호별 빅데이터 정밀 탐색
            </h2>
          </div>
          <span className="text-xs text-slate-400">분석할 번호를 클릭하세요</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-9 lg:grid-cols-15 gap-2.5">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              onClick={() => handleSelect(n)}
              className={`p-1 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                selectedNum === n
                  ? 'bg-amber-400/20 ring-2 ring-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                  : 'hover:bg-slate-800'
              }`}
            >
              <LottoBall number={n} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Selected Number Detailed Intelligence Card */}
      <div className="glass-panel-gold rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-4">
            <LottoBall number={selectedNum} size="xl" className="shadow-2xl" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-white font-outfit">
                  No. {selectedNum}
                </h3>
                {isHot && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    🔥 HOT 급상승
                  </span>
                )}
                {isCold && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    ❄️ COLD 미출현
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                역대 1회부터 현재까지의 빅데이터 통계 및 궁합 분석
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">역대 누적 출현</span>
              <strong className="text-xl font-outfit font-black gold-gradient-text">
                {freq} 회
              </strong>
            </div>
            <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">전체 출현 순위</span>
              <strong className="text-xl font-outfit font-black text-amber-300">
                {rank} 위
              </strong>
            </div>
          </div>
        </div>

        {/* Companion Partner Numbers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-white text-sm md:text-base">
              {selectedNum}번과 가장 자주 함께 나온 찰떡궁합 번호
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {companions.map((compNum) => (
              <div
                key={compNum}
                onClick={() => handleSelect(compNum)}
                className="flex items-center gap-2.5 bg-slate-900/70 hover:bg-slate-800 px-3 py-2 rounded-xl border border-amber-500/20 cursor-pointer transition group"
              >
                <LottoBall number={compNum} size="sm" />
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                    {compNum} 번
                  </span>
                  <span className="text-[10px] text-slate-400 block">동반 출현 단짝</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appearances in Draw History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">
              최근 10회차 중 {selectedNum}번이 출현한 회차
            </h4>
          </div>

          {relatedDraws.length === 0 ? (
            <p className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              최근 10회차 동안 본 번호로 출현하지 않았습니다. (반등 대기 구간)
            </p>
          ) : (
            <div className="space-y-2">
              {relatedDraws.map((d) => (
                <div
                  key={d.round}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400 font-outfit">제 {d.round}회</span>
                    <span className="text-slate-500">{d.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {d.numbers.map((n) => (
                      <span
                        key={n}
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          n === selectedNum
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 font-black'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
