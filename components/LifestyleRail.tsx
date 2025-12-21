
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
    <div className="mb-6">
      <GlassCard className="flex flex-col relative" noPadding>
        {/* Compact Header */}
        <div className="px-4 py-2 border-b border-glass-border dark:border-dark-border">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center text-sm">
            <span className="text-lg mr-2">🧬</span> Günlük Yaşam İndeksi
          </h3>
        </div>

        {/* 
            LAYOUT LOGIC FIX:
            Mobile (< md): Flex + Overflow (Scrollable Rail)
            Desktop (>= md): Grid (4 Columns x 2 Rows = 8 items, Perfectly Centered)
            Added gap-4 for better spacing in grid mode.
         */}
        <div
          ref={scrollRef}
          className="
             w-full p-3
             flex overflow-x-auto gap-3 snap-x snap-mandatory touch-pan-x no-scrollbar 
             md:grid md:grid-cols-3 md:gap-4 md:overflow-visible
           "
        >
          {indexes.map((idx) => (
            <div
              key={idx.id}
              className="
                   flex-shrink-0 w-[130px] md:w-auto h-[110px] 
                   bg-white/40 dark:bg-slate-700/40 
                   border border-white/30 dark:border-white/5 rounded-xl 
                   p-2 flex flex-col items-center justify-center text-center space-y-1 
                   hover:bg-white/60 dark:hover:bg-slate-600 transition-colors 
                   snap-start
                 "
            >
              <div className="p-1.5 bg-white/50 dark:bg-slate-800 rounded-full shadow-sm mb-0.5">
                {getIcon(idx.icon)}
              </div>

              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                {idx.name}
              </span>

              <div className="flex items-center justify-center space-x-1.5 bg-white/30 dark:bg-black/20 px-2 py-0.5 rounded-full mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(idx.status)}`}></span>
                <span className={`text-[10px] font-bold uppercase ${idx.status === 'good' ? 'text-green-700 dark:text-emerald-300/90' :
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
    </div>
  );
};

export default LifestyleRail;
