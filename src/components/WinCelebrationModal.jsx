import React, { useEffect } from 'react';
import { Trophy, Sparkles, X, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WinCelebrationModal({ rank, onClose }) {
  useEffect(() => {
    // Grand Confetti Fireworks
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F5CE62', '#E5A93B', '#FFFFFF', '#00E676', '#0091EA']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F5CE62', '#E5A93B', '#FFFFFF', '#00E676', '#0091EA']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="glass-panel-gold rounded-3xl max-w-md w-full p-6 md:p-8 text-center border-2 border-amber-400/80 shadow-[0_0_50px_rgba(245,206,98,0.3)] space-y-5 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-radial from-amber-500/20 via-transparent to-transparent pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative inline-block mt-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/40 animate-bounce">
            <Trophy className="w-10 h-10 text-slate-950" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        <div>
          <span className="text-xs font-bold text-amber-300 tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            JACKPOT CELEBRATION
          </span>
          <h2 className="text-3xl font-black text-white mt-2 font-cinzel gold-gradient-text drop-shadow">
            축하합니다! {rank} 당첨!
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            보관하신 번호가 실제 당첨 번호와 일치했습니다!<br />
            영수증을 확인하시고 공식 지급 기한(1년) 내에 수령하세요!
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 shadow-xl shadow-amber-500/25 hover:brightness-110 transition active:scale-95 text-sm"
        >
          확인 및 닫기
        </button>
      </div>
    </div>
  );
}
