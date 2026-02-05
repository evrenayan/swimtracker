'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    getBarrierValuesWithDetails,
    deleteBarrierValue,
    getAllPoolTypes,
    getAllSwimmingStyles,
    getAllBarrierTypes,
} from '@/lib/supabase/queries';
import { isAdmin } from '@/lib/auth/auth';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BarrierForm from '@/components/barriers/BarrierForm';
import BarrierTable from '@/components/barriers/BarrierTable';
import type { PoolType, SwimmingStyle, BarrierType } from '@/lib/types';

export default function BarriersPage() {
    const router = useRouter();
    const [barriers, setBarriers] = useState<any[]>([]);
    const [poolTypes, setPoolTypes] = useState<PoolType[]>([]);
    const [swimmingStyles, setSwimmingStyles] = useState<SwimmingStyle[]>([]);
    const [barrierTypes, setBarrierTypes] = useState<BarrierType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBarrier, setEditingBarrier] = useState<any | undefined>(undefined);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Check admin status
            const adminStatus = await isAdmin();
            setIsUserAdmin(adminStatus);

            const [barriersResult, poolTypesResult, stylesResult, barrierTypesResult] = await Promise.all([
                getBarrierValuesWithDetails(),
                getAllPoolTypes(),
                getAllSwimmingStyles(),
                getAllBarrierTypes(),
            ]);

            if (barriersResult.error) {
                toast.error('Barajlar yüklenirken bir hata oluştu');
            } else {
                setBarriers(barriersResult.data || []);
            }

            if (!poolTypesResult.error) setPoolTypes(poolTypesResult.data || []);
            if (!stylesResult.error) setSwimmingStyles(stylesResult.data || []);
            if (!barrierTypesResult.error) setBarrierTypes(barrierTypesResult.data || []);
        } catch (error) {
            toast.error('Veriler yüklenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBarrier = () => {
        if (!isUserAdmin) return;
        setEditingBarrier(undefined);
        setShowForm(true);
    };

    const handleEditBarrier = (barrier: any) => {
        if (!isUserAdmin) return;
        setEditingBarrier(barrier);
        setShowForm(true);
    };

    const handleDeleteBarrier = (barrierId: string) => {
        if (!isUserAdmin) return;
        setShowDeleteConfirm(barrierId);
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm || !isUserAdmin) return;

        try {
            const result = await deleteBarrierValue(showDeleteConfirm);

            if (result.error) {
                toast.error('Baraj silinirken bir hata oluştu: ' + result.error.message);
                return;
            }

            toast.success('Baraj başarıyla silindi!');
            await loadData();
            setShowDeleteConfirm(null);
        } catch (err) {
            toast.error('Beklenmeyen bir hata oluştu');
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    const handleFormSuccess = async () => {
        setShowForm(false);
        setEditingBarrier(undefined);
        await loadData();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingBarrier(undefined);
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

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Card className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-pink-900 mb-2">
                                Baraj Yönetimi
                            </h1>
                            <p className="text-pink-700">
                                Baraj değerlerini görüntüleyin {isUserAdmin && 've düzenleyin'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => router.push('/barriers/graph')}
                                variant="secondary"
                            >
                                Baraj Grafiği
                            </Button>

                            {isUserAdmin && (
                                <Button
                                    onClick={handleAddBarrier}
                                    variant="primary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Yeni Baraj Ekle
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Barriers Table */}
                <BarrierTable
                    barriers={barriers}
                    onEdit={handleEditBarrier}
                    onDelete={handleDeleteBarrier}
                    isAdmin={isUserAdmin}
                />

                {/* Barrier Form Modal - Only render if admin */}
                {isUserAdmin && (
                    <Modal
                        isOpen={showForm}
                        onClose={handleFormCancel}
                        title={editingBarrier ? 'Baraj Düzenle' : 'Yeni Baraj Ekle'}
                        size="lg"
                    >
                        <BarrierForm
                            existingBarrier={editingBarrier}
                            poolTypes={poolTypes}
                            swimmingStyles={swimmingStyles}
                            barrierTypes={barrierTypes}
                            onSuccess={handleFormSuccess}
                            onCancel={handleFormCancel}
                        />
                    </Modal>
                )}

                {/* Delete Confirmation Modal - Only render if admin */}
                {isUserAdmin && (
                    <Modal
                        isOpen={!!showDeleteConfirm}
                        onClose={cancelDelete}
                        title="Barajı Sil"
                        size="sm"
                    >
                        <div className="space-y-6">
                            <p className="text-pink-700">
                                Bu baraj değerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}
