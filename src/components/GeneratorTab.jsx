import React, { useState } from 'react';
import { Sparkles, Dices, Lock, Ban, BookmarkCheck, Copy, ReceiptText, RefreshCw, Check, Zap, Layers, Play, FastForward } from 'lucide-react';
import LottoBall from './LottoBall';
import LottoMachine from './LottoMachine';
import { generateMultipleGames, generateSingleGame } from '../utils/lottoEngine';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import confetti from 'canvas-confetti';

const ENGINE_MODES = [
  { id: 'balanced', name: '균형형 (Balanced)', desc: '총합(100~175)·홀짝·연속번호 최적 통계 필터링', badge: 'GOLD 1위', theme: 'border-amber-400/80 bg-amber-500/10' },
  { id: 'hot', name: '빈도형 (Hot Picker)', desc: '역대 누적 최다 출현 및 최근 상승세 번호 가중치 부여', badge: '빅데이터', theme: 'border-yellow-500/80 bg-yellow-500/10' },
  { id: 'cold', name: '미출현형 (Cold Picker)', desc: '최근 15회차 이상 미출현 번호의 확률적 반등 노림수', badge: '실버 반등', theme: 'border-slate-400/80 bg-slate-400/10' },
  { id: 'hybrid', name: '혼합형 (Smart Hybrid)', desc: '다출현 Hot 3개 + 미출현 Cold 2개 + 황금 난수 1개', badge: '플래티넘 AI', theme: 'border-amber-300/80 bg-amber-300/10' },
  { id: 'random', name: '완전 랜덤 (True Random)', desc: '암호학적 순수 난수 기반 무작위 100% 독립 추출', badge: '옵시디언', theme: 'border-slate-500/80 bg-slate-800/20' }
];

export default function GeneratorTab({ onSaveToStorage, onOpenReceipt, onDiagnose, onOpenOmr }) {
  const [engineMode, setEngineMode] = useState('balanced');
  const [gameCount, setGameCount] = useState(5);
  const [lockedNumbers, setLockedNumbers] = useState([]);
  const [excludedNumbers, setExcludedNumbers] = useState([]);
  
  const [generatedGames, setGeneratedGames] = useState([
    [7, 12, 19, 23, 34, 42],
    [3, 14, 21, 27, 33, 45],
    [5, 11, 18, 29, 36, 40],
    [1, 16, 24, 31, 38, 43],
    [9, 13, 20, 26, 35, 44]
  ]);

  // Rotary Machine Live State
  const [isMachineDrawing, setIsMachineDrawing] = useState(false);
  const [machineDrawnNumbers, setMachineDrawnNumbers] = useState([7, 12, 19, 23, 34, 42]);

  const [isCopied, setIsCopied] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Trigger Rotary Machine Draw
  const handleStartMachineDraw = () => {
    sound.playClick();
    triggerHaptic([30, 40, 50]);

    // Generate upcoming new games
    const newGames = generateMultipleGames(gameCount, engineMode, lockedNumbers, excludedNumbers);
    
    // Set 1st game as the live machine dispenser target
    setMachineDrawnNumbers(newGames[0]);
    setIsMachineDrawing(true);
    setGeneratedGames(newGames);
  };

  // Fast Instant Draw (Skip machine animation)
  const handleFastDraw = () => {
    sound.playClick();
    triggerHaptic([20, 30]);

    const newGames = generateMultipleGames(gameCount, engineMode, lockedNumbers, excludedNumbers);
    setGeneratedGames(newGames);
    setMachineDrawnNumbers(newGames[0]);
    sound.playSuccess();

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F5CE62', '#CBD5E1', '#FFFFFF']
    });
  };

  const handleCopyClipboard = () => {
    sound.playClick();
    triggerHaptic(20);
    const text = generatedGames
      .map((game, i) => `${String.fromCharCode(65 + i)}게임: ${game.join(', ')}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveAll = () => {
    sound.playClick();
    triggerHaptic(30);
    onSaveToStorage(generatedGames, engineMode);
  };

  // Toggle Lock number
  const toggleLock = (num) => {
    sound.playLock();
    triggerHaptic(15);
    if (lockedNumbers.includes(num)) {
      setLockedNumbers(lockedNumbers.filter(n => n !== num));
    } else {
      if (lockedNumbers.length >= 5) {
        alert('고정수(LOCK)는 최대 5개까지만 선택 가능합니다.');
        return;
      }
      setExcludedNumbers(excludedNumbers.filter(n => n !== num));
      setLockedNumbers([...lockedNumbers, num].sort((a, b) => a - b));
    }
  };

  // Toggle Excluded number
  const toggleExclude = (num) => {
    sound.playClick();
    triggerHaptic(15);
    if (excludedNumbers.includes(num)) {
      setExcludedNumbers(excludedNumbers.filter(n => n !== num));
    } else {
      if (excludedNumbers.length >= 39) {
        alert('제외수는 최대 39개까지만 선택 가능합니다.');
        return;
      }
      setLockedNumbers(lockedNumbers.filter(n => n !== num));
      setExcludedNumbers([...excludedNumbers, num].sort((a, b) => a - b));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP CENTERPIECE: The Rotary Glass Lotto Machine */}
      <LottoMachine
        isDrawing={isMachineDrawing}
        setIsDrawing={setIsMachineDrawing}
        drawnNumbers={machineDrawnNumbers}
        onDrawComplete={(numbers) => {
          // Handled
        }}
      />

      {/* 2. Control Bar: Rotary Trigger, Fast Draw, and Game Selector */}
      <div className="glass-panel-gold rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Game Count Selector & Filter Trigger */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-amber-500/30">
              {[1, 2, 3, 4, 5].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => {
                    sound.playClick();
                    triggerHaptic(15);
                    setGameCount(cnt);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                    gameCount === cnt
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md scale-105'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cnt}게임
                </button>
              ))}
            </div>

            {/* Filter Toggle Button (Gold & Slate) */}
            <button
              onClick={() => {
                sound.playClick();
                triggerHaptic(20);
                setShowFilterModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/50 text-xs text-slate-200 transition shadow-inner"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>고정 {lockedNumbers.length}개</span>
              <span className="text-slate-600">|</span>
              <Ban className="w-3.5 h-3.5 text-slate-400" />
              <span>제외 {excludedNumbers.length}개</span>
            </button>
          </div>

          {/* Action Buttons: Rotary Machine Draw & Fast Draw */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-1 max-w-lg justify-end">
            <button
              onClick={handleFastDraw}
              disabled={isMachineDrawing}
              className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-400/50 text-xs font-semibold transition active:scale-95 flex items-center gap-1.5"
              title="머신 연출 없이 즉시 번호 생성"
            >
              <FastForward className="w-4 h-4 text-slate-400" />
              <span>즉시 추첨</span>
            </button>

            <button
              onClick={handleStartMachineDraw}
              disabled={isMachineDrawing}
              className="flex-1 py-3.5 px-6 rounded-xl font-cinzel font-black text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 shadow-xl shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 shine-effect opacity-50 pointer-events-none" />
              <Play className={`w-4 h-4 text-slate-950 fill-slate-950 ${isMachineDrawing ? 'animate-spin' : ''}`} />
              <span className="text-base md:text-lg tracking-wider font-extrabold font-sans">
                {isMachineDrawing ? '머신 볼 추첨 중...' : '🎰 머신 가동 추첨'}
              </span>
              <Sparkles className="w-4 h-4 text-amber-950 group-hover:scale-125 transition-transform" />
            </button>
          </div>
        </div>

        {/* Selected Locks & Excludes pill display */}
        {(lockedNumbers.length > 0 || excludedNumbers.length > 0) && (
          <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-wrap items-center gap-2 text-xs">
            {lockedNumbers.length > 0 && (
              <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-md text-amber-300">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>고정: {lockedNumbers.join(', ')}</span>
              </div>
            )}
            {excludedNumbers.length > 0 && (
              <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700 px-2 py-1 rounded-md text-slate-300">
                <Ban className="w-3 h-3 text-slate-400" />
                <span>제외: {excludedNumbers.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Engine Selection Bar (Gold & Titanium Gray Theme) */}
      <div className="glass-panel-gray rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
              빅데이터 5대 조합 엔진 선택
            </h2>
          </div>
          <span className="text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 w-fit font-mono">
            GOLD & TITANIUM ENGINE
          </span>
        </div>

        {/* Engine Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {ENGINE_MODES.map((engine) => {
            const isSelected = engineMode === engine.id;
            return (
              <button
                key={engine.id}
                onClick={() => {
                  sound.playClick();
                  triggerHaptic(15);
                  setEngineMode(engine.id);
                }}
                className={`text-left p-3.5 rounded-xl transition-all duration-200 relative overflow-hidden border ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-outfit ${
                    isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {engine.badge}
                  </span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                </div>
                <div className={`font-bold text-sm mb-1 ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                  {engine.name.split(' (')[0]}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {engine.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Generated Results List (Gold & Gray Luxury Cards) */}
      <div className="space-y-3">
        {generatedGames.map((game, idx) => {
          const sum = game.reduce((a, b) => a + b, 0);
          const oddCount = game.filter(n => n % 2 !== 0).length;
          const gameLabel = String.fromCharCode(65 + idx);

          return (
            <div
              key={idx}
              className="glass-panel-gray rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-amber-400/50 transition duration-300 group border border-slate-800"
            >
              {/* Game Label & Stats */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-slate-800 border border-amber-400/40 flex items-center justify-center font-outfit font-black text-amber-300 text-sm shadow">
                  {gameLabel}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-outfit">
                  <span className="bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700/60">
                    합계: <strong className="text-amber-300 font-bold">{sum}</strong>
                  </span>
                  <span className="bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700/60">
                    홀짝: <strong className="text-slate-200">{oddCount}:{6 - oddCount}</strong>
                  </span>
                </div>
              </div>

              {/* 6 Luxury Metallic Lotto Balls */}
              <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                {game.map((num) => (
                  <LottoBall
                    key={num}
                    number={num}
                    size="md"
                    isLocked={lockedNumbers.includes(num)}
                  />
                ))}
              </div>

              {/* Individual Diagnose Button */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    sound.playClick();
                    triggerHaptic(20);
                    onDiagnose(game);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 text-xs transition flex items-center gap-1 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>진단</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Action Footer: Save to Storage, Receipt View, Clipboard Copy */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>추출된 번호는 마이 보관함에 영구 보관 및 자동 당첨 확인이 가능합니다.</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCopyClipboard}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-amber-300 hover:border-amber-400 text-xs font-semibold transition active:scale-95"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? '복사 완료' : '전체 복사'}</span>
          </button>

          <button
            onClick={() => onOpenOmr(generatedGames)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 hover:border-amber-400 text-xs font-bold transition active:scale-95 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>🏷️ OMR 마킹 슬립지</span>
          </button>

          <button
            onClick={() => onOpenReceipt(generatedGames)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-amber-300 hover:border-amber-400 text-xs font-semibold transition active:scale-95"
          >
            <ReceiptText className="w-3.5 h-3.5 text-amber-400" />
            <span>영수증 티켓 보기/공유</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition active:scale-95"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>보관함에 저장</span>
          </button>
        </div>
      </div>

      {/* Number Lock & Exclusion Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-gold rounded-2xl max-w-xl w-full p-5 md:p-6 border border-amber-400/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">고정수 & 제외수 설정</h3>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              <strong className="text-amber-300">클릭</strong>하여 <span className="text-amber-400 font-bold">🔒 고정수(1~5개)</span>를 지정하거나, 
              우측 제외 탭에서 <span className="text-slate-400 font-bold">🚫 제외수</span>를 설정하세요.
            </p>

            {/* 1 ~ 45 Ball Selection Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                const isLocked = lockedNumbers.includes(num);
                const isExcluded = excludedNumbers.includes(num);

                return (
                  <div key={num} className="flex flex-col items-center gap-1">
                    <LottoBall
                      number={num}
                      size="sm"
                      isLocked={isLocked}
                      className={isExcluded ? 'opacity-20 grayscale' : ''}
                      onClick={() => toggleLock(num)}
                    />
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        onClick={() => toggleExclude(num)}
                        className={`px-1 rounded ${isExcluded ? 'bg-slate-700 text-amber-400 font-bold border border-amber-400/40' : 'text-slate-500 hover:text-slate-300'}`}
                        title="제외수로 지정"
                      >
                        제외
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Summary & Clear */}
            <div className="flex items-center justify-between text-xs pt-2">
              <div className="space-x-2 text-slate-300">
                <span>고정수: <b className="text-amber-400">{lockedNumbers.length}/5</b></span>
                <span>제외수: <b className="text-slate-400">{excludedNumbers.length}/39</b></span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setLockedNumbers([]);
                  setExcludedNumbers([]);
                }}
                className="text-slate-400 hover:text-amber-300 underline"
              >
                전체 초기화
              </button>
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition"
            >
              설정 완료 적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
