'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Swimmer, RaceRecord, SwimmingStyle } from '@/lib/types';
import {
  getSwimmer,
  getRaceRecordsBySwimmerAndStyle,
  getAllSwimmingStyles,
} from '@/lib/supabase/queries';
import { logger } from '@/lib/logger';
import { prepareChartData, calculateTimeDifferences } from '@/lib/utils/chartData';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import ChartLegend from '@/components/dashboard/ChartLegend';
import BarrierEvaluation from '@/components/dashboard/BarrierEvaluation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SwimmerNavigation from '@/components/swimmers/SwimmerNavigation';

type PoolType = '25m' | '50m';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const swimmerId = params.id as string;

  const [swimmer, setSwimmer] = useState<Swimmer | null>(null);
  const [swimmingStyles, setSwimmingStyles] = useState<SwimmingStyle[]>([]);
  const [selectedPoolType, setSelectedPoolType] = useState<PoolType>('25m');
  const [racesByStyle, setRacesByStyle] = useState<Map<string, RaceRecord[]>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [expandedStyle, setExpandedStyle] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        // Fetch swimmer data
        const swimmerResult = await getSwimmer(swimmerId);
        if (swimmerResult.error || !swimmerResult.data) {
          logger.error('dashboard_fetch_swimmer_error', { error: swimmerResult.error });
          toast.error('Sporcu bilgileri yüklenirken bir hata oluştu');
          router.push('/swimmers');
          return;
        }
        setSwimmer(swimmerResult.data);

        // Fetch all swimming styles
        const stylesResult = await getAllSwimmingStyles();
        if (stylesResult.error || !stylesResult.data) {
          logger.error('dashboard_fetch_styles_error', { error: stylesResult.error });
          return;
        }
        setSwimmingStyles(stylesResult.data);

        // Fetch race records for each style and selected pool type
        const racesMap = new Map<string, RaceRecord[]>();
        for (const style of stylesResult.data) {
          const racesResult = await getRaceRecordsBySwimmerAndStyle(
            swimmerId,
            selectedPoolType,
            style.name
          );
          if (!racesResult.error && racesResult.data) {
            racesMap.set(style.name, racesResult.data);
          }
        }
        setRacesByStyle(racesMap);
      } catch (error) {
        logger.error('dashboard_fetch_data_error', { error });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [swimmerId, selectedPoolType, router]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!swimmer) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <p className="text-pink-700">Sporcu bulunamadı.</p>
          </Card>
        </div>
      </div>
    );
  }

  const isMale = swimmer.gender === 'Erkek';
  const colorClasses = {
    title: isMale ? 'text-blue-900' : 'text-pink-900',
    subtitle: isMale ? 'text-blue-700' : 'text-pink-700',
    border: isMale ? 'border-blue-200' : 'border-pink-200',
    tabActive: isMale ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50' : 'text-pink-700 border-b-2 border-pink-700 bg-pink-50',
    tabInactive: isMale ? 'text-blue-500 hover:text-blue-700 hover:bg-blue-50' : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50',
    emptyIcon: isMale ? 'text-blue-300' : 'text-pink-300',
    emptyText: isMale ? 'text-blue-700' : 'text-pink-700',
  };

  // Define stroke type order
  const strokeOrder: Record<string, number> = {
    'Serbest': 1,
    'Sırtüstü': 2,
    'Kurbağalama': 3,
    'Kelebek': 4,
    'Karışık': 5,
  };

  // Sort swimming styles by stroke type first, then by distance
  const sortedSwimmingStyles = [...swimmingStyles].sort((a, b) => {
    // First, sort by stroke type
    const strokeOrderA = strokeOrder[a.stroke_type] || 999;
    const strokeOrderB = strokeOrder[b.stroke_type] || 999;

    if (strokeOrderA !== strokeOrderB) {
      return strokeOrderA - strokeOrderB;
    }

    // If same stroke type, sort by distance (ascending)
    return a.distance_meters - b.distance_meters;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-8 p-6">
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
                  <h1 className={`text-3xl md:text-4xl font-bold ${colorClasses.title}`}>
                    {swimmer.name} {swimmer.surname}
                  </h1>
                </div>
                <div className={`flex flex-wrap gap-6 ${colorClasses.subtitle}`}>
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

            <SwimmerNavigation
              swimmerId={swimmerId}
              isMale={isMale}
              onAddRace={() => router.push(`/swimmers/${swimmerId}`)}
            />
          </div>
        </Card>

        {/* Pool Type Tabs */}
        <div className="mb-8">
          <div className={`flex gap-2 md:gap-4 border-b ${colorClasses.border}`}>
            <button
              onClick={() => setSelectedPoolType('25m')}
              className={`px-4 md:px-6 py-3 font-semibold transition-all duration-200 ${selectedPoolType === '25m'
                ? colorClasses.tabActive
                : colorClasses.tabInactive
                }`}
            >
              25m Havuz
            </button>
            <button
              onClick={() => setSelectedPoolType('50m')}
              className={`px-4 md:px-6 py-3 font-semibold transition-all duration-200 ${selectedPoolType === '50m'
                ? colorClasses.tabActive
                : colorClasses.tabInactive
                }`}
            >
              50m Havuz
            </button>
          </div>
        </div>

        {/* Charts Accordion */}
        <div className="space-y-4">
          {sortedSwimmingStyles.map((style) => {
            const races = racesByStyle.get(style.name) || [];

            // Only show styles that have data
            if (races.length === 0) {
              return null;
            }

            const chartData = prepareChartData(races);
            const dataWithDifferences = calculateTimeDifferences(chartData);
            const isExpanded = expandedStyle === style.name;

            return (
              <Card key={style.id} className="overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedStyle(isExpanded ? null : style.name)}
                  className={`w-full p-4 md:p-6 flex items-center justify-between transition-colors ${isMale
                    ? 'hover:bg-blue-50'
                    : 'hover:bg-pink-50'
                    }`}
                >
                  <h3 className={`text-lg md:text-xl font-semibold ${colorClasses.title}`}>
                    {style.name}
                  </h3>
                  <svg
                    className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                      } ${colorClasses.subtitle}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="p-4 md:p-6 pt-0 border-t border-gray-100">
                    <PerformanceChart
                      data={dataWithDifferences}
                      swimmingStyle={style.name}
                    />
                    <ChartLegend data={dataWithDifferences} />
                    <BarrierEvaluation
                      swimmerId={swimmerId}
                      age={swimmer.age}
                      gender={swimmer.gender}
                      poolType={selectedPoolType}
                      swimmingStyle={style.name}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {Array.from(racesByStyle.values()).every((races) => races.length === 0) && (
          <Card className="p-12">
            <div className="text-center">
              <svg className={`mx-auto h-16 w-16 ${colorClasses.emptyIcon} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className={`${colorClasses.emptyText} text-xl font-medium mb-4`}>
                {selectedPoolType} havuz için henüz yarış kaydı bulunmamaktadır.
              </p>
              <Button
                onClick={() => router.push(`/swimmers/${swimmerId}`)}
                variant={isMale ? 'primary-blue' : 'primary'}
              >
                Yarış Ekle
              </Button>
            </div>
          </Card>
        )}


      </div>
    </div>
  );
}
