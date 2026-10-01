import React, { useState } from 'react';
import { Bookmark, Trash2, Trophy, Copy, Plus, Check, Sparkles, ExternalLink } from 'lucide-react';
import LottoBall from './LottoBall';
import { checkWinningRank } from '../utils/analyzer';
import { RECENT_DRAWS } from '../data/historyData';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function StorageTab({ savedCombinations, onDeleteCombination, onClearAll, onTriggerCelebration }) {
  const [selectedDrawRound, setSelectedDrawRound] = useState(RECENT_DRAWS[0].round);
  const [copiedId, setCopiedId] = useState(null);

  const targetDraw = RECENT_DRAWS.find(d => d.round === selectedDrawRound) || RECENT_DRAWS[0];

  const handleCopySingle = (comb) => {
    sound.playClick();
    triggerHaptic(15);
    const text = comb.numbers.join(', ');
    navigator.clipboard.writeText(text);
    setCopiedId(comb.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCheckAndCelebrate = (rank) => {
    if (rank === '1등' || rank === '2등' || rank === '3등') {
      sound.playJackpot();
      onTriggerCelebration(rank);
    } else {
      sound.playSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Draw Header for Auto Comparison */}
      <div className="glass-panel-gold rounded-2xl p-5 border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              보관함 당첨 자동 비교 대조기
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            보관된 조합을 실제 당첨 회차 번호와 1초 만에 자동 비교 대조합니다.
          </p>
        </div>

        {/* Draw Select Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300">비교 회차:</span>
          <select
            value={selectedDrawRound}
            onChange={(e) => {
              sound.playClick();
              setSelectedDrawRound(Number(e.target.value));
            }}
            className="bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer"
          >
            {RECENT_DRAWS.map(d => (
              <option key={d.round} value={d.round}>
                제 {d.round}회 ({d.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Draw Quick Preview Bar */}
      <div className="glass-panel rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-800">
        <div className="text-xs text-slate-300">
          <strong className="text-amber-400">제 {targetDraw.round}회</strong> 기준 당첨 번호:
        </div>
        <div className="flex items-center gap-2">
          {targetDraw.numbers.map((n) => (
            <LottoBall key={n} number={n} size="xs" />
          ))}
          <span className="text-amber-400 font-bold text-xs">+</span>
          <LottoBall number={targetDraw.bonus} size="xs" isBonus={true} />
        </div>
      </div>

      {/* Saved Combinations List */}
      {savedCombinations.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">보관된 번호 조합이 없습니다</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            [번호 생성] 탭에서 마음에 드는 조합을 추출한 뒤 "보관함에 저장" 버튼을 눌러보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>총 {savedCombinations.length}개 조합 저장됨</span>
            <button
              onClick={() => {
                if (window.confirm('저장된 모든 조합을 삭제하시겠습니까?')) {
                  onClearAll();
                }
              }}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>전체 비우기</span>
            </button>
          </div>

          {savedCombinations.map((item) => {
            const result = checkWinningRank(item.numbers, targetDraw.numbers, targetDraw.bonus);
            const isWin = result.rank !== '낙첨';

            return (
              <div
                key={item.id}
                className={`glass-panel rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-200 border ${
                  isWin ? 'border-amber-400/60 bg-amber-500/5 shadow-lg shadow-amber-500/10' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Meta info & Winning Badge */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold font-outfit ${
                    isWin ? 'bg-amber-400 text-slate-950 font-black animate-bounce' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {result.rank}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="block font-medium text-slate-300">{item.createdAt || '생성일자'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">[{item.engine || '수동'}]</span>
                  </div>
                </div>

                {/* 6 Lotto Balls with Match Highlight */}
                <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                  {item.numbers.map((num) => {
                    const isMatched = result.matchedNumbers.includes(num);
                    return (
                      <LottoBall
                        key={num}
                        number={num}
                        size="md"
                        isMatched={isMatched}
                      />
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {isWin && (
                    <button
                      onClick={() => handleCheckAndCelebrate(result.rank)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold hover:brightness-110 flex items-center gap-1 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>축하 연출</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopySingle(item)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 transition"
                    title="복사"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onDeleteCombination(item.id)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-500 hover:text-rose-400 transition"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
