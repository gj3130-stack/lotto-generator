import React from 'react';
import { ShieldCheck, HeartHandshake, PhoneCall, X, AlertTriangle } from 'lucide-react';

export default function ResponsibleGamblingModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel rounded-2xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white">건전한 복권 문화 & 책임 이용 안내</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>확률 고지:</strong> 로또 6/45는 매 회차 8,145,060분의 1의 독립 확률로 추첨되는 게임입니다. 어떠한 분석 알고리즘도 100% 당첨을 보장하지 않습니다.
            </span>
          </div>

          <p>
            • 복권은 일상 속 소소한 즐거움과 희망을 나누는 건전한 레저 게임입니다.<br />
            • 본인의 경제적 형편에 맞게 <strong>소액(주 5,000원 이하 권장)</strong>으로 건전하게 즐겨주세요.<br />
            • 본 애플리케이션의 통계 및 조합 엔진은 과거 데이터 기반의 수학적 시뮬레이션 엔터테인먼트 도구입니다.
          </p>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>한국도박문제예방치유원 헬프라인 (24시간 무료 상담)</span>
            </div>
            <strong className="text-emerald-400 font-bold font-outfit text-sm">국번없이 1336</strong>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
        >
          확인했습니다
        </button>
      </div>
    </div>
  );
}
