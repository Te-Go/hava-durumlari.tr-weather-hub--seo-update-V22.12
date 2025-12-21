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

// City-Region mapping for SEO entity signals (All 81 Provinces)
// Format: Province -> Geographic Region
export const CITY_REGIONS: Record<string, string> = {
    // =========================================================================
    // MARMARA REGION (11 provinces)
    // =========================================================================
    'İstanbul': 'Marmara',
    'Bursa': 'Marmara',
    'Kocaeli': 'Marmara',
    'Sakarya': 'Marmara',
    'Tekirdağ': 'Marmara',
    'Balıkesir': 'Marmara',
    'Edirne': 'Marmara',
    'Kırklareli': 'Marmara',
    'Çanakkale': 'Marmara',
    'Yalova': 'Marmara',
    'Bilecik': 'Marmara',

    // =========================================================================
    // İÇ ANADOLU REGION (13 provinces)
    // =========================================================================
    'Ankara': 'İç Anadolu',
    'Konya': 'İç Anadolu',
    'Kayseri': 'İç Anadolu',
    'Eskişehir': 'İç Anadolu',
    'Sivas': 'İç Anadolu',
    'Aksaray': 'İç Anadolu',
    'Nevşehir': 'İç Anadolu',
    'Niğde': 'İç Anadolu',
    'Kırşehir': 'İç Anadolu',
    'Kırıkkale': 'İç Anadolu',
    'Yozgat': 'İç Anadolu',
    'Karaman': 'İç Anadolu',
    'Çankırı': 'İç Anadolu',

    // =========================================================================
    // EGE REGION (8 provinces)
    // =========================================================================
    'İzmir': 'Ege',
    'Denizli': 'Ege',
    'Aydın': 'Ege',
    'Muğla': 'Ege',
    'Manisa': 'Ege',
    'Afyonkarahisar': 'Ege',
    'Kütahya': 'Ege',
    'Uşak': 'Ege',

    // =========================================================================
    // AKDENİZ REGION (8 provinces)
    // =========================================================================
    'Antalya': 'Akdeniz',
    'Adana': 'Akdeniz',
    'Mersin': 'Akdeniz',
    'Hatay': 'Akdeniz',
    'Kahramanmaraş': 'Akdeniz',
    'Osmaniye': 'Akdeniz',
    'Isparta': 'Akdeniz',
    'Burdur': 'Akdeniz',

    // =========================================================================
    // KARADENİZ REGION (18 provinces)
    // =========================================================================
    'Samsun': 'Karadeniz',
    'Trabzon': 'Karadeniz',
    'Ordu': 'Karadeniz',
    'Giresun': 'Karadeniz',
    'Rize': 'Karadeniz',
    'Artvin': 'Karadeniz',
    'Zonguldak': 'Karadeniz',
    'Kastamonu': 'Karadeniz',
    'Sinop': 'Karadeniz',
    'Amasya': 'Karadeniz',
    'Tokat': 'Karadeniz',
    'Çorum': 'Karadeniz',
    'Bolu': 'Karadeniz',
    'Düzce': 'Karadeniz',
    'Karabük': 'Karadeniz',
    'Bartın': 'Karadeniz',
    'Bayburt': 'Karadeniz',
    'Gümüşhane': 'Karadeniz',

    // =========================================================================
    // DOĞU ANADOLU REGION (14 provinces)
    // =========================================================================
    'Erzurum': 'Doğu Anadolu',
    'Malatya': 'Doğu Anadolu',
    'Elazığ': 'Doğu Anadolu',
    'Van': 'Doğu Anadolu',
    'Ağrı': 'Doğu Anadolu',
    'Erzincan': 'Doğu Anadolu',
    'Kars': 'Doğu Anadolu',
    'Iğdır': 'Doğu Anadolu',
    'Ardahan': 'Doğu Anadolu',
    'Muş': 'Doğu Anadolu',
    'Bitlis': 'Doğu Anadolu',
    'Hakkari': 'Doğu Anadolu',
    'Bingöl': 'Doğu Anadolu',
    'Tunceli': 'Doğu Anadolu',

    // =========================================================================
    // GÜNEYDOĞU ANADOLU REGION (9 provinces)
    // =========================================================================
    'Gaziantep': 'Güneydoğu Anadolu',
    'Diyarbakır': 'Güneydoğu Anadolu',
    'Şanlıurfa': 'Güneydoğu Anadolu',
    'Mardin': 'Güneydoğu Anadolu',
    'Batman': 'Güneydoğu Anadolu',
    'Siirt': 'Güneydoğu Anadolu',
    'Şırnak': 'Güneydoğu Anadolu',
    'Adıyaman': 'Güneydoğu Anadolu',
    'Kilis': 'Güneydoğu Anadolu',
};

// Helper function to get region for a city
export const getCityRegion = (city: string): string | undefined => {
    return CITY_REGIONS[city];
};

// Types for type-safe usage
export type CityName = typeof REGULAR_CITIES[number];
export type SeasonalSpot = typeof SEASONAL_SPOTS[number];
export type ArticleCategory = typeof ARTICLE_CATEGORIES[number];

