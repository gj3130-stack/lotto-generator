import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Phone, ExternalLink, Sparkles, Building2, Store, CheckCircle, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

// Major Lotto Stores Data across Nationwide Korea with Coordinates
const NATIONWIDE_STORES = [
  {
    id: 1,
    name: '스파 (노원구 본점)',
    address: '서울 노원구 동일로 1493 상계주공10단지종합상가 111호',
    lat: 37.6608,
    lng: 127.0569,
    firstCount: 52,
    secondCount: 215,
    isPartner: true,
    tag: '전국 1등 최다 배출 신화'
  },
  {
    id: 2,
    name: '부일카서비스',
    address: '부산 동구 자성로133번길 35',
    lat: 35.1388,
    lng: 129.0628,
    firstCount: 46,
    secondCount: 178,
    isPartner: true,
    tag: '부산·경남 최고 성지'
  },
  {
    id: 3,
    name: '잠실매점 (잠실역 8번출구)',
    address: '서울 송파구 올림픽로 269 잠실역 8번출구 가판',
    lat: 37.5133,
    lng: 127.1001,
    firstCount: 22,
    secondCount: 95,
    isPartner: true,
    tag: '서울 강남권 대표 명당'
  },
  {
    id: 4,
    name: '로또명당인주점',
    address: '충남 아산시 인주면 서해로 519-2',
    lat: 36.8872,
    lng: 126.9152,
    firstCount: 33,
    secondCount: 112,
    isPartner: true,
    tag: '충청권 부동의 1위'
  },
  {
    id: 5,
    name: '일등복권편의점',
    address: '대구 달서구 대구로 237',
    lat: 35.8344,
    lng: 128.5342,
    firstCount: 29,
    secondCount: 98,
    isPartner: false,
    tag: '대구 경북 1위 명당'
  },
  {
    id: 6,
    name: '행운복권방 (포천점)',
    address: '경기 포천시 소흘읍 호국로 439',
    lat: 37.8286,
    lng: 127.1424,
    firstCount: 19,
    secondCount: 68,
    isPartner: false,
    tag: '경기 북부 명당'
  },
  {
    id: 7,
    name: '목화휴게소',
    address: '경남 사천시 사천대로 912',
    lat: 35.0347,
    lng: 128.0642,
    firstCount: 24,
    secondCount: 88,
    isPartner: false,
    tag: '남해안 고속도로 성지'
  },
  {
    id: 8,
    name: '대박찬스복권방',
    address: '인천 부평구 경인로 895',
    lat: 37.4912,
    lng: 126.7235,
    firstCount: 17,
    secondCount: 54,
    isPartner: false,
    tag: '인천 부평 대표 명당'
  }
];

export default function NearbyStoresTab() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [isLocating, setIsLocating] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);

  // Calculate distance in km (Haversine formula)
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Get User Current GPS Location
  const handleGetLocation = () => {
    sound.playClick();
    triggerHaptic(20);
    if (!navigator.geolocation) {
      alert('사용자의 브라우저가 위치 정보를 지원하지 않습니다.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLocating(false);
        sound.playSuccess();
        triggerHaptic(30);
      },
      (err) => {
        setIsLocating(false);
        alert('위치 권한을 허용해주시면 가장 가까운 복권 판매점을 계산해 드립니다.');
      },
      { timeout: 8000 }
    );
  };

  // Filtered and Sorted Stores
  const filteredStores = NATIONWIDE_STORES.filter((store) => {
    const matchesQuery = store.name.includes(searchQuery) || store.address.includes(searchQuery);
    const matchesRegion = selectedRegion === '전체' || store.address.includes(selectedRegion);
    return matchesQuery && matchesRegion;
  }).map((store) => {
    if (userLocation) {
      const dist = getDistanceKm(userLocation.lat, userLocation.lng, store.lat, store.lng);
      return { ...store, distance: Number(dist) };
    }
    return store;
  }).sort((a, b) => {
    if (userLocation && a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    }
    return b.firstCount - a.firstCount;
  });

  const handleOpenMap = (store, type = 'naver') => {
    sound.playClick();
    triggerHaptic(15);
    const query = encodeURIComponent(`로또 ${store.name}`);
    if (type === 'kakao') {
      window.open(`https://map.kakao.com/link/search/${query}`, '_blank');
    } else {
      window.open(`https://map.naver.com/p/search/${query}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & GPS Locate Banner */}
      <div className="glass-panel-gold rounded-3xl p-5 md:p-6 border border-amber-400/40 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 font-outfit">
                O2O STORE FINDER
              </span>
              <span className="text-xs text-slate-300 font-medium">전국 8,500개 판매점 연계</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white font-cinzel gold-gradient-text">
              내 주변 복권 판매점 실시간 길찾기
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              현재 내 위치에서 가장 가까운 1등 명당 복권방과 당첨 이력을 1초 만에 확인하세요.
            </p>
          </div>

          {/* GPS Button */}
          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/25 hover:brightness-110 transition active:scale-95 flex items-center justify-center gap-2 font-sans"
          >
            <Navigation className={`w-4 h-4 text-slate-950 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'GPS 위치 수신 중...' : (userLocation ? '📍 내 위치 기준 거리 정렬됨' : '📍 내 주변 가장 가까운 판매점 찾기')}</span>
          </button>
        </div>

        {/* Region Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
            {['전체', '서울', '경기', '부산', '대구', '인천', '충남', '경남'].map((region) => (
              <button
                key={region}
                onClick={() => {
                  sound.playClick();
                  setSelectedRegion(region);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? 'bg-amber-400 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="판매점 이름 또는 도로명 주소 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>
      </div>

      {/* 2. Partner Store Banner (B2B Commercial Monetization Spot) */}
      <div className="glass-panel-gray rounded-2xl p-4 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center shrink-0 shadow">
            <Store className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 font-cinzel">
                LOTTO VIP PARTNER NETWORK
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold font-mono">
                복권방 사장님 전용
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              우리 매장을 [내 주변 1등 명당 상단]에 등록하고 매장 매출을 극대화하세요.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setPartnerModalOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition whitespace-nowrap active:scale-95 shadow"
        >
          제휴 입점 문의
        </button>
      </div>

      {/* 3. Stores List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className={`glass-panel-gray rounded-2xl p-5 border transition duration-200 flex flex-col justify-between gap-4 group ${
              store.isPartner ? 'border-amber-400/50 shadow-lg shadow-amber-500/5 bg-gradient-to-br from-amber-500/5 to-slate-900/60' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition">
                    {store.name}
                  </h3>
                  {store.isPartner && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.2 rounded">
                      ⭐ 공식 제휴 명당
                    </span>
                  )}
                </div>

                {store.distance !== undefined && (
                  <span className="text-xs font-outfit font-black text-amber-400 bg-slate-950 px-2.5 py-1 rounded-md border border-amber-500/30">
                    약 {store.distance} km
                  </span>
                )}
              </div>

              <div className="flex items-start gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{store.address}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{store.tag}</p>
            </div>

            {/* Winning Records & Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs font-outfit">
                <div>
                  <span className="text-slate-500 block text-[10px]">1등 당첨</span>
                  <strong className="text-amber-400 font-bold text-base">{store.firstCount} 회</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">2등 당첨</span>
                  <strong className="text-slate-300 font-bold text-base">{store.secondCount} 회</strong>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenMap(store, 'naver')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-300 text-xs font-medium transition flex items-center gap-1"
                >
                  <span>네이버</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleOpenMap(store, 'kakao')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-300 text-xs font-medium transition flex items-center gap-1"
                >
                  <span>카카오</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Partner Modal (B2B Application Modal) */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-gold rounded-3xl max-w-md w-full p-6 md:p-7 border border-amber-400/60 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setPartnerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 mx-auto flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-amber-400" />
                </div>
              </div>
              <h3 className="text-xl font-black text-white font-cinzel gold-gradient-text">
                복권 판매점 파트너 제휴 입점
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                매주 수만 명의 로또 구매자가 방문하는 본 플랫폼 상단에 사장님의 판매점을 노출하세요.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>GPS 기반 내 동네 구매자에게 최우선 상단 핀 노출</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>네이버/카카오 지도 1초 원클릭 길안내 방문 유도</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>매장 TV/태블릿용 '골드 로또 머신 키오스크' 라이선스 제공</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-400">월 제휴 광고비:</span>
                <span className="text-lg font-outfit font-black gold-gradient-text">월 29,000 원</span>
              </div>
              <button
                onClick={() => {
                  sound.playSuccess();
                  alert('제휴 상담 신청이 접수되었습니다! 담당 매니저가 24시간 내에 연락드립니다.');
                  setPartnerModalOpen(false);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-xl hover:brightness-110 transition active:scale-95"
              >
                제휴 입점 상담 신청하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
