'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#831843',
          border: '1px solid #f9a8d4',
          borderRadius: '0.5rem',
          padding: '1rem',
        },
        success: {
          iconTheme: {
            primary: '#ec4899',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
