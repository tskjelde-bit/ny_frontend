import React, { useState, useEffect } from 'react';
import { DISTRICTS } from '@/constants';
import { DistrictData } from '@/types';
import Map from '@/components/Map';
import DistrictStats from '@/components/DistrictStats';
import Calculator from '@/components/Calculator';
import Header from '@/components/Header';
import RightPanel from '@/components/RightPanel';
import { ChevronDown, ChevronUp, MapIcon, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedDistrict = DISTRICTS.find(d => d.id === selectedDistrictId) || null;

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDistrictSelect = (district: DistrictData) => {
    setSelectedDistrictId(district.id);
    setIsExpanded(true);
    setShowCalculator(false);
  };

  const handleDistrictClick = (id: string) => {
    setSelectedDistrictId(id);
    setIsExpanded(true);
    setShowCalculator(false);
  };

  const handleDistrictChangeById = (id: string) => {
    setSelectedDistrictId(id);
  };

  const toggleExpand = () => {
    if (selectedDistrictId) {
      setIsExpanded(!isExpanded);
    }
  };

  const getPanelHeightClass = () => {
    if (showCalculator) return 'h-full md:h-[640px]';
    return 'h-auto';
  };

  return (
    <div className="flex flex-col h-screen md:min-h-screen w-full bg-[#0a0f1d] text-slate-100 font-sans overflow-hidden md:overflow-y-auto">
      <Header />

      <div className="flex-1 flex justify-center min-h-0">
        {/* Main Centered Content Wrapper - px-0 på mobil for fullbredde kart */}
        <div className="w-full max-w-[1680px] flex flex-col px-0 md:px-10 mx-auto min-h-0">

          {/* Top Row: Title Section - Skjules på mobil hvis kalkulator er åpen */}
          <div className={`pt-4 md:pt-10 pb-4 md:pb-6 shrink-0 text-left px-4 md:px-0 ${showCalculator ? 'hidden md:block' : 'block'}`}>
            <h1 className="text-2xl md:text-5xl font-manrope font-extrabold text-white tracking-tight mb-0.5 md:mb-2">
              Boligmarkedet i <span className="text-blue-500">{selectedDistrict?.name || 'Oslo'}</span>
            </h1>
            <p className="text-slate-400 font-semibold text-[10px] md:text-lg opacity-90 leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
              {selectedDistrict?.description || 'Klikk på en bydel for å se detaljert markedsstatistikk og prognoser.'}
            </p>
          </div>

          {/* Bottom Row: Map & Sidepanel - flex-1 for å fylle rest av viewport på mobil */}
          <div className="flex-1 flex flex-col lg:flex-row gap-0 md:gap-10 min-h-0 mb-0 md:mb-10 items-stretch">

            {/* Map Container - Ingen padding eller border radius på mobil */}
            <div className="flex-1 max-w-[1050px] flex flex-col min-w-0 rounded-none md:rounded-[1rem] overflow-hidden bg-white md:bg-[#f1f5f9] relative shadow-2xl">

              {/* Map Area */}
              <div className="flex-1 min-h-0 relative">
                <Map
                  districts={DISTRICTS}
                  selectedDistrict={selectedDistrictId}
                  onSelect={handleDistrictSelect}
                  onDistrictClick={handleDistrictClick}
                />

                {/* Zoom Controls */}
                <div className="absolute right-3 top-3 md:right-6 md:top-6 flex flex-col gap-1 md:gap-2 z-10">
                  <button className="w-8 h-8 md:w-10 md:h-10 bg-white/95 border border-slate-200 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-lg group">
                    <span className="text-lg md:text-xl font-bold text-slate-600 group-hover:text-blue-600 transition-colors">+</span>
                  </button>
                  <button className="w-8 h-8 md:w-10 md:h-10 bg-white/95 border border-slate-200 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-lg group">
                    <span className="text-lg md:text-xl font-bold text-slate-600 group-hover:text-blue-600 transition-colors">−</span>
                  </button>
                </div>

                {/* Visual Branding Overlay */}
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 opacity-30 flex items-center gap-2 pointer-events-none text-slate-900">
                  <MapIcon className="w-3.5 h-3.5 md:w-5 md:h-5" />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Oslo Boligverdi</span>
                </div>
              </div>

              {/* Stats/Calculator Panel */}
              <div className={`flex-none relative z-20 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${getPanelHeightClass()}`}>

                {/* Expand/Collapse Trigger */}
                {selectedDistrictId && !showCalculator && (
                  <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 z-30">
                    <button
                      onClick={toggleExpand}
                      className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 border-[3px] md:border-4 border-[#0a0f1d] rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-all shadow-2xl active:scale-90 group"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-y-0.5 transition-transform" /> : <ChevronUp className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-0.5 transition-transform" />}
                    </button>
                  </div>
                )}

                <div className="bg-[#0a0f1d] overflow-hidden h-full">
                  {showCalculator && selectedDistrict ? (
                    <Calculator
                      district={selectedDistrict}
                      onDistrictChange={handleDistrictChangeById}
                      onClose={() => setShowCalculator(false)}
                    />
                  ) : (
                    <DistrictStats
                      district={selectedDistrict}
                      isExpanded={isExpanded}
                      onOpenCalculator={() => setShowCalculator(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Sidepanel - Skjult på mindre skjermer */}
            <div className="hidden lg:flex flex-col w-[510px] shrink-0 h-full">
               <RightPanel className="h-full rounded-[1rem] border border-white/5 shadow-2xl overflow-hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
