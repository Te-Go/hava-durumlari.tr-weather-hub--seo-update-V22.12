
import React, { useEffect, useState, ErrorInfo, ReactNode } from 'react';
import { getWeatherData, getWeatherDataByCoords, getMarketData, toSlug, fromSlug, fetchLiveArticles, trackEvent, getCityFromCoords, getTomorrowDashboardData, getWeekendDashboardData, initAnalytics, initAds, getUserPreferences, saveUserPreferences, getCityById } from './services/weatherService';
import { WeatherData, MarketTicker, NewsItem } from './types';
import TopBar from './components/TopBar';
import Navigation from './components/Navigation';
import HeroDashboard from './components/HeroDashboard';
import WeatherCommentaryGrid, { AnswerSummaryBar } from './components/WeatherCommentaryGrid';
import { generateWeatherCommentary, Timeframe } from './shared/weatherCommentary';
import ForecastSection from './components/ForecastSection';
import RadarNews from './components/RadarNews';
import HistoricalChart from './components/HistoricalChart';
import Footer from './components/Footer';
import CityIndex from './components/CityIndex';
import AdGrid from './components/AdGrid';
import LifestyleRail from './components/LifestyleRail';
import CookieBanner from './components/CookieBanner';
import HorizontalAd from './components/HorizontalAd';
// DesktopSidebarLeft removed from layout
import DesktopSidebarRight from './components/DesktopSidebarRight';
import NewsSection from './components/NewsSection';

type ViewState =
  | { type: 'home' }
  | { type: 'tomorrow' }
  | { type: 'weekend' }
  | { type: 'cities' };

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Crash:", error, errorInfo);
    trackEvent('app_crash', 'error', error.toString());
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-slate-500">
          Hata oluştu. <button className="text-blue-500 underline" onClick={() => window.location.reload()}>Yenile</button>
        </div>
      );
    }
    return this.props.children ?? null;
  }
}

interface AppProps {
  locationId?: number;
}

const App: React.FC<AppProps> = ({ locationId = 0 }) => {
  // OPTIMIZED STATE INITIALIZATION
  // We resolve the city synchronously to avoid a flash of default content (İstanbul) before the effect runs.
  // This ensures the App mounts with the Server-Injected Context immediately.
  const [currentCity, setCurrentCity] = useState<string>(() => {
    // PRIORITY ORDER FOR CITY RESOLUTION:
    // 1. URL Path (highest priority - user navigated directly to this URL)
    // 2. locationId prop (WordPress server context)
    // 3. localStorage (client persistence)
    // 4. Default (İstanbul)

    // 1. URL Path Extraction (Client-side navigation & direct links)
    // This takes priority because if the user navigated to /hava-durumu/ankara,
    // they expect to see Ankara weather, regardless of any other context.
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const segments = path.split('/').filter(Boolean);
      const citySlug = segments[segments.length - 1];

      // URL pattern: /hava-durumu/{city-slug} or /{view}/{city-slug}
      // Last segment is typically the city slug
      if (citySlug && citySlug !== 'yarin' && citySlug !== 'hafta-sonu' && citySlug !== 'hava-durumu') {
        const city = fromSlug(citySlug);
        if (city) {
          return city;
        }
      }
    }

    // 2. Server Context (WordPress locationId prop)
    // Only used when URL doesn't specify a city
    if (locationId > 0) {
      return getCityById(locationId);
    }

    // 3. Client Side Persistence (Fallback - localStorage)
    if (typeof window !== 'undefined') {
      const prefs = getUserPreferences();
      if (prefs.lastCity) {
        return prefs.lastCity;
      }
    }

    // 4. Default
    return 'İstanbul';
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [marketData, setMarketData] = useState<MarketTicker[]>([]);
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>({ type: 'home' });

  // DEBUG: Log mount state
  useEffect(() => {
    console.warn('🔴 [DEBUG-MOUNT] currentCity:', currentCity);
    console.warn('🔴 [DEBUG-MOUNT] URL path:', window.location.pathname);
    console.warn('🔴 [DEBUG-MOUNT] Expected city from slug:', fromSlug(window.location.pathname.split('/').pop() || ''));
  }, []);

  // THEME STATE INITIALIZATION (Lazy Initializer)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const prefs = getUserPreferences();
      if (prefs.theme === 'dark') return true;
      if (prefs.theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isManualTheme, setIsManualTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const prefs = getUserPreferences();
      return prefs.theme !== 'system';
    }
    return false;
  });

  // CONSENT & PREFERENCE LISTENER
  useEffect(() => {
    // 1. Load Consent & Analytics
    const checkConsent = () => {
      const prefs = getUserPreferences();
      if (prefs.consentStatus === 'accepted') {
        initAnalytics();
        initAds();
      }
    };
    checkConsent();
    window.addEventListener('storage', checkConsent);
    window.addEventListener('cookie_consent_updated', checkConsent);

    return () => {
      window.removeEventListener('storage', checkConsent);
      window.removeEventListener('cookie_consent_updated', checkConsent);
    };
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Tarayıcı konum özelliğini desteklemiyor.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          // 1. Get locality name from coordinates (for display & URL)
          const localityName = await getCityFromCoords(latitude, longitude);

          // 2. Fetch weather directly by coordinates (most accurate)
          const weatherData = await getWeatherDataByCoords(latitude, longitude, localityName);

          // 3. Update state
          setCurrentCity(localityName);
          setWeatherData(weatherData);

          // 4. Update URL (SEO-friendly)
          const slug = toSlug(localityName);
          window.history.pushState({ city: localityName }, '', `/hava-durumu/${slug}`);

          // 5. Save preference & track
          saveUserPreferences({ lastCity: localityName });
          trackEvent('use_location', 'gps', localityName);

        } catch (e) {
          console.error('GPS location error:', e);
          alert("Konum belirlenemedi. Lütfen tekrar deneyin.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert("Konum izni reddedildi. Lütfen tarayıcı ayarlarından konum iznini açın.");
        } else {
          alert("Konum alınamadı. Lütfen tekrar deneyin.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // GLOBAL DATA & VIEW ROUTING
  useEffect(() => {
    const initGlobalData = async () => {
      try {
        const tickers = await getMarketData();
        setMarketData(Array.isArray(tickers) ? tickers : []);
        const liveArticles = await fetchLiveArticles();
        setArticles(liveArticles);
      } catch (e) { console.error("Global Data Init Failed", e); }
    };
    initGlobalData();

    // View Resolution based on URL (Server routing support)
    // HYBRID MODEL: Check query param first (?gun=yarin), then legacy path (/yarin/)
    const urlParams = new URLSearchParams(window.location.search);
    const gunParam = urlParams.get('gun');
    const path = window.location.pathname;

    if (gunParam === 'yarin' || path.includes('yarin')) setView({ type: 'tomorrow' });
    else if (gunParam === 'hafta-sonu' || path.includes('hafta-sonu')) setView({ type: 'weekend' });

    // CRITICAL FIX: Extract city from URL on initial mount
    // This ensures the correct city is loaded when navigating directly to a city URL
    const segments = path.split('/').filter(Boolean);
    const citySlug = segments[segments.length - 1]; // Last segment is city slug
    console.log('[DEBUG] URL City Extraction:', { path, segments, citySlug });
    if (citySlug && citySlug !== 'yarin' && citySlug !== 'hafta-sonu' && citySlug !== 'hava-durumu') {
      const city = fromSlug(citySlug);
      console.log('[DEBUG] City resolved:', { citySlug, city });
      if (city) setCurrentCity(city);
    }

    // SPA Routing: Handle browser back/forward without full reload
    const handlePopState = () => {
      const path = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      const gunParam = urlParams.get('gun');

      // 1. Determine view type from URL (hybrid model: ?gun= or legacy path)
      if (gunParam === 'yarin' || path.includes('yarin')) {
        setView({ type: 'tomorrow' });
      } else if (gunParam === 'hafta-sonu' || path.includes('hafta-sonu')) {
        setView({ type: 'weekend' });
      } else {
        setView({ type: 'home' });
      }

      // 2. Extract and set city from URL slug
      const segments = path.split('/').filter(Boolean);
      const citySlug = segments[segments.length - 1]; // Last segment is city slug
      if (citySlug && citySlug !== 'yarin' && citySlug !== 'hafta-sonu' && citySlug !== 'hava-durumu') {
        const city = fromSlug(citySlug);
        if (city) setCurrentCity(city);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Run once on mount

  // Watch for locationId prop changes specifically (Dynamic Updates / Single Page Transitions if parent updates)
  // Watch for locationId prop changes (Dynamic Updates from WordPress parent)
  // IMPORTANT: Only override city if the URL doesn't already specify one
  // This prevents the hardcoded data-location-id from overwriting URL-based navigation
  useEffect(() => {
    if (locationId > 0) {
      // Check if URL already specifies a city
      const path = window.location.pathname;
      const segments = path.split('/').filter(Boolean);
      const citySlug = segments[segments.length - 1];
      const urlHasCity = citySlug && citySlug !== 'yarin' && citySlug !== 'hafta-sonu' && citySlug !== 'hava-durumu' && fromSlug(citySlug);

      // Only use locationId if URL doesn't have a valid city
      if (!urlHasCity) {
        const city = getCityById(locationId);
        setCurrentCity(city);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setIsManualTheme(true);
    // Save Preference
    saveUserPreferences({ theme: newMode ? 'dark' : 'light' });
    trackEvent('toggle_theme', 'ui', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    // AbortController to cancel pending requests when city/view changes
    const abortController = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const wData = await getWeatherData(currentCity);

        // Only update state if this request is still relevant
        if (isMounted && !abortController.signal.aborted) {
          if (wData?.daily && wData?.hourly) {
            setWeatherData(wData);
          } else {
            setWeatherData(null);
          }
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
        if (isMounted) {
          console.error("Weather Fetch Failed", e);
          setWeatherData(null);
        }
      }
      if (isMounted) setLoading(false);
    };

    // Only fetch if we are in a main weather view
    if (view.type === 'home' || view.type === 'tomorrow' || view.type === 'weekend') {
      fetchData();
    }

    // Cleanup: abort pending request and mark as unmounted
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [currentCity, view.type]);

  useEffect(() => {
    // Auto-Theme Logic (Only if user hasn't manually overridden via settings)
    if (weatherData && !isManualTheme) {
      if (weatherData.icon === 'moon' || weatherData.icon.includes('night') || weatherData.icon.includes('storm')) {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    }

    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });

    if (view.type === 'tomorrow') {
      document.title = `${currentCity} Yarınki Hava Durumu - ${tomorrowStr} | TG`;
    }
    else if (view.type === 'weekend') {
      document.title = `Hafta Sonu Hava Durumu - ${currentCity} | TG`;
    }
    else {
      document.title = `${currentCity} Hava Durumu - 15 Günlük Tahmin | TG`;
    }

    trackEvent('view_weather', 'city', currentCity);
  }, [weatherData, view.type, currentCity, isManualTheme]);

  const handleCityChange = (newCity: string) => {
    const prettyName = fromSlug(toSlug(newCity));
    setCurrentCity(prettyName);

    // Save to LocalStorage
    saveUserPreferences({ lastCity: prettyName });

    const slug = toSlug(prettyName);
    let prefix = '';
    if (view.type === 'tomorrow') prefix = '/yarin';
    else if (view.type === 'weekend') prefix = '/hafta-sonu';
    window.history.pushState({ city: prettyName }, '', `${prefix}/${slug}`);
    trackEvent('change_city', 'navigation', prettyName);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 200);
  };

  const handleViewToggle = (newView: 'home' | 'tomorrow' | 'weekend') => {
    setView({ type: newView });
    const slug = toSlug(currentCity);
    let prefix = '';
    if (newView === 'tomorrow') prefix = '/yarin';
    else if (newView === 'weekend') prefix = '/hafta-sonu';
    window.history.pushState({ city: currentCity }, '', `${prefix}/${slug}`);
    trackEvent('toggle_view', 'hero', newView);
  };

  const handleFooterNavigate = (dest: string) => {
    // Navigate to React-controlled views or update state for cities
    window.scrollTo(0, 0);

    if (dest === 'home') {
      setView({ type: 'home' });
      window.history.pushState({ city: currentCity }, '', `/${toSlug(currentCity)}`);
    }
    else if (dest === 'tomorrow') {
      setView({ type: 'tomorrow' });
      window.history.pushState({ city: currentCity }, '', `/yarin/${toSlug(currentCity)}`);
    }
    else if (dest === 'weekend') {
      setView({ type: 'weekend' });
      window.history.pushState({ city: currentCity }, '', `/hafta-sonu/${toSlug(currentCity)}`);
    }
    else if (dest === 'cities') {
      setView({ type: 'cities' });
    }
    else if (dest.startsWith('city:')) {
      const city = dest.split(':')[1];
      setCurrentCity(city);
      setView({ type: 'home' });
      window.history.pushState({ city }, '', `/${toSlug(city)}`);
    }
  };

  const renderView = () => {
    switch (view.type) {
      case 'home':
      case 'tomorrow':
      case 'weekend':
        let displayData = weatherData;
        if (weatherData) {
          if (view.type === 'tomorrow') displayData = getTomorrowDashboardData(weatherData);
          else if (view.type === 'weekend') displayData = getWeekendDashboardData(weatherData);
        }

        return (
          <>
            <Navigation
              currentCity={currentCity}
              onCityChange={handleCityChange}
              onLocationClick={handleUseLocation}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              activeView={view.type}
            />
            {/* Answer Summary Bar - Between City Rail and Hero */}
            {displayData && (() => {
              const timeframe: Timeframe = view.type === 'tomorrow' ? 'tomorrow' : (view.type === 'weekend' ? 'weekend' : 'today');
              const commentary = generateWeatherCommentary(displayData, timeframe);
              return (
                <AnswerSummaryBar
                  city={commentary.city}
                  summary={commentary.answerBlock}
                  comparison={commentary.timeframeBlock.comparison}
                />
              );
            })()}
            {loading || !displayData ? (
              <div className="flex items-center justify-center min-h-[50vh]"><div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div></div>
            ) : (
              <div className="animate-fadeIn mt-4">
                <HeroDashboard
                  data={displayData}
                  badgeText={view.type === 'tomorrow' ? 'Yarın' : (view.type === 'weekend' ? 'Hafta Sonu' : 'Şimdi')}
                  activeView={view.type}
                  onToggleView={handleViewToggle}
                />
                <WeatherCommentaryGrid
                  weatherData={displayData}
                  initialTimeframe={view.type === 'tomorrow' ? 'tomorrow' : (view.type === 'weekend' ? 'weekend' : 'today')}
                  showTimeframeSelector={false}
                  showFAQ={true}
                  showDailySummary={true}
                  className="mb-8"
                />
                {/* Side-by-side: Lifestyle (left 50%) + Radar (right 50%) on desktop */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
                  <div className="w-full md:w-1/2">
                    <LifestyleRail data={displayData} />
                  </div>
                  <div className="w-full md:w-1/2">
                    <RadarNews
                      articles={articles}
                      weatherData={displayData}
                      compact={true}
                    />
                  </div>
                </div>

                {/* Horizontal Ad Unit */}
                <HorizontalAd />

                <ForecastSection data={displayData} focusTomorrow={view.type === 'tomorrow'} />
                <HistoricalChart weatherData={displayData} />
                <NewsSection articles={articles} />
                <AdGrid />
              </div>
            )}
          </>
        );
      case 'cities': return <CityIndex onCityClick={(city) => { setCurrentCity(city); setView({ type: 'home' }); window.history.pushState({ city }, '', `/${toSlug(city)}`); window.scrollTo(0, 0); }} onBack={() => setView({ type: 'home' })} />;
      default: return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-200 selection:bg-blue-200 selection:text-blue-900 transition-colors duration-500">
        <TopBar tickers={marketData} currentTemp={weatherData?.currentTemp} onHomeClick={() => setView({ type: 'home' })} position="top" />

        {/* Main Grid Layout - Mobile First with max-w-7xl (1280px) */}
        <div className="flex-grow w-full max-w-7xl mx-auto px-4 py-4 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8">

          {/* Main Content Column - Full width on mobile, flex-1 on desktop */}
          <main className="flex-1 min-w-0 order-1">
            {renderView()}
          </main>

          {/* Right Sidebar (Desktop Only) - Non-sticky, scrolls with content */}
          <aside className="hidden lg:block w-72 flex-shrink-0 order-2">
            <DesktopSidebarRight
              articles={articles}
            />
          </aside>

        </div>

        <Footer onNavigate={handleFooterNavigate} />
        <TopBar tickers={marketData} currentTemp={weatherData?.currentTemp} onHomeClick={() => setView({ type: 'home' })} position="bottom" />

        {/* Consent Banner Layer */}
        <CookieBanner />
      </div>
    </ErrorBoundary>
  );
};

export default App;
