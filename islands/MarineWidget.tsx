import React from 'react';
import VitalityPulse from '../components/VitalityPulse';

interface MarineData {
    seaTemp: number;
    waveHeight: number;
    windSpeed: number;
    ferryStatus?: 'normal' | 'delayed' | 'cancelled';
}

interface Props {
    data?: MarineData;
    narrative?: string;
    lastUpdated: number;
    cityDisplay?: string;
}

/**
 * Marine Widget (Coastal Cities Only)
 * Shows sea temperature, wave height, wind speed, and ferry status
 * Fixed Slot Contract: 220px height
 */
const MarineWidget: React.FC<Props> = ({ data, narrative, lastUpdated, cityDisplay }) => {
    const ferryStatusConfig: Record<string, { color: string; label: string }> = {
        normal: { color: 'bg-green-500', label: 'Normal' },
        delayed: { color: 'bg-yellow-500', label: 'Gecikmeli' },
        cancelled: { color: 'bg-red-500', label: 'İptal' },
    };

    const ferryConfig = ferryStatusConfig[data?.ferryStatus || 'normal'];

    return (
        <div
            className="sinan-marine-widget bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 mt-4"
            style={{ minHeight: 'var(--sinan-slot-height, 220px)' }}
        >
            {/* Header: 50px */}
            <div className="h-[50px] px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🌊</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 dark:text-white text-sm">Deniz Durumu</h2>
                        {cityDisplay && <span className="text-xs text-slate-500 dark:text-slate-400 block -mt-0.5">{cityDisplay}</span>}
                    </div>
                </div>
                <VitalityPulse lastUpdated={lastUpdated} />
            </div>

            {/* Narrative: 50px */}
            <div className="h-[50px] px-4 py-2 text-sm text-slate-600 dark:text-slate-300 flex items-center">
                <p className="line-clamp-2">{narrative || 'Deniz verisi yükleniyor...'}</p>
            </div>

            {/* Metrics Grid: 120px */}
            <div className="grid grid-cols-2 h-[100px] mt-0 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex flex-col items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors border-r border-slate-200 dark:border-slate-700">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">{data?.seaTemp ?? '--'}°</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sıcaklık</div>
                </div>
                <div className="flex flex-col items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">{data?.waveHeight ?? '--'}m</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dalga</div>
                </div>
            </div>

            {/* Footer Link */}
            <a
                href="/deniz-suyu-sicakligi"
                className="h-[36px] px-4 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
                Tüm Türkiye Deniz Sıcaklıkları →
            </a>
        </div>
    );
};

export default MarineWidget;
