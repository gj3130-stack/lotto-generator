import React, { useState } from 'react';
import { Crown, Check, Sparkles, X, Zap, Flame, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function VipPassModal({ onClose, isVipActive, onToggleVip }) {
  // Plan selection: 'lifetime' (6,900 won) | 'monthly' (2,900 won/mo)
  const [selectedPlan, setSelectedPlan] = useState('lifetime');

  const handleUpgrade = () => {
    sound.playJackpot();
    triggerHaptic([30, 50, 70]);
    onToggleVip();
    alert(
      isVipActive 
        ? 'VIP 멤버십이 비활성화되었습니다.' 
        : `축하합니다! ${selectedPlan === 'lifetime' ? '평생 소장 VIP 라이선스' : '월간 VIP 구독'}가 성공적으로 활성화되었습니다.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel-gold rounded-3xl max-w-md w-full p-5 sm:p-7 border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,206,98,0.25)] space-y-5 relative my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        {/* Crown & VIP Header */}
        <div className="text-center space-y-1.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-xl shadow-amber-500/30 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-[#0d121f] rounded-[14px] flex items-center justify-center">
              <Crown className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white font-cinzel gold-gradient-text">
            LOTTO VIP PRESTIGE PASS
          </h2>
          <p className="text-xs text-slate-300">
            커피 한 잔 값으로 평생 누리는 AI 빅데이터 정밀 분석과 무제한 조합
          </p>
        </div>

        {/* 2 Plan Selection Cards (Market Optimized Pricing) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Plan 1: Monthly (2,900 won) */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedPlan('monthly');
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
              selectedPlan === 'monthly'
                ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/60 shadow-lg shadow-amber-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">가벼운 시작</span>
              <strong className="text-sm font-bold text-white block mt-0.5">월간 라이트</strong>
            </div>
            <div className="mt-3">
              <span className="text-xs text-slate-400">월 </span>
              <strong className="text-lg font-black text-white font-outfit">2,900원</strong>
              <p className="text-[9px] text-slate-500 mt-0.5">매주 로또 1게임도 안 되는 가격</p>
            </div>
          </div>

          {/* Plan 2: Lifetime (6,900 won - HIGH CONVERSION) */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedPlan('lifetime');
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
              selectedPlan === 'lifetime'
                ? 'bg-gradient-to-b from-amber-500/20 to-slate-950 border-amber-400 ring-2 ring-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-bl-lg font-sans">
              인기 1위 (65% 할인)
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-bold block">평생 무제한</span>
              <strong className="text-sm font-black text-amber-200 block mt-0.5">평생 소장 패스</strong>
            </div>
            <div className="mt-3">
              <span className="text-[10px] text-slate-500 line-through mr-1 font-outfit">₩19,900</span>
              <strong className="text-xl font-black gold-gradient-text font-outfit">6,900원</strong>
              <p className="text-[9px] text-amber-300/80 mt-0.5 font-medium">1회 결제로 평생 소장 ✨</p>
            </div>
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-2 text-xs text-slate-200 bg-slate-950/70 p-3.5 rounded-2xl border border-amber-500/20">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AI 가중치 5대 조합 엔진 무제한 동시 추출</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>고정수(LOCK) & 제외수 39개 풀 필터링</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>실제 로또 OMR 마킹 슬립지 무제한 고화질 인쇄</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>마이 보관함 무제한 저장 및 매주 당첨 자동 대조</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>광고 완전 제거 & 프라이빗 VIP 라운지 권한</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-2">
          <button
            onClick={handleUpgrade}
            className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 shadow-xl shadow-amber-500/25 hover:brightness-110 transition active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>
              {isVipActive 
                ? 'VIP 멤버십 이용 중 (클릭 시 토글)' 
                : `${selectedPlan === 'lifetime' ? '6,900원에 평생 소장하기' : '월 2,900원에 시작하기'}`}
            </span>
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>언제든 자유롭게 해지 가능 • 안전한 공식 결제 연동</span>
          </div>
        </div>
      </div>
    </div>
  );
}
