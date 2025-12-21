
import React from 'react';
import { toSlug } from '../services/weatherService';
import { REGULAR_CITIES } from '../shared/cityData';

interface FooterProps {
  onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {

  const handleLinkClick = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    onNavigate(view);
  };

  return (
    <footer className="bg-deep-navy text-white/60 py-12 px-4 mt-auto">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">

        {/* Column 1: Hakkımızda */}
        <div>
          <h4 className="text-white font-bold mb-4">Hakkımızda</h4>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Hava Durumları</button></li>
            <li><a href="/iletisim" className="hover:text-white transition-colors">İletişim</a></li>
          </ul>
        </div>

        {/* Column 2: Haberler & Makaleler */}
        <div>
          <h4 className="text-white font-bold mb-4">Haberler & Makaleler</h4>
          <ul className="space-y-2">
            <li><a href="/yarin" onClick={(e) => handleLinkClick(e, 'tomorrow')} className="hover:text-white transition-colors text-blue-400 font-semibold">Yarınki Hava Durumu</a></li>
            <li><a href="/hafta-sonu" onClick={(e) => handleLinkClick(e, 'weekend')} className="hover:text-white transition-colors text-indigo-400 font-semibold">Bu Hafta Sonu</a></li>
            {/* SEO Links for Content */}
            <li><a href="/kategori/makaleler" className="hover:text-white transition-colors">Makaleler</a></li>
            <li><a href="/kategori/hava-analizleri" className="hover:text-white transition-colors">Hava Analizleri</a></li>
            <li><a href="/kategori/haberler" className="hover:text-white transition-colors">Haberler</a></li>
          </ul>
        </div>

        {/* Column 3: Keşfet (Populated with Regular Cities) */}
        <div>
          <h4 className="text-white font-bold mb-4">Keşfet</h4>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate('cities')} className="text-blue-400 hover:text-white font-semibold">Tüm Şehirler →</button></li>
            {REGULAR_CITIES.slice(0, 8).map((city) => (
              <li key={city}>
                <a
                  href={`/hava-durumu/${toSlug(city)}`}
                  className="hover:text-white transition-colors"
                >
                  {city}
                </a>
              </li>
            ))}
            {REGULAR_CITIES.length > 8 && (
              <li><span className="opacity-50 text-[10px]">+ {REGULAR_CITIES.length - 8} şehir daha</span></li>
            )}
          </ul>
        </div>

        {/* Column 4: Yasal & Social */}
        <div>
          <h4 className="text-white font-bold mb-4">Yasal</h4>
          <ul className="space-y-2">
            <li><a href="/yasal/kullanim-kosullari" className="hover:text-white transition-colors">Kullanım Koşulları</a></li>
            <li><a href="/yasal/gizlilik-politikasi" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
            <li><a href="/yasal/cerez-politikasi" className="hover:text-white transition-colors">Çerez Politikası</a></li>
            <li><a href="/yasal/kvkk" className="hover:text-white transition-colors">KVKK Aydınlatma Metni</a></li>
            <li><a href="/yasal/kunye" className="hover:text-white transition-colors">Künye</a></li>
          </ul>

          <div className="mt-8">
            <h4 className="text-white font-bold mb-4">Bizi Takip Edin</h4>
            <div className="flex space-x-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer">X</div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer">Fb</div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer">In</div>
            </div>
            <div className="mt-8 text-[10px] opacity-40">
              © 2025 TG Dijital. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
