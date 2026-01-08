'use client';

import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';

interface SwimmerNavigationProps {
    swimmerId: string;
    isMale: boolean;
    onAddRace?: () => void;
}

export default function SwimmerNavigation({ swimmerId, isMale, onAddRace }: SwimmerNavigationProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active page
    const isProfileActive = pathname === `/swimmers/${swimmerId}`;
    const isDashboardActive = pathname === `/swimmers/${swimmerId}/dashboard`;
    const isBarriersActive = pathname === `/swimmers/${swimmerId}/barriers`;

    return (
        <div className="flex gap-3 flex-wrap">
            <Button
                onClick={() => router.push(`/swimmers/${swimmerId}`)}
                variant={isProfileActive ? (isMale ? 'primary-blue' : 'primary') : (isMale ? 'secondary-blue' : 'secondary')}
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
            </Button>
            <Button
                onClick={() => router.push(`/swimmers/${swimmerId}/dashboard`)}
                variant={isDashboardActive ? (isMale ? 'primary-blue' : 'primary') : (isMale ? 'secondary-blue' : 'secondary')}
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
            </Button>
            <Button
                onClick={() => router.push(`/swimmers/${swimmerId}/barriers`)}
                variant={isBarriersActive ? (isMale ? 'primary-blue' : 'primary') : (isMale ? 'secondary-blue' : 'secondary')}
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Baraj Durumu
            </Button>
            {onAddRace && (
                <button
                    onClick={onAddRace}
                    className="relative px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden group"
                >
                    {/* Animated Sparkles */}
                    <span className="absolute top-0 right-0 w-3 h-3 animate-ping">
                        <svg className="w-3 h-3 text-white opacity-75" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                        </svg>
                    </span>
                    <span className="absolute top-1 right-8 w-2 h-2 animate-pulse delay-100">
                        <svg className="w-2 h-2 text-white opacity-60" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                        </svg>
                    </span>
                    <span className="absolute bottom-1 right-4 w-2.5 h-2.5 animate-ping delay-200">
                        <svg className="w-2.5 h-2.5 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                        </svg>
                    </span>

                    {/* Shimmer Effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer"></span>

                    <span className="relative flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Yarış Ekle
                    </span>
                </button>
            )}
        </div>
    );
}
