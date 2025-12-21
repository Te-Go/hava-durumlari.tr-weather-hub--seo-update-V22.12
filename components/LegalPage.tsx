
import React, { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import { Icon } from './Icons';
import { fetchLegalPage } from '../services/weatherService';
import { LegalContent } from '../types';
import { sanitizeHtmlLight } from '../shared/sanitizeHtml';

interface LegalPageProps {
  slug: string;
  onBack: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ slug, onBack }) => {
  const [data, setData] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      setLoading(true);
      // Fetch from WordPress
      const result = await fetchLegalPage(slug);

      if (isMounted) {
        if (result) {
          setData(result);
        } else {
          // Fallback: If WP page doesn't exist yet, use hardcoded backup with updated branding
          const fallbackContent: Record<string, { title: string, content: string }> = {
            'terms': {
              title: 'Kullanım Koşulları',
              content: `
                <h3>1. Giriş</h3>
                <p>TG Dijital Hava Durumu platformuna hoş geldiniz. Bu siteyi kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.</p>
                <h3>2. Hizmetin Kapsamı</h3>
                <p>Sitemiz, kullanıcılarına anlık hava durumu verileri, tahminler ve ilgili haber içerikleri sunmaktadır.</p>
                <h3>3. Sorumluluk Reddi</h3>
                <p>Sunulan hava durumu tahminleri bilgilendirme amaçlıdır. TG Dijital, verilerin kesinliği konusunda garanti vermez ve bu verilere dayanarak alınan kararlardan doğabilecek zararlardan sorumlu tutulamaz.</p>
              `
            },
            'privacy': {
              title: 'Gizlilik Politikası',
              content: `
                <p>TG Dijital Medya A.Ş. ("Şirket") olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, hava-durumlari.tr ("Site") üzerinden toplanan verilerin nasıl işlendiğini açıklar.</p>
                
                <h3>1. Toplanan Veriler</h3>
                <ul>
                    <li><strong>Konum Verileri (GPS):</strong> Size en yakın yerleşim biriminin hava durumunu sunmak için, izniniz dahilinde anlık konum verinizi işleriz. Bu veri sunucularımızda kalıcı olarak saklanmaz, sadece anlık sorgu için kullanılır.</li>
                    <li><strong>Log Kayıtları:</strong> IP adresiniz, tarayıcı türünüz, erişim zamanınız ve ziyaret ettiğiniz sayfalar, yasal zorunluluklar (5651 Sayılı Kanun) ve güvenlik amacıyla kayıt altına alınır.</li>
                    <li><strong>Çerezler (Cookies):</strong> Site deneyimini iyileştirmek için çerezler kullanılır. Detaylar için <a href="/legal:cookies">Çerez Politikası</a>'na bakınız.</li>
                </ul>

                <h3>2. Verilerin Kullanım Amacı</h3>
                <p>Toplanan veriler şu amaçlarla kullanılır:</p>
                <ul>
                    <li>Hava durumu hizmetinin yerelleştirilmesi (Örn: İstanbul'daysanız İstanbul havasını göstermek).</li>
                    <li>Site trafiğinin analizi ve performans iyileştirmesi.</li>
                    <li>Kullanıcı deneyimine uygun reklam gösterimi (Google AdSense aracılığıyla).</li>
                </ul>

                <h3>3. Verilerin Paylaşımı</h3>
                <p>Kişisel verileriniz, yasal zorunluluklar (savcılık talepleri vb.) haricinde üçüncü şahıslarla paylaşılmaz. Ancak, anonimleştirilmiş trafik verileri analiz ve reklam partnerlerimizle (Google Analytics, Google Ads) paylaşılabilir.</p>

                <h3>4. Veri Güvenliği</h3>
                <p>Verileriniz, SSL (Secure Socket Layer) şifrelemesi ile korunmaktadır. Şirketimiz, verilerin yetkisiz erişime karşı korunması için gerekli teknik tedbirleri almaktadır.</p>
              `
            },
            'cookies': {
              title: 'Çerez Politikası',
              content: `
                <p>TG Dijital olarak, web sitemizdeki deneyiminizi geliştirmek, site trafiğini analiz etmek ve size uygun içerikler sunmak amacıyla çerezler (cookies) kullanmaktayız.</p>
                
                <h3>1. Kullandığımız Çerez Türleri</h3>
                
                <h4>a) Zorunlu Çerezler (Essential)</h4>
                <p>Sitenin düzgün çalışması için gereklidir. Bu çerezler kişisel veri tutmaz.</p>
                <ul>
                    <li><strong>tg_theme:</strong> Tercih ettiğiniz tema (Aydınlık/Karanlık) ayarını hatırlar.</li>
                    <li><strong>tg_last_city:</strong> Son baktığınız şehri hatırlar, böylece her seferinde tekrar arama yapmanız gerekmez.</li>
                    <li><strong>tg_cookie_consent:</strong> Çerez tercihlerinizi saklar.</li>
                </ul>

                <h4>b) Performans ve Analiz Çerezleri</h4>
                <p>Sitemizi nasıl kullandığınızı anlamamıza yardımcı olur. Bu veriler anonimleştirilmiştir.</p>
                <ul>
                    <li><strong>Google Analytics (_ga):</strong> Hangi sayfaların popüler olduğunu ve kullanıcıların sitede ne kadar zaman geçirdiğini ölçer.</li>
                </ul>

                <h4>c) Reklam ve Pazarlama Çerezleri</h4>
                <p>Size ilgi alanlarınıza uygun reklamlar göstermek için kullanılır.</p>
                <ul>
                    <li><strong>Google AdSense (__gads):</strong> Size alakalı reklamlar sunmak ve reklam sıklığını kontrol etmek için kullanılır.</li>
                </ul>

                <h3>2. Çerezleri Nasıl Yönetebilirsiniz?</h3>
                <p>Tarayıcınızın ayarlarını değiştirerek çerezleri dilediğiniz zaman reddedebilir veya silebilirsiniz. Ancak zorunlu çerezlerin silinmesi, sitenin bazı özelliklerinin (örneğin son şehir hafızası) çalışmamasına neden olabilir.</p>
              `
            },
            'kvkk': {
              title: 'KVKK Aydınlatma Metni',
              content: `
                <h3>1. Veri Sorumlusu</h3>
                <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>TG Dijital Medya A.Ş.</strong> tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>

                <h3>2. Kişisel Verilerin İşlenme Amacı</h3>
                <p>Toplanan kişisel verileriniz (IP adresi, Çerez kayıtları, Konum verisi), aşağıdaki amaçlarla işlenmektedir:</p>
                <ul>
                    <li>Hava durumu hizmetlerinin size özel (lokasyon bazlı) sunulması.</li>
                    <li>Bilgi güvenliği süreçlerinin yürütülmesi (5651 sayılı kanun gereği loglama).</li>
                    <li>Reklam/Kampanya/Promosyon süreçlerinin yürütülmesi (Kişiselleştirilmiş reklamlar).</li>
                </ul>

                <h3>3. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği</h3>
                <p>Toplanan kişisel verileriniz; yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, iş ortaklarımıza (Google Ireland Ltd.), kanunen yetkili kamu kurumlarına ve sunucu hizmeti aldığımız yurt içi/yurt dışı tedarikçilerimize (Hostinger) KVKK'nın 8. ve 9. maddelerinde belirtilen şartlar çerçevesinde aktarılabilecektir.</p>

                <h3>4. Veri Sahibi Olarak Haklarınız (Madde 11)</h3>
                <p>Kişisel veri sahibi olarak, Kanun'un 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
                <ul>
                    <li>Kişisel veri işlenip işlenmediğini öğrenme,</li>
                    <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                    <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                    <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme,</li>
                    <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme.</li>
                </ul>
                <p>Bu haklarınızı kullanmak için taleplerinizi <strong>iletisim@hava-durumlari.tr</strong> e-posta adresine iletebilirsiniz.</p>
              `
            },
            'imprint': {
              title: 'Künye',
              content: `
                <p><strong>İmtiyaz Sahibi:</strong> TG Dijital Medya A.Ş.</p>
                <p><strong>Genel Yayın Yönetmeni:</strong> Dr. Cengiz Mehmet</p>
                <p><strong>Adres:</strong> Maslak Mah. Büyükdere Cad. No:123, Sarıyer/İstanbul</p>
                <p><strong>E-posta:</strong> info@hava-durumlari.tr</p>
                <p><strong>Yer Sağlayıcı:</strong> Hostinger</p>
              `
            },
            'contact': {
              title: 'İletişim',
              content: `
                <p>Görüş, öneri ve reklam iş birlikleri için bizimle iletişime geçebilirsiniz.</p>
                <h3>İletişim Bilgileri</h3>
                <p><strong>E-posta:</strong> iletisim@hava-durumlari.tr</p>
                <p><strong>Telefon:</strong> +90 (212) 555 00 00</p>
                <p><strong>Adres:</strong> İstanbul, Türkiye</p>
              `
            }
          };

          const fallback = fallbackContent[slug];

          if (fallback) {
            setData(fallback);
          } else {
            setData({
              title: 'Yükleniyor...',
              content: '<p class="text-center text-slate-500">Bu sayfa içeriği hazırlanmaktadır.</p>'
            });
          }
        }
        setLoading(false);
      }
    };

    loadContent();

    return () => { isMounted = false; };
  }, [slug]);

  return (
    <div className="max-w-3xl mx-auto pt-8 pb-24 animate-fadeIn relative px-4 min-h-screen flex flex-col">
      <GlassCard className="flex-grow">
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>İçerik yükleniyor...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-light text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
              {data?.title}
            </h1>
            <div
              className="prose prose-blue dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 font-light text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: sanitizeHtmlLight(data?.content || '') }}
            />
          </>
        )}
      </GlassCard>

      {/* Sticky Back Button for better Mobile UX */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto flex items-center space-x-2 text-white bg-blue-600/90 hover:bg-blue-700 backdrop-blur-md font-medium px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          <Icon.ChevronRight className="w-4 h-4 rotate-180" />
          <span>Geri Dön</span>
        </button>
      </div>
    </div>
  );
};

export default LegalPage;
