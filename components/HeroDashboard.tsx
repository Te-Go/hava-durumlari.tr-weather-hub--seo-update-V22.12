
import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import GlassCard from './GlassCard';
import { WeatherIcon3D, Icon } from './Icons';
import HourlyMeteogram from './HourlyMeteogram';
import AlertBar from './AlertBar';
import { toSlug } from '../services/weatherService';

// Sub-component for Live Clock (Compact Version)
const LiveClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right flex items-baseline gap-2">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        {time.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })}
      </span>
      <span className="text-xl font-light text-slate-800 dark:text-white tracking-tighter font-sans">
        {time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};





interface HeroDashboardProps {
  data: WeatherData;
  badgeText?: string;
  activeView: 'home' | 'tomorrow' | 'weekend';
  onToggleView: (view: 'home' | 'tomorrow' | 'weekend') => void;
}

const HeroDashboard: React.FC<HeroDashboardProps> = ({ data, badgeText = "Şimdi", activeView, onToggleView }) => {
  const citySlug = toSlug(data.city);
  const baseUrl = `/hava-durumu/${citySlug}`;
  const homeHref = baseUrl;
  const tomorrowHref = `${baseUrl}?gun=yarin`;
  const weekendHref = `${baseUrl}?gun=hafta-sonu`;

  return (
    <div className="flex flex-col gap-4 mb-6">

      <AlertBar data={data} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Weather (Left) */}
        <GlassCard className="md:col-span-1 relative flex flex-col justify-between h-[360px]">

          <div className="flex flex-col gap-3 mb-2">
            {/* Toggle Control - Real Navigation (Hybrid URL Model) */}
            <div className="flex bg-white/40 dark:bg-slate-700/50 p-1.5 rounded-xl border border-white/20 dark:border-white/5 backdrop-blur-md w-full">
              <a
                href={homeHref}
                onClick={(e) => { e.preventDefault(); onToggleView('home'); }}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold text-center transition-all ${activeView === 'home' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Bugün
              </a>
              <a
                href={tomorrowHref}
                onClick={(e) => { e.preventDefault(); onToggleView('tomorrow'); }}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold text-center transition-all ${activeView === 'tomorrow' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Yarın
              </a>
              <a
                href={weekendHref}
                onClick={(e) => { e.preventDefault(); onToggleView('weekend'); }}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold text-center transition-all ${activeView === 'weekend' ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Hafta Sonu
              </a>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${badgeText === 'Yarın' ? 'bg-indigo-500' : (badgeText === 'Hafta Sonu' ? 'bg-purple-500' : 'bg-blue-500')}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${badgeText === 'Yarın' ? 'text-indigo-600 dark:text-indigo-300' : (badgeText === 'Hafta Sonu' ? 'text-purple-600 dark:text-purple-300' : 'text-blue-600 dark:text-blue-300')}`}>
                GÖSTERİLEN: {badgeText.toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mt-2">
              <div>
                <h1 className="text-7xl font-light text-slate-800 dark:text-white tracking-tighter">
                  {Math.round(data.currentTemp)}°
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">{data.condition}</p>
              </div>
              <WeatherIcon3D type={data.icon} className="transform scale-150 mr-4" />
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-blue-50/50 dark:bg-slate-800/50 rounded-xl p-3 border border-blue-100/50 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">Öneri</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                {data.smartPhrase}
              </p>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 flex items-center justify-between">
              <span>Yüksek: {Math.round(data.high)}°</span>
              <span>Düşük: {Math.round(data.low)}°</span>
            </p>
          </div>
        </GlassCard>

        {/* 24-HOUR METEOGRAM (Right) - New Component */}
        <div className="md:col-span-2">
          <HourlyMeteogram
            hourlyData={data.hourly}
            sunrise={data.sunrise}
            sunset={data.sunset}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;
