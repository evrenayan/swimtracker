'use client';

import Link from 'next/link';

export default function Footer() {
    return (
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
                            <li><Link href="/#features" className="hover:text-pink-600 transition-colors">Özellikler</Link></li>
                            <li><Link href="/#solutions" className="hover:text-pink-600 transition-colors">Çözümler</Link></li>
                            <li><Link href="/login" className="hover:text-pink-600 transition-colors">Giriş Yap</Link></li>
                            <li><Link href="/signup" className="hover:text-pink-600 transition-colors">Kayıt Ol</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">İletişim</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li><Link href="/support" className="hover:text-pink-600 transition-colors">Destek</Link></li>
                            <li><Link href="/about" className="hover:text-pink-600 transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/privacy" className="hover:text-pink-600 transition-colors">Gizlilik Politikası</Link></li>
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
    );
}
