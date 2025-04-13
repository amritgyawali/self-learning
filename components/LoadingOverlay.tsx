'use client';

import React, { memo } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerSize?: 'small' | 'medium' | 'large';
  spinnerColor?: string;
  loadingText?: string;
  fullScreen?: boolean;
}

// Using memo to prevent unnecessary re-renders when props haven't changed
const LoadingOverlay: React.FC<LoadingOverlayProps> = memo(function LoadingOverlay({
  isLoading,
  children,
  spinnerSize = 'medium',
  spinnerColor,
  loadingText,
  fullScreen = false,
}) {
  // Early return for better performance when not loading
  if (!isLoading) return <>{children}</>;

  return (
    <>
      {fullScreen ? null : <div className="opacity-50">{children}</div>}
      <div
        className={`${fullScreen ? 'fixed inset-0' : 'absolute inset-0'} flex items-center justify-center bg-white/80 z-50`}
      >
        <LoadingSpinner size={spinnerSize} color={spinnerColor} text={loadingText} />
      </div>
    </>
  );
});

export default LoadingOverlay;