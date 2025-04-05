'use client';

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerSize?: 'small' | 'medium' | 'large';
  spinnerColor?: string;
  loadingText?: string;
  fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  spinnerSize = 'medium',
  spinnerColor,
  loadingText,
  fullScreen = false,
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {fullScreen ? null : <div className="opacity-50">{children}</div>}
      <div
        className={`${fullScreen ? 'fixed inset-0' : 'absolute inset-0'} flex items-center justify-center bg-white/80 z-50`}
      >
        <LoadingSpinner size={spinnerSize} color={spinnerColor} text={loadingText} />
      </div>
    </div>
  );
};

export default LoadingOverlay;