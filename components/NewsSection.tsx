
import React from 'react';
import GlassCard from './GlassCard';
import { NewsItem } from '../types';

interface NewsSectionProps {
    articles: NewsItem[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ articles }) => {
    // Show only first 4
    const displayArticles = articles.slice(0, 4);

    if (displayArticles.length === 0) return null;

    return (
        <GlassCard className="flex flex-col mt-6 mb-6">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Haberler & Makaleler</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {displayArticles.map((item) => (
                    <a
                        key={item.id}
                        href={item.link || '#'}
                        className="relative rounded-xl overflow-hidden aspect-square group cursor-pointer block"
                        target="_self"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                            <span className="text-[10px] font-bold text-blue-300 uppercase mb-1">{item.category}</span>
                            <p className="text-xs font-medium text-white line-clamp-2 leading-tight">
                                {item.title}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </GlassCard>
    );
};

export default NewsSection;
