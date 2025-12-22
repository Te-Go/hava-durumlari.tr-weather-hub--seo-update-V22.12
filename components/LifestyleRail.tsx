
import React, { useRef } from 'react';
import { LifestyleIndex, WeatherData } from '../types';
import GlassCard from './GlassCard';
import { Icon } from './Icons';
import { calculateLifestyleIndexes } from '../services/weatherService';

interface LifestyleRailProps {
  data: WeatherData;
}

const LifestyleRail: React.FC<LifestyleRailProps> = ({ data }) => {
  // Safety Guard: If data is missing (during loading or error), do not render
  if (!data) return null;

  const indexes = calculateLifestyleIndexes(data);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    if (status === 'good') return 'bg-green-500 dark:bg-emerald-400';
    if (status === 'moderate') return 'bg-orange-500 dark:bg-amber-400';
    return 'bg-red-500 dark:bg-rose-400';
  };

  const getIcon = (iconName: string) => {
    if (iconName === 'Footprints') return <Icon.Sun className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
    if (iconName === 'Baby') return <Icon.Sun className="w-5 h-5 text-pink-500 dark:text-pink-400" />;
    if (iconName === 'Heart') return <Icon.Droplets className="w-5 h-5 text-rose-500 dark:text-rose-400" />;
    if (iconName === 'Shield') return <Icon.AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
    if (iconName === 'Flame') return <Icon.Flame className="w-5 h-5 text-red-500 dark:text-red-400" />;
    if (iconName === 'Fish') return <Icon.Fish className="w-5 h-5 text-teal-500 dark:text-teal-400" />;
    if (iconName === 'Car') return <Icon.Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    if (iconName === 'Sprout') return <Icon.Sprout className="w-5 h-5 text-green-600 dark:text-green-500" />;
    if (iconName === 'Bike') return <Icon.Bike className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
    return <Icon.Sun className="w-5 h-5 text-slate-500" />;
  };

  return (
    <GlassCard className="flex flex-col relative h-full" noPadding>
      {/* Compact Header */}
      <div className="px-3 py-2 border-b border-glass-border dark:border-dark-border">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center text-sm">
          <span className="text-base mr-1.5">🧬</span> Günlük Yaşam
        </h3>
      </div>

      {/* 
          COMPACT LAYOUT: 3x3 grid for 9 items when at 50% width
          Mobile: Scrollable rail
          Desktop: 3-column grid with smaller cards
       */}
      <div
        ref={scrollRef}
        className="
           w-full p-2
           flex overflow-x-auto gap-2 snap-x snap-mandatory touch-pan-x no-scrollbar 
           md:grid md:grid-cols-3 md:gap-2 md:overflow-visible
         "
      >
        {indexes.map((idx) => (
          <div
            key={idx.id}
            className="
                 flex-shrink-0 w-[100px] md:w-auto h-[85px] 
                 bg-slate-50/80 dark:bg-slate-700/40 
                 border border-slate-200/60 dark:border-white/5 rounded-lg 
                 p-1.5 flex flex-col items-center justify-center text-center 
                 hover:bg-slate-100 hover:border-slate-300/80 hover:shadow-sm hover:scale-[1.02] 
                 dark:hover:bg-slate-600 transition-all duration-200
                 snap-start
               "
          >
            <div className="p-1 bg-white/50 dark:bg-slate-800 rounded-full shadow-sm mb-0.5">
              {getIcon(idx.icon)}
            </div>

            <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              {idx.name}
            </span>

            <div className="flex items-center justify-center space-x-1 bg-white/30 dark:bg-black/20 px-1.5 py-0.5 rounded-full mt-0.5">
              <span className={`w-1 h-1 rounded-full ${getStatusColor(idx.status)}`}></span>
              <span className={`text-[9px] font-bold uppercase ${idx.status === 'good' ? 'text-green-700 dark:text-emerald-300/90' :
                (idx.status === 'moderate' ? 'text-orange-700 dark:text-amber-300/90' :
                  'text-red-700 dark:text-rose-300/90')
                }`}>
                {idx.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default LifestyleRail;
