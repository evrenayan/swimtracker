'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
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
        <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-pink-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-pink-800">
                                SwimTracker
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#features" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">Özellikler</Link>
                        <Link href="/#solutions" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">Çözümler</Link>
                        <Link href="/about" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">Hakkında</Link>

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

                    {/* Mobile Menu Button */}
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
    );
}
