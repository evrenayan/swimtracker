'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import { formatTime } from '@/lib/utils/timeFormat';

interface BarrierTableProps {
    barriers: any[];
    onEdit: (barrier: any) => void;
    onDelete: (barrierId: string) => void;
    isAdmin?: boolean;
}

export default function BarrierTable({ barriers, onEdit, onDelete, isAdmin = false }: BarrierTableProps) {
    const [filters, setFilters] = useState({
        age: '',
        gender: '',
        pool: '',
        style: '',
        barrierType: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Extract unique values for dropdowns
    const uniqueValues = useMemo(() => {
        const ages = new Set<number>();
        const genders = new Set<string>();
        const pools = new Set<string>();
        const styles = new Set<string>();
        const barrierTypes = new Set<string>();

        barriers.forEach(b => {
            if (b.age) ages.add(b.age);
            if (b.gender) genders.add(b.gender);
            if (b.pool_types?.name) pools.add(b.pool_types.name);
            if (b.swimming_styles) {
                styles.add(`${b.swimming_styles.distance_meters}m ${b.swimming_styles.stroke_type}`);
            }
            if (b.barrier_types?.name) barrierTypes.add(b.barrier_types.name);
        });

        return {
            ages: Array.from(ages).sort((a, b) => a - b),
            genders: Array.from(genders).sort(),
            pools: Array.from(pools).sort(),
            styles: Array.from(styles).sort(),
            barrierTypes: Array.from(barrierTypes).sort(),
        };
    }, [barriers]);

    // Filter barriers
    const filteredBarriers = useMemo(() => {
        return barriers.filter(barrier => {
            const styleName = `${barrier.swimming_styles?.distance_meters}m ${barrier.swimming_styles?.stroke_type}`;

            return (
                (!filters.age || barrier.age.toString() === filters.age) &&
                (!filters.gender || barrier.gender === filters.gender) &&
                (!filters.pool || barrier.pool_types?.name === filters.pool) &&
                (!filters.style || styleName === filters.style) &&
                (!filters.barrierType || barrier.barrier_types?.name === filters.barrierType)
            );
        });
    }, [barriers, filters]);

    // Paginate barriers
    const paginatedBarriers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBarriers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBarriers, currentPage]);

    const totalPages = Math.ceil(filteredBarriers.length / itemsPerPage);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    if (barriers.length === 0) {
        return (
            <Card className="p-8">
                <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-lg font-medium text-pink-900 mb-1">Henüz baraj tanımlanmamış</p>
                    {isAdmin && (
                        <p className="text-sm">Yeni bir baraj eklemek için yukarıdaki butona tıklayın</p>
                    )}
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-pink-100 to-pink-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                                <div className="flex flex-col gap-2">
                                    <span>Yaş</span>
                                    <select
                                        className="text-xs border-pink-200 rounded-md focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                                        value={filters.age}
                                        onChange={(e) => handleFilterChange('age', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        {uniqueValues.ages.map(age => (
                                            <option key={age} value={age}>{age}</option>
                                        ))}
                                    </select>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                                <div className="flex flex-col gap-2">
                                    <span>Cinsiyet</span>
                                    <select
                                        className="text-xs border-pink-200 rounded-md focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                                        value={filters.gender}
                                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        {uniqueValues.genders.map(gender => (
                                            <option key={gender} value={gender}>{gender}</option>
                                        ))}
                                    </select>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                                <div className="flex flex-col gap-2">
                                    <span>Havuz</span>
                                    <select
                                        className="text-xs border-pink-200 rounded-md focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                                        value={filters.pool}
                                        onChange={(e) => handleFilterChange('pool', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        {uniqueValues.pools.map(pool => (
                                            <option key={pool} value={pool}>{pool}</option>
                                        ))}
                                    </select>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                                <div className="flex flex-col gap-2">
                                    <span>Stil</span>
                                    <select
                                        className="text-xs border-pink-200 rounded-md focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                                        value={filters.style}
                                        onChange={(e) => handleFilterChange('style', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        {uniqueValues.styles.map(style => (
                                            <option key={style} value={style}>{style}</option>
                                        ))}
                                    </select>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">
                                <div className="flex flex-col gap-2">
                                    <span>Baraj Tipi</span>
                                    <select
                                        className="text-xs border-pink-200 rounded-md focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                                        value={filters.barrierType}
                                        onChange={(e) => handleFilterChange('barrierType', e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        {uniqueValues.barrierTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider align-top">
                                <span className="mt-1 block">Süre</span>
                            </th>
                            {isAdmin && (
                                <th className="px-6 py-4 text-right text-xs font-semibold text-pink-900 uppercase tracking-wider align-top">
                                    <span className="mt-1 block">İşlemler</span>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-pink-100">
                        {paginatedBarriers.length > 0 ? (
                            paginatedBarriers.map((barrier) => (
                                <tr key={barrier.id} className="hover:bg-pink-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {barrier.age}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${barrier.gender === 'Erkek'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-pink-100 text-pink-800'
                                            }`}>
                                            {barrier.gender}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {barrier.pool_types?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {barrier.swimming_styles?.distance_meters}m {barrier.swimming_styles?.stroke_type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {barrier.barrier_types?.name || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatTime(barrier.time_milliseconds)}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(barrier)}
                                                    className="text-pink-600 hover:text-pink-900 transition-colors duration-150"
                                                    title="Düzenle"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => onDelete(barrier.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                                    title="Sil"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    Filtrelere uygun kayıt bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-pink-100 flex items-center justify-between bg-pink-50/30">
                    <div className="text-sm text-pink-700">
                        Toplam <span className="font-medium">{filteredBarriers.length}</span> kayıttan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredBarriers.length)}</span> arası gösteriliyor
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-medium text-pink-700 bg-white border border-pink-200 rounded-md hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Önceki
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${currentPage === page
                                    ? 'bg-pink-600 text-white border border-pink-600'
                                    : 'text-pink-700 bg-white border border-pink-200 hover:bg-pink-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm font-medium text-pink-700 bg-white border border-pink-200 rounded-md hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sonraki
                        </button>
                    </div>
                </div>
            )}
        </Card>
    );
}
