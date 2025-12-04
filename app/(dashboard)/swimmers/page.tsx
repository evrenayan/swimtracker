'use client';

import { useState } from 'react';
import SwimmerList from '@/components/swimmers/SwimmerList';
import SwimmerForm from '@/components/swimmers/SwimmerForm';
import Modal from '@/components/ui/Modal';
import type { Swimmer } from '@/lib/types';

export default function SwimmersPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshTrigger(prev => prev + 1); // Trigger list refresh
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <SwimmerList
          onAddClick={handleAddClick}
          refreshTrigger={refreshTrigger}
        />

        <Modal
          isOpen={showForm}
          onClose={handleFormCancel}
          title="Yeni Sporcu Ekle"
          size="md"
        >
          <SwimmerForm
            key={showForm ? 'open' : 'closed'}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </Modal>
      </div>
    </div>
  );
}
