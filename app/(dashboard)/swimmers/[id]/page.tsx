'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { getSwimmer, getRaceRecordsBySwimmer, deleteRaceRecord } from '@/lib/supabase/queries';
import RaceForm from '@/components/races/RaceForm';
import RaceTable from '@/components/races/RaceTable';
import SwimmerForm from '@/components/swimmers/SwimmerForm';
import type { Swimmer, RaceRecord } from '@/lib/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SwimmerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const swimmerId = params.id as string;

  const [swimmer, setSwimmer] = useState<Swimmer | null>(null);
  const [races, setRaces] = useState<RaceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRaces, setIsLoadingRaces] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [showRaceForm, setShowRaceForm] = useState(false);
  const [showSwimmerForm, setShowSwimmerForm] = useState(false);
  const [editingRace, setEditingRace] = useState<RaceRecord | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loadSwimmer = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getSwimmer(swimmerId);

      if (result.error || !result.data) {
        const errorMsg = result.error?.message || 'Sporcu bilgileri yüklenirken bir hata oluştu';
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      setSwimmer(result.data);
      setIsLoading(false);
    } catch (err) {
      const errorMsg = 'Beklenmeyen bir hata oluştu';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  }, [swimmerId]);

  const loadRaces = useCallback(async () => {
    setIsLoadingRaces(true);
    try {
      const result = await getRaceRecordsBySwimmer(swimmerId);

      if (result.error) {
        console.error('Error loading races:', result.error);
        setIsLoadingRaces(false);
        return;
      }

      setRaces(result.data || []);
      setIsLoadingRaces(false);
    } catch (err) {
      console.error('Unexpected error loading races:', err);
      setIsLoadingRaces(false);
    }
  }, [swimmerId]);

  useEffect(() => {
    loadSwimmer();
    loadRaces();
  }, [loadSwimmer, loadRaces]);

  const handleDashboardClick = () => {
    router.push(`/swimmers/${swimmerId}/dashboard`);
  };

  // Race Actions
  const handleAddRaceClick = () => {
    setEditingRace(undefined);
    setShowRaceForm(true);
  };

  const handleEditRace = (race: RaceRecord) => {
    setEditingRace(race);
    setShowRaceForm(true);
  };

  const handleDeleteRace = (raceId: string) => {
    setShowDeleteConfirm(raceId);
  };

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;

    try {
      const result = await deleteRaceRecord(showDeleteConfirm);

      if (result.error) {
        toast.error('Yarış silinirken bir hata oluştu: ' + result.error.message);
        return;
      }

      toast.success('Yarış başarıyla silindi!');
      await loadRaces();
      setShowDeleteConfirm(null);
    } catch (err) {
      toast.error('Beklenmeyen bir hata oluştu');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleRaceFormSuccess = async () => {
    setShowRaceForm(false);
    setEditingRace(undefined);
    await loadRaces();
  };

  const handleRaceFormCancel = () => {
    setShowRaceForm(false);
    setEditingRace(undefined);
  };

  // Swimmer Actions
  const handleEditSwimmerClick = () => {
    setShowSwimmerForm(true);
  };

  const handleSwimmerFormSuccess = async () => {
    setShowSwimmerForm(false);
    await loadSwimmer();
  };

  const handleSwimmerFormCancel = () => {
    setShowSwimmerForm(false);
  };

  if (isLoading) {
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

  if (error || !swimmer) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center gap-3 text-red-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error || 'Sporcu bulunamadı'}</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const isMale = swimmer.gender === 'Erkek';
  const colorClasses = {
    title: isMale ? 'text-blue-900' : 'text-pink-900',
    subtitle: isMale ? 'text-blue-700' : 'text-pink-700',
    icon: isMale ? 'text-blue-500' : 'text-pink-500',
    editBtn: isMale ? 'text-blue-400 hover:text-blue-600' : 'text-pink-400 hover:text-pink-600',
    sectionTitle: isMale ? 'text-blue-900' : 'text-pink-900',
    text: isMale ? 'text-blue-700' : 'text-pink-700',
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Swimmer Info Header */}
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
                  <h1 className={`text-4xl font-bold ${colorClasses.title}`}>
                    {swimmer.name} {swimmer.surname}
                  </h1>
                  <button
                    onClick={handleEditSwimmerClick}
                    className={`${colorClasses.editBtn} transition-colors`}
                    title="Profili Düzenle"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <div className={`flex flex-wrap gap-6 ${colorClasses.subtitle}`}>
                  <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 ${colorClasses.icon}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span><span className="font-semibold">Yaş:</span> {swimmer.age}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 ${colorClasses.icon}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span><span className="font-semibold">Cinsiyet:</span> {swimmer.gender}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push(`/swimmers/${swimmerId}/barriers`)}
                variant={isMale ? 'secondary-blue' : 'secondary'}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Baraj Durumu
              </Button>
              <Button
                onClick={handleDashboardClick}
                variant={isMale ? 'secondary-blue' : 'secondary'}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </Button>
              <Button
                onClick={handleAddRaceClick}
                variant={isMale ? 'primary-blue' : 'primary'}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yeni Yarış Ekle
              </Button>
            </div>
          </div>
        </Card>

        {/* Race Records Section */}
        <div>
          <h2 className={`text-2xl font-bold ${colorClasses.sectionTitle} mb-4`}>
            Yarış Kayıtları
          </h2>
          <RaceTable
            races={races}
            onEdit={handleEditRace}
            onDelete={handleDeleteRace}
            isLoading={isLoadingRaces}
            swimmerGender={swimmer.gender}
          />
        </div>

        {/* Race Form Modal */}
        <Modal
          isOpen={showRaceForm}
          onClose={handleRaceFormCancel}
          title={editingRace ? 'Yarış Düzenle' : 'Yeni Yarış Ekle'}
          size="lg"
        >
          <RaceForm
            swimmerId={swimmerId}
            existingRace={editingRace}
            onSuccess={handleRaceFormSuccess}
            onCancel={handleRaceFormCancel}
          />
        </Modal>

        {/* Swimmer Form Modal */}
        <Modal
          isOpen={showSwimmerForm}
          onClose={handleSwimmerFormCancel}
          title="Profili Düzenle"
          size="md"
        >
          <SwimmerForm
            swimmer={swimmer}
            onSuccess={handleSwimmerFormSuccess}
            onCancel={handleSwimmerFormCancel}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!showDeleteConfirm}
          onClose={cancelDelete}
          title="Yarışı Sil"
          size="sm"
        >
          <div className="space-y-6">
            <p className={colorClasses.text}>
              Bu yarış kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={confirmDelete}
                variant="danger"
                className="flex-1"
              >
                Sil
              </Button>
              <Button
                onClick={cancelDelete}
                variant={isMale ? 'secondary-blue' : 'secondary'}
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
