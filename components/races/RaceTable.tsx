'use client';

import { useState, useMemo } from 'react';
import { formatTime } from '@/lib/utils/timeFormat';
import type { RaceRecord } from '@/lib/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RaceTableProps {
  races: RaceRecord[];
  onEdit: (race: RaceRecord) => void;
  onDelete: (raceId: string) => void;
  isLoading?: boolean;
  swimmerGender?: string;
}

export default function RaceTable({
  races,
  onEdit,
  onDelete,
  isLoading = false,
  swimmerGender = 'Kadın', // Default to female/pink if not provided
}: RaceTableProps) {
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const isMale = swimmerGender === 'Erkek';
  const colorClasses = {
    headerBg: isMale ? 'bg-gradient-to-r from-blue-200 to-blue-100 border-blue-300' : 'bg-gradient-to-r from-pink-200 to-pink-100 border-pink-300',
    headerText: isMale ? 'text-blue-950' : 'text-pink-950',
    select: isMale ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500' : 'border-pink-300 focus:ring-pink-500 focus:border-pink-500',
    rowBorder: isMale ? 'border-blue-100' : 'border-pink-100',
    rowHover: isMale ? 'hover:bg-blue-50' : 'hover:bg-pink-50',
    rowAltBg: isMale ? 'bg-blue-50/30' : 'bg-pink-50/30',
    textPrimary: isMale ? 'text-blue-800' : 'text-pink-800',
    textSecondary: isMale ? 'text-blue-700' : 'text-pink-700',
    emptyIcon: isMale ? 'text-blue-300' : 'text-pink-300',
    emptyText: isMale ? 'text-blue-700' : 'text-pink-700',
    emptySubtext: isMale ? 'text-blue-500' : 'text-pink-500',
    paginationBorder: isMale ? 'border-blue-100' : 'border-pink-100',
    paginationBg: isMale ? 'bg-blue-50/30' : 'bg-pink-50/30',
    paginationText: isMale ? 'text-blue-700' : 'text-pink-700',
    paginationBtn: isMale ? 'text-blue-700 border-blue-200 hover:bg-blue-50' : 'text-pink-700 border-pink-200 hover:bg-pink-50',
    paginationActive: isMale ? 'bg-blue-600 text-white border-blue-600' : 'bg-pink-600 text-white border-pink-600',
  };

  const [filters, setFilters] = useState({
    poolType: '',
    swimmingStyle: '',
    date: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const formatDate = (month: number, year: number): string => {
    return `${monthNames[month - 1]} ${year}`;
  };

  // Extract unique values for dropdowns
  const uniqueValues = useMemo(() => {
    const poolTypes = new Set<string>();
    const swimmingStyles = new Set<string>();
    const dates = new Set<string>();

    races.forEach(race => {
      if (race.pool_type) poolTypes.add(race.pool_type);
      if (race.swimming_style) swimmingStyles.add(race.swimming_style);
      dates.add(formatDate(race.month, race.year));
    });

    return {
      poolTypes: Array.from(poolTypes).sort(),
      swimmingStyles: Array.from(swimmingStyles).sort(),
      dates: Array.from(dates).sort((a, b) => {
        // Sort dates chronologically
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const yearDiff = parseInt(yearB) - parseInt(yearA);
        if (yearDiff !== 0) return yearDiff;
        return monthNames.indexOf(monthB) - monthNames.indexOf(monthA);
      }),
    };
  }, [races]);

  // Filter races
  const filteredRaces = useMemo(() => {
    return races.filter(race => {
      const raceDate = formatDate(race.month, race.year);

      return (
        (!filters.poolType || race.pool_type === filters.poolType) &&
        (!filters.swimmingStyle || race.swimming_style === filters.swimmingStyle) &&
        (!filters.date || raceDate === filters.date)
      );
    });
  }, [races, filters]);

  // Paginate races
  const paginatedRaces = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRaces.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRaces, currentPage]);

  const totalPages = Math.ceil(filteredRaces.length / itemsPerPage);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (races.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <svg className={`mx-auto h-16 w-16 ${colorClasses.emptyIcon} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className={`${colorClasses.emptyText} text-xl font-medium mb-2`}>Henüz yarış kaydı eklenmemiş</p>
          <p className={colorClasses.emptySubtext}>
            Başlamak için &quot;Yeni Yarış Ekle&quot; butonuna tıklayın
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${colorClasses.headerBg} border-b-2`}>
              <th className={`text-left px-6 py-4 ${colorClasses.headerText} font-semibold text-sm uppercase tracking-wide`}>
                <div className="flex flex-col gap-2">
                  <span>Havuz Tipi</span>
                  <select
                    className={`text-xs rounded-md bg-white/50 ${colorClasses.select}`}
                    value={filters.poolType}
                    onChange={(e) => handleFilterChange('poolType', e.target.value)}
                  >
                    <option value="">Tümü</option>
                    {uniqueValues.poolTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </th>
              <th className={`text-left px-6 py-4 ${colorClasses.headerText} font-semibold text-sm uppercase tracking-wide`}>
                <div className="flex flex-col gap-2">
                  <span>Yüzme Stili</span>
                  <select
                    className={`text-xs rounded-md bg-white/50 ${colorClasses.select}`}
                    value={filters.swimmingStyle}
                    onChange={(e) => handleFilterChange('swimmingStyle', e.target.value)}
                  >
                    <option value="">Tümü</option>
                    {uniqueValues.swimmingStyles.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
              </th>
              <th className={`text-left px-6 py-4 ${colorClasses.headerText} font-semibold text-sm uppercase tracking-wide`}>
                <div className="flex flex-col gap-2">
                  <span>Tarih</span>
                  <select
                    className={`text-xs rounded-md bg-white/50 ${colorClasses.select}`}
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  >
                    <option value="">Tümü</option>
                    {uniqueValues.dates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
              </th>
              <th className={`text-left px-6 py-4 ${colorClasses.headerText} font-semibold text-sm uppercase tracking-wide align-top`}>
                <span className="mt-1 block">Süre</span>
              </th>
              <th className={`text-right px-6 py-4 ${colorClasses.headerText} font-semibold text-sm uppercase tracking-wide align-top`}>
                <span className="mt-1 block">İşlemler</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRaces.length > 0 ? (
              paginatedRaces.map((race, index) => (
                <tr
                  key={race.id}
                  className={`border-b ${colorClasses.rowBorder} ${colorClasses.rowHover} transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : colorClasses.rowAltBg
                    }`}
                >
                  <td className={`px-6 py-4 ${colorClasses.textPrimary} font-medium`}>
                    {race.pool_type}
                  </td>
                  <td className={`px-6 py-4 ${colorClasses.textSecondary}`}>
                    {race.swimming_style}
                  </td>
                  <td className={`px-6 py-4 ${colorClasses.textSecondary}`}>
                    {formatDate(race.month, race.year)}
                  </td>
                  <td className={`px-6 py-4 ${colorClasses.textPrimary} font-mono font-semibold`}>
                    {formatTime(race.total_milliseconds)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={() => onEdit(race)}
                        variant={isMale ? 'secondary-blue' : 'secondary'}
                        size="sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Düzenle
                      </Button>
                      <Button
                        onClick={() => onDelete(race.id)}
                        variant="danger"
                        size="sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Sil
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Filtrelere uygun kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={`px-6 py-4 border-t ${colorClasses.paginationBorder} flex items-center justify-between ${colorClasses.paginationBg}`}>
          <div className={`text-sm ${colorClasses.paginationText}`}>
            Toplam <span className="font-medium">{filteredRaces.length}</span> kayıttan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredRaces.length)}</span> arası gösteriliyor
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm font-medium bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${colorClasses.paginationBtn}`}
            >
              Önceki
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${currentPage === page
                  ? colorClasses.paginationActive
                  : `bg-white border ${colorClasses.paginationBtn}`
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm font-medium bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${colorClasses.paginationBtn}`}
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
