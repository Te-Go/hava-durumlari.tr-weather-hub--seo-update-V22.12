import React, { useState, useEffect, useMemo } from 'react';
import { WeatherData, HistoricalData } from '../types';
import { getHistoricalData } from '../services/weatherService';
import GlassCard from './GlassCard';
import { Icon } from './Icons';
import {
    ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    ReferenceLine, CartesianGrid, BarChart, Bar
} from 'recharts';

interface HistoricalChartProps {
    weatherData: WeatherData;
}

type TabType = 'temperature' | 'precipitation';

const HistoricalChart: React.FC<HistoricalChartProps> = ({ weatherData }) => {
    const [activeTab, setActiveTab] = useState<TabType>('temperature');
    const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showHighs, setShowHighs] = useState(true);
    const [showLows, setShowLows] = useState(true);
    const [showAverage, setShowAverage] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!weatherData?.coord) return;
            setIsLoading(true);
            try {
                const data = await getHistoricalData(
                    weatherData.coord.lat,
                    weatherData.coord.lon,
                    weatherData.city
                );
                setHistoricalData(data);
            } catch (e) {
                console.error('Failed to load historical data', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [weatherData?.city]);

    // Helper to get day of year
    const getDayOfYear = (dateStr: string): number => {
        const date = new Date(dateStr);
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    // Transform data for chart
    const chartData = useMemo(() => {
        if (!historicalData || historicalData.last12Months.length === 0) return [];

        // Create lookup for 10-year averages
        const avgLookup: { [doy: number]: { avgHigh: number; avgLow: number; avgPrecip: number } } = {};
        historicalData.tenYearAvg.forEach(avg => {
            avgLookup[avg.dayOfYear] = { avgHigh: avg.avgHigh, avgLow: avg.avgLow, avgPrecip: avg.avgPrecip };
        });

        // Sample data to avoid too many points (every 3rd day)
        const sampled = historicalData.last12Months.filter((_, i) => i % 3 === 0);

        return sampled.map(day => {
            const doy = getDayOfYear(day.date);
            const avg = avgLookup[doy] || { avgHigh: 15, avgLow: 5, avgPrecip: 1 };
            const date = new Date(day.date);
            const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

            return {
                date: day.date,
                label: `${date.getDate()} ${monthNames[date.getMonth()]}`,
                month: monthNames[date.getMonth()],
                high: day.high,
                low: day.low,
                precip: day.precip,
                avgHigh: avg.avgHigh,
                avgLow: avg.avgLow,
                avgPrecip: avg.avgPrecip
            };
        });
    }, [historicalData]);

    // Find today's position for reference line
    const todayIndex = chartData.length - 1;

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-white/20 dark:border-slate-600 text-sm">
                    <p className="font-bold text-slate-700 dark:text-slate-200 mb-2">{data.label}</p>
                    {activeTab === 'temperature' ? (
                        <>
                            {showHighs && <p className="text-red-500">Yüksek: {data.high}°C</p>}
                            {showLows && <p className="text-blue-500">Düşük: {data.low}°C</p>}
                            {showAverage && (
                                <>
                                    <p className="text-gray-400 text-xs mt-1">10 Yıl Ort: {data.avgHigh}° / {data.avgLow}°</p>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-blue-500">Yağış: {data.precip} mm</p>
                            {showAverage && <p className="text-gray-400 text-xs">10 Yıl Ort: {data.avgPrecip} mm</p>}
                        </>
                    )}
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <GlassCard className="p-6">
                <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="ml-3 text-slate-500">Geçmiş veriler yükleniyor...</span>
                </div>
            </GlassCard>
        );
    }

    if (!historicalData || chartData.length === 0) {
        return null; // Don't render if no data
    }

    return (
        <GlassCard className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Icon.Sun size={20} className="text-blue-500" />
                        Hava Durumu Eğilimleri
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Son 12 ay ve 10 yıl ortalaması • {weatherData.city}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('temperature')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'temperature'
                            ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                    >
                        🌡️ Sıcaklık
                    </button>
                    <button
                        onClick={() => setActiveTab('precipitation')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'precipitation'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                    >
                        🌧️ Yağış
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[280px] md:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'temperature' ? (
                        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                domain={['dataMin - 5', 'dataMax + 5']}
                                tickFormatter={(v) => `${v}°`}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {/* Daily High Area */}
                            {showHighs && (
                                <Area
                                    type="monotone"
                                    dataKey="high"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    fill="url(#highGradient)"
                                    name="Günlük Yüksek"
                                />
                            )}

                            {/* Daily Low Area */}
                            {showLows && (
                                <Area
                                    type="monotone"
                                    dataKey="low"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="url(#lowGradient)"
                                    name="Günlük Düşük"
                                />
                            )}

                            {/* 10-Year Average Lines */}
                            {showAverage && (
                                <>
                                    <Line
                                        type="monotone"
                                        dataKey="avgHigh"
                                        stroke="#fca5a5"
                                        strokeWidth={2}
                                        strokeDasharray="6 4"
                                        dot={false}
                                        name="10 Yıl Yüksek Ort."
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="avgLow"
                                        stroke="#93c5fd"
                                        strokeWidth={2}
                                        strokeDasharray="6 4"
                                        dot={false}
                                        name="10 Yıl Düşük Ort."
                                    />
                                </>
                            )}

                            {/* Today marker */}
                            <ReferenceLine
                                x={chartData[todayIndex]?.month}
                                stroke="#10b981"
                                strokeWidth={2}
                                label={{ value: 'Bugün', position: 'top', fontSize: 11, fill: '#10b981' }}
                            />
                        </ComposedChart>
                    ) : (
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `${v}mm`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="precip"
                                fill="url(#precipGradient)"
                                radius={[4, 4, 0, 0]}
                                name="Yağış"
                            />
                            {showAverage && (
                                <Line
                                    type="monotone"
                                    dataKey="avgPrecip"
                                    stroke="#06b6d4"
                                    strokeWidth={2}
                                    strokeDasharray="6 4"
                                    dot={false}
                                    name="10 Yıl Ort."
                                />
                            )}
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Legend / Toggles */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs">
                {activeTab === 'temperature' && (
                    <>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showHighs}
                                onChange={(e) => setShowHighs(e.target.checked)}
                                className="w-4 h-4 rounded border-red-300 text-red-500 focus:ring-red-500"
                            />
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-0.5 bg-red-500 rounded"></span>
                                Günlük Yüksek
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showLows}
                                onChange={(e) => setShowLows(e.target.checked)}
                                className="w-4 h-4 rounded border-blue-300 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-0.5 bg-blue-500 rounded"></span>
                                Günlük Düşük
                            </span>
                        </label>
                    </>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showAverage}
                        onChange={(e) => setShowAverage(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-gray-500 focus:ring-gray-500"
                    />
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-0.5 bg-gray-400 rounded border-dashed"></span>
                        10 Yıl Ortalaması
                    </span>
                </label>
            </div>
        </GlassCard>
    );
};

export default HistoricalChart;
