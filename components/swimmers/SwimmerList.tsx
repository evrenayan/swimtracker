'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAllSwimmers } from '@/lib/supabase/queries';
import { isAdmin } from '@/lib/auth/auth';
import type { Swimmer } from '@/lib/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface SwimmerListProps {
  onAddClick?: () => void;
  refreshTrigger?: number;
}

export default function SwimmerList({ onAddClick, refreshTrigger }: SwimmerListProps) {
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadSwimmers();
  }, [refreshTrigger]);

  const loadSwimmers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check admin status
      const adminStatus = await isAdmin();
      setIsUserAdmin(adminStatus);

      const result = await getAllSwimmers();

      if (result.error || !result.data) {
        // If error is due to RLS (empty array returned for athletes with no swimmer), it's fine
        // But if it's a real error, show it
        if (result.error) {
          const errorMsg = result.error.message || 'Sporcular yüklenirken bir hata oluştu';
          setError(errorMsg);
          toast.error(errorMsg);
        } else {
          setSwimmers([]);
        }
        setIsLoading(false);
        return;
      }

      setSwimmers(result.data);
      setIsLoading(false);
    } catch (err) {
      const errorMsg = 'Beklenmeyen bir hata oluştu';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  const handleSwimmerClick = (swimmerId: string) => {
    router.push(`/swimmers/${swimmerId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Sporcular</h2>
          {isUserAdmin && (
            <Button onClick={onAddClick} variant="primary">
              Yeni Sporcu Ekle
            </Button>
          )}
        </div>
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Sporcular</h2>
          {isUserAdmin && (
            <Button onClick={onAddClick} variant="primary">
              Yeni Sporcu Ekle
            </Button>
          )}
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-700">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {isUserAdmin ? 'Tüm Sporcular' : 'Profilim'}
        </h2>
        {isUserAdmin && (
          <Button onClick={onAddClick} variant="primary">
            Yeni Sporcu Ekle
          </Button>
        )}
      </div>

      {swimmers.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-pink-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-pink-700 text-xl font-medium mb-2">
              {isUserAdmin ? 'Henüz sporcu eklenmemiş' : 'Henüz sporcu profili oluşturulmamış'}
            </p>
            {isUserAdmin ? (
              <p className="text-pink-500">
                Başlamak için &quot;Yeni Sporcu Ekle&quot; butonuna tıklayın
              </p>
            ) : (
              <p className="text-pink-500">
                Lütfen yöneticinizle iletişime geçin.
              </p>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {swimmers.map((swimmer) => {
            const isMale = swimmer.gender === 'Erkek';
            const colorClasses = {
              title: isMale ? 'text-blue-900' : 'text-pink-900',
              arrow: isMale ? 'text-blue-400' : 'text-pink-400',
              text: isMale ? 'text-blue-700' : 'text-pink-700',
              icon: isMale ? 'text-blue-500' : 'text-pink-500',
              photoBg: isMale ? 'bg-blue-100' : 'bg-pink-100',
              photoIcon: isMale ? 'text-blue-400' : 'text-pink-400',
            };

            return (
              <Card
                key={swimmer.id}
                hover
                onClick={() => handleSwimmerClick(swimmer.id)}
                className="p-6"
              >
                <div className="flex gap-4">
                  {/* Swimmer Photo */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${isMale ? 'border-blue-200' : 'border-pink-200'} ${colorClasses.photoBg}`}>
                      {swimmer.photo_url ? (
                        <img
                          src={swimmer.photo_url}
                          alt={`${swimmer.name} ${swimmer.surname}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className={`w-10 h-10 ${colorClasses.photoIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Swimmer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={`text-xl font-semibold ${colorClasses.title} truncate`}>
                        {swimmer.name} {swimmer.surname}
                      </h3>
                      <svg className={`w-5 h-5 ${colorClasses.arrow} flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className={`space-y-2 text-sm ${colorClasses.text}`}>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${colorClasses.icon} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span><span className="font-medium">Yaş:</span> {swimmer.age}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${colorClasses.icon} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <span><span className="font-medium">Cinsiyet:</span> {swimmer.gender}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
