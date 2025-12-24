import React from 'react';
import { Icon } from './Icons';

interface MobileNavProps {
    activeView: 'home' | 'tomorrow' | 'weekend';
    onToggleView: (view: 'home' | 'tomorrow' | 'weekend') => void;
    onSearchClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeView, onToggleView, onSearchClick }) => {

    // SINAN IMPROVEMENT: Subtle haptic feedback for native feel
    const handlePress = (callback: () => void) => {
        if (navigator.vibrate) navigator.vibrate(10);
        callback();
    };

    const navItemClass = (isActive: boolean) => `
    flex flex-col items-center justify-center w-full h-full space-y-1 relative
    ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}
    transition-colors duration-200
  `;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
            {/* Glassmorphism Container with iOS safe area */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/50 dark:border-slate-700/50"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">

                    {/* 1. HOME (Today) */}
                    <button onClick={() => handlePress(() => onToggleView('home'))} className={navItemClass(activeView === 'home')}>
                        {activeView === 'home' && <span className="absolute -top-1 w-1 h-1 bg-blue-500 rounded-full" />}
                        <Icon.Sun size={20} className={activeView === 'home' ? 'fill-current' : ''} />
                        <span className="text-[10px] font-bold">Bugün</span>
                    </button>

                    {/* 2. TOMORROW */}
                    <button onClick={() => handlePress(() => onToggleView('tomorrow'))} className={navItemClass(activeView === 'tomorrow')}>
                        {activeView === 'tomorrow' && <span className="absolute -top-1 w-1 h-1 bg-blue-500 rounded-full" />}
                        <Icon.Calendar size={20} className={activeView === 'tomorrow' ? 'fill-current' : ''} />
                        <span className="text-[10px] font-bold">Yarın</span>
                    </button>

                    {/* 3. SEARCH (Floating Action Button style) */}
                    <div className="relative -top-5">
                        <button
                            onClick={() => handlePress(onSearchClick)}
                            className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 transition-transform"
                            aria-label="Şehir Ara"
                        >
                            <Icon.Search size={24} />
                        </button>
                    </div>

                    {/* 4. WEEKEND */}
                    <button onClick={() => handlePress(() => onToggleView('weekend'))} className={navItemClass(activeView === 'weekend')}>
                        {activeView === 'weekend' && <span className="absolute -top-1 w-1 h-1 bg-blue-500 rounded-full" />}
                        <Icon.Coffee size={20} className={activeView === 'weekend' ? 'fill-current' : ''} />
                        <span className="text-[10px] font-bold">Hafta Sonu</span>
                    </button>

                    {/* 5. MENU (Scroll to Footer/News) */}
                    <button
                        onClick={() => handlePress(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))}
                        className={navItemClass(false)}
                    >
                        <Icon.Menu size={20} />
                        <span className="text-[10px] font-bold">Menü</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default MobileNav;
