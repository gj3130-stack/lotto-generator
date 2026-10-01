import React, { useRef, useState } from 'react';
import { Download, Share2, X, Check, Printer, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

export default function OmrModal({ games, onClose, round = 1141 }) {
  const omrRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Download OMR Card Image
  const handleDownloadImage = async () => {
    if (!omrRef.current) return;
    sound.playClick();
    triggerHaptic(30);
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(omrRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `LOTTO_VIP_${round}회차_OMR카드.png`;
      link.href = dataUrl;
      link.click();
      sound.playSuccess();
    } catch (err) {
      console.error(err);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="max-w-xl w-full my-auto flex flex-col items-center">
        {/* Real OMR Slip Card Container */}
        <div
          ref={omrRef}
          className="w-full bg-[#FAF7F2] text-slate-900 rounded-t-2xl p-5 sm:p-7 shadow-2xl border-4 border-[#C82A2A] relative select-none font-sans"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* OMR Slip Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#C82A2A]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C82A2A] flex items-center justify-center text-white font-black text-sm">
                6/45
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#C82A2A] flex items-center gap-1.5 font-sans">
                  <span>로또 6/45 OMR 마킹 슬립지</span>
                </h3>
                <p className="text-[10px] text-slate-600 font-medium">
                  LOTTO VIP MASTER 공식 규격 컴퓨터용 사인펜 자동 마킹 뷰어
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="block font-bold text-[#C82A2A] font-outfit text-sm">제 {round} 회차</span>
              <span className="text-[10px] text-slate-500">자동 마킹 5게임</span>
            </div>
          </div>

          {/* OMR Notice */}
          <div className="py-2 text-[10px] text-[#C82A2A] font-bold flex items-center justify-between border-b border-rose-200">
            <span>※ 컴퓨터용 사인펜으로 검게 칠해진 영역(■)을 확인하세요.</span>
            <span>매장 직접 마킹용</span>
          </div>

          {/* Games Rows (A ~ E) */}
          <div className="py-3 space-y-3">
            {games.map((game, gIdx) => {
              const gameLetter = String.fromCharCode(65 + gIdx);
              const gameSet = new Set(game);

              return (
                <div
                  key={gIdx}
                  className="bg-white/80 p-2 sm:p-2.5 rounded-lg border border-[#C82A2A]/40 flex flex-col sm:flex-row sm:items-center gap-2"
                >
                  {/* Row Label & Type */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-20 shrink-0">
                    <div className="w-6 h-6 rounded bg-[#C82A2A] text-white flex items-center justify-center font-bold text-xs">
                      {gameLetter}
                    </div>
                    <span className="text-[10px] bg-rose-50 text-[#C82A2A] px-1.5 py-0.5 rounded font-bold border border-rose-200">
                      자동선택
                    </span>
                  </div>

                  {/* 1 ~ 45 Number Matrix in 5 Columns or Responsive Grid */}
                  <div className="grid grid-cols-9 sm:grid-cols-15 gap-1 flex-1">
                    {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
                      const isMarked = gameSet.has(n);
                      return (
                        <div
                          key={n}
                          className={`h-6 sm:h-7 rounded flex flex-col items-center justify-center text-[10px] font-mono transition-all relative ${
                            isMarked
                              ? 'bg-slate-950 text-white font-black shadow-md ring-2 ring-[#C82A2A]'
                              : 'bg-slate-50 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <span className={isMarked ? 'font-black' : ''}>{n}</span>
                          {/* Pen Mark Indicator */}
                          {isMarked && (
                            <div className="absolute inset-0 bg-slate-950 rounded flex items-center justify-center text-white font-black text-xs">
                              {n}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* OMR Footer Barcode & Guide */}
          <div className="pt-2 border-t-2 border-[#C82A2A] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-600">
            <div>
              <span>• 복권방 방문 시 본 화면을 켜두고 OMR 용지에 그대로 칠하시면 30초 만에 마킹 완료됩니다.</span>
            </div>
            <div className="font-outfit font-bold text-slate-800 text-xs">
              합계: {(games.length * 1000).toLocaleString()}원
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-b-2xl flex items-center justify-between gap-2 shadow-2xl">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs transition"
          >
            닫기
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-amber-300 text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">인쇄하기</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? '저장 중...' : 'OMR 슬립지 이미지 저장'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
