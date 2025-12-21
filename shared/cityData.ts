/**
 * Centralized City Data - Single Source of Truth
 * 
 * This file eliminates duplicate city arrays across components.
 * Used by: Navigation, Footer, CityIndex, SeasonalRail
 */

// Regular cities for main navigation and footer
export const REGULAR_CITIES = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Adana', 'Gaziantep', 'Konya', 'Antalya',
    'Diyarbakır', 'Mersin', 'Kayseri', 'Eskişehir', 'Gebze', 'Çankaya', 'Bağcılar',
    'Samsun', 'Denizli', 'Şanlıurfa', 'Kahramanmaraş', 'Üsküdar', 'Van',
    'Bahçelievler', 'Ümraniye', 'Malatya', 'Esenler', 'Batman', 'Erzurum'
] as const;

// Seasonal spots (Winter/Ski resorts)
export const SEASONAL_SPOTS = [
    { name: 'Erciyes', type: 'Kayak', icon: '🏔️' },
    { name: 'Uludağ', type: 'Kayak', icon: '⛷️' },
    { name: 'Palandöken', type: 'Kayak', icon: '🏂' },
    { name: 'Saklıkent', type: 'Kayak', icon: '❄️' },
    { name: 'Davraz', type: 'Kayak', icon: '🚠' },
] as const;

// Archive/Article categories
export const ARTICLE_CATEGORIES = ['Tümü', 'Şehir', 'Tarım', 'Bilim', 'Yaşam', 'Sağlık', 'Bahçe'] as const;

// Types for type-safe usage
export type CityName = typeof REGULAR_CITIES[number];
export type SeasonalSpot = typeof SEASONAL_SPOTS[number];
export type ArticleCategory = typeof ARTICLE_CATEGORIES[number];
