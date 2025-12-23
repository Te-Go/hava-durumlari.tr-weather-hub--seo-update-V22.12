
import React, { useState } from 'react';
import { NewsItem } from '../types';
import GlassCard from './GlassCard';
import { Icon } from './Icons';

interface ArchivePageProps {
  articles: NewsItem[];
  onArticleClick: (id: number) => void;
  onBack: () => void;
}

const CATEGORIES = ['Tümü', 'Şehir', 'Tarım', 'Bilim', 'Yaşam', 'Sağlık', 'Bahçe'];

const ArchivePage: React.FC<ArchivePageProps> = ({ articles, onArticleClick, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'Tümü' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12 animate-fadeIn relative">
      {/* Top Logo Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-white/40 hover:bg-white/60 text-slate-700 px-5 py-2 rounded-full backdrop-blur-md transition-all border border-white/40 shadow-sm group hover:shadow-md"
        >
          <div className="p-1 rounded-full bg-white/50 shadow-sm">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png"
              alt="Hava Durumları Logo"
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="font-bold tracking-tight text-sm group-hover:text-blue-600 transition-colors">Hava Durumları</span>
        </button>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-light text-slate-800 dark:text-slate-200 mb-2">Meteorolojik Analizler</h1>
        <p className="text-slate-500 dark:text-slate-400">Güncel hava durumu gelişmeleri, analizler ve yaşam makaleleri.</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Icon.Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Konu ara... (örn: Tarım, Fırtına)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-slate-700 dark:text-slate-200 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white/40 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((item) => (
          <a
            key={item.id}
            href={item.link || `/makale/${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              onArticleClick(item.id);
            }}
            className="block"
          >
            <GlassCard
              className="flex flex-col group cursor-pointer hover:scale-[1.01]"
              noPadding
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 bg-blue-500/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs text-slate-400 mb-2">{item.date}</span>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <div className="mt-auto flex items-center text-blue-500 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                  Devamını Oku <Icon.ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </GlassCard>
          </a>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          Sonuç bulunamadı.
        </div>
      )}

      {/* Bottom Geri Dön Button */}
      <div className="mt-12 flex justify-center pb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium px-6 py-3 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all border border-transparent hover:border-white/40 dark:hover:border-slate-700 group"
        >
          <Icon.ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span>Ana Sayfaya Geri Dön</span>
        </button>
      </div>
    </div>
  );
};

export default ArchivePage;
