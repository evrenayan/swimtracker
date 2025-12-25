'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-pink-50/30 font-sans">
            <Navbar />

            <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Destek ve İletişim</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bize Ulaşın</h2>
                        <p className="text-gray-600 mb-6">
                            Her türlü soru, öneri ve destek talebiniz için bizimle iletişime geçebilirsiniz. Ekibimiz en kısa sürede size geri dönüş yapacaktır.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span>destek@swimtracker.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <span>0850 123 45 67</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Üyelik ücretli mi?</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Temel özellikler ücretsizdir. İleri seviye analizler için Premium paketlerimizi inceleyebilirsiniz.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Şifremi unuttum, ne yapmalıyım?</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Giriş sayfasındaki "Şifremi Unuttum" bağlantısını kullanarak şifrenizi sıfırlayabilirsiniz.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Verilerim güvende mi?</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Evet, verileriniz şifrelenmiş sunucularda saklanmakta ve düzenli olarak yedeklenmektedir.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
