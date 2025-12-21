
import React from 'react';
import { WeatherData } from '../types';
import { Icon } from './Icons';

interface AlertBarProps {
  data: WeatherData;
}

const AlertBar: React.FC<AlertBarProps> = ({ data }) => {
  // Logic to determine alerts
  let alertType: 'warning' | 'danger' | null = null;
  let message = '';

  // 1. Storm / Severe Codes
  if (data.icon === 'storm') {
    alertType = 'danger';
    message = 'Fırtına Uyarısı: Şiddetli hava koşulları bekleniyor.';
  }
  // 2. High Wind
  else if (data.windSpeed > 40) {
    alertType = 'warning';
    message = `Kuvvetli Rüzgar: ${data.windSpeed} km/h hızında rüzgar bekleniyor.`;
  }
  // 3. High UV
  else if (data.uvIndex > 8) {
    alertType = 'warning';
    message = 'Yüksek UV İndeksi: Güneş çarpmasına karşı dikkatli olun.';
  }
  // 4. Extreme Cold
  else if (data.currentTemp < -5) {
    alertType = 'warning';
    message = 'Don Tehlikesi: Yollarda buzlanmaya dikkat edin.';
  }

  if (!alertType) return null;

  return (
    <div className={`
      w-full mb-4 px-4 py-3 rounded-xl flex items-start gap-3 shadow-sm border
      ${alertType === 'danger'
        ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
        : 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200'
      }
    `}>
      <Icon.AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-0.5">
          {alertType === 'danger' ? 'Acil Uyarı' : 'Meteorolojik Uyarı'}
        </p>
        <p className="text-sm font-medium leading-tight">{message}</p>
      </div>
    </div>
  );
};

export default AlertBar;
