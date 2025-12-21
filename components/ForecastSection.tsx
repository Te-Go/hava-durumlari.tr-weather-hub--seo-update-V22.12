
import React, { useState, useRef, useEffect } from 'react';
import { WeatherData, HourlyForecast } from '../types';
import GlassCard from './GlassCard';
import { Icon } from './Icons';
import { CONFIG } from '../services/weatherService';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

// Type for selected metric in drawer
type MetricType = 'feelsLike' | 'uv' | 'humidity' | null;

// Mini Sparkline Chart Component for drawer metrics
interface MetricSparklineProps {
  metric: MetricType;
  hourlyData: HourlyForecast[];
  dayFeelsLike: number;
}

const MetricSparkline: React.FC<MetricSparklineProps> = ({ metric, hourlyData, dayFeelsLike }) => {
  // Use first 24 hours of data
  const chartData = hourlyData.slice(0, 24).map((h, idx) => ({
    time: h.time.split(':')[0],
    temp: Math.round(h.temp),
    // Approximate feels-like based on wind chill (simplified)
    feelsLike: Math.round(h.temp - (h.windSpeed > 10 ? 2 : 0) - (h.precipProb > 50 ? 1 : 0)),
    precipProb: h.precipProb,
    // Approximate humidity: higher in morning/evening, lower midday (simplified pattern)
    humidity: Math.round(60 + 20 * Math.cos((idx - 6) * Math.PI / 12)),
    // UV approximation: peaks at noon, zero at night
    uv: idx >= 6 && idx <= 18 ? Math.round(6 * Math.sin((idx - 6) * Math.PI / 12)) : 0,
    windSpeed: h.windSpeed
  }));

  const metricLabels: Record<string, string> = {
    feelsLike: '24 Saatlik Sıcaklık Karşılaştırması',
    uv: '24 Saatlik UV İndeksi',
    humidity: '24 Saatlik Nem ve Yağış Olasılığı'
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-white/20 dark:border-slate-600 text-xs">
          <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{label}:00</p>
          {metric === 'feelsLike' && (
            <>
              <p className="text-orange-500">Gerçek: {payload[0]?.value}°</p>
              <p className="text-purple-500">Hissedilen: {payload[1]?.value}°</p>
            </>
          )}
          {metric === 'humidity' && (
            <>
              <p className="text-blue-500">Nem: {payload[0]?.value}%</p>
              <p className="text-cyan-500">Yağış: {payload[1]?.value}%</p>
            </>
          )}
          {metric === 'uv' && <p className="text-amber-500">UV: {payload[0]?.value}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-3 pt-3 border-t border-blue-100/50 dark:border-slate-600/50 animate-fadeIn">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
        <Icon.ArrowUp size={14} />
        {metricLabels[metric || 'feelsLike']}
      </p>
      <div className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'feelsLike' ? (
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} fill="url(#tempGradient)" name="Gerçek" />
              <Line type="monotone" dataKey="feelsLike" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Hissedilen" />
            </ComposedChart>
          ) : metric === 'humidity' ? (
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} fill="url(#humidityGradient)" name="Nem" />
              <Line type="monotone" dataKey="precipProb" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Yağış" />
            </ComposedChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="uv" stroke="#f59e0b" strokeWidth={2} fill="url(#uvGradient)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Legend for dual-line charts */}
      {metric === 'feelsLike' && (
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-500 rounded"></span> Gerçek Sıcaklık</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-purple-500 rounded border-dashed"></span> Hissedilen</span>
        </div>
      )}
      {metric === 'humidity' && (
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 rounded"></span> Nem %</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-500 rounded"></span> Yağış Olasılığı</span>
        </div>
      )}
    </div>
  );
};

interface ForecastSectionProps {
  data: WeatherData;
  focusTomorrow?: boolean;
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ data, focusTomorrow = false }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<{ day: string; metric: MetricType } | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dailySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusTomorrow) {
      setExpandedDay('Yarın');
    }
  }, [focusTomorrow]);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
    // Reset metric selection when closing drawer
    if (expandedDay === day) {
      setSelectedMetric(null);
    }
  };

  const toggleMetric = (day: string, metric: MetricType) => {
    if (selectedMetric?.day === day && selectedMetric?.metric === metric) {
      setSelectedMetric(null);
    } else {
      setSelectedMetric({ day, metric });
    }
  };

  const scrollHourly = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.75;

      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getForecastIcon = (iconName: string, size: number = 24) => {
    switch (iconName) {
      case 'sunny': return <Icon.Sun size={size} className="text-orange-400" />;
      case 'moon': return <Icon.Moon size={size} className="text-slate-400" />;
      case 'cloudy': return <Icon.Cloud size={size} className="text-slate-400" />;
      case 'cloudy-night': return <Icon.Cloud size={size} className="text-slate-500" />;
      case 'overcast': return <Icon.Cloud size={size} className="text-slate-500" />;
      case 'rain': return <Icon.CloudRain size={size} className="text-blue-400" />;
      case 'drizzle': return <Icon.CloudRain size={size} className="text-blue-300" />;
      case 'storm': return <Icon.CloudLightning size={size} className="text-amber-500" />;
      case 'snow': return <Icon.CloudSnow size={size} className="text-cyan-300" />;
      case 'fog': return <Icon.CloudFog size={size} className="text-slate-400" />;
      default: return <Icon.Cloud size={size} className="text-slate-400" />;
    }
  };

  // Map icon names to Turkish weather descriptions
  const getWeatherDescription = (iconName: string): string => {
    switch (iconName) {
      case 'sunny': return 'Güneşli';
      case 'moon': return 'Açık (Gece)';
      case 'cloudy': return 'Parçalı Bulutlu';
      case 'cloudy-night': return 'Bulutlu (Gece)';
      case 'overcast': return 'Kapalı';
      case 'rain': return 'Yağmurlu';
      case 'drizzle': return 'Çisenti';
      case 'storm': return 'Fırtınalı';
      case 'snow': return 'Karlı';
      case 'fog': return 'Sisli';
      default: return 'Parçalı Bulutlu';
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 15 Day Vertical */}
        <div className="flex-1 min-w-0" ref={dailySectionRef}>
          <GlassCard className="flex flex-col h-full relative" noPadding>
            <div className="p-5 pb-2 border-b border-glass-border dark:border-dark-border">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">15 Günlük Tahmin</h3>
            </div>

            <div className="max-h-none md:max-h-[500px] overflow-y-visible md:overflow-y-auto custom-scrollbar divide-y divide-blue-50 dark:divide-slate-700 relative pb-4">
              {data.daily.map((day) => (
                <div key={day.day} className={`group transition-colors ${expandedDay === day.day ? 'bg-blue-50/30 dark:bg-slate-700/30' : ''}`}>
                  <button onClick={() => toggleDay(day.day)} className="w-full flex items-center justify-between p-4 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors min-h-[64px]">
                    {/* Column 1: Day + Date */}
                    <div className="flex items-center min-w-[100px]">
                      <span className={`font-medium ${day.day === 'Yarın' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>{day.day}</span>
                      <span className="text-xs text-slate-400 ml-1.5">{day.date}</span>
                    </div>
                    {/* Column 2: Weather Icon */}
                    <div className="flex items-center justify-center min-w-[40px]">{getForecastIcon(day.icon, 24)}</div>
                    {/* Column 3: Description (short weather text) */}
                    <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400 min-w-[120px] text-center truncate">
                      {day.description || getWeatherDescription(day.icon)}
                    </div>
                    {/* Column 4: Rain Probability */}
                    <div className="flex items-center bg-blue-50/80 dark:bg-slate-700 px-2 py-1 rounded-md min-w-[55px] justify-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <Icon.Droplets size={12} className="mr-1 text-blue-500" />{day.rainProb}%
                    </div>
                    {/* Column 5: Wind */}
                    <div className="hidden sm:flex items-center bg-slate-50/80 dark:bg-slate-700 px-2 py-1 rounded-md min-w-[55px] justify-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <Icon.Wind size={12} className="mr-1 text-slate-400" />{day.wind.split(' ')[0]}
                    </div>
                    {/* Column 6: Temperatures */}
                    <div className="flex items-center space-x-2 min-w-[70px] justify-end">
                      <span className="text-slate-800 dark:text-white font-semibold">{Math.round(day.high)}°</span>
                      <span className="text-slate-400 dark:text-slate-500 font-light">{Math.round(day.low)}°</span>
                    </div>
                    {/* Column 7: Chevron */}
                    <Icon.ChevronRight className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${expandedDay === day.day ? 'rotate-90' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-500 ease-out overflow-hidden ${expandedDay === day.day ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="min-h-0">
                      <div className="bg-blue-50/30 dark:bg-slate-800/30 p-4 grid grid-cols-3 gap-3 text-xs border-t border-blue-50/50 dark:border-slate-700 shadow-inner">
                        {/* 1. Feels Like - CLICKABLE */}
                        <button
                          onClick={() => toggleMetric(day.day, 'feelsLike')}
                          className={`flex flex-col items-center bg-white/60 dark:bg-slate-700/60 p-3 rounded-xl border shadow-sm transition-all active:scale-95 cursor-pointer
                              ${selectedMetric?.day === day.day && selectedMetric?.metric === 'feelsLike'
                              ? 'border-purple-400 ring-2 ring-purple-200 dark:ring-purple-800'
                              : 'border-white/50 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600'}`}
                        >
                          <Icon.Thermometer size={18} className="text-purple-400 mb-2" />
                          <span className="text-slate-400 dark:text-slate-500 mb-1">Sıcaklık / Hissedilen</span>
                          <span className="font-bold text-slate-600 dark:text-slate-200 text-sm">{Math.round(day.feelsLike)}°</span>
                        </button>
                        {/* 2. UV Index - CLICKABLE */}
                        <button
                          onClick={() => toggleMetric(day.day, 'uv')}
                          className={`flex flex-col items-center bg-white/60 dark:bg-slate-700/60 p-3 rounded-xl border shadow-sm transition-all active:scale-95 cursor-pointer
                              ${selectedMetric?.day === day.day && selectedMetric?.metric === 'uv'
                              ? 'border-amber-400 ring-2 ring-amber-200 dark:ring-amber-800'
                              : 'border-white/50 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-600'}`}
                        >
                          <Icon.Sun size={18} className="text-orange-400 mb-2" />
                          <span className="text-slate-400 dark:text-slate-500 mb-1">UV İndeksi</span>
                          <span className="font-bold text-slate-600 dark:text-slate-200 text-sm">{Math.round(day.uvIndex)}</span>
                        </button>
                        {/* 3. Humidity + Rain - CLICKABLE */}
                        <button
                          onClick={() => toggleMetric(day.day, 'humidity')}
                          className={`flex flex-col items-center bg-white/60 dark:bg-slate-700/60 p-3 rounded-xl border shadow-sm transition-all active:scale-95 cursor-pointer
                              ${selectedMetric?.day === day.day && selectedMetric?.metric === 'humidity'
                              ? 'border-cyan-400 ring-2 ring-cyan-200 dark:ring-cyan-800'
                              : 'border-white/50 dark:border-slate-600 hover:border-cyan-300 dark:hover:border-cyan-600'}`}
                        >
                          <Icon.Droplets size={18} className="text-cyan-400 mb-2" />
                          <span className="text-slate-400 dark:text-slate-500 mb-1">Nem / Yağış</span>
                          <span className="font-bold text-slate-600 dark:text-slate-200 text-sm">{day.humidity}% / {day.rainProb}%</span>
                        </button>
                      </div>
                      {/* SPARKLINE CHART - Shows when metric selected */}
                      {selectedMetric?.day === day.day && selectedMetric.metric && (
                        <div className="px-4 pb-4 bg-blue-50/30 dark:bg-slate-800/30">
                          <MetricSparkline
                            metric={selectedMetric.metric}
                            hourlyData={data.hourly}
                            dayFeelsLike={day.feelsLike}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Hint Fade (Visible only on Desktop with overflow) */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 dark:from-slate-800/80 to-transparent pointer-events-none hidden md:block rounded-b-3xl"></div>

            {/* FORCE VISIBLE SCROLLBAR */}
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
                display: block; 
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent; 
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #94a3b8; 
                border-radius: 20px;
                border: 2px solid transparent;
                background-clip: content-box;
              }
              .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #475569; 
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #64748b; 
              }
            `}</style>
          </GlassCard>
        </div>

        {/* Sidebar Ads (Two Static Square 300x250 Units) */}
        {/* UPDATED: Hidden on XL screens because the main App Right Sidebar takes over */}
        <div className="hidden md:flex xl:hidden flex-col gap-6 w-[300px] flex-shrink-0">
          {/* Ad 1: Travel */}
          <div className="bg-glass-white/40 dark:bg-slate-800/40 border border-glass-border dark:border-dark-border rounded-3xl h-[250px] flex items-center justify-center shadow-glass relative overflow-hidden group cursor-pointer">
            {CONFIG.ads?.square ? (
              <div className="w-full h-full overflow-hidden" dangerouslySetInnerHTML={{ __html: CONFIG.ads.square }} />
            ) : (
              <>
                <img
                  src="https://picsum.photos/300/250?random=88"
                  alt="Reklam"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-blue-600 w-fit px-2 py-0.5 rounded mb-1">Sponsorlu</span>
                  <p className="text-sm font-bold text-white leading-tight">Yaz Tatili Erken Rezervasyon Fırsatları</p>
                </div>
              </>
            )}
          </div>

          {/* Ad 2: Energy (Converted to Square, Removed Sticky) */}
          <div className="bg-glass-white/40 dark:bg-slate-800/40 border border-glass-border dark:border-dark-border rounded-3xl h-[250px] flex items-center justify-center shadow-glass relative overflow-hidden group cursor-pointer">
            {CONFIG.ads?.vertical ? (
              <div className="w-full h-full overflow-hidden" dangerouslySetInnerHTML={{ __html: CONFIG.ads.vertical }} />
            ) : (
              <>
                <img
                  src="https://picsum.photos/300/250?random=99"
                  alt="Reklam"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-green-600 w-fit px-2 py-0.5 rounded mb-1">Enerji</span>
                  <p className="text-sm font-bold text-white leading-tight">Eviniz İçin Güneş Paneli Çözümleri</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForecastSection;
