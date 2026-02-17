
"use client";

import React, { useState } from 'react';
import { DistrictInfo, BoligType, Standard } from '@/types';
import { OSLO_DISTRICTS, BOLIGTYPE_FACTORS, STANDARD_FACTORS } from '@/constants';
import { X, Loader2, Sparkles, Home, Building2, Warehouse, DoorOpen, ArrowRight, TrendingUp, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react';

interface CalculatorProps {
  district: DistrictInfo;
  onDistrictChange: (id: string) => void;
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ district, onDistrictChange, onClose }) => {
  const [type, setType] = useState<BoligType>(BoligType.LEILIGHET);
  const [area, setArea] = useState<number>(85);
  const [standard, setStandard] = useState<Standard>(Standard.STANDARD);
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  const getIconForType = (t: BoligType) => {
    switch (t) {
      case BoligType.LEILIGHET: return <Building2 className="w-5 h-5" />;
      case BoligType.REKKEHUS: return <Warehouse className="w-5 h-5" />;
      case BoligType.TOMANNSBOLIG: return <DoorOpen className="w-5 h-5" />;
      case BoligType.ENEBOLIG: return <Home className="w-5 h-5" />;
    }
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setEstimatedValue(null);
    
    setTimeout(() => {
      const boligtypeFaktor = BOLIGTYPE_FACTORS[type];
      const effektivPrisPerKvm = district.pricePerSqm * boligtypeFaktor;
      const basisverdi = area * effektivPrisPerKvm;
      const standardFaktor = STANDARD_FACTORS[standard];
      const finalValue = basisverdi * (1 + standardFaktor);
      setEstimatedValue(Math.round(finalValue));
      setIsCalculating(false);
    }, 1000);
  };

  const handleReset = () => {
    setEstimatedValue(null);
  };

  const showResultOnMobile = estimatedValue !== null;

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0f1d] animate-in fade-in duration-300 overflow-hidden md:relative md:bg-transparent md:max-w-6xl md:mx-auto md:px-10 md:py-10">
      
      {/* Header for kalkulator */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2 md:p-0 md:mb-8 border-b border-white/5 md:border-none md:bg-transparent shrink-0">
        <div className="flex flex-col text-left">
          <h1 className="text-xl md:text-[40px] font-manrope font-extrabold text-white tracking-tight mb-0.5 md:mb-1">
            Verdikalkulator
          </h1>
          <p className="text-slate-400 font-semibold text-[10px] md:text-[18px] opacity-90">
            Boligestimat for <span className="text-blue-500">{district.name}</span>
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 md:p-2 text-slate-500 hover:text-white transition-all group shrink-0"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden md:overflow-hidden relative">
        <div className="h-full w-full grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8 p-0 md:p-0">
          
          {/* VENSTRE SIDE / FORM */}
          <div className={`lg:col-span-7 md:bg-[#0f172a]/40 md:rounded-[2rem] md:border border-white/5 p-4 md:p-8 flex flex-col h-full ${showResultOnMobile ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex-1 space-y-4 md:space-y-6 flex flex-col justify-start md:justify-center">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Bydel</label>
                  <div className="relative">
                    <select
                      value={district.id}
                      onChange={(e) => onDistrictChange(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2.5 text-blue-500 font-bold appearance-none text-sm focus:ring-1 focus:ring-blue-600 outline-none"
                    >
                      {OSLO_DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Areal</label>
                  <div className="flex items-center justify-between bg-[#0a0f1d] border border-slate-800 rounded-xl px-3 py-2.5 focus-within:ring-1 focus-within:ring-blue-600 group">
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        className="bg-transparent text-blue-500 font-bold text-sm md:text-base outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-[2ch]"
                        style={{ width: `${area.toString().length}ch` }}
                      />
                      <span className="text-blue-500 font-bold text-sm md:text-base ml-1">m2</span>
                    </div>
                    <div className="flex flex-col -space-y-1 ml-2">
                      <button onClick={() => setArea(prev => prev + 1)} className="text-slate-600 hover:text-blue-500 transition-colors">
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => setArea(prev => Math.max(0, prev - 1))} className="text-slate-600 hover:text-blue-500 transition-colors">
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Boligtype</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.values(BoligType).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        type === t ? 'bg-blue-600/10 border-blue-600 text-blue-500 shadow-lg shadow-blue-900/10' : 'bg-[#0a0f1d] border-slate-800 text-slate-500'
                      }`}
                    >
                      {getIconForType(t)}
                      <span className="text-[8px] font-bold uppercase mt-1">{t.slice(0, 3)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Standard</label>
                <div className="grid grid-cols-3 gap-1 bg-[#0a0f1d] p-1 rounded-xl border border-slate-800">
                  {Object.values(Standard).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStandard(s)}
                      className={`py-2 rounded-lg text-[8px] font-bold uppercase transition-all ${
                        standard === s ? 'bg-slate-800 text-blue-400' : 'text-slate-500'
                      }`}
                    >
                      {s === Standard.RENOVERINGSBEHOV ? 'Behov' : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black py-4 rounded-xl mt-6 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-xl shadow-blue-900/20"
            >
              {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isCalculating ? 'Analyserer...' : 'Beregn verdi'}
            </button>
          </div>

          {/* HØYRE SIDE / RESULTAT */}
          <div className={`lg:col-span-5 md:bg-slate-900/40 md:rounded-[2rem] md:border border-slate-800 p-4 md:p-8 flex flex-col h-full relative transition-all duration-500 ${showResultOnMobile ? 'flex' : 'hidden lg:flex'}`}>
            {estimatedValue ? (
              <div className="animate-in fade-in zoom-in-95 flex flex-col h-full justify-between pb-2">
                <div className="flex-none flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 mb-3 mx-auto">
                    Beregning klar
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-1 opacity-80">Ditt verdiestimat</h3>
                    <div className="text-4xl md:text-6xl font-manrope font-extrabold text-white tracking-tighter">
                      {estimatedValue.toLocaleString('no-NO')}
                      <span className="ml-1 text-white">kr</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full mb-4">
                     <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                        <div className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-0.5">Pris/m²</div>
                        <div className="text-white font-manrope font-extrabold text-sm">{Math.round(estimatedValue / area).toLocaleString('no-NO')}</div>
                     </div>
                     <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                        <div className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-0.5">Trend</div>
                        <div className="text-emerald-400 font-manrope font-extrabold text-sm flex items-center justify-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{district.priceChange}%
                        </div>
                     </div>
                  </div>

                  <div className="w-full space-y-4 mb-2">
                    <div className="text-center">
                      <h4 className="text-white font-manrope font-extrabold text-base md:text-xl uppercase tracking-tight mb-1">TRENGER DU EN VERDIVURDERING?</h4>
                      <p className="text-slate-400 text-[11px] font-medium leading-relaxed max-w-[280px] mx-auto opacity-90 px-2">
                        Jeg hjelper deg med en kostnadsfri e-takst av boligen din
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <ul className="space-y-2">
                        {[
                          'Uforpliktende møte',
                          'Motta tips og råd',
                          'Sett av 30 – 60 minutter'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-slate-200 text-[10px] font-bold uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-[0.1em] text-[11px] transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98]">
                    Få en presis verdivurdering
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleReset}
                    className="w-full text-slate-500 hover:text-white text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 py-1 transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    Endre detaljer
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center h-full max-w-[250px] mx-auto opacity-40">
                <div className="w-16 h-16 bg-slate-800/40 rounded-3xl flex items-center justify-center border border-slate-800/60 mb-6">
                  <CalcIcon className="w-8 h-8 text-slate-700" />
                </div>
                <h4 className="text-slate-400 font-bold text-lg tracking-tight mb-2 uppercase">Resultat</h4>
                <p className="text-slate-600 text-sm leading-relaxed text-center font-medium">
                  Verdiestimatet ditt dukker opp her når du har fylt ut detaljene.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hjelpe-ikon for Calc
const CalcIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <line x1="8" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="16" y2="18"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
  </svg>
);

export default Calculator;
