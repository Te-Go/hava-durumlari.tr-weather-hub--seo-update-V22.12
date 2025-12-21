
import React from 'react';
import { MarketTicker } from '../types';
import { CONFIG, HUB_LOGOS } from '../services/weatherService';

interface TopBarProps {
  tickers: MarketTicker[];
  currentTemp?: number;
  onHomeClick?: () => void;
  position?: 'top' | 'bottom';
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ tickers, currentTemp, onHomeClick, position = 'top', isDarkMode, onToggleTheme }) => {
  // Logic: Top is sticky, Bottom is static
  const positionClass = position === 'top'
    ? 'sticky top-0 border-b border-white/5 shadow-md z-50'
    : 'relative border-t border-white/5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10';

  // Shared pill style for perfect height matching
  // Added hover effects to indicate interactivity
  const pillClass = "flex items-center space-x-2 text-xs font-medium bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm whitespace-nowrap transition-colors hover:bg-white/20 active:scale-95";

  // Use centralized weather logo
  const weatherLogo = HUB_LOGOS.WEATHER;

  return (
    <div className={`bg-deep-navy text-white py-2 px-4 overflow-x-auto no-scrollbar w-full transition-colors duration-500 ${positionClass}`}>
      <div className="flex items-center space-x-4 md:space-x-6 mx-auto max-w-4xl justify-between md:justify-start">
        {/* Left Section: Logo & Toggle */}
        <div className="flex items-center space-x-3">
          {/* Hava Logo Button */}
          <button
            onClick={onHomeClick}
            className={pillClass}
          >
            <img
              src={weatherLogo}
              alt="Hava Logo"
              className="w-5 h-5 object-contain"
              onError={(e) => {
                // Fallback to official CDN if local file not found
                e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/1163/1163661.png";
              }}
            />
            <span className="text-white">Hava</span>
            {currentTemp !== undefined && (
              <span className="text-xs font-light text-white ml-1 border-l border-white/20 pl-2">
                {Math.round(currentTemp)}°
              </span>
            )}
          </button>
        </div>

        {/* Right Section: Tickers */}
        <div className="flex items-center space-x-3">
          {tickers.map((ticker) => (
            <a
              key={ticker.symbol}
              href={ticker.link || '#'}
              className={pillClass}
              target="_blank" // Open in new tab to keep users on Weather Hub
              rel="noopener noreferrer" // Security best practice
              title={`${ticker.symbol} Detayları`}
            >
              {/* Logo Logic: Render Image if exists, else generic Icon */}
              {ticker.logoUrl ? (
                <img
                  src={ticker.logoUrl}
                  alt={ticker.symbol}
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    // Safety fallback if local image is missing
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) {
                      (e.currentTarget.nextSibling as HTMLElement).style.display = 'block';
                    }
                  }}
                />
              ) : (
                <span className="opacity-80">{ticker.icon}</span>
              )}
              {/* Fallback Icon (Hidden by default if logo exists) */}
              <span className="opacity-80 hidden">{ticker.icon}</span>

              <span className="text-gray-300">{ticker.symbol}</span>
              <span className="font-bold text-white">{ticker.price}</span>
              <span className={ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                {ticker.change > 0 ? '↑' : '↓'} {Math.abs(ticker.change)}%
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
