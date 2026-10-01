import React, { useState, useEffect } from 'react';
import { FlaskConical, Award, AlertCircle, CheckCircle, HelpCircle, RefreshCw } from 'lucide-react';
import LottoBall from './LottoBall';
import { diagnoseCombination } from '../utils/analyzer';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function DiagnosisTab({ initialNumbers }) {
  const [selectedNumbers, setSelectedNumbers] = useState(
    initialNumbers && initialNumbers.length === 6
      ? initialNumbers
      : [7, 12, 19, 23, 34, 42]
  );

  useEffect(() => {
    if (initialNumbers && initialNumbers.length === 6) {
      setSelectedNumbers(initialNumbers);
    }
  }, [initialNumbers]);

  const diagnosis = diagnoseCombination(selectedNumbers);

  const toggleNumber = (num) => {
    sound.playClick();
    triggerHaptic(15);
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      if (selectedNumbers.length >= 6) {
        alert('조합 진단을 위해 정확히 6개의 번호를 선택해주세요.');
        return;
      }
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* 6 Number Selector Header */}
      <div className="glass-panel-gold rounded-2xl p-5 md:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              6개 번호 조합 통계 정밀 진단기
            </h2>
          </div>
          <span className="text-xs text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            선택된 번호: {selectedNumbers.length} / 6개
          </span>
        </div>

        {/* Selected Balls Bar */}
        <div className="flex items-center justify-center gap-2 md:gap-3 py-3 min-h-[60px] bg-slate-950/60 rounded-xl border border-amber-500/20 mb-4">
          {selectedNumbers.length === 0 ? (
            <p className="text-xs text-slate-500">아래 1~45번 패널에서 진단할 번호 6개를 선택하세요.</p>
          ) : (
            selectedNumbers.map((num) => (
              <LottoBall
                key={num}
                number={num}
                size="md"
                onClick={() => toggleNumber(num)}
              />
            ))
          )}
        </div>

        {/* 1 ~ 45 Quick Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-15 gap-1.5 pt-2 border-t border-slate-800">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
            const isSelected = selectedNumbers.includes(n);
            return (
              <button
                key={n}
                onClick={() => toggleNumber(n)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow scale-105'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagnosis Report Card */}
      {diagnosis && (
        <div className="space-y-5 animate-fadeIn">
          {/* Main Score Gauge */}
          <div className="glass-panel rounded-2xl p-6 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-slate-950 border-4 border-amber-400/30 shadow-inner">
                <span className={`text-3xl font-black font-outfit ${getScoreColor(diagnosis.score)}`}>
                  {diagnosis.score}
                </span>
                <span className="absolute bottom-2 text-[10px] text-slate-500 font-bold">SCORE</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>조합 균형 지수 평가:</span>
                  <span className={`font-black ${getScoreColor(diagnosis.score)}`}>
                    {diagnosis.score >= 85 ? '최상급 황금 밸런스' : (diagnosis.score >= 70 ? '양호한 조합' : '주의 및 조정 필요')}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  역대 1등 당첨번호 통계(총합, 홀짝, 고저, 색상 분포, 연속수)를 기반으로 산출된 통계적 균형도입니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">총합 점수</span>
                <strong className="text-base text-amber-300 font-outfit">{diagnosis.sum}</strong>
                <span className="text-[10px] text-slate-500 block">{diagnosis.sumStatus}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">홀짝 비율</span>
                <strong className="text-base text-slate-200 font-outfit">{diagnosis.oddEven}</strong>
                <span className="text-[10px] text-slate-500 block">{diagnosis.oddEvenStatus}</span>
              </div>
            </div>
          </div>

          {/* Detailed Diagnosis Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">고저 비율 (1~22 vs 23~45)</span>
              <p className="text-lg font-bold text-white font-outfit">{diagnosis.highLow}</p>
              <p className="text-[11px] text-slate-500">한쪽으로 치우치지 않고 균형 있게 배치되었습니다.</p>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">연속 번호 쌍</span>
              <p className="text-lg font-bold text-white font-outfit">{diagnosis.consecutivePairs} 쌍</p>
              <p className="text-[11px] text-slate-500">
                {diagnosis.consecutivePairs >= 2 ? '⚠️ 연속 번호가 많아 당첨 확률이 낮아집니다.' : '정상적인 연속 번호 분포입니다.'}
              </p>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">구간별 번호 분포 (5색)</span>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-[10px] flex items-center justify-center font-bold text-slate-950">{diagnosis.ranges.yellow}</span>
                <span className="w-5 h-5 rounded-full bg-blue-500 text-[10px] flex items-center justify-center font-bold text-white">{diagnosis.ranges.blue}</span>
                <span className="w-5 h-5 rounded-full bg-red-500 text-[10px] flex items-center justify-center font-bold text-white">{diagnosis.ranges.red}</span>
                <span className="w-5 h-5 rounded-full bg-slate-500 text-[10px] flex items-center justify-center font-bold text-white">{diagnosis.ranges.gray}</span>
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-[10px] flex items-center justify-center font-bold text-slate-950">{diagnosis.ranges.green}</span>
              </div>
              <p className="text-[11px] text-slate-500">1~10 / 11~20 / 21~30 / 31~40 / 41~45번대</p>
            </div>
          </div>

          {/* Historical Simulation Results */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>최근 10회차 대상 가상 당첨 시뮬레이션 결과</span>
            </h4>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">1등</span>
                <strong className="text-amber-400 font-bold font-outfit text-sm">{diagnosis.matchHistory.rank1}회</strong>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">2등</span>
                <strong className="text-slate-300 font-bold font-outfit text-sm">{diagnosis.matchHistory.rank2}회</strong>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">3등</span>
                <strong className="text-amber-600 font-bold font-outfit text-sm">{diagnosis.matchHistory.rank3}회</strong>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">4등</span>
                <strong className="text-blue-400 font-bold font-outfit text-sm">{diagnosis.matchHistory.rank4}회</strong>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">5등</span>
                <strong className="text-emerald-400 font-bold font-outfit text-sm">{diagnosis.matchHistory.rank5}회</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
