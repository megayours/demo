import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  const borderSizes = {
    small: 'border-[1px]',
    medium: 'border-2',
    large: 'border-3',
  };

  const blurSizes = {
    small: 'blur-[1px]',
    medium: 'blur-[2px]',
    large: 'blur-[3px]',
  };

  const insetSizes = {
    small: 'inset-[2px]',
    medium: 'inset-1',
    large: 'inset-1.5',
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className={`absolute inset-0 rounded-full animate-spin-slow ${borderSizes[size]} border-transparent`}>
        <div className={`h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full ${blurSizes[size]} opacity-75`}></div>
      </div>
      <div className={`absolute ${insetSizes[size]} bg-[var(--color-background)] rounded-full`}></div>
      <div className={`absolute ${insetSizes[size]} rounded-full animate-spin ${borderSizes[size]} border-transparent`}>
        <div className="h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default Spinner;