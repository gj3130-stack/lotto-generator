import React from 'react';
import { MapPin, Trophy, ExternalLink, Sparkles } from 'lucide-react';
import { FAMOUS_STORES } from '../data/storeData';

export default function FamousStoresTab() {
  const handleOpenMap = (storeName) => {
    const query = encodeURIComponent(`로또 명당 ${storeName}`);
    window.open(`https://map.naver.com/p/search/${query}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel-gold rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              전국 역대 1등 최다 배출 로또 명당 지도
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            수십 명의 1등 당첨자를 탄생시킨 전국 최고 명당 복권 판매점 순위입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAMOUS_STORES.map((store, idx) => (
          <div
            key={store.name}
            className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-amber-400/50 transition flex flex-col justify-between gap-4 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center font-outfit">
                    #{idx + 1}
                  </span>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition">
                    {store.name}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {store.tag}
                </span>
              </div>

              <div className="flex items-start gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>{store.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs font-outfit">
                <div>
                  <span className="text-slate-500 block text-[10px]">1등 당첨</span>
                  <strong className="text-amber-400 font-bold text-base">{store.firstPrizeCount} 회</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">2등 당첨</span>
                  <strong className="text-slate-300 font-bold text-base">{store.secondPrizeCount} 회</strong>
                </div>
              </div>

              <button
                onClick={() => handleOpenMap(store.name)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 text-xs transition"
              >
                <span>네이버 지도</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
