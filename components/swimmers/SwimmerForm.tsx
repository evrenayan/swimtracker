'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { createSwimmer, updateSwimmer, getAvailableUsers } from '@/lib/supabase/queries';
import { uploadSwimmerPhoto, deleteSwimmerPhoto } from '@/lib/supabase/storage';
import { isAdmin } from '@/lib/auth/auth';
import type { Swimmer, UserProfile } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Image from 'next/image';

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(swimmer?.photo_url || null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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
      setPhotoPreview(swimmer.photo_url);
    } else {
      reset({
        name: '',
        surname: '',
        age: '',
        gender: '',
        user_id: '',
      });
      setPhotoPreview(null);
    }
    setPhotoFile(null);
  }, [swimmer, reset]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const onSubmit = async (data: SwimmerFormData) => {
    setIsSubmitting(true);

    try {
      let photoUrl: string | null = swimmer?.photo_url || null;

      // Handle photo upload if a new photo was selected
      if (photoFile) {
        setIsUploadingPhoto(true);

        // If updating and there's an old photo, delete it first
        if (swimmer?.photo_url) {
          await deleteSwimmerPhoto(swimmer.photo_url);
        }

        // Create a temporary ID for new swimmers
        const uploadId = swimmer?.id || `temp-${Date.now()}`;
        const uploadResult = await uploadSwimmerPhoto(photoFile, uploadId);

        setIsUploadingPhoto(false);

        if (uploadResult.error) {
          toast.error(uploadResult.error.message);
          setIsSubmitting(false);
          return;
        }

        photoUrl = uploadResult.data;
      } else if (!photoPreview && swimmer?.photo_url) {
        // Photo was removed
        await deleteSwimmerPhoto(swimmer.photo_url);
        photoUrl = null;
      }

      // Transform form data to API format
      const swimmerData = {
        name: data.name.trim(),
        surname: data.surname.trim(),
        age: parseInt(data.age, 10),
        gender: data.gender as 'Erkek' | 'Kadın',
        user_id: data.user_id || null,
        photo_url: photoUrl,
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
      setPhotoFile(null);
      setPhotoPreview(null);
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
      {/* Photo Upload Section */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotoğraf
        </label>
        <div className="flex items-start gap-4">
          {/* Photo Preview */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Sporcu fotoğrafı"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Fotoğraf Seç
                </span>
              </label>

              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Kaldır
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              JPG, PNG veya GIF. Maksimum 5MB.
            </p>
          </div>
        </div>
      </div>

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
