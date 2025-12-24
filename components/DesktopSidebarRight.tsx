
import React from 'react';
import { CONFIG } from '../services/weatherService';
import { NewsItem } from '../types';

// SINAN LAUNCH PHASE: Import new utility components
import NetworkWidget from './NetworkWidget';
import NewsletterWidget from './NewsletterWidget';
import FeaturedAnalysis from './FeaturedAnalysis';

interface DesktopSidebarRightProps {
  articles: NewsItem[];
  city?: string; // For personalized newsletter
}

const DesktopSidebarRight: React.FC<DesktopSidebarRightProps> = ({ articles, city = 'İstanbul' }) => {
  const ads = CONFIG.ads as Record<string, string | string[] | undefined> | undefined;

  // Get the first article for Featured Analysis
  const featuredArticle = articles.length > 0 ? articles[0] : undefined;

  return (
    <div className="flex flex-col gap-5">

      {/* ═══════════════════════════════════════════════════════════════════
          SLOT 1: THE "PRIME" SPOT (Sticky Top) - REAL ADSENSE
          300x600 Half Page - Your highest-paying real estate
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block bg-glass-white/40 dark:bg-slate-800/40 border border-glass-border dark:border-dark-border rounded-3xl min-h-[600px] flex items-center justify-center shadow-glass relative overflow-hidden">
        {ads?.vertical ? (
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: ads.vertical as string }} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-slate-100 dark:bg-slate-700/50 w-full h-full rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Reklam Alanı
                </p>
                <p className="text-[10px] text-slate-300 dark:text-slate-600">300x600</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SLOT 2: THE "RETENTION" ENGINE - NEWSLETTER/PUSH
          Storm alert newsletter signup with city personalization
         ═══════════════════════════════════════════════════════════════════ */}
      <NewsletterWidget city={city} />

      {/* ═══════════════════════════════════════════════════════════════════
          SLOT 3: THE "RECIRCULATION" MODULE - INTERNAL LINK
          Features the latest article to drive internal traffic
         ═══════════════════════════════════════════════════════════════════ */}
      <FeaturedAnalysis article={featuredArticle} />

      {/* ═══════════════════════════════════════════════════════════════════
          SLOT 4: THE "NETWORK" WIDGET - CROSS-LINK HUB
          Piyasa Özeti with hub logos and live-ish data
         ═══════════════════════════════════════════════════════════════════ */}
      <NetworkWidget />

    </div>
  );
};

export default DesktopSidebarRight;
