import React from 'react';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';

export default function VipPromoBanner({ onOpenVip }) {
  return (
    <div
      onClick={onOpenVip}
      className="glass-panel-gold rounded-2xl p-4 border border-amber-400/40 hover:border-amber-400 cursor-pointer transition shadow-lg shadow-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shrink-0 shadow">
          <Crown className="w-5 h-5 text-slate-950" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300 font-cinzel tracking-wider">
              LOTTO VIP PRESTIGE PASS
            </span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold font-sans">
              AI 프리미엄
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            AI 딥러닝 골드 가중치 알고리즘과 무제한 정밀 분석 VIP 혜택을 확인해보세요.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform whitespace-nowrap">
        <span>VIP 혜택 보기</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
