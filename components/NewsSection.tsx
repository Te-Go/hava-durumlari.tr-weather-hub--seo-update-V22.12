import React, { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import { Icon } from './Icons';
import { NewsItem } from '../types';
import { fetchLiveArticles } from '../services/weatherService';

// SINAN PROTOCOL: Interface now accepts 'city' for context
interface NewsSectionProps {
    city?: string;
}

const NewsSection: React.FC<NewsSectionProps> = ({ city }) => {
    const [articles, setArticles] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadNews = async () => {
            setLoading(true);
            // Pass the city to the bridge
            const news = await fetchLiveArticles(city);
            if (isMounted) {
                setArticles(news);
                setLoading(false);
            }
        };

        loadNews();

        return () => { isMounted = false; };
    }, [city]); // Re-fetch when city changes

    // Show only first 4
    const displayArticles = articles.slice(0, 4);

    if (!loading && displayArticles.length === 0) return null;

    return (
        <GlassCard className="flex flex-col mt-6 mb-6">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">
                {/* Dynamic Header: "Ankara Meteorolojik Analizler" */}
                {city ? `${city} Meteorolojik Analizler` : 'Meteorolojik Analizler'}
            </h3>

            {loading ? (
                // Skeleton Loader
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="relative rounded-xl overflow-hidden aspect-square bg-slate-200 dark:bg-slate-700 animate-pulse"
                        />
                    ))}
                </div>
            ) : (
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
            )}
        </GlassCard>
    );
};

export default NewsSection;
