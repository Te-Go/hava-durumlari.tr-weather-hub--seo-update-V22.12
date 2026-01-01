import React from 'react';
import TrafficWidget from './TrafficWidget';
import MarineWidget from './MarineWidget';
import SkiConditions from './SkiConditions';
import RegionalSummary from './RegionalSummary';
import AgricultureWidget from './AgricultureWidget';
import AltitudeWidget from './AltitudeWidget';
import FireRiskWidget from './FireRiskWidget';
import TourismWidget from './TourismWidget';
import IslandNarration, { generateIslandNarratives } from './IslandNarration';

import type { TomTomTrafficData } from '../services/tomtomTrafficService';
import type { MarineData } from '../services/marineService';
import type { SkiData } from '../services/skiService';
import type { AgricultureData } from '../services/agricultureService';
import type { AltitudeData } from '../services/altitudeService';
import type { FireRiskData } from '../services/fireRiskService';
import type { TourismData } from '../services/tourismService';
import type { IslandCategory } from '../shared/provinceIslandMap';

interface IslandPanelProps {
    // Existing data types
    traffic?: TomTomTrafficData | null;
    marine?: MarineData | null;
    ski?: SkiData | null;

    // New data types
    agriculture?: AgricultureData | null;
    altitude?: AltitudeData | null;
    fireRisk?: FireRiskData | null;
    tourism?: TourismData | null;

    // Display props
    cityDisplay: string;
    trafficCityDisplay?: string;
    marineCityDisplay?: string;
    fallbackNarrative: string;

    // Optional: show narration box
    showNarration?: boolean;
}

/**
 * IslandPanel - Unified container for contextual weather widgets
 * 
 * Layout Logic (Mobile-First):
 * - Mobile: Vertical stack (flex-col)
 * - Desktop: Side-by-side grid for 2+ widgets, centered for 1 widget
 * - Narration box below widgets for SEO
 */
const IslandPanel: React.FC<IslandPanelProps> = ({
    traffic,
    marine,
    ski,
    agriculture,
    altitude,
    fireRisk,
    tourism,
    cityDisplay,
    trafficCityDisplay,
    marineCityDisplay,
    fallbackNarrative,
    showNarration = true
}) => {
    // Determine which widgets are active
    const hasTraffic = !!traffic;
    const hasMarine = !!marine;
    const hasSki = !!ski;
    const hasAgriculture = !!agriculture;
    const hasAltitude = !!altitude;
    const hasFireRisk = !!fireRisk && fireRisk.isFireSeason;
    const hasTourism = !!tourism;

    // Build active categories list (for narration)
    const activeCategories: IslandCategory[] = [];
    if (hasTraffic) activeCategories.push('traffic');
    if (hasMarine) activeCategories.push('marine');
    if (hasSki) activeCategories.push('ski');
    if (hasAgriculture) activeCategories.push('agriculture');
    if (hasAltitude) activeCategories.push('altitude');
    if (hasFireRisk) activeCategories.push('fireRisk');
    if (hasTourism) activeCategories.push('tourism');

    const widgetCount = activeCategories.length;
    const lastUpdated = Date.now();

    // Derive narratives for each category
    const trafficNarrative = traffic?.congestionLevel === 'high'
        ? 'Trafik yoğunluğu yüksek.'
        : 'Trafik akıcı.';
    const marineNarrative = marine ? `Deniz suyu ${marine.seaTemp}°C.` : '';
    const skiNarrative = ski ? `Kar kalınlığı ${ski.snowDepth}cm.` : '';

    // Build narratives object for IslandNarration
    const narratives: Record<IslandCategory, string> = {
        traffic: generateIslandNarratives('traffic', traffic, cityDisplay),
        marine: generateIslandNarratives('marine', marine, cityDisplay),
        ski: generateIslandNarratives('ski', ski, cityDisplay),
        agriculture: generateIslandNarratives('agriculture', agriculture, cityDisplay),
        altitude: generateIslandNarratives('altitude', altitude, cityDisplay),
        fireRisk: generateIslandNarratives('fireRisk', fireRisk, cityDisplay),
        tourism: generateIslandNarratives('tourism', tourism, cityDisplay),
    };

    // If no widgets, show fallback
    if (widgetCount === 0) {
        return (
            <div className="mt-6">
                <RegionalSummary
                    narrative={fallbackNarrative}
                    cityDisplay={cityDisplay}
                />
            </div>
        );
    }

    // Dynamic grid classes
    // Mobile: stack vertically
    // Desktop: 2-col grid for 2+ widgets, centered single widget for 1
    const gridClasses = widgetCount === 1
        ? 'flex flex-col items-center'
        : 'flex flex-col md:grid md:grid-cols-2 gap-4';

    const singleWidgetClasses = widgetCount === 1
        ? 'w-full md:max-w-lg'
        : 'w-full';

    return (
        <>
            <div className={`mt-6 ${gridClasses}`}>
                {/* Traffic Widget */}
                {hasTraffic && (
                    <div className={`${singleWidgetClasses} ${widgetCount > 1 ? 'mb-4 md:mb-0' : ''}`}>
                        <TrafficWidget
                            city={cityDisplay}
                            cityDisplay={trafficCityDisplay || cityDisplay}
                            data={traffic}
                            narrative={trafficNarrative}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                )}

                {/* Marine Widget */}
                {hasMarine && (
                    <div className={singleWidgetClasses}>
                        <MarineWidget
                            data={marine}
                            cityDisplay={marineCityDisplay}
                            narrative={marineNarrative}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                )}

                {/* Ski Widget */}
                {hasSki && ski && (
                    <div className={singleWidgetClasses}>
                        <SkiConditions
                            data={ski}
                            narrative={skiNarrative}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                )}

                {/* Agriculture Widget */}
                {hasAgriculture && agriculture && (
                    <div className={singleWidgetClasses}>
                        <AgricultureWidget
                            data={agriculture}
                            cityDisplay={cityDisplay}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                )}

                {/* Altitude Widget */}
                {hasAltitude && altitude && (
                    <div className={singleWidgetClasses}>
                        <AltitudeWidget
                            data={altitude}
                            cityDisplay={cityDisplay}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                )}

                {/* Fire Risk Widget */}
                {hasFireRisk && fireRisk && (
                    <div className={singleWidgetClasses}>
                        <FireRiskWidget
                            data={fireRisk}
                            cityDisplay={cityDisplay}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                )}

                {/* Tourism Widget */}
                {hasTourism && tourism && (
                    <div className={singleWidgetClasses}>
                        <TourismWidget
                            data={tourism}
                            cityDisplay={cityDisplay}
                            lastUpdated={lastUpdated}
                        />
                    </div>
                )}
            </div>

            {/* SEO Narration Box */}
            {showNarration && activeCategories.length > 0 && (
                <IslandNarration
                    cityDisplay={cityDisplay}
                    activeCategories={activeCategories}
                    narratives={narratives}
                    lastUpdated={lastUpdated}
                />
            )}
        </>
    );
};

export default IslandPanel;
