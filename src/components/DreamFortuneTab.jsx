import React, { useState } from 'react';
import { Moon, Sparkles, Search, Compass, ArrowRight } from 'lucide-react';
import { DREAM_INTERPRETATIONS } from '../data/dreamData';
import LottoBall from './LottoBall';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function DreamFortuneTab({ onApplyNumbers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [birthDate, setBirthDate] = useState('1990-05-15');
  const [sajuNumbers, setSajuNumbers] = useState([3, 11, 19, 27, 34, 42]);

  const filteredDreams = DREAM_INTERPRETATIONS.filter(item =>
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate Saju Lucky Numbers using Birthdate & Today
  const handleGenerateSaju = () => {
    sound.playClick();
    triggerHaptic([30, 40]);

    const dateStr = birthDate.replace(/-/g, '');
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) seed += Number(dateStr[i]);
    for (let i = 0; i < todayStr.length; i++) seed += Number(todayStr[i]);

    const numbers = new Set();
    let counter = 1;
    while (numbers.size < 6) {
      const pseudoRand = ((seed * counter * 37) % 45) + 1;
      numbers.add(pseudoRand);
      counter++;
    }

    const res = Array.from(numbers).sort((a, b) => a - b);
    setSajuNumbers(res);
    sound.playSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Saju Horoscope Lucky Number Banner */}
      <div className="glass-panel-gold rounded-2xl p-5 md:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            <h2 className="text-base md:text-lg font-bold text-white">
              오늘의 사주 & 생년월일 맞춤 럭키 넘버
            </h2>
          </div>
          <span className="text-xs text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            천간지지 일주 분석
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs text-slate-300 whitespace-nowrap">생년월일:</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="bg-slate-900 border border-amber-500/30 text-amber-300 text-xs px-3 py-2 rounded-lg outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleGenerateSaju}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>오늘의 사주 6개 번호 추출</span>
          </button>
        </div>

        {/* Generated Saju Balls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            {sajuNumbers.map((n) => (
              <LottoBall key={n} number={n} size="sm" />
            ))}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onApplyNumbers(sajuNumbers);
            }}
            className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1"
          >
            <span>이 번호로 진단하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dream Search Section */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base md:text-lg font-bold text-white">
              전통 꿈 해몽 횡재수 번호 사전
            </h3>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="돼지, 똥, 조상님, 불 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>

        {/* Dream Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {filteredDreams.map((item) => (
            <div
              key={item.keyword}
              className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">
                    {item.keyword}
                  </span>
                  <span className="text-[11px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded font-sans">
                    길몽
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.meaning}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  {item.numbers.map((n) => (
                    <LottoBall key={n} number={n} size="xs" />
                  ))}
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onApplyNumbers(item.numbers);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 text-[11px] font-medium transition"
                >
                  적용
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
