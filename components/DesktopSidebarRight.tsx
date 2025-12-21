
import React from 'react';
import GlassCard from './GlassCard';
import { CONFIG } from '../services/weatherService';
import { NewsItem } from '../types';
import { Icon } from './Icons';

interface DesktopSidebarRightProps {
  articles: NewsItem[];
}

// Mock ads for sidebar (native style)
const SIDEBAR_MOCK_ADS = [
  { title: "Kış Aylarında Doğalgaz Tasarrufu", img: "https://picsum.photos/200/200?random=20" },
  { title: "En Uygun Elektrik Tarifeleri", img: "https://picsum.photos/200/200?random=21" },
  { title: "Akıllı Ev Sistemleri ile Konfor", img: "https://picsum.photos/200/200?random=22" },
  { title: "Yalıtım ile Isı Kaybını Önleyin", img: "https://picsum.photos/200/200?random=23" },
];

// Weather-related categories for filtering
const WEATHER_CATEGORIES = ['Meteoroloji', 'Hava Durumu', 'İklim', 'Tarım', 'Doğa', 'Çevre'];

const DesktopSidebarRight: React.FC<DesktopSidebarRightProps> = ({ articles }) => {
  const ads = CONFIG.ads as Record<string, string | string[] | undefined> | undefined;

  // Filter weather-related articles for "Havadan Konuşalım"
  const weatherArticles = articles.filter(article =>
    WEATHER_CATEGORIES.some(cat =>
      article.category?.toLowerCase().includes(cat.toLowerCase())
    )
  );

  const havadanArticles = weatherArticles.length > 0
    ? weatherArticles.slice(0, 5)
    : articles.slice(5, 10);

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Half Page Ad (300x600) - Desktop Only */}
      <div className="hidden lg:block bg-glass-white/40 dark:bg-slate-800/40 border border-glass-border dark:border-dark-border rounded-3xl min-h-[600px] flex items-center justify-center shadow-glass relative overflow-hidden">
        {ads?.vertical ? (
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: ads.vertical as string }} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <img src="https://picsum.photos/300/600?random=vertical" alt="Reklam" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="relative z-10 bg-black/60 p-4 rounded-xl backdrop-blur-sm text-white w-full max-w-[280px]">
              <p className="font-bold text-sm mb-2">Premium Reklam Alanı</p>
              <p className="text-xs text-gray-300 mb-3">300x600 Half Page</p>
              <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold w-full hover:bg-gray-100 transition-colors">Detay</button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Gündem - Trending News */}
      <GlassCard className="flex flex-col" noPadding>
        <div className="px-4 py-3 border-b border-glass-border dark:border-dark-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Gündem</span>
          <a
            href="/haberler"
            className="ml-auto text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center gap-1"
          >
            Tümü <Icon.ChevronRight className="w-3 h-3" />
          </a>
        </div>
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
          {articles.slice(0, 5).map((article, idx) => (
            <a
              key={article.id}
              href={article.link || `/makale/${article.id}`}
              className={`p-3 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors text-left group block ${idx >= 3 ? 'hidden lg:block' : ''}`}
            >
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 leading-snug">
                {article.title}
              </p>
              <div className="flex items-center text-[10px] text-slate-400">
                <span>{article.category}</span>
                <Icon.ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </GlassCard>

      {/* 3. Medium Rectangle Ad (300x250) */}
      <div className="bg-glass-white/40 dark:bg-slate-800/40 border border-glass-border dark:border-dark-border rounded-2xl min-h-[250px] flex items-center justify-center shadow-glass relative overflow-hidden">
        {ads?.square ? (
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: ads.square as string }} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img src="https://picsum.photos/300/250?random=square" alt="Reklam" className="absolute inset-0 w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="text-[9px] font-bold text-white/70 mb-1">REKLAM</div>
              <p className="text-white text-sm font-medium line-clamp-2">Premium Reklam Alanı</p>
              <span className="text-xs text-gray-300 flex items-center mt-1">
                300x250 <Icon.ChevronRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Havadan Konuşalım - Weather Articles */}
      <GlassCard className="flex flex-col" noPadding>
        <div className="px-4 py-3 border-b border-glass-border dark:border-dark-border flex items-center gap-2">
          <Icon.Cloud className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Havadan Konuşalım</span>
          <a
            href="/haberler?kategori=hava-durumu"
            className="ml-auto text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center gap-1"
          >
            Tümü <Icon.ChevronRight className="w-3 h-3" />
          </a>
        </div>
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
          {havadanArticles.map((article, idx) => (
            <a
              key={article.id}
              href={article.link || `/makale/${article.id}`}
              className={`p-3 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors text-left group block ${idx >= 3 ? 'hidden lg:block' : ''}`}
            >
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 leading-snug">
                {article.title}
              </p>
              <div className="flex items-center text-[10px] text-slate-400">
                <span>{article.category}</span>
                <Icon.ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </GlassCard>

      {/* 5. Medium Rectangle Ad (300x250) */}
      <div className="bg-glass-white/40 dark:bg-slate-800/40 border border-glass-border dark:border-dark-border rounded-2xl min-h-[250px] flex items-center justify-center shadow-glass relative overflow-hidden">
        {ads?.mediumRect2 ? (
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: ads.mediumRect2 as string }} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img src="https://picsum.photos/300/250?random=mid" alt="Reklam" className="absolute inset-0 w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute top-3 right-3 bg-white/90 text-[8px] font-bold text-slate-500 px-2 py-1 rounded">
              REKLAM
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
              <p className="text-sm font-medium mb-1">Özel Kampanyalar</p>
              <p className="text-xs text-gray-300">300x250 Medium Rectangle</p>
            </div>
          </div>
        )}
      </div>

      {/* 6. Large Rectangle Ad (336x280) - Desktop Only */}
      <div className="hidden lg:block bg-glass-white/40 dark:bg-slate-800/40 border border-glass-border dark:border-dark-border rounded-2xl min-h-[280px] flex items-center justify-center shadow-glass relative overflow-hidden">
        {ads?.largeRect ? (
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: ads.largeRect as string }} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img src="https://picsum.photos/336/280?random=large" alt="Reklam" className="absolute inset-0 w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute top-3 right-3 bg-white/90 text-[8px] font-bold text-slate-500 px-2 py-1 rounded">
              REKLAM
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
              <p className="text-sm font-medium mb-1">Premium İçerik Alanı</p>
              <p className="text-xs text-gray-300 mb-3">336x280 Large Rectangle</p>
              <button className="bg-white text-slate-800 px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors">
                Keşfet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. Newsletter Signup CTA */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Icon.Sun className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hava Bülteni</p>
              <p className="text-xs text-slate-400">Günlük tahminler</p>
            </div>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-600 transition-colors">
            Abone Ol
          </button>
        </div>
      </GlassCard>

      {/* 8. Half Page Ad (300x600) - Desktop Only */}
      <div className="hidden lg:block bg-glass-white/40 dark:bg-slate-800/40 border border-glass-border dark:border-dark-border rounded-3xl min-h-[600px] flex items-center justify-center shadow-glass relative overflow-hidden">
        {ads?.vertical2 ? (
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: ads.vertical2 as string }} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <img src="https://picsum.photos/300/600?random=skyscraper2" alt="Reklam" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="relative z-10 bg-black/60 p-4 rounded-xl backdrop-blur-sm text-white w-full max-w-[280px]">
              <p className="font-bold text-sm mb-2">Premium Skyscraper</p>
              <p className="text-xs text-gray-300 mb-3">300x600 Half Page</p>
              <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold w-full hover:bg-gray-100 transition-colors">Detay</button>
            </div>
          </div>
        )}
      </div>

      {/* 9. Large Rectangle Ad (336x280) - Desktop Only */}
      <div className="hidden lg:block bg-glass-white/40 dark:bg-slate-800/40 border border-glass-border dark:border-dark-border rounded-2xl min-h-[280px] flex items-center justify-center shadow-glass relative overflow-hidden">
        {ads?.largeRect2 ? (
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: ads.largeRect2 as string }} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img src="https://picsum.photos/336/280?random=bottom" alt="Reklam" className="absolute inset-0 w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute top-3 right-3 bg-white/90 text-[8px] font-bold text-slate-500 px-2 py-1 rounded">
              REKLAM
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
              <p className="text-sm font-medium mb-1">Fırsat Alanı</p>
              <p className="text-xs text-gray-300 mb-3">336x280 Large Rectangle</p>
              <button className="bg-white text-slate-800 px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors">
                İncele
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopSidebarRight;
