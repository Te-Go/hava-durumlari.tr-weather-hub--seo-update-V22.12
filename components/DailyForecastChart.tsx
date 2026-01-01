import React, { useRef } from 'react';
import { DailyForecast } from '../types';
import GlassCard from './GlassCard';
import { Icon } from './Icons';

interface DailyForecastChartProps {
    dailyData: DailyForecast[];
    cityName: string;
}

// Helper for Icons
const getChartIcon = (iconName: string, size: number = 20) => {
    switch (iconName) {
        case 'sunny': return <Icon.Sun size={size} className="text-orange-400 drop-shadow-sm" />;
        case 'moon': return <Icon.Moon size={size} className="text-indigo-300 drop-shadow-sm" />;
        case 'cloudy': return <Icon.Cloud size={size} className="text-slate-400" />;
        case 'cloudy-night': return <Icon.Cloud size={size} className="text-slate-500" />;
        case 'overcast': return <Icon.Cloud size={size} className="text-slate-500" />;
        case 'rain': return <Icon.CloudRain size={size} className="text-blue-400" />;
        case 'drizzle': return <Icon.CloudRain size={size} className="text-blue-300" />;
        case 'snow': return <Icon.CloudSnow size={size} className="text-cyan-300" />;
        case 'storm': return <Icon.CloudLightning size={size} className="text-amber-500" />;
        case 'fog': return <Icon.CloudFog size={size} className="text-slate-400" />;
        default: return <Icon.Cloud size={size} className="text-slate-400" />;
    }
};

/**
 * Generate a 15-day weather trend analysis in Turkish
 */
function generateTrendAnalysis(data: DailyForecast[], cityName: string): {
    summary: string;
    stats: {
        avgHigh: number;
        avgLow: number;
        rainyDays: number;
        warmestDay: { day: string; temp: number };
        coldestDay: { day: string; temp: number };
        trend: 'warming' | 'cooling' | 'stable';
    };
} {
    if (data.length === 0) {
        return {
            summary: 'Tahmin verisi mevcut değil.',
            stats: { avgHigh: 0, avgLow: 0, rainyDays: 0, warmestDay: { day: '', temp: 0 }, coldestDay: { day: '', temp: 0 }, trend: 'stable' }
        };
    }

    // Calculate statistics
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const avgHigh = Math.round(highs.reduce((a, b) => a + b, 0) / highs.length);
    const avgLow = Math.round(lows.reduce((a, b) => a + b, 0) / lows.length);

    // Rainy days calculation
    // Data flow: dailyData.daily[].rainProb comes from Open-Meteo API precipitation_probability_max
    // A day is counted as "rainy" if rainProb > 50%
    // This uses the full 15-day data slice passed to this function
    const rainyDays = data.filter(d => d.rainProb > 50).length;

    // Warmest and coldest days
    const maxHigh = Math.max(...highs);
    const minLow = Math.min(...lows);
    const warmestDay = data.find(d => d.high === maxHigh) || data[0];
    const coldestDay = data.find(d => d.low === minLow) || data[0];

    // Trend: Compare first 5 days avg with last 5 days avg
    const firstHalf = data.slice(0, 5);
    const lastHalf = data.slice(-5);
    const firstAvg = firstHalf.reduce((a, b) => a + b.high, 0) / firstHalf.length;
    const lastAvg = lastHalf.reduce((a, b) => a + b.high, 0) / lastHalf.length;
    const tempDiff = lastAvg - firstAvg;

    let trend: 'warming' | 'cooling' | 'stable' = 'stable';
    if (tempDiff > 3) trend = 'warming';
    else if (tempDiff < -3) trend = 'cooling';

    // Generate summary text
    const trendText = trend === 'warming'
        ? 'Sıcaklıklar yükseliş eğiliminde.'
        : trend === 'cooling'
            ? 'Önümüzdeki günlerde soğuma bekleniyor.'
            : 'Sıcaklıklar genel olarak stabil kalacak.';

    const rainText = rainyDays === 0
        ? 'Yağmur beklenmiyor.'
        : rainyDays === 1
            ? '1 gün yağış olasılığı var.'
            : `${rainyDays} gün yağışlı geçebilir.`;

    const tempRangeText = `Sıcaklıklar ${Math.round(minLow)}° ile ${Math.round(maxHigh)}° arasında seyredecek.`;

    const extremeText = `En sıcak gün ${warmestDay.day} (${Math.round(warmestDay.high)}°), en soğuk gece ${coldestDay.day} (${Math.round(coldestDay.low)}°).`;

    const summary = `${cityName} için 15 günlük tahmin özeti: ${tempRangeText} ${trendText} ${rainText} ${extremeText}`;

    return {
        summary,
        stats: {
            avgHigh,
            avgLow,
            rainyDays,
            warmestDay: { day: warmestDay.day, temp: Math.round(warmestDay.high) },
            coldestDay: { day: coldestDay.day, temp: Math.round(coldestDay.low) },
            trend
        }
    };
}

/**
 * DailyForecastChart - 15-day visual forecast with chart and trend analysis
 */
const DailyForecastChart: React.FC<DailyForecastChartProps> = ({ dailyData, cityName }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const data = dailyData.slice(0, 15);

    // Generate trend analysis
    const { summary, stats } = generateTrendAnalysis(data, cityName);

    // Temperature range for graph positioning
    const allTemps = data.flatMap(d => [d.high, d.low]);
    const minTemp = Math.min(...allTemps);
    const maxTemp = Math.max(...allTemps);
    const tempRange = maxTemp - minTemp || 1;

    // Scroll handlers
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = 240;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

    // Chart dimensions
    const cardWidth = 80; // Wider cards for daily view
    const graphHeight = 60;
    const graphTopOffset = 100;

    // Generate SVG paths for high and low temperatures
    const highPoints = data.map((d, i) => ({
        x: i * cardWidth + cardWidth / 2,
        y: graphHeight - ((d.high - minTemp) / tempRange) * (graphHeight - 16) - 8
    }));

    const lowPoints = data.map((d, i) => ({
        x: i * cardWidth + cardWidth / 2,
        y: graphHeight - ((d.low - minTemp) / tempRange) * (graphHeight - 16) - 8
    }));

    const highPath = highPoints.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');
    const lowPath = lowPoints.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');

    // Area fill between high and low
    const areaPath = highPath +
        ` L ${highPoints[highPoints.length - 1].x},${lowPoints[lowPoints.length - 1].y}` +
        lowPoints.slice().reverse().map((p) => ` L ${p.x},${p.y}`).join('') +
        ` L ${highPoints[0].x},${highPoints[0].y} Z`;

    // Trend icon
    const getTrendIcon = () => {
        switch (stats.trend) {
            case 'warming': return <Icon.ArrowUp size={16} className="text-orange-500" />;
            case 'cooling': return <Icon.ArrowDown size={16} className="text-blue-500" />;
            default: return <Icon.ArrowRight size={16} className="text-slate-400" />;
        }
    };

    return (
        <div className="mt-6 flex flex-col gap-4">
            {/* 15-Day Visual Chart */}
            <GlassCard className="flex flex-col" noPadding>
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100/80 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-gradient-to-b from-orange-400 to-red-500 rounded-full" />
                        <h3 className="font-bold text-slate-700 dark:text-slate-200">15 Günlük Sıcaklık Grafiği</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        {getTrendIcon()}
                        <span className="capitalize">
                            {stats.trend === 'warming' ? 'Isınma' : stats.trend === 'cooling' ? 'Soğuma' : 'Stabil'}
                        </span>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="relative group h-[280px]">
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg border border-white/50 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hidden md:flex"
                    >
                        <Icon.ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg border border-white/50 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hidden md:flex"
                    >
                        <Icon.ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>

                    {/* Scrollable Rail */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto snap-x snap-mandatory relative h-full"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* SVG Graph Background */}
                        <svg
                            className="absolute left-0 pointer-events-none z-0"
                            style={{ top: `${graphTopOffset}px` }}
                            width={data.length * cardWidth}
                            height={graphHeight}
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <linearGradient id="dailyTempGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            {/* Area fill between high and low */}
                            <path d={areaPath} fill="url(#dailyTempGradient)" />
                            {/* High temperature line */}
                            <path d={highPath} stroke="#f97316" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            {/* Low temperature line */}
                            <path d={lowPath} stroke="#3b82f6" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            {/* Data points for high */}
                            {highPoints.map((p, i) => (
                                <circle key={`high-${i}`} cx={p.x} cy={p.y} r={3} fill="#f97316" stroke="white" strokeWidth={1.5} />
                            ))}
                            {/* Data points for low */}
                            {lowPoints.map((p, i) => (
                                <circle key={`low-${i}`} cx={p.x} cy={p.y} r={3} fill="#3b82f6" stroke="white" strokeWidth={1.5} />
                            ))}
                        </svg>

                        {/* Day Cards */}
                        {data.map((day, index) => (
                            <div
                                key={`${day.day}-${index}`}
                                className={`snap-start flex-shrink-0 flex flex-col items-center pt-4 pb-2 relative z-10 transition-all hover:scale-105 border-r border-slate-100/50 dark:border-slate-700/30
                                    ${day.rainProb > 50 ? 'bg-gradient-to-b from-blue-100/40 to-transparent dark:from-blue-900/20' : 'bg-gradient-to-b from-amber-50/30 to-transparent dark:from-slate-800/20'}`}
                                style={{ width: `${cardWidth}px` }}
                            >
                                {/* Day Name */}
                                <span className={`text-[11px] font-bold mb-1 ${day.day === 'Yarın' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {day.day?.slice(0, 3) || 'Gün'}
                                </span>

                                {/* Date */}
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 mb-2">
                                    {day.date}
                                </span>

                                {/* Weather Icon */}
                                <div className="mb-2">
                                    {getChartIcon(day.icon, 24)}
                                </div>

                                {/* High Temperature */}
                                <span className="text-sm font-bold text-orange-500">
                                    {Math.round(day.high)}°
                                </span>

                                {/* Spacer for graph */}
                                <div className="h-[60px]" />

                                {/* Low Temperature */}
                                <span className="text-sm font-semibold text-blue-500">
                                    {Math.round(day.low)}°
                                </span>

                                {/* Precipitation */}
                                <div className="flex flex-col items-center mt-2">
                                    {day.rainProb > 0 ? (
                                        <div className="flex items-center gap-0.5">
                                            <Icon.Droplets size={10} className="text-blue-400" />
                                            <span className="text-[10px] text-blue-500 font-medium">{day.rainProb}%</span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-slate-300 dark:text-slate-600">-</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex justify-between items-center px-4 py-2 border-t border-slate-100/80 dark:border-slate-700/50 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-0.5 bg-orange-500 rounded-full" />
                            <span>Yüksek</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-0.5 bg-blue-500 rounded-full" />
                            <span>Düşük</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Icon.Droplets size={10} className="text-blue-400" />
                            <span>Yağış %</span>
                        </div>
                    </div>
                    <span className="text-slate-400">
                        {stats.avgHigh}° / {stats.avgLow}° ort.
                    </span>
                </div>
            </GlassCard>

            {/* Trend Analysis Summary */}
            <GlassCard className="p-4">
                <div className="flex flex-col gap-4">
                    {/* SEO Title for crawlers */}
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">15 Günlük Özet</h3>

                    {/* Header with badges */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-lg flex items-center justify-center">
                                <Icon.BarChart size={16} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="font-medium text-slate-600 dark:text-slate-300">Trend Analizi</span>
                        </div>

                        {/* Quick Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Trend Badge */}
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stats.trend === 'warming'
                                ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'
                                : stats.trend === 'cooling'
                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}>
                                {getTrendIcon()}
                                {stats.trend === 'warming' ? 'Isınma Trendi' : stats.trend === 'cooling' ? 'Soğuma Trendi' : 'Stabil'}
                            </span>

                            {/* Rainy Days Badge */}
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
                                <Icon.Droplets size={12} />
                                {stats.rainyDays === 0 ? 'Yağış Yok' : `${stats.rainyDays} Gün Yağışlı`}
                            </span>
                        </div>
                    </div>

                    {/* Temperature Range Bars - Separate for Daytime and Nighttime */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Daytime Temperatures */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                    ☀️ Gündüz Sıcaklıkları
                                </span>
                                <span className="text-xs text-slate-400">
                                    {Math.round(Math.min(...dailyData.slice(0, 15).map(d => d.high)))}° — {Math.round(Math.max(...dailyData.slice(0, 15).map(d => d.high)))}°
                                </span>
                            </div>
                            <div className="relative h-5 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 rounded-full overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-700 dark:text-slate-200 shadow">
                                        Ort: {stats.avgHigh}°
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Nighttime Temperatures */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                    🌙 Gece Sıcaklıkları
                                </span>
                                <span className="text-xs text-slate-400">
                                    {Math.round(Math.min(...dailyData.slice(0, 15).map(d => d.low)))}° — {Math.round(Math.max(...dailyData.slice(0, 15).map(d => d.low)))}°
                                </span>
                            </div>
                            <div className="relative h-5 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-400 rounded-full overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-700 dark:text-slate-200 shadow">
                                        Ort: {stats.avgLow}°
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Week Summaries */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Week 1 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border-l-4 border-blue-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">📅 1. Hafta</span>
                                <span className="text-[10px] text-slate-400">(1-7 gün)</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-300">
                                    {Math.round(dailyData.slice(0, 7).reduce((a, b) => a + b.high, 0) / Math.max(dailyData.slice(0, 7).length, 1))}° / {Math.round(dailyData.slice(0, 7).reduce((a, b) => a + b.low, 0) / Math.max(dailyData.slice(0, 7).length, 1))}°
                                </span>
                                <span className="text-cyan-600 dark:text-cyan-400 text-xs">
                                    {dailyData.slice(0, 7).filter(d => d.rainProb > 50).length} gün yağışlı
                                </span>
                            </div>
                        </div>

                        {/* Week 2 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border-l-4 border-purple-500">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">📅 2. Hafta</span>
                                <span className="text-[10px] text-slate-400">(8-15 gün)</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-300">
                                    {Math.round(dailyData.slice(7, 15).reduce((a, b) => a + b.high, 0) / Math.max(dailyData.slice(7, 15).length, 1))}° / {Math.round(dailyData.slice(7, 15).reduce((a, b) => a + b.low, 0) / Math.max(dailyData.slice(7, 15).length, 1))}°
                                </span>
                                <span className="text-cyan-600 dark:text-cyan-400 text-xs">
                                    {dailyData.slice(7, 15).filter(d => d.rainProb > 50).length} gün yağışlı
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Warmest Day & Coldest Night Highlights */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-3 border border-orange-200 dark:border-orange-800/50">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🔥</span>
                                <div>
                                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{stats.warmestDay.temp}°</div>
                                    <div className="text-[10px] text-orange-700 dark:text-orange-300 font-medium">En Sıcak Gün: {stats.warmestDay.day}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800/50">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">❄️</span>
                                <div>
                                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.coldestDay.temp}°</div>
                                    <div className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">En Soğuk Gece: {stats.coldestDay.day}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Text */}
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">15 Günlük Açıklaması</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {summary}
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default DailyForecastChart;
