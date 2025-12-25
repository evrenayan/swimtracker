'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-pink-50/30 font-sans">
            <Navbar />

            <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Hakkımızda</h1>

                <div className="bg-white rounded-3xl p-8 shadow-sm space-y-8 text-gray-600">
                    <section>
                        <p className="text-lg leading-relaxed">
                            SwimTracker, yüzme antrenörleri ve sporcuları için geliştirilmiş, veri odaklı bir performans takip platformudur.
                            Amacımız, geleneksel kağıt-kalem yöntemlerini modern teknolojiyle birleştirerek yüzme sporunda verimliliği artırmaktır.
                        </p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-pink-50 p-6 rounded-2xl">
                            <h3 className="font-bold text-pink-700 mb-2">Misyonumuz</h3>
                            <p>
                                Her seviyedeki yüzücünün potansiyelini en üst düzeye çıkarmasına yardımcı olacak araçlar sağlamak ve yüzme topluluğuna değer katmak.
                            </p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-2xl">
                            <h3 className="font-bold text-purple-700 mb-2">Vizyonumuz</h3>
                            <p>
                                Dünya çapında yüzme performansı analizi denildiğinde akla gelen ilk dijital çözüm ortağı olmak.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Neler Yapıyoruz?</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Sporcu performans verilerinin detaylı analizi</li>
                            <li>Otomatik baraj kontrolü ve hedef takibi</li>
                            <li>Antrenör-sporcu iletişimi ve veri paylaşımı</li>
                            <li>Gelişim raporları ve grafiksel gösterimler</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
                        <p>
                            Yazılım geliştiriciler, veri analistleri ve eski milli yüzücülerden oluşan tutkulu bir ekibiz.
                            Yüzme sporunun ihtiyaçlarını çok iyi biliyor ve çözümlerimizi bu doğrultuda geliştiriyoruz.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
