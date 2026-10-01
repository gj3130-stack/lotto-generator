import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GeneratorTab from './components/GeneratorTab';
import HistoryTab from './components/HistoryTab';
import NumberExplorerTab from './components/NumberExplorerTab';
import DiagnosisTab from './components/DiagnosisTab';
import StorageTab from './components/StorageTab';
import DreamFortuneTab from './components/DreamFortuneTab';
import TaxCalculatorTab from './components/TaxCalculatorTab';
import NearbyStoresTab from './components/NearbyStoresTab';
import ReceiptModal from './components/ReceiptModal';
import OmrModal from './components/OmrModal';
import WinCelebrationModal from './components/WinCelebrationModal';
import ResponsibleGamblingModal from './components/ResponsibleGamblingModal';
import VipPassModal from './components/VipPassModal';
import VipPromoBanner from './components/VipPromoBanner';
import { 
  Dices, BarChart3, Search, FlaskConical, Bookmark, 
  Moon, Calculator, MapPin, Sparkles, Navigation 
} from 'lucide-react';
import { sound } from './utils/sound';
import { triggerHaptic } from './utils/haptics';

const TABS = [
  { id: 'generator', label: '번호 생성', icon: Dices, badge: 'HOT' },
  { id: 'stores', label: '내주변 복권방', icon: Navigation, badge: 'O2O' },
  { id: 'history', label: '빅데이터 분석', icon: BarChart3 },
  { id: 'explorer', label: '번호 탐색', icon: Search },
  { id: 'diagnosis', label: '조합 진단', icon: FlaskConical },
  { id: 'storage', label: '마이 보관함', icon: Bookmark },
  { id: 'dream', label: '꿈·운세', icon: Moon },
  { id: 'tax', label: '실수령액', icon: Calculator },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('generator');
  
  // Storage state with LocalStorage persistence
  const [savedCombinations, setSavedCombinations] = useState(() => {
    try {
      const saved = localStorage.getItem('lotto_vip_saved_games');
      return saved ? JSON.parse(saved) : [
        { id: 1, numbers: [7, 10, 22, 29, 31, 38], engine: '균형형', createdAt: '2024-10-05 18:30' },
        { id: 2, numbers: [3, 14, 21, 27, 33, 45], engine: '빈도형', createdAt: '2024-09-28 14:15' }
      ];
    } catch {
      return [];
    }
  });

  // Modals state
  const [receiptGames, setReceiptGames] = useState(null);
  const [omrGames, setOmrGames] = useState(null);
  const [diagnosisNumbers, setDiagnosisNumbers] = useState(null);
  const [winCelebrationRank, setWinCelebrationRank] = useState(null);
  const [isResponsibleOpen, setIsResponsibleOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);
  const [isVipActive, setIsVipActive] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lotto_vip_saved_games', JSON.stringify(savedCombinations));
    } catch (e) {
      console.error(e);
    }
  }, [savedCombinations]);

  // Tab change
  const handleTabChange = (tabId) => {
    sound.playClick();
    triggerHaptic(15);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save generated games to storage
  const handleSaveToStorage = (games, engineMode) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }) + ' ' + 
                    now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    const newItems = games.map((game, idx) => ({
      id: Date.now() + idx,
      numbers: game,
      engine: engineMode,
      createdAt: dateStr
    }));

    setSavedCombinations(prev => [...newItems, ...prev]);
    alert(`${games.length}개의 번호 조합이 [마이 보관함]에 안전하게 저장되었습니다!`);
  };

  // Delete single combination
  const handleDeleteCombination = (id) => {
    sound.playClick();
    triggerHaptic(20);
    setSavedCombinations(prev => prev.filter(item => item.id !== id));
  };

  // Clear all combinations
  const handleClearAllStorage = () => {
    sound.playClick();
    triggerHaptic(30);
    setSavedCombinations([]);
  };

  // Move to diagnosis tab with specific numbers
  const handleDiagnoseNumbers = (numbers) => {
    setDiagnosisNumbers(numbers);
    setActiveTab('diagnosis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* VIP Luxury Header */}
      <Header
        onOpenResponsibleModal={() => setIsResponsibleOpen(true)}
        onOpenVipModal={() => setIsVipOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 sm:px-6 space-y-6">
        {/* Commercial VIP Banner / Ad Slot */}
        <VipPromoBanner onOpenVip={() => setIsVipOpen(true)} />

        {/* Navigation Tabs Bar */}
        <div className="relative border-b border-slate-800/80 pb-2">
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tab.id === 'storage' ? savedCombinations.length : null;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap relative ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>

                  {tab.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-rose-500 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}

                  {count !== null && count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Body Rendering */}
        <div className="pt-1">
          {activeTab === 'generator' && (
            <GeneratorTab
              onSaveToStorage={handleSaveToStorage}
              onOpenReceipt={(games) => setReceiptGames(games)}
              onOpenOmr={(games) => setOmrGames(games)}
              onDiagnose={handleDiagnoseNumbers}
            />
          )}

          {activeTab === 'stores' && <NearbyStoresTab />}

          {activeTab === 'history' && <HistoryTab />}

          {activeTab === 'explorer' && <NumberExplorerTab />}

          {activeTab === 'diagnosis' && (
            <DiagnosisTab initialNumbers={diagnosisNumbers} />
          )}

          {activeTab === 'storage' && (
            <StorageTab
              savedCombinations={savedCombinations}
              onDeleteCombination={handleDeleteCombination}
              onClearAll={handleClearAllStorage}
              onTriggerCelebration={(rank) => setWinCelebrationRank(rank)}
            />
          )}

          {activeTab === 'dream' && (
            <DreamFortuneTab onApplyNumbers={handleDiagnoseNumbers} />
          )}

          {activeTab === 'tax' && <TaxCalculatorTab />}
        </div>
      </main>

      {/* Luxury Footer */}
      <footer className="w-full border-t border-slate-900/90 bg-[#06080e] py-8 pb-24 md:pb-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-slate-400 font-cinzel">LOTTO VIP MASTER PRESTIGE EDITION</p>
            <p className="text-[11px] text-slate-500">
              본 서비스는 빅데이터 통계 분석 기반의 프리미엄 로또 6/45 조합 솔루션입니다.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsResponsibleOpen(true)}
              className="hover:text-amber-400 transition underline"
            >
              책임 이용 & 면책 고지
            </button>
            <button
              onClick={() => setIsVipOpen(true)}
              className="hover:text-amber-400 transition underline"
            >
              VIP 멤버십 안내
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (스마트폰 엄지 터치 최적화) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0e17]/95 backdrop-blur-lg border-t border-amber-500/25 px-2 py-1.5 flex items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        {[
          { id: 'generator', label: '번호생성', icon: Dices },
          { id: 'stores', label: '내주변', icon: Navigation },
          { id: 'history', label: '빅데이터', icon: BarChart3 },
          { id: 'storage', label: '보관함', icon: Bookmark, count: savedCombinations.length },
          { id: 'diagnosis', label: '진단', icon: FlaskConical },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive ? 'text-amber-300 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,206,98,0.6)]' : 'text-slate-400'}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-400 text-slate-950 text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-sans">
                {item.label}
              </span>
              {isActive && (
                <span className="w-3 h-0.5 bg-amber-400 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Global Modals */}
      {receiptGames && (
        <ReceiptModal
          games={receiptGames}
          onClose={() => setReceiptGames(null)}
        />
      )}

      {omrGames && (
        <OmrModal
          games={omrGames}
          onClose={() => setOmrGames(null)}
        />
      )}

      {winCelebrationRank && (
        <WinCelebrationModal
          rank={winCelebrationRank}
          onClose={() => setWinCelebrationRank(null)}
        />
      )}

      {isResponsibleOpen && (
        <ResponsibleGamblingModal
          onClose={() => setIsResponsibleOpen(false)}
        />
      )}

      {isVipOpen && (
        <VipPassModal
          isVipActive={isVipActive}
          onToggleVip={() => setIsVipActive(!isVipActive)}
          onClose={() => setIsVipOpen(false)}
        />
      )}
    </div>
  );
}
