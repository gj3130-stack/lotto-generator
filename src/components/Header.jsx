import React, { useState, useEffect } from 'react';
import { Crown, Volume2, VolumeX, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function Header({ onOpenResponsibleModal, onOpenVipModal }) {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Next Draw Countdown Timer (Every Saturday 20:35 KST)
  useEffect(() => {
    function calculateNextDraw() {
      const now = new Date();
      // Calculate next Saturday
      const dayOfWeek = now.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
      const target = new Date(now);

      let daysUntilSat = (6 - dayOfWeek + 7) % 7;
      target.setDate(now.getDate() + daysUntilSat);
      target.setHours(20, 35, 0, 0);

      // If Saturday has passed 20:35, move to next week Saturday
      if (now > target) {
        target.setDate(target.getDate() + 7);
      }

      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    calculateNextDraw();
    const interval = setInterval(calculateNextDraw, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const state = sound.toggleMute();
    setIsMuted(state);
    if (!state) sound.playClick();
    triggerHaptic(15);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#080b11]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center group-hover:scale-95 transition-transform">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-black tracking-wider text-xl gold-gradient-text drop-shadow">
                  LOTTO VIP MASTER
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30 tracking-tight">
                  PRO v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                빅데이터 AI 가중치 로또 6/45 종합 솔루션
              </p>
            </div>
          </div>

          {/* Quick Actions (Mobile Right) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 transition"
              title={isMuted ? "소리 켜기" : "소리 끄기"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onOpenResponsibleModal}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-amber-400 transition"
              title="책임 이용 안내"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center / Right: Countdown Timer & Utilities */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Saturday Countdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/20 shadow-inner text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-slate-400 font-medium">다음 추첨:</span>
            <div className="font-outfit font-bold text-amber-300 flex items-center gap-1 tracking-wider">
              <span>{timeLeft.days}일</span>
              <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
              <span className="w-5 text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Desktop Utilities */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenVipModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-400/40 text-amber-300 text-xs font-semibold hover:border-amber-400 transition hover:shadow-lg hover:shadow-amber-500/10 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>VIP 패스</span>
            </button>

            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-400 transition"
              title={isMuted ? "사운드 켜기" : "사운드 음소거"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={onOpenResponsibleModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-amber-300 text-xs transition"
              title="건전 복권 문화 안내"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>건전이용</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
