import React, { useState } from 'react';
import VitalityPulse from '../components/VitalityPulse';

// Fixed Slot Contract Constants
const SLOT_COUNT = 4;
const ROUTE_HEIGHT = 45;

interface TrafficData {
    congestionLevel: 'low' | 'medium' | 'high' | 'severe';
    mainRoutes: Array<{ name: string; delay: number }>;
}

interface Props {
    city: string;
    cityDisplay: string;
    data?: TrafficData;
    narrative?: string;
    lastUpdated: number;
}

/**
 * Traffic Widget (Metro Cities Only)
 * Shows real-time traffic congestion and route delays
 * Fixed Slot Contract: 250px height with 4 visible routes
 */
const TrafficWidget: React.FC<Props> = ({
    city,
    cityDisplay,
    data,
    narrative,
    lastUpdated
}) => {
    const [expanded, setExpanded] = useState(false);
    const routes = data?.mainRoutes || [];

    // Fixed Slot Contract: Always show exactly SLOT_COUNT items
    const visibleRoutes = expanded ? routes : routes.slice(0, SLOT_COUNT);
    const emptySlots = expanded ? 0 : Math.max(0, SLOT_COUNT - routes.length);
    const hasMore = routes.length > SLOT_COUNT;

    const congestionColors: Record<string, { bg: string; text: string; label: string }> = {
        low: { bg: 'bg-green-500', text: 'text-green-700', label: 'Akıcı' },
        medium: { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'Yoğun' },
        high: { bg: 'bg-orange-500', text: 'text-orange-700', label: 'Çok Yoğun' },
        severe: { bg: 'bg-red-500', text: 'text-red-700', label: 'Kilitli' },
    };

    const congestion = congestionColors[data?.congestionLevel || 'low'];

    return (
        <div
            className="sinan-traffic-widget bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
            style={{ minHeight: 'var(--sinan-slot-height, 250px)' }}
        >
            {/* Header: 50px fixed */}
            <div className="h-[50px] px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🚗</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 dark:text-white text-sm">Trafik Durumu</h2>
                        <span className="text-xs text-slate-500">{cityDisplay}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${congestion.bg}`}>
                        {congestion.label}
                    </span>
                    <VitalityPulse lastUpdated={lastUpdated} />
                </div>
            </div>

            {/* Narrative: 60px fixed */}
            <div className="h-[60px] p-3 bg-slate-50 dark:bg-slate-900/50 border-l-4 border-blue-500 text-sm text-slate-700 dark:text-slate-300 overflow-hidden flex items-center">
                <p className="line-clamp-2">{narrative || 'Trafik verisi yükleniyor...'}</p>
            </div>

            {/* Routes: SLOT_COUNT × ROUTE_HEIGHT = 180px */}
            <div className="px-4">
                {visibleRoutes.map((route, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 last:border-0"
                        style={{ height: ROUTE_HEIGHT }}
                    >
                        <span className="text-slate-700 dark:text-slate-300 text-sm truncate max-w-[70%]">
                            {route.name}
                        </span>
                        <span className={`text-sm font-medium ${route.delay > 20 ? 'text-red-500' : route.delay > 10 ? 'text-orange-500' : 'text-slate-500'}`}>
                            +{route.delay} dk
                        </span>
                    </div>
                ))}

                {/* FILLER SLOTS: Maintain fixed height */}
                {Array.from({ length: emptySlots }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        style={{ height: ROUTE_HEIGHT }}
                        aria-hidden="true"
                    />
                ))}
            </div>

            {/* View More: User-triggered expansion (no CLS penalty) */}
            {hasMore && !expanded && (
                <button
                    onClick={() => setExpanded(true)}
                    className="w-full h-[40px] text-blue-500 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 border-t border-slate-100 dark:border-slate-700 transition-colors"
                >
                    +{routes.length - SLOT_COUNT} daha fazla göster
                </button>
            )}

            {hasMore && expanded && (
                <button
                    onClick={() => setExpanded(false)}
                    className="w-full h-[40px] text-slate-500 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 border-t border-slate-100 dark:border-slate-700 transition-colors"
                >
                    Daha az göster
                </button>
            )}
        </div>
    );
};

export default TrafficWidget;
