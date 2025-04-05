'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#FF4E50',
  text = 'Loading...',
}) => {
  const sizeMap = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.div
        className={`${sizeMap[size]} rounded-full border-4 border-t-transparent`}
        style={{ borderColor: `${color}20`, borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <p className="mt-2 text-sm font-medium text-gray-600">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;