'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { createBarrierValue, updateBarrierValue } from '@/lib/supabase/queries';
import type { PoolType, SwimmingStyle, BarrierType } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { parseTime } from '@/lib/utils/timeFormat';

const barrierSchema = z.object({
    age: z.string().min(1, 'Yaş gereklidir').refine(
        (val) => {
            const num = parseInt(val, 10);
            return !isNaN(num) && num >= 1 && num <= 99;
        },
        'Yaş 1 ile 99 arasında olmalıdır'
    ),
    gender: z.string().min(1, 'Cinsiyet seçilmelidir'),
    pool_type_id: z.string().min(1, 'Havuz tipi seçilmelidir'),
    swimming_style_id: z.string().min(1, 'Yüzme stili seçilmelidir'),
    barrier_type_id: z.string().min(1, 'Baraj tipi seçilmelidir'),
    time: z.string().min(1, 'Süre gereklidir').regex(
        /^\d{1,2}:\d{2}:\d{3}$/,
        'Süre formatı MM:SS:mmm olmalıdır (örn: 1:23:456)'
    ),
});

type BarrierFormData = z.infer<typeof barrierSchema>;

interface BarrierFormProps {
    existingBarrier?: any;
    poolTypes: PoolType[];
    swimmingStyles: SwimmingStyle[];
    barrierTypes: BarrierType[];
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function BarrierForm({
    existingBarrier,
    poolTypes,
    swimmingStyles,
    barrierTypes,
    onSuccess,
    onCancel,
}: BarrierFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<BarrierFormData>({
        resolver: zodResolver(barrierSchema),
        defaultValues: existingBarrier
            ? {
                age: existingBarrier.age.toString(),
                gender: existingBarrier.gender,
                pool_type_id: existingBarrier.pool_type_id,
                swimming_style_id: existingBarrier.swimming_style_id,
                barrier_type_id: existingBarrier.barrier_type_id,
                time: formatTimeFromMs(existingBarrier.time_milliseconds),
            }
            : {
                age: '',
                gender: '',
                pool_type_id: '',
                swimming_style_id: '',
                barrier_type_id: '',
                time: '',
            },
    });

    function formatTimeFromMs(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = ms % 1000;
        return `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
    }

    const onSubmit = async (data: BarrierFormData) => {
        setIsSubmitting(true);

        try {
            const timeMs = parseTime(data.time);

            const barrierData = {
                age: parseInt(data.age, 10),
                gender: data.gender as 'Erkek' | 'Kadın',
                pool_type_id: data.pool_type_id,
                swimming_style_id: data.swimming_style_id,
                barrier_type_id: data.barrier_type_id,
                time_milliseconds: timeMs,
            };

            let result;
            if (existingBarrier) {
                result = await updateBarrierValue(existingBarrier.id, barrierData);
            } else {
                result = await createBarrierValue(barrierData);
            }

            if (result.error || !result.data) {
                const errorMsg = result.error?.message || 'Baraj kaydedilirken bir hata oluştu';
                toast.error(errorMsg);
                setIsSubmitting(false);
                return;
            }

            reset();
            toast.success(existingBarrier ? 'Baraj başarıyla güncellendi!' : 'Baraj başarıyla eklendi!');
            onSuccess?.();
        } catch (error) {
            const errorMsg = 'Beklenmeyen bir hata oluştu';
            toast.error(errorMsg);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    id="age"
                    label="Yaş"
                    type="number"
                    placeholder="Yaş girin"
                    error={errors.age?.message}
                    disabled={isSubmitting}
                    autoComplete="off"
                    data-lpignore="true"
                    {...register('age')}
                />

                <div className="w-full">
                    <label htmlFor="gender" className="block text-sm font-medium text-pink-900 mb-1.5">
                        Cinsiyet
                    </label>
                    <select
                        id="gender"
                        {...register('gender')}
                        className={`
              w-full px-4 py-2 rounded-lg border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
              ${errors.gender
                                ? 'border-red-300 bg-red-50 text-red-900'
                                : 'border-pink-200 bg-white text-gray-900 hover:border-pink-300'
                            }
              disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
                        disabled={isSubmitting}
                        autoComplete="off"
                        data-lpignore="true"
                    >
                        <option value="">Seçiniz</option>
                        <option value="Erkek">Erkek</option>
                        <option value="Kadın">Kadın</option>
                    </select>
                    {errors.gender && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.gender.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                    <label htmlFor="pool_type_id" className="block text-sm font-medium text-pink-900 mb-1.5">
                        Havuz Tipi
                    </label>
                    <select
                        id="pool_type_id"
                        {...register('pool_type_id')}
                        className={`
              w-full px-4 py-2 rounded-lg border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
              ${errors.pool_type_id
                                ? 'border-red-300 bg-red-50 text-red-900'
                                : 'border-pink-200 bg-white text-gray-900 hover:border-pink-300'
                            }
              disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
                        disabled={isSubmitting}
                        autoComplete="off"
                        data-lpignore="true"
                    >
                        <option value="">Seçiniz</option>
                        {poolTypes.map((poolType) => (
                            <option key={poolType.id} value={poolType.id}>
                                {poolType.name}
                            </option>
                        ))}
                    </select>
                    {errors.pool_type_id && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.pool_type_id.message}
                        </p>
                    )}
                </div>

                <div className="w-full">
                    <label htmlFor="swimming_style_id" className="block text-sm font-medium text-pink-900 mb-1.5">
                        Yüzme Stili
                    </label>
                    <select
                        id="swimming_style_id"
                        {...register('swimming_style_id')}
                        className={`
              w-full px-4 py-2 rounded-lg border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
              ${errors.swimming_style_id
                                ? 'border-red-300 bg-red-50 text-red-900'
                                : 'border-pink-200 bg-white text-gray-900 hover:border-pink-300'
                            }
              disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
                        disabled={isSubmitting}
                        autoComplete="off"
                        data-lpignore="true"
                    >
                        <option value="">Seçiniz</option>
                        {swimmingStyles.map((style) => (
                            <option key={style.id} value={style.id}>
                                {style.distance_meters}m {style.stroke_type}
                            </option>
                        ))}
                    </select>
                    {errors.swimming_style_id && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.swimming_style_id.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                    <label htmlFor="barrier_type_id" className="block text-sm font-medium text-pink-900 mb-1.5">
                        Baraj Tipi
                    </label>
                    <select
                        id="barrier_type_id"
                        {...register('barrier_type_id')}
                        className={`
              w-full px-4 py-2 rounded-lg border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
              ${errors.barrier_type_id
                                ? 'border-red-300 bg-red-50 text-red-900'
                                : 'border-pink-200 bg-white text-gray-900 hover:border-pink-300'
                            }
              disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
                        disabled={isSubmitting}
                        autoComplete="off"
                        data-lpignore="true"
                    >
                        <option value="">Seçiniz</option>
                        {barrierTypes.map((barrierType) => (
                            <option key={barrierType.id} value={barrierType.id}>
                                {barrierType.name}
                            </option>
                        ))}
                    </select>
                    {errors.barrier_type_id && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.barrier_type_id.message}
                        </p>
                    )}
                </div>

                <Input
                    id="time"
                    label="Süre (MM:SS:mmm)"
                    type="text"
                    placeholder="Örn: 1:23:456"
                    error={errors.time?.message}
                    disabled={isSubmitting}
                    helperText="Format: Dakika:Saniye:Milisaniye"
                    autoComplete="off"
                    data-lpignore="true"
                    {...register('time')}
                />
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    className="flex-1"
                >
                    {existingBarrier ? 'Güncelle' : 'Kaydet'}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        İptal
                    </Button>
                )}
            </div>
        </form>
    );
}
