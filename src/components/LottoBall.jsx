import React from 'react';

export default function LottoBall({ 
  number, 
  size = 'md', 
  isBonus = false, 
  isLocked = false,
  isMatched = false,
  theme = 'luxury', // 'luxury' | 'pureGold'
  onClick,
  className = '' 
}) {
  const num = Number(number);

  // Luxury Gold & Titanium Gray Palette
  // 1~10 24K Royal Gold, 11~20 Platinum Silver, 21~30 Champagne Bronze, 31~40 Obsidian Slate, 41~45 Crown Gold
  const getRangeClass = (n) => {
    if (theme === 'pureGold') return 'lotto-ball-pure-gold';
    if (n <= 10) return 'lotto-ball-range-1';
    if (n <= 20) return 'lotto-ball-range-2';
    if (n <= 30) return 'lotto-ball-range-3';
    if (n <= 40) return 'lotto-ball-range-4';
    return 'lotto-ball-range-5';
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] sm:w-7 sm:h-7 sm:text-xs',
    sm: 'w-7 h-7 text-xs sm:w-8 sm:h-8 sm:text-sm',
    md: 'w-8 h-8 text-xs sm:w-10 sm:h-10 sm:text-base md:w-11 md:h-11 md:text-lg',
    lg: 'w-10 h-10 text-sm sm:w-12 sm:h-12 sm:text-lg md:w-14 md:h-14 md:text-xl',
    xl: 'w-14 h-14 text-xl sm:w-16 sm:h-16 sm:text-2xl font-black'
  };

  return (
    <div
      onClick={onClick}
      className={`lotto-ball font-outfit select-none font-extrabold relative transition-all duration-200 ${sizeClasses[size] || sizeClasses.md} ${getRangeClass(num)} ${isBonus ? 'lotto-ball-bonus ring-2 ring-amber-400' : ''} ${isMatched ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 animate-pulse scale-110 shadow-[0_0_20px_rgba(245,206,98,0.8)]' : ''} ${onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''} ${className}`}
      title={`번호 ${num}`}
    >
      <span>{num}</span>
      {isLocked && (
        <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow border border-amber-200">
          🔒
        </span>
      )}
    </div>
  );
}
