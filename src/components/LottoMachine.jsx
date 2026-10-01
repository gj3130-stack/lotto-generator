import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import LottoBall from './LottoBall';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import confetti from 'canvas-confetti';

export default function LottoMachine({ 
  onDrawComplete, 
  isDrawing, 
  setIsDrawing,
  drawnNumbers,
  onReset
}) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);
  const ballsRef = useRef([]);
  const [dispensedBalls, setDispensedBalls] = useState([]);
  const [chamberStatus, setChamberStatus] = useState('대기 중');

  // Initialize 45 physics balls inside circular drum with VIBRANT & COLORFUL colors
  useEffect(() => {
    const balls = [];
    const colors = [
      { fill: '#FBC02D', stroke: '#E65100', text: '#1A1300' }, // 1~10: Sunshine Gold
      { fill: '#0288D1', stroke: '#01579B', text: '#FFFFFF' }, // 11~20: Sapphire Blue
      { fill: '#E53935', stroke: '#B71C1C', text: '#FFFFFF' }, // 21~30: Ruby Red
      { fill: '#8E24AA', stroke: '#4A148C', text: '#FFFFFF' }, // 31~40: Amethyst Purple
      { fill: '#43A047', stroke: '#1B5E20', text: '#FFFFFF' }  // 41~45: Emerald Green
    ];

    for (let i = 1; i <= 45; i++) {
      const colIdx = i <= 10 ? 0 : i <= 20 ? 1 : i <= 30 ? 2 : i <= 40 ? 3 : 4;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 80;
      balls.push({
        num: i,
        x: 150 + Math.cos(angle) * dist,
        y: 150 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: 11,
        color: colors[colIdx]
      });
    }
    ballsRef.current = balls;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = 150;
    const centerY = 150;
    const chamberRadius = 125;

    const render = () => {
      ctx.clearRect(0, 0, 300, 300);

      // Draw Chamber Outer Glow & Ring
      const grad = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, chamberRadius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(0.65, 'rgba(15, 23, 42, 0.5)');
      grad.addColorStop(1, 'rgba(5, 8, 15, 0.9)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, chamberRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Golden Edge Rim
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#D4AF37';
      ctx.stroke();

      // Inner Platinum Bezel
      ctx.beginPath();
      ctx.arc(centerX, centerY, chamberRadius - 3, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.4)';
      ctx.stroke();

      // Physics update for 45 balls
      const isBlowing = isDrawing;

      ballsRef.current.forEach((b) => {
        if (isBlowing) {
          // Strong air agitation
          b.vx += (Math.random() - 0.5) * 4.5;
          b.vy += (Math.random() - 0.5) * 4.5 - 0.9;
          const speed = Math.hypot(b.vx, b.vy);
          if (speed > 16) {
            b.vx = (b.vx / speed) * 16;
            b.vy = (b.vy / speed) * 16;
          }
        } else {
          // Gentle idle motion with gravity
          b.vy += 0.15;
          b.vx *= 0.985;
          b.vy *= 0.985;
        }

        b.x += b.vx;
        b.y += b.vy;

        // Circular boundary collision
        const dx = b.x - centerX;
        const dy = b.y - centerY;
        const dist = Math.hypot(dx, dy);
        const maxDist = chamberRadius - b.radius - 2;

        if (dist > maxDist) {
          const nx = dx / dist;
          const ny = dy / dist;
          b.x = centerX + nx * maxDist;
          b.y = centerY + ny * maxDist;
          const dot = b.vx * nx + b.vy * ny;
          b.vx = (b.vx - 2 * dot * nx) * 0.82;
          b.vy = (b.vy - 2 * dot * ny) * 0.82;

          if (isBlowing && Math.random() < 0.08) {
            sound.playBallTick();
          }
        }

        // Draw individual colorful ball with 3D gloss
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color.fill;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = b.color.stroke;
        ctx.stroke();

        // 3D Glass Specular reflection
        const glare = ctx.createRadialGradient(
          b.x - b.radius * 0.35,
          b.y - b.radius * 0.35,
          1,
          b.x,
          b.y,
          b.radius
        );
        glare.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        glare.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        glare.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
        ctx.fillStyle = glare;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ball Number
        ctx.font = 'bold 8.5px Outfit, sans-serif';
        ctx.fillStyle = b.color.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(b.num), b.x, b.y + 0.5);

        ctx.restore();
      });

      // Glass front reflection curve
      ctx.beginPath();
      ctx.ellipse(centerX - 35, centerY - 45, 60, 25, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fill();

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isDrawing]);

  // Dispense balls one by one with CUTE POP SOUND ("퐁! 뽁!")
  useEffect(() => {
    if (!isDrawing || !drawnNumbers || drawnNumbers.length === 0) return;

    setDispensedBalls([]);
    setChamberStatus('에어 펌프 가동 중...');

    const targets = [...drawnNumbers];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < targets.length) {
        const nextNum = targets[currentIndex];
        setDispensedBalls((prev) => [...prev, nextNum]);
        
        // 🎈 CUTE POP EFFECT ("퐁! 뽁!") with rising scale pitch
        sound.playCutePop(currentIndex);
        triggerHaptic([30, 40]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsDrawing(false);
        setChamberStatus('추첨 완료');
        sound.playJackpot();
        triggerHaptic([50, 70, 90]);

        // Colorful Confetti
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#FBC02D', '#0288D1', '#E53935', '#8E24AA', '#43A047', '#FFFFFF']
        });

        if (onDrawComplete) {
          onDrawComplete(targets);
        }
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isDrawing, drawnNumbers]);

  return (
    <div className="glass-panel-gold rounded-3xl p-4 sm:p-6 md:p-7 border border-amber-400/40 shadow-2xl space-y-4 sm:space-y-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Machine Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0e17] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white font-cinzel tracking-wider flex items-center gap-1.5 sm:gap-2">
                <span className="gold-gradient-text">LOTTO VIP ROTARY MACHINE</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                실감형 에어 믹싱 & 귀여운 사운드 추첨 머신
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-amber-500/30 text-[11px] shrink-0">
            <span className={`w-2 h-2 rounded-full ${isDrawing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-slate-300 font-mono font-medium">{chamberStatus}</span>
          </div>
        </div>
      </div>

      {/* Center: Rotary Glass Drum & Mechanism (Responsive for Mobile) */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 py-1">
        {/* Machine Apparatus & Globe */}
        <div className="relative flex flex-col items-center">
          {/* Top Brass Funnel */}
          <div className="w-20 sm:w-24 h-5 sm:h-6 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 rounded-t-lg shadow-md border-t border-amber-200" />

          {/* Central Circular Chamber (Responsive sizing) */}
          <div className="relative p-1.5 sm:p-2 rounded-full bg-gradient-to-b from-amber-400/40 via-slate-700/40 to-amber-600/40 shadow-[0_0_35px_rgba(212,175,55,0.25)]">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="rounded-full cursor-pointer chamber-globe w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]"
              onClick={() => {
                if (!isDrawing) sound.playClick();
              }}
            />
          </div>

          {/* Bottom Stand & Heavy Pedestal */}
          <div className="w-40 sm:w-48 h-4 sm:h-5 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 rounded-t-md border-t border-slate-500 mt-1 shadow-lg" />
          <div className="w-56 sm:w-64 h-6 sm:h-7 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 rounded-b-xl border-t border-amber-300 shadow-2xl flex items-center justify-center">
            <span className="text-[9px] sm:text-[10px] font-cinzel font-black tracking-widest text-slate-950">
              OFFICIAL 6/45 BLOWER CHAMBER
            </span>
          </div>
        </div>

        {/* Right / Dispenser Tray: Ball Exit Ramp (Mobile Optimized) */}
        <div className="w-full lg:w-auto flex-1 max-w-lg space-y-3 sm:space-y-4">
          <div className="glass-panel-gray rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>추출된 당첨 번호 레일 (Live Dispenser)</span>
              </span>
              <span className="text-[11px] font-outfit text-amber-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-amber-500/20">
                {dispensedBalls.length} / 6 개 안착
              </span>
            </div>

            {/* 6 Ball Dispenser Slots (Mobile Perfect Responsive Grid) */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5 py-3 px-1.5 sm:px-2 bg-slate-950/80 rounded-xl border border-amber-500/20 min-h-[72px] items-center justify-items-center">
              {Array.from({ length: 6 }).map((_, slotIdx) => {
                const num = dispensedBalls[slotIdx];
                return (
                  <div key={slotIdx} className="flex flex-col items-center">
                    {num ? (
                      <div className="animate-bounce" style={{ animationIterationCount: 2 }}>
                        <LottoBall number={num} size="md" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-dashed border-slate-700 bg-slate-900/50 flex items-center justify-center text-slate-600 text-xs font-outfit font-bold">
                        {slotIdx + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Live Stats Preview of Dispensed Numbers */}
            {dispensedBalls.length === 6 && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-300 animate-fadeIn">
                <span>합계: <strong className="text-amber-400 font-bold">{dispensedBalls.reduce((a, b) => a + b, 0)}</strong></span>
                <span>홀짝: <strong className="text-slate-200">{dispensedBalls.filter(n => n % 2 !== 0).length} : {dispensedBalls.filter(n => n % 2 === 0).length}</strong></span>
                <span className="text-emerald-400 font-semibold">골드 밸런스 완료 ✨</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
