'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signOut, onAuthStateChange } from '@/lib/auth/auth';
import type { AuthUser } from '@/lib/auth/auth';
import Logo from './Logo';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = user?.profile?.role === 'admin';

  const navItems = [
    {
      name: 'Sporcular',
      href: '/swimmers',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      // Everyone can see swimmers (but content differs)
      show: true,
    },
    {
      name: 'Barajlar',
      href: '/barriers',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      // Everyone can see barriers (admin edits, athlete views)
      show: true,
    },
  ];

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Çıkış yapılırken bir hata oluştu');
    } else {
      toast.success('Başarıyla çıkış yapıldı');
      router.push('/login');
    }
  };

  if (loading) {
    return null; // Or a skeleton loader
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-pink-600 text-white rounded-lg shadow-lg"
        suppressHydrationWarning
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" suppressHydrationWarning>
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          bg-white border-r border-pink-100 min-h-screen flex flex-col
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 bg-white border border-pink-100 rounded-full p-1 text-pink-500 hover:text-pink-700 shadow-sm z-50"
        >
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'px-2' : ''}`}>
          <Logo collapsed={isCollapsed} />
        </div>

        {/* User Info */}
        {user && (
          <div className={`px-4 py-2 mb-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.profile?.full_name || user.email}
              </p>
              <p className="text-xs text-pink-600 uppercase font-semibold mt-1">
                {!user.profile
                  ? 'Profil Yok'
                  : (user.profile.role === 'admin' ? 'Yönetici' : 'Sporcu')
                }
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          <ul className="space-y-2">
            {navItems.filter(item => item.show).map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                      }
                      ${isCollapsed ? 'justify-center px-2' : ''}
                    `}
                    title={isCollapsed ? item.name : ''}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="whitespace-nowrap transition-all duration-300">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="px-3 py-4 border-t border-pink-100">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200
              ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
            `}
            title={isCollapsed ? 'Çıkış Yap' : ''}
          >
            <svg
              className="w-5 h-5 min-w-[1.25rem]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {!isCollapsed && <span className="whitespace-nowrap transition-all duration-300">Çıkış Yap</span>}
          </button>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-pink-100">
            <p className="text-xs text-gray-500 text-center">
              © 2025 SwimTrack
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
