'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-pink-50/30 font-sans">
            <Navbar />

            <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Gizlilik Politikası</h1>

                <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6 text-gray-600">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Veri Toplama</h2>
                        <p>
                            SwimTracker olarak, hizmetlerimizi kullanırken sağladığınız kişisel bilgilerinizi (isim, e-posta, yüzme dereceleri vb.) topluyoruz.
                            Bu bilgiler, size daha iyi bir hizmet sunmak ve platformumuzu geliştirmek amacıyla kullanılmaktadır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Veri Kullanımı</h2>
                        <p>
                            Toplanan veriler, performans analizi yapmak, antrenman önerileri sunmak ve hesap güvenliğini sağlamak için kullanılır.
                            Verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Çerezler</h2>
                        <p>
                            Kullanıcı deneyimini geliştirmek için çerezler kullanıyoruz. Çerez tercihlerinizi tarayıcı ayarlarınızdan değiştirebilirsiniz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Güvenlik</h2>
                        <p>
                            Verilerinizin güvenliği bizim için önceliklidir. Modern şifreleme yöntemleri ve güvenli sunucu altyapıları kullanarak verilerinizi koruyoruz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. İletişim</h2>
                        <p>
                            Gizlilik politikamızla ilgili sorularınız için bizimle iletişime geçebilirsiniz.
                        </p>
                    </section>

                    <div className="text-sm text-gray-500 pt-4 border-t border-gray-100">
                        Son Güncelleme: 25 Aralık 2025
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
