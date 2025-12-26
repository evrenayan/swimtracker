'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSwimmer, getRaceRecordsBySwimmer, getSwimmerBarriers } from '@/lib/supabase/queries';
import { logger } from '@/lib/logger';
import type { Swimmer, RaceRecord } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatTime } from '@/lib/utils/timeFormat';

interface BestBarrierResult {
    poolType: string;
    swimmingStyle: string;
    bestTime: number | null;
    bestBarrierName: string | null;
    bestBarrierTime: number | null;
    allPassedBarriers: string[];
    nextBarrierName: string | null;
    nextBarrierTime: number | null;
}

export default function SwimmerBarriersPage() {
    const params = useParams();
    const router = useRouter();
    const swimmerId = params.id as string;

    const [swimmer, setSwimmer] = useState<Swimmer | null>(null);
    const [data, setData] = useState<BestBarrierResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch Swimmer
            const swimmerRes = await getSwimmer(swimmerId);
            if (swimmerRes.error || !swimmerRes.data) {
                throw new Error(swimmerRes.error?.message || 'Sporcu bulunamadı');
            }
            const currentSwimmer = swimmerRes.data;
            setSwimmer(currentSwimmer);

            // 2. Fetch Races and Barriers in parallel
            const [racesRes, barriersRes] = await Promise.all([
                getRaceRecordsBySwimmer(swimmerId),
                getSwimmerBarriers(currentSwimmer.age, currentSwimmer.gender)
            ]);

            if (racesRes.error) throw new Error(racesRes.error.message);
            if (barriersRes.error) throw new Error(barriersRes.error.message);

            const races = racesRes.data || [];
            const barriers = barriersRes.data || [];

            // 3. Process Data
            // Group races by pool + style and find best time
            const bestTimes = new Map<string, number>(); // Key: "pool|style" -> time

            races.forEach(race => {
                const key = `${race.pool_type}|${race.swimming_style}`;
                const currentBest = bestTimes.get(key);
                if (currentBest === undefined || race.total_milliseconds < currentBest) {
                    bestTimes.set(key, race.total_milliseconds);
                }
            });

            // Identify all unique pool/style combinations from BARRIERS (to show what's available to aim for)
            // We want to show a row for every barrier category that exists for this age/gender
            const uniqueCategories = new Set<string>();
            barriers.forEach(b => {
                // b.pool_types and b.swimming_styles are objects from joins
                const poolName = b.pool_types?.name;
                const styleName = b.swimming_styles?.name;
                if (poolName && styleName) {
                    uniqueCategories.add(`${poolName}|${styleName}`);
                }
            });

            const results: BestBarrierResult[] = [];

            uniqueCategories.forEach(key => {
                const [poolType, swimmingStyle] = key.split('|');
                const bestTime = bestTimes.get(key) || null;

                // Find barriers for this category
                const categoryBarriers = barriers.filter(b =>
                    b.pool_types?.name === poolType &&
                    b.swimming_styles?.name === swimmingStyle
                );

                // Define barrier hierarchy from lowest to highest
                const barrierHierarchy = ['B1', 'B2', 'A1', 'A2', 'A3', 'A4'];

                let bestBarrierName: string | null = null;
                let bestBarrierTime: number | null = null;
                let nextBarrierName: string | null = null;
                let nextBarrierTime: number | null = null;
                const allPassedBarriers: string[] = [];

                if (bestTime !== null) {
                    // Find passed barriers
                    const passed = categoryBarriers.filter(b => bestTime <= b.time_milliseconds);

                    // Sort passed by time ascending (hardest first) to find the best one
                    // Actually, 'Best' is the one with smallest time requirement that was passed.
                    // e.g. Passed A1 (30s) and A2 (32s) with 29s. Best is A1.
                    passed.sort((a, b) => a.time_milliseconds - b.time_milliseconds);

                    if (passed.length > 0) {
                        const best = passed[0]; // Hardest passed
                        bestBarrierName = best.barrier_types?.name || 'Bilinmiyor';
                        bestBarrierTime = best.time_milliseconds;
                        allPassedBarriers.push(...passed.map(p => p.barrier_types?.name));

                        // Find next barrier in hierarchy
                        const currentBarrierIndex = barrierHierarchy.indexOf(bestBarrierName || '');
                        if (currentBarrierIndex !== -1 && currentBarrierIndex < barrierHierarchy.length - 1) {
                            // There's a next barrier
                            const nextBarrierNameInHierarchy = barrierHierarchy[currentBarrierIndex + 1];
                            const nextBarrier = categoryBarriers.find(b => b.barrier_types?.name === nextBarrierNameInHierarchy);
                            if (nextBarrier) {
                                nextBarrierName = nextBarrier.barrier_types?.name || null;
                                nextBarrierTime = nextBarrier.time_milliseconds;
                            }
                        }
                    } else {
                        // No barriers passed, find the first barrier to aim for (B1)
                        const firstBarrier = categoryBarriers.find(b => b.barrier_types?.name === 'B1');
                        if (firstBarrier) {
                            nextBarrierName = firstBarrier.barrier_types?.name || null;
                            nextBarrierTime = firstBarrier.time_milliseconds;
                        }
                    }
                } else {
                    // No time recorded, show first barrier as target
                    const firstBarrier = categoryBarriers.find(b => b.barrier_types?.name === 'B1');
                    if (firstBarrier) {
                        nextBarrierName = firstBarrier.barrier_types?.name || null;
                        nextBarrierTime = firstBarrier.time_milliseconds;
                    }
                }

                results.push({
                    poolType,
                    swimmingStyle,
                    bestTime,
                    bestBarrierName,
                    bestBarrierTime,
                    allPassedBarriers,
                    nextBarrierName,
                    nextBarrierTime
                });
            });

            // Sort results by Pool (25m first) then Style
            results.sort((a, b) => {
                if (a.poolType !== b.poolType) return a.poolType.localeCompare(b.poolType);
                return a.swimmingStyle.localeCompare(b.swimmingStyle); // You might want custom style order
            });

            setData(results);

        } catch (err: any) {
            logger.error('barriers_load_error', { error: err });
            setError(err.message || 'Beklenmeyen bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [swimmerId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !swimmer) {
        return (
            <div className="p-8">
                <Card className="p-6 text-red-700">
                    {error || 'Sporcu bulunamadı'}
                </Card>
            </div>
        );
    }

    const isMale = swimmer.gender === 'Erkek';
    const themeClass = isMale ? 'text-blue-900' : 'text-pink-900';
    const borderClass = isMale ? 'border-blue-200' : 'border-pink-200';
    const bgHeaderClass = isMale ? 'bg-blue-50' : 'bg-pink-50';

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            {/* Header */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex gap-4">
                        {/* Swimmer Photo */}
                        <div className="flex-shrink-0">
                            <div className={`w-24 h-24 rounded-lg overflow-hidden border-2 ${isMale ? 'border-blue-200' : 'border-pink-200'} ${isMale ? 'bg-blue-100' : 'bg-pink-100'}`}>
                                {swimmer.photo_url ? (
                                    <img
                                        src={swimmer.photo_url}
                                        alt={`${swimmer.name} ${swimmer.surname}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className={`w-12 h-12 ${isMale ? 'text-blue-400' : 'text-pink-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Swimmer Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className={`text-3xl md:text-4xl font-bold ${themeClass}`}>
                                    {swimmer.name} {swimmer.surname}
                                </h1>
                            </div>
                            <div className={`flex flex-wrap gap-6 ${isMale ? 'text-blue-700' : 'text-pink-700'}`}>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span><span className="font-bold">Yaş:</span> {swimmer.age}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                    <span><span className="font-bold">Cinsiyet:</span> {swimmer.gender}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => router.push(`/swimmers/${swimmerId}`)}
                            variant={isMale ? 'secondary-blue' : 'secondary'}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profil
                        </Button>
                        <Button
                            onClick={() => router.push(`/swimmers/${swimmerId}/dashboard`)}
                            variant={isMale ? 'secondary-blue' : 'secondary'}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Dashboard
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${bgHeaderClass} border-b ${borderClass}`}>
                                <th className="p-4 font-semibold text-gray-700">Havuz</th>
                                <th className="p-4 font-semibold text-gray-700">Branş</th>
                                <th className="p-4 font-semibold text-gray-700">En İyi Derece</th>
                                <th className="p-4 font-semibold text-gray-700">Geçilen Baraj</th>
                                <th className="p-4 font-semibold text-gray-700">Baraj Derecesi</th>
                                <th className="p-4 font-semibold text-gray-700">Hedef Baraj</th>
                                <th className="p-4 font-semibold text-gray-700">Hedef Derece</th>
                                <th className="p-4 font-semibold text-gray-700">Kalan Süre</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 bg-white">
                                    <td className="p-4 text-gray-900 font-medium">{row.poolType}</td>
                                    <td className="p-4 text-gray-900">{row.swimmingStyle}</td>
                                    <td className="p-4 text-gray-900 font-mono">
                                        {row.bestTime ? formatTime(row.bestTime) : '-'}
                                    </td>
                                    <td className="p-4">
                                        {row.bestBarrierName ? (
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isMale ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                                {row.bestBarrierName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">Baraj geçilemedi</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-600 font-mono text-sm">
                                        {row.bestBarrierTime ? formatTime(row.bestBarrierTime) : '-'}
                                    </td>
                                    <td className="p-4">
                                        {row.nextBarrierName ? (
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isMale ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'}`}>
                                                {row.nextBarrierName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-600 font-mono text-sm">
                                        {row.nextBarrierTime ? formatTime(row.nextBarrierTime) : '-'}
                                    </td>
                                    <td className="p-4 text-gray-900 font-mono font-semibold">
                                        {row.bestTime && row.nextBarrierTime ? (
                                            <span className="text-orange-600">
                                                {((row.nextBarrierTime - row.bestTime) / 1000).toFixed(2)}s
                                            </span>
                                        ) : row.nextBarrierTime ? (
                                            <span className="text-gray-400 text-sm italic">Derece yok</span>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">
                                        Bu yaş grubu ve cinsiyet için tanımlı baraj bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
