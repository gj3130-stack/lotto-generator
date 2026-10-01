import React, { useRef, useState } from 'react';
import { Download, Share2, X, Check, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function ReceiptModal({ games, onClose, round = 1141 }) {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  });

  const currentTime = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Download Receipt Ticket as PNG Image
  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    sound.playClick();
    triggerHaptic(30);
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `LOTTO_VIP_${round}회차_영수증.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Web Share or Clipboard
  const handleShare = async () => {
    sound.playClick();
    triggerHaptic(20);
    const shareText = `🎰 LOTTO VIP MASTER 제${round}회차 추천 조합\n` +
      games.map((g, i) => `${String.fromCharCode(65 + i)}: ${g.join(' ')}`).join('\n') +
      `\n\n대박을 기원합니다! 🏆`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `LOTTO VIP 제${round}회차 조합`,
          text: shareText
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Paper Receipt Container */}
        <div
          ref={receiptRef}
          className="w-full bg-[#FAFAFA] text-slate-900 rounded-t-xl p-6 font-mono shadow-2xl relative border-t-8 border-amber-500 overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        >
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-slate-300 pb-4">
            <h2 className="text-2xl font-black font-sans tracking-tight text-slate-900 flex items-center justify-center gap-1.5">
              <span>로또 6/45</span>
            </h2>
            <p className="text-xs text-slate-500 font-sans tracking-wide mt-1">
              LOTTO VIP MASTER PRESTIGE TICKET
            </p>
            <div className="flex items-center justify-between text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200">
              <span>제 <strong>{round}</strong> 회</span>
              <span>발행: {currentDate} {currentTime}</span>
            </div>
          </div>

          {/* Games List */}
          <div className="py-4 space-y-3 font-mono">
            {games.map((game, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 w-5">{String.fromCharCode(65 + idx)}</span>
                  <span className="text-[11px] text-slate-400 font-sans bg-slate-100 px-1 rounded">자동</span>
                </div>
                <div className="flex items-center gap-2 font-bold tracking-wider text-slate-800 text-base">
                  {game.map((num) => (
                    <span key={num} className="w-6 text-center">
                      {String(num).padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Price & Summary */}
          <div className="border-t-2 border-dashed border-slate-300 pt-3 text-xs space-y-1 text-slate-600">
            <div className="flex justify-between font-bold text-slate-800 text-sm">
              <span>합계 금액</span>
              <span>{(games.length * 1000).toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>추첨일</span>
              <span>매주 토요일 20:35 SBS 생방송</span>
            </div>
          </div>

          {/* Barcode Mock Graphic */}
          <div className="mt-5 pt-3 border-t border-slate-200 text-center">
            <div className="h-10 w-full flex items-center justify-center gap-[3px] opacity-80 overflow-hidden">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 h-full"
                  style={{ width: `${(i % 3 === 0 ? 3 : (i % 2 === 0 ? 1.5 : 2))}px` }}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-400 tracking-widest mt-1">
              9841-2049-5820-1948-5920
            </p>
          </div>

          {/* Serrated Bottom Edge Mock */}
          <div className="absolute -bottom-2 left-0 right-0 h-4 flex justify-between overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-[#080b11] rotate-45 transform origin-top -mt-2" />
            ))}
          </div>
        </div>

        {/* Buttons Controls */}
        <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-b-xl flex items-center justify-between gap-2 shadow-2xl">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs transition"
          >
            닫기
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-200 hover:text-amber-300 text-xs font-semibold transition"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShare ? '복사됨' : '공유하기'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? '저장 중...' : '이미지 다운로드'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
