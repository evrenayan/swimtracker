'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { createSwimmer, updateSwimmer, getAvailableUsers } from '@/lib/supabase/queries';
import { isAdmin } from '@/lib/auth/auth';
import type { Swimmer, UserProfile } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

// Zod schema for swimmer form validation
const swimmerSchema = z.object({
  name: z.string().min(1, 'İsim gereklidir'),
  surname: z.string().min(1, 'Soyisim gereklidir'),
  age: z.string().min(1, 'Yaş gereklidir').refine(
    (val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1 && num <= 99;
    },
    'Yaş 1 ile 99 arasında olmalıdır'
  ),
  gender: z.string().min(1, 'Cinsiyet seçilmelidir'),
  user_id: z.string().optional(),
});

type SwimmerFormData = z.infer<typeof swimmerSchema>;

interface SwimmerFormProps {
  swimmer?: Swimmer;
  onSuccess?: (swimmer: Swimmer) => void;
  onCancel?: () => void;
}

export default function SwimmerForm({ swimmer, onSuccess, onCancel }: SwimmerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SwimmerFormData>({
    resolver: zodResolver(swimmerSchema),
    defaultValues: {
      name: swimmer?.name || '',
      surname: swimmer?.surname || '',
      age: swimmer?.age?.toString() || '',
      gender: swimmer?.gender || '',
      user_id: swimmer?.user_id || '',
    },
  });

  useEffect(() => {
    const loadData = async () => {
      // Check if user is admin
      const adminStatus = await isAdmin();
      setIsUserAdmin(adminStatus);

      // Only load available users if admin
      if (adminStatus) {
        try {
          // Use API route instead of direct Supabase query
          const response = await fetch(
            `/api/users/available?currentUserId=${swimmer?.user_id || ''}`
          );

          if (response.ok) {
            const result = await response.json();
            if (result.data) {
              setAvailableUsers(result.data);
            }
          } else {
            console.error('Failed to fetch available users:', await response.text());
          }
        } catch (error) {
          console.error('Error loading available users:', error);
        }
      }
      setLoadingUsers(false);
    };

    loadData();
  }, [swimmer]);

  // Reset form when swimmer changes
  useEffect(() => {
    if (swimmer) {
      reset({
        name: swimmer.name,
        surname: swimmer.surname,
        age: swimmer.age.toString(),
        gender: swimmer.gender,
        user_id: swimmer.user_id || '',
      });
    } else {
      reset({
        name: '',
        surname: '',
        age: '',
        gender: '',
        user_id: '',
      });
    }
  }, [swimmer, reset]);

  const onSubmit = async (data: SwimmerFormData) => {
    setIsSubmitting(true);

    try {
      // Transform form data to API format
      const swimmerData = {
        name: data.name.trim(),
        surname: data.surname.trim(),
        age: parseInt(data.age, 10),
        gender: data.gender as 'Erkek' | 'Kadın',
        user_id: data.user_id || null,
      };

      let result;
      if (swimmer) {
        // Update existing swimmer
        result = await updateSwimmer(swimmer.id, swimmerData);
      } else {
        // Create new swimmer
        result = await createSwimmer(swimmerData);
      }

      if (result.error || !result.data) {
        const errorMsg = result.error?.message || 'Sporcu kaydedilirken bir hata oluştu';
        toast.error(errorMsg);
        setIsSubmitting(false);
        return;
      }

      reset();
      toast.success(swimmer ? 'Sporcu başarıyla güncellendi!' : 'Sporcu başarıyla eklendi!');
      onSuccess?.(result.data);
    } catch (error) {
      const errorMsg = 'Beklenmeyen bir hata oluştu';
      toast.error(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="name"
        label="İsim"
        type="text"
        placeholder="Sporcunun adını girin"
        error={errors.name?.message}
        disabled={isSubmitting}
        {...register('name')}
      />

      <Input
        id="surname"
        label="Soyisim"
        type="text"
        placeholder="Sporcunun soyadını girin"
        error={errors.surname?.message}
        disabled={isSubmitting}
        {...register('surname')}
      />

      <Input
        id="age"
        label="Yaş"
        type="number"
        placeholder="Sporcunun yaşını girin"
        error={errors.age?.message}
        disabled={isSubmitting}
        {...register('age')}
      />

      <div className="w-full">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1.5">
          Cinsiyet
        </label>
        <select
          id="gender"
          {...register('gender')}
          className={`
            w-full px-4 py-2 rounded-lg border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.gender
              ? 'border-red-300 bg-red-50 text-red-900'
              : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          disabled={isSubmitting}
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

      {/* User Assignment - Only visible to admins */}
      {isUserAdmin && (
        <div className="w-full">
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1.5">
            Kullanıcı Hesabı
            <span className="text-gray-500 text-xs ml-2">(Opsiyonel)</span>
          </label>
          <select
            id="user_id"
            {...register('user_id')}
            className={`
              w-full px-4 py-2 rounded-lg border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              border-gray-300 bg-white text-gray-900 hover:border-gray-400
              disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
            disabled={isSubmitting || loadingUsers}
          >
            <option value="">Kullanıcı atanmadı</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name || user.id} ({user.role})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex-1"
        >
          {swimmer ? 'Güncelle' : 'Kaydet'}
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
