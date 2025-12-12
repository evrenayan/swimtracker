'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  getAllPoolTypes,
  getAllSwimmingStyles,
  createRaceRecord,
  updateRaceRecord,
} from '@/lib/supabase/queries';
import { timeToMilliseconds, millisecondsToTime } from '@/lib/utils/timeFormat';
import type { PoolType, SwimmingStyle, RaceRecord } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Validation schema
const raceFormSchema = z.object({
  pool_type: z.string().min(1, 'Havuz tipi seçilmelidir'),
  swimming_style: z.string().min(1, 'Yüzme stili seçilmelidir'),
  month: z.number().min(1, 'Ay 1-12 arasında olmalıdır').max(12, 'Ay 1-12 arasında olmalıdır'),
  year: z.number().min(2000, 'Geçerli bir yıl giriniz').max(2100, 'Geçerli bir yıl giriniz'),
  minutes: z.number().min(0, 'Dakika 0 veya daha büyük olmalıdır').max(59, 'Dakika 59\'dan küçük olmalıdır'),
  seconds: z.number().min(0, 'Saniye 0 veya daha büyük olmalıdır').max(59, 'Saniye 59\'dan küçük olmalıdır'),
  milliseconds: z.number().min(0, 'Salise 0 veya daha büyük olmalıdır').max(99, 'Salise 99\'dan küçük olmalıdır'),
});

type RaceFormData = z.infer<typeof raceFormSchema>;

interface RaceFormProps {
  swimmerId: string;
  existingRace?: RaceRecord;
  onSuccess: (race: RaceRecord) => void;
  onCancel: () => void;
}

export default function RaceForm({
  swimmerId,
  existingRace,
  onSuccess,
  onCancel,
}: RaceFormProps) {
  const [poolTypes, setPoolTypes] = useState<PoolType[]>([]);
  const [swimmingStyles, setSwimmingStyles] = useState<SwimmingStyle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const isEditMode = !!existingRace;

  // Initialize form with default or existing values
  const defaultValues: RaceFormData = existingRace
    ? {
      pool_type: existingRace.pool_type,
      swimming_style: existingRace.swimming_style,
      month: existingRace.month,
      year: existingRace.year,
      ...millisecondsToTime(existingRace.total_milliseconds),
    }
    : {
      pool_type: '',
      swimming_style: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RaceFormData>({
    resolver: zodResolver(raceFormSchema),
    defaultValues,
  });

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    setIsLoadingData(true);
    try {
      const [poolTypesResult, stylesResult] = await Promise.all([
        getAllPoolTypes(),
        getAllSwimmingStyles(),
      ]);

      if (poolTypesResult.data) {
        setPoolTypes(poolTypesResult.data);
      }

      if (stylesResult.data) {
        setSwimmingStyles(stylesResult.data);
      }

      setIsLoadingData(false);
    } catch (err) {
      toast.error('Referans verileri yüklenirken bir hata oluştu');
      setIsLoadingData(false);
    }
  };

  const onSubmit = async (data: RaceFormData) => {
    setIsLoading(true);

    try {
      const totalMilliseconds = timeToMilliseconds({
        minutes: data.minutes,
        seconds: data.seconds,
        milliseconds: data.milliseconds,
      });

      const raceData = {
        swimmer_id: swimmerId,
        pool_type: data.pool_type as '25m' | '50m',
        swimming_style: data.swimming_style,
        month: data.month,
        year: data.year,
        total_milliseconds: totalMilliseconds,
      };

      let result;
      if (isEditMode && existingRace) {
        result = await updateRaceRecord(existingRace.id, raceData);
      } else {
        result = await createRaceRecord(raceData);
      }

      if (result.error || !result.data) {
        const errorMsg = result.error?.message || 'Yarış kaydedilirken bir hata oluştu';
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      toast.success(isEditMode ? 'Yarış başarıyla güncellendi!' : 'Yarış başarıyla eklendi!');
      onSuccess(result.data);
    } catch (err) {
      toast.error('Beklenmeyen bir hata oluştu');
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Pool Type */}
      <div className="w-full">
        <label htmlFor="pool_type" className="block text-sm font-medium text-pink-900 mb-1.5">
          Havuz Tipi
        </label>
        <select
          id="pool_type"
          {...register('pool_type')}
          className={`
            w-full px-4 py-2 rounded-lg border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
            ${errors.pool_type
              ? 'border-red-300 bg-red-50 text-red-900'
              : 'border-pink-200 bg-white text-gray-900 hover:border-pink-300'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          disabled={isLoading}
        >
          <option value="">Seçiniz</option>
          {poolTypes.map((poolType) => (
            <option key={poolType.id} value={poolType.name}>
              {poolType.name}
            </option>
          ))}
        </select>
        {errors.pool_type && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.pool_type.message}
          </p>
        )}
      </div>

      {/* Swimming Style */}
      <div className="w-full">
        <label htmlFor="swimming_style" className="block text-sm font-medium text-pink-900 mb-1.5">
          Yüzme Stili
        </label>
        <select
          id="swimming_style"
          {...register('swimming_style')}
          className={`
            w-full px-4 py-2 rounded-lg border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
            ${errors.swimming_style
              ? 'border-red-300 bg-red-50 text-red-900'
              : 'border-pink-200 bg-white text-gray-900 hover:border-pink-300'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          disabled={isLoading}
        >
          <option value="">Seçiniz</option>
          {swimmingStyles.map((style) => (
            <option key={style.id} value={style.name}>
              {style.name}
            </option>
          ))}
        </select>
        {errors.swimming_style && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.swimming_style.message}
          </p>
        )}
      </div>

      {/* Date - Month and Year */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Ay"
          type="number"
          placeholder="1-12"
          min="1"
          max="12"
          error={errors.month?.message}
          disabled={isLoading}
          {...register('month', { valueAsNumber: true })}
        />
        <Input
          label="Yıl"
          type="number"
          placeholder="2024"
          min="2000"
          max="2100"
          error={errors.year?.message}
          disabled={isLoading}
          {...register('year', { valueAsNumber: true })}
        />
      </div>

      {/* Time - MM:SS:ss */}
      <div>
        <label className="block text-sm font-medium text-pink-900 mb-1.5">
          Süre (Dakika:Saniye:Salise)
        </label>
        <div className="grid grid-cols-3 gap-3">
          <Input
            type="number"
            placeholder="Dk"
            min="0"
            max="59"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.value.length > 2) {
                target.value = target.value.slice(0, 2);
              }
            }}
            error={errors.minutes?.message}
            disabled={isLoading}
            {...register('minutes', { valueAsNumber: true })}
          />
          <Input
            type="number"
            placeholder="Sn"
            min="0"
            max="59"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.value.length > 2) {
                target.value = target.value.slice(0, 2);
              }
            }}
            error={errors.seconds?.message}
            disabled={isLoading}
            {...register('seconds', { valueAsNumber: true })}
          />
          <Input
            type="number"
            placeholder="Ss"
            min="0"
            max="99"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.value.length > 2) {
                target.value = target.value.slice(0, 2);
              }
            }}
            error={errors.milliseconds?.message}
            disabled={isLoading}
            {...register('milliseconds', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          {isEditMode ? 'Güncelle' : 'Kaydet'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
