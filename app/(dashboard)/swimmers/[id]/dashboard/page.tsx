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
import { prepareChartData, calculateTimeDifferences } from '@/lib/utils/chartData';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import ChartLegend from '@/components/dashboard/ChartLegend';
import BarrierEvaluation from '@/components/dashboard/BarrierEvaluation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        // Fetch swimmer data
        const swimmerResult = await getSwimmer(swimmerId);
        if (swimmerResult.error || !swimmerResult.data) {
          console.error('Error fetching swimmer:', swimmerResult.error);
          toast.error('Sporcu bilgileri yüklenirken bir hata oluştu');
          router.push('/swimmers');
          return;
        }
        setSwimmer(swimmerResult.data);

        // Fetch all swimming styles
        const stylesResult = await getAllSwimmingStyles();
        if (stylesResult.error || !stylesResult.data) {
          console.error('Error fetching styles:', stylesResult.error);
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
        console.error('Error fetching dashboard data:', error);
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

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex gap-4 items-start">
            {/* Swimmer Photo */}
            <div className="flex-shrink-0">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 ${isMale ? 'border-blue-200' : 'border-pink-200'} ${isMale ? 'bg-blue-100' : 'bg-pink-100'}`}>
                {swimmer.photo_url ? (
                  <img
                    src={swimmer.photo_url}
                    alt={`${swimmer.name} ${swimmer.surname}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className={`w-10 h-10 md:w-12 md:h-12 ${isMale ? 'text-blue-400' : 'text-pink-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Swimmer Info */}
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${colorClasses.title} mb-3`}>
                {swimmer.name} {swimmer.surname}
              </h1>
              <p className={`${colorClasses.subtitle} text-lg`}>
                {swimmer.age} yaş • {swimmer.gender}
              </p>
            </div>
          </div>
        </div>

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

        {/* Charts Grid */}
        <div className="space-y-8">
          {swimmingStyles.map((style) => {
            const races = racesByStyle.get(style.name) || [];

            // Only show styles that have data
            if (races.length === 0) {
              return null;
            }

            const chartData = prepareChartData(races);
            const dataWithDifferences = calculateTimeDifferences(chartData);

            return (
              <Card key={style.id} className="p-4 md:p-6">
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

        {/* Back Button */}
        <div className="mt-8">
          <Button
            onClick={() => router.push(`/swimmers/${swimmerId}`)}
            variant={isMale ? 'ghost-blue' : 'ghost'}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Sporcu Profiline Dön
          </Button>
        </div>
      </div>
    </div>
  );
}
