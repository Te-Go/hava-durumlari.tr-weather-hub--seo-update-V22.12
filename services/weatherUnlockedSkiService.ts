import { SkiData } from './skiService';

// Resort Map (User Provided IDs)
const RESORT_IDS: Record<string, string> = {
    'uludag': '54887323',
    'erciyes': '54887317',
    'palandoken': '54887319',
    'kartalkaya': '54887315',
    'sarikamis': '54888529',
    'davraz': '54888519',
    'saklikent': '54888733',
    'ilgaz': '54888525',
    'konakli': '54888527',
    'spil': '54887321', // Spil Mountain
};

export async function fetchWeatherUnlockedSki(city: string): Promise<SkiData | null> {
    const cityKey = city.toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');

    const resortId = RESORT_IDS[cityKey];
    if (!resortId) return null;

    try {
        // Use PHP Proxy
        const url = `/wp-json/sinan/v1/ski?id=${resortId}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Proxy error');

        const data = await response.json();
        const forecast = data.forecast?.[0]; // Today's forecast

        if (!forecast) return null;

        // Map forecast data to SkiData model
        // Note: This API provides FORECAST, not live lift status.
        // We use forecast data to populate the widget.

        const baseTemp = forecast.base?.temp_c ?? 0;
        const freshSnow = forecast.base?.fresh_snow_cm ?? 0;
        const windSpeed = forecast.base?.windspd_kmh ?? 0;
        const weatherCode = forecast.base?.wx_code ?? 0;

        // Determine simple status/icon
        const conditions = getWeatherCondition(weatherCode);

        return {
            resortName: getProjectedResortName(cityKey),
            status: 'Tahmin', // Explicitly label as Forecast
            runsOpen: '-',
            totalRuns: '-',
            liftsOpen: '-',
            totalLifts: '-',
            snowDepthBase: freshSnow, // Using fresh snow as proxy or just show forecast snow
            snowDepthSummit: forecast.upper?.fresh_snow_cm ?? 0,
            lastSnowDate: freshSnow > 0 ? 'Bugün' : 'Yakında',

            // Current Conditions (Forecasted)
            weatherIcon: conditions.icon,
            temperature: baseTemp,
            windSpeed: windSpeed,
            visibility: '-',

            lastUpdated: Date.now()
        };

    } catch (e) {
        console.error('Ski Forecast Fetch Error:', e);
        return null;
    }
}

function getProjectedResortName(key: string): string {
    const names: Record<string, string> = {
        'uludag': 'Uludağ',
        'erciyes': 'Erciyes',
        'palandoken': 'Palandöken',
        'kartalkaya': 'Kartalkaya',
        'sarikamis': 'Sarıkamış',
        'davraz': 'Davraz',
        'saklikent': 'Saklıkent',
    };
    return names[key] || key;
}

function getWeatherCondition(code: number): { text: string; icon: any } {
    // Basic mapping for Weather Unlocked codes (0-3 clear, 50+ snow)
    if (code >= 50) return { text: 'Kar Yağışlı', icon: 'snow' };
    if (code >= 20) return { text: 'Bulutlu', icon: 'cloud' };
    return { text: 'Açık', icon: 'sun' };
}
