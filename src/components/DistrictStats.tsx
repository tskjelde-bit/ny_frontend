
"use client";

import React from 'react';
import { DistrictInfo } from '@/types';
import { CITY_AVERAGE } from '@/constants';
import { TrendingUp, Clock, BarChart3, Coins } from 'lucide-react';

interface DistrictStatsProps {
  district: DistrictInfo | null;
  isExpanded: boolean;
  onOpenCalculator: () => void;
}

// Hjelpefunksjon for å sikre stor forbokstav
const capitalizeFirst = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Fargekoding: grønn/gul/rød basert på markedsdata
const GREEN = 'text-[#03d392]';
const YELLOW = 'text-[#facc15]';
const RED = 'text-[#e05a5a]';

const getTrendColor = (val: number) => val >= 2.5 ? GREEN : val >= 1.5 ? YELLOW : RED;
const getDaysColor = (val: number) => val <= 18 ? GREEN : val <= 24 ? YELLOW : RED;
const getSqmColor = (val: number) => val >= 110000 ? GREEN : val >= 75000 ? YELLOW : RED;
const getMedianColor = (val: number) => val >= 7000000 ? GREEN : val >= 4500000 ? YELLOW : RED;

// Logikk for generering av sammenligningstekster
const getComparisonTexts = (district: DistrictInfo) => {
  // Prisutvikling (prosentpoeng)
  const trendDiff = Number((district.priceChange - CITY_AVERAGE.priceTrend).toFixed(1));
  const trendAbsDiff = Math.abs(trendDiff);
  const trendPrep = trendDiff > 0.1 ? "over" : trendDiff < -0.1 ? "under" : "på linje med";
  const trendInterp = trendDiff > 0.1
    ? "Sterkere prisvekst enn byen for øvrig."
    : trendDiff < -0.1
    ? "Svakere prisvekst enn byen for øvrig."
    : "Normal prisvekst.";
  const trendDesktop = trendAbsDiff > 0.1
    ? `${trendDiff > 0 ? '+' : ''}${trendDiff} prosentpoeng ${trendPrep} Oslo-snittet (${CITY_AVERAGE.priceTrend}%). ${trendInterp}`
    : `På linje med Oslo-snittet (${CITY_AVERAGE.priceTrend}%). ${trendInterp}`;
  const trendMobile = trendAbsDiff > 0.1
    ? `${trendDiff > 0 ? '+' : ''}${trendDiff}pp ${trendPrep} snittet (${CITY_AVERAGE.priceTrend}%). ${trendDiff > 0.1 ? 'Sterkere vekst.' : 'Svakere vekst.'}`
    : `På linje med snittet (${CITY_AVERAGE.priceTrend}%). Normal vekst.`;

  // Liggetid (dager)
  const daysDiff = district.avgDaysOnMarket - CITY_AVERAGE.daysOnMarket;
  const daysAbsDiff = Math.abs(daysDiff);
  const daysPrep = daysDiff < -2 ? "raskere enn" : daysDiff > 2 ? "tregere enn" : "på nivå med";
  const daysInterp = daysDiff < -2
    ? "Svært likvid marked."
    : daysDiff > 2
    ? "Lavere etterspørsel."
    : "Normal etterspørsel.";
  const daysDesktop = daysAbsDiff > 2
    ? `${daysAbsDiff} dager ${daysPrep} Oslo-snittet (${CITY_AVERAGE.daysOnMarket} dager). ${daysInterp}`
    : `På nivå med Oslo-snittet (${CITY_AVERAGE.daysOnMarket} dager). ${daysInterp}`;
  const daysMobile = daysAbsDiff > 2
    ? `${daysAbsDiff} dager ${daysPrep} snittet (${CITY_AVERAGE.daysOnMarket}). ${daysDiff < -2 ? 'Likvid marked.' : 'Lavere etterspørsel.'}`
    : `På nivå med snittet (${CITY_AVERAGE.daysOnMarket}). Normal etterspørsel.`;

  // Medianpris (millioner)
  const medianDiff = Number(((district.medianPrice / 1000000) - CITY_AVERAGE.medianPrice).toFixed(1));
  const medianAbsDiff = Math.abs(medianDiff);
  const medianPrep = medianDiff > 0.2 ? "over" : medianDiff < -0.2 ? "under" : "på nivå med";
  const medianInterp = medianDiff > 1.0
    ? "Betydelig høyere prisnivå."
    : medianDiff > 0.2
    ? "Høyere prisnivå."
    : medianDiff < -0.2
    ? "Lavere prisnivå."
    : "Normalt prisnivå.";
  const medianDesktop = medianAbsDiff > 0.2
    ? `${medianAbsDiff} mill. kr ${medianPrep} Oslo-snittet (${CITY_AVERAGE.medianPrice} mill.). ${medianInterp}`
    : `På nivå med Oslo-snittet (${CITY_AVERAGE.medianPrice} mill.). ${medianInterp}`;
  const medianMobile = medianAbsDiff > 0.2
    ? `${medianAbsDiff}M ${medianPrep} snittet (${CITY_AVERAGE.medianPrice}M). ${medianDiff > 1.0 ? 'Betydelig høyere nivå.' : medianDiff > 0.2 ? 'Høyere nivå.' : 'Lavere nivå.'}`
    : `På nivå med snittet (${CITY_AVERAGE.medianPrice}M). Normalt nivå.`;

  // Kvadratmeterpris (kroner)
  const sqmDiff = district.pricePerSqm - CITY_AVERAGE.avgSqmPrice;
  const sqmAbsDiff = Math.abs(sqmDiff);
  const sqmPrep = sqmDiff > 1000 ? "over" : sqmDiff < -1000 ? "under" : "på nivå med";
  const sqmInterp = sqmDiff > 1000
    ? "Høyere prisnivå enn byen for øvrig."
    : sqmDiff < -1000
    ? "Rimeligere område."
    : "Normalt prisnivå.";
  const sqmDesktop = sqmAbsDiff > 1000
    ? `${(sqmAbsDiff / 1000).toFixed(0)} ${sqmAbsDiff >= 1000 ? '500' : '000'} kr/m² ${sqmPrep} Oslo-snittet (${(CITY_AVERAGE.avgSqmPrice / 1000).toFixed(0)} 500 kr/m²). ${sqmInterp}`
    : `På nivå med Oslo-snittet (${(CITY_AVERAGE.avgSqmPrice / 1000).toFixed(0)} 500 kr/m²). ${sqmInterp}`;
  const sqmMobile = sqmAbsDiff > 1000
    ? `${(sqmAbsDiff / 1000).toFixed(1)}k ${sqmPrep} snittet (${(CITY_AVERAGE.avgSqmPrice / 1000).toFixed(1)}k). ${sqmDiff > 1000 ? 'Høyere nivå.' : 'Rimeligere.'}`
    : `På nivå med snittet (${(CITY_AVERAGE.avgSqmPrice / 1000).toFixed(1)}k). Normalt nivå.`;

  return {
    trend: { desktop: trendDesktop, mobile: trendMobile },
    days: { desktop: daysDesktop, mobile: daysMobile },
    median: { desktop: medianDesktop, mobile: medianMobile },
    sqm: { desktop: sqmDesktop, mobile: sqmMobile }
  };
};

const DistrictStats: React.FC<DistrictStatsProps> = ({ district, isExpanded, onOpenCalculator }) => {
  const data = district || {
    id: 'oslo',
    name: 'Oslo',
    priceChange: CITY_AVERAGE.priceTrend,
    avgDaysOnMarket: CITY_AVERAGE.daysOnMarket,
    pricePerSqm: CITY_AVERAGE.avgSqmPrice,
    medianPrice: CITY_AVERAGE.medianPrice * 1000000,
    description: '',
    lat: 59.9139,
    lng: 10.7522
  };

  const compTexts = district ? getComparisonTexts(district) : null;
  const osloTextColor = 'text-[#0b1018]';

  if (!district) {
    return (
      <div className="h-full flex items-center animate-in fade-in duration-700">
        <div className="max-w-[1050px] mx-auto px-4 md:px-10 w-full py-3.5 md:py-4">
          <div className="grid grid-cols-4 gap-2 md:gap-4 w-full">
            <StatItem label="Prisendring" value={`+${data.priceChange}%`} color={osloTextColor} labelColor={osloTextColor} center small />
            <StatItem
              label="Salgstid"
              value={<>{data.avgDaysOnMarket} <span className="md:inline hidden">dager</span><span className="md:hidden inline">D</span></>}
              color={osloTextColor}
              labelColor={osloTextColor}
              center
              small
            />
            <StatItem label="Medianpris" value={`${(data.medianPrice / 1000000).toFixed(1)}M`} color={osloTextColor} labelColor={osloTextColor} center small />
            <StatItem label="Per M2" value={`${(data.pricePerSqm / 1000).toFixed(0)} K`} color={osloTextColor} labelColor={osloTextColor} center small />
          </div>
        </div>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div className="flex flex-col animate-in fade-in duration-300">
        <div className="flex items-center py-3.5 md:py-4 px-4 md:px-10 border-b border-slate-800/10">
           <div className="grid grid-cols-4 gap-2 md:gap-4 w-full max-w-7xl mx-auto">
              <StatItem label="Prisendring" value={`+${data.priceChange}%`} color={getTrendColor(data.priceChange)} small center />
              <StatItem
                label="Salgstid"
                value={<>{data.avgDaysOnMarket} <span className="md:inline hidden">dager</span><span className="md:hidden inline">D</span></>}
                color={getDaysColor(data.avgDaysOnMarket)}
                small
                center
              />
              <StatItem label="Medianpris" value={`${(data.medianPrice / 1000000).toFixed(1)}M`} color={getMedianColor(data.medianPrice)} small center />
              <StatItem label="Per M2" value={`${(data.pricePerSqm / 1000).toFixed(0)} K`} color={getSqmColor(data.pricePerSqm)} small center />
           </div>
        </div>
        <button 
          onClick={onOpenCalculator}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 uppercase tracking-[0.2em] transition-all active:scale-[0.99] shadow-[0_-10px_20px_rgba(37,99,235,0.2)] text-[10px] md:text-sm"
        >
          Hva er boligen din på {data.name} verdt?
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in slide-in-from-bottom-4 duration-500">
      <div className="pt-4 pb-1 px-3 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-4">
          <StatBox
            title="Prisendring"
            value={`+${data.priceChange}%`}
            colorClass={getTrendColor(data.priceChange)}
            icon={<TrendingUp />}
            desktopDesc={compTexts?.trend.desktop || "Gjennomsnittlig vekst."}
            mobileDesc={compTexts?.trend.mobile || "Normal vekst."}
          />

          <StatBox
            title="Salgstid"
            value={<>{data.avgDaysOnMarket} <span className="md:inline hidden">dager</span><span className="md:hidden inline">D</span></>}
            colorClass={getDaysColor(data.avgDaysOnMarket)}
            icon={<Clock />}
            desktopDesc={compTexts?.days.desktop || "Normal etterspørsel."}
            mobileDesc={compTexts?.days.mobile || "Normal etterspørsel."}
          />

          <StatBox
            title="Medianpris"
            value={`${(data.medianPrice / 1000000).toFixed(1)}M`}
            colorClass={getMedianColor(data.medianPrice)}
            icon={<BarChart3 />}
            desktopDesc={compTexts?.median.desktop || "Normalt prisnivå."}
            mobileDesc={compTexts?.median.mobile || "Normalt nivå."}
          />

          <StatBox
            title="Per m2"
            value={`${(data.pricePerSqm / 1000).toFixed(0)} K`}
            colorClass={getSqmColor(data.pricePerSqm)}
            icon={<Coins />}
            desktopDesc={compTexts?.sqm.desktop || "Normalt prisnivå."}
            mobileDesc={compTexts?.sqm.mobile || "Normalt nivå."}
          />
        </div>
      </div>

      <button 
        onClick={onOpenCalculator}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 md:py-4 uppercase tracking-[0.2em] transition-all active:scale-[0.99] shadow-[0_-10px_20px_rgba(37,99,235,0.2)] text-[10px] md:text-sm"
      >
        Hva er boligen din på {data.name} verdt?
      </button>
    </div>
  );
};

const StatItem = ({ label, value, color, small, center, labelColor = "text-slate-500" }: { label: string, value: React.ReactNode, color: string, small?: boolean, center?: boolean, labelColor?: string }) => (
  <div className={center ? 'text-center' : 'text-left'}>
    <div className={`${color} font-black ${small ? 'text-xl md:text-3xl' : 'text-2xl md:text-5xl'} tracking-tighter mb-0.5 md:mb-1 transition-colors duration-500`}>{value}</div>
    <div className={`${labelColor} text-[8px] md:text-[10px] font-bold tracking-[0.15em] leading-tight uppercase`}>{label}</div>
  </div>
);

const StatBox = ({ title, value, colorClass, icon, desktopDesc, mobileDesc }: { title: string, value: React.ReactNode, colorClass: string, icon: React.ReactElement, desktopDesc: string, mobileDesc: string }) => (
  <div className="bg-slate-900/40 rounded-[1rem] p-2 md:p-4 border border-white/5 hover:border-blue-500/20 transition-all group">
    <div className="flex items-start justify-between mb-0 md:mb-3">
      <div className={`${colorClass} font-black text-lg md:text-2xl tracking-tighter transition-colors duration-500`}>{value}</div>
      <div className={`${colorClass} opacity-70`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 14, strokeWidth: 2.5 })}
      </div>
    </div>
    <div className="space-y-0 md:space-y-1">
      {/* Oppdatert label til uppercase og økt tracking */}
      <h4 className="text-[8px] md:text-[10px] font-bold text-slate-500 tracking-[0.15em] uppercase">{title}</h4>
      <p className="hidden md:block text-[12px] text-slate-400 leading-tight font-medium opacity-90 line-clamp-2">
        {desktopDesc}
      </p>
      <p className="block md:hidden text-[9px] text-slate-400 leading-[1.1] font-medium opacity-80 line-clamp-2">
        {mobileDesc}
      </p>
    </div>
  </div>
);

export default DistrictStats;
