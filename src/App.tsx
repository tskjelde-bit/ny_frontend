import React, { useState, useRef } from 'react';
import { OSLO_DISTRICTS } from '@/constants';
import { DistrictInfo } from '@/types';
import MapComponent, { MapComponentHandle, TileLayerKey, TILE_LAYERS } from '@/components/MapComponent';
import DistrictStats from '@/components/DistrictStats';
import Calculator from '@/components/Calculator';
import Header from '@/components/Header';
import RightPanel from '@/components/RightPanel';
import { ChevronDown, ChevronUp, MapIcon, Plus, Minus, Layers, Target } from 'lucide-react';

const App: React.FC = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTileLayer, setActiveTileLayer] = useState<TileLayerKey>('blue');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const mapComponentRef = useRef<MapComponentHandle>(null);

  const selectedDistrict = OSLO_DISTRICTS.find(d => d.id === selectedDistrictId) || null;

  const handleDistrictSelect = (district: DistrictInfo) => {
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
    <div className="flex flex-col h-[100dvh] md:min-h-screen md:h-auto w-full bg-[#0a0f1d] text-slate-100 font-sans overflow-hidden md:overflow-y-auto">
      <Header />

      <div className="flex-1 flex flex-col min-h-0 md:block md:flex-none">
        {/* Main Centered Content Wrapper */}
        <div className="w-full max-w-[1700px] flex flex-col px-0 md:px-14 mx-auto min-h-0 flex-1 md:flex-none md:block">

          {/* Title Section */}
          <div className={`pt-2 md:pt-10 pb-2 md:pb-6 shrink-0 text-left px-4 md:px-0 ${showCalculator ? 'hidden md:block' : 'block'}`}>
            <h1 className="text-2xl md:text-5xl font-manrope font-extrabold text-white tracking-tight mb-0.5 md:mb-2">
              Boligmarkedet i <span className="text-blue-500">{selectedDistrict?.name || 'Oslo'}</span>
            </h1>
            <p className="text-slate-400 font-semibold text-[10px] md:text-lg opacity-90 leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
              {selectedDistrict?.description || 'Klikk på en bydel for å se detaljert markedsstatistikk og prognoser.'}
            </p>
          </div>

          {/* Map & Sidepanel Grid */}
          <div className="grid lg:grid-cols-12 gap-0 lg:gap-8 lg:items-stretch mb-0 md:mb-4 flex-1 min-h-0 md:flex-none">

            {/* Map Container — relative parent, map is absolute inset-0, stats overlay at bottom */}
            <div
              className="lg:col-span-8 relative rounded-none md:rounded-[1rem] overflow-hidden bg-white md:bg-[#f1f5f9] shadow-2xl flex-1 min-h-0 md:flex-none md:!h-[450px] lg:!h-auto"
            >

              {/* Map — fills entire container */}
              <div className="absolute inset-0 z-0">
                <MapComponent
                  ref={mapComponentRef}
                  properties={[]}
                  districts={OSLO_DISTRICTS}
                  selectedProperty={null}
                  selectedDistrict={selectedDistrict}
                  onPropertySelect={() => {}}
                  onDistrictSelect={handleDistrictSelect}
                />
              </div>

              {/* Map Controls */}
              <div className="absolute top-1/2 -translate-y-1/2 right-4 z-[500] flex flex-col gap-2 pointer-events-auto">
                <button
                  onClick={() => mapComponentRef.current?.zoomIn()}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#1e293b] text-white shadow-lg hover:bg-blue-600 transition-all"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => mapComponentRef.current?.zoomOut()}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#1e293b] text-white shadow-lg hover:bg-blue-600 transition-all"
                >
                  <Minus size={14} />
                </button>
                <div className="relative mt-1 md:mt-2">
                  <button
                    onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      isLayerMenuOpen ? 'bg-blue-600 text-white' : 'bg-[#1e293b] text-white'
                    } hover:bg-blue-600`}
                  >
                    <Layers size={14} />
                  </button>
                  {isLayerMenuOpen && (
                    <div className="absolute right-full mr-2 top-0 rounded-lg shadow-xl overflow-hidden border bg-white border-slate-200" style={{ minWidth: '120px' }}>
                      {(Object.keys(TILE_LAYERS) as TileLayerKey[]).map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            mapComponentRef.current?.setTileLayer(key);
                            setActiveTileLayer(key);
                            setIsLayerMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                            activeTileLayer === key
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {TILE_LAYERS[key].name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    mapComponentRef.current?.resetView();
                    setSelectedDistrictId(null);
                    setIsExpanded(false);
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#1e293b] text-white shadow-lg hover:bg-blue-600 transition-all"
                >
                  <Target size={14} />
                </button>
              </div>

              {/* Branding Overlay */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 opacity-30 flex items-center gap-2 pointer-events-none text-slate-900">
                <MapIcon className="w-3.5 h-3.5 md:w-5 md:h-5" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Oslo Boligverdi</span>
              </div>

              {/* Stats/Calculator Panel — absolute overlay at bottom of map */}
              <div className="absolute bottom-0 left-0 right-0 z-[500] pointer-events-none">
                <div className="pointer-events-auto">
                  {/* Expand/Collapse Trigger */}
                  {selectedDistrictId && !showCalculator && (
                    <div className="flex justify-center mb-[-16px] md:mb-[-20px]">
                      <button
                        onClick={toggleExpand}
                        className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 border-[3px] md:border-4 border-[#0a0f1d] rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-all shadow-2xl active:scale-90 group relative z-30"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-y-0.5 transition-transform" /> : <ChevronUp className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-0.5 transition-transform" />}
                      </button>
                    </div>
                  )}

                  <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${getPanelHeightClass()} ${
                    selectedDistrictId ? 'bg-[#0a0f1d]' : 'bg-white/50'
                  }`}>
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
            </div>

            {/* Sidepanel — desktop only */}
            <div className="lg:col-span-4 hidden lg:flex flex-col">
               <RightPanel className="h-full rounded-[1rem] border border-white/5 shadow-2xl overflow-hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
