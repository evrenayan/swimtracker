'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50/30 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-pink-800">
                SwimTracker
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">Özellikler</a>
              <a href="#solutions" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">Çözümler</a>
              <a href="#about" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">Hakkında</a>

              <div className="flex items-center gap-4">
                {user ? (
                  <Link
                    href="/swimmers"
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Dashboard'a Git
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/signup"
                      className="px-5 py-2.5 rounded-full bg-pink-600 text-white font-semibold hover:bg-pink-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Hemen Başla
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button - can be implemented if needed */}
            <div className="md:hidden flex items-center">
              {user ? (
                <Link href="/swimmers" className="text-sm font-semibold text-pink-600">Dashboard</Link>
              ) : (
                <Link href="/login" className="text-sm font-semibold text-pink-600">Giriş Yap</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto z-10 relative">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
              Yüzme Performansınızı <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                Zirveye Taşıyın
              </span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
              Antrenörler ve sporcular için tasarlanmış profesyonel analiz platformu. Dereceleri takip edin, barajları aşın ve hedeflerinize ulaşın.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-full bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Ücretsiz Deneyin
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 rounded-full bg-white text-gray-700 border border-pink-200 font-bold text-lg hover:bg-pink-50 hover:border-pink-300 transition-all duration-300"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-100 rounded-full blur-3xl opacity-40 -z-10 animate-pulse-slow"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-40 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-40 -z-10"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-pink-600 font-bold tracking-wide uppercase text-sm mb-2">Özellikler</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              Neden SwimTracker?
            </h3>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Geleneksel kağıt-kalem yöntemlerini bırakın. Modern araçlarla veri odaklı başarıya ulaşın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-pink-50/50 hover:bg-pink-50 transition-colors duration-300 border border-pink-100 hover:border-pink-200">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Detaylı Performans Analizi</h4>
              <p className="text-gray-600 leading-relaxed">
                Her yarışın derecesini kaydedin, gelişim grafiklerini anlık olarak izleyin. Antrenman verimliliğinizi artıracak içgörüler edinin.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-rose-50/50 hover:bg-rose-50 transition-colors duration-300 border border-rose-100 hover:border-rose-200">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Otomatik Baraj Kontrolü</h4>
              <p className="text-gray-600 leading-relaxed">
                Federasyon barajlarını sisteme tanımlayın. Sporcularınızın hangi barajları geçtiğini otomatik olarak görün ve raporlayın.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-purple-50/50 hover:bg-purple-50 transition-colors duration-300 border border-purple-100 hover:border-purple-200">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Sporcu & Antrenör Paneli</h4>
              <p className="text-gray-600 leading-relaxed">
                Antrenörler tüm takımı yönetirken, sporcular kendi gelişimlerini takip edebilir. Rol bazlı yetkilendirme ile güvenli veri yönetimi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Image Section */}
      <section id="solutions" className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90"></div>

        {/* Pink Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                Verileriniz Güvende <br /> Analizleriniz Cebinizde
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                SwimTracker, modern web teknolojileri ile geliştirilmiş, tamamen bulut tabanlı bir çözümdür. Bilgisayar, tablet veya telefonunuzdan dilediğiniz zaman erişin.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
                  <span className="text-gray-300">Bulut tabanlı güvenli veri saklama</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
                  <span className="text-gray-300">Mobil uyumlu duyarlı tasarım</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
                  <span className="text-gray-300">Sürekli güncellenen altyapı</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="inline-block px-8 py-4 rounded-full bg-pink-600 text-white font-bold hover:bg-pink-500 transition-colors"
              >
                Ücretsiz Hesap Oluştur
              </Link>
            </div>

            <div className="lg:w-1/2 relative">
              {/* Abstract Abstract UI Mockup */}
              <div className="relative rounded-2xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">ED</div>
                    <div>
                      <div className="text-sm font-bold text-white">Ece Demir</div>
                      <div className="text-xs text-gray-400">Serbest Stil</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">Barajı Geçti</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-gray-700/30 p-3 rounded-lg">
                    <span className="text-gray-400 text-sm">50m Serbest</span>
                    <span className="text-white font-mono font-bold">28.45</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-700/30 p-3 rounded-lg">
                    <span className="text-gray-400 text-sm">100m Serbest</span>
                    <span className="text-white font-mono font-bold">1:02.10</span>
                  </div>
                  <div className="h-32 bg-gradient-to-t from-pink-500/20 to-transparent rounded-lg border-b border-pink-500/30 flex items-end justify-between px-2 pb-2">
                    <div className="w-4 bg-pink-500/40 h-[40%] rounded-t-sm"></div>
                    <div className="w-4 bg-pink-500/50 h-[60%] rounded-t-sm"></div>
                    <div className="w-4 bg-pink-500/60 h-[50%] rounded-t-sm"></div>
                    <div className="w-4 bg-pink-500/70 h-[75%] rounded-t-sm"></div>
                    <div className="w-4 bg-pink-500/80 h-[90%] rounded-t-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Başarıya Giden Yolda İlk Kulaç
          </h2>
          <p className="text-xl text-pink-100 mb-10 max-w-2xl mx-auto">
            Hemen ücretsiz hesabınızı oluşturun ve takımınızın performansını profesyonelce yönetmeye başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-pink-600 font-bold rounded-full text-lg hover:bg-pink-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Hemen Kayıt Ol
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <span className="text-xl font-bold text-gray-900">SwimTracker</span>
              </div>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                Yüzme performans takip ve analiz platformu. Sporcuların gelişimini veriye dayalı yönetin.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-pink-600 transition-colors">Özellikler</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Fiyatlandırma</a></li>
                <li><a href="/login" className="hover:text-pink-600 transition-colors">Giriş Yap</a></li>
                <li><a href="/signup" className="hover:text-pink-600 transition-colors">Kayıt Ol</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">İletişim</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-pink-600 transition-colors">Destek</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Gizlilik Politikası</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 SwimTracker. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 014.123 4.1c.636-.247 1.363-.416 2.427-.465C7.568 2.012 7.913 2 10.315 2h2zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
