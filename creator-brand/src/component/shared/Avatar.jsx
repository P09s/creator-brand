import React, { useState } from 'react';

/**
 * Universal Avatar component
 * Shows profile photo if available, falls back to gradient + initial
 * Uses state to handle image errors without touching the DOM directly
 */

const SIZES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const GRADIENTS = [
  'from-purple-500/50 to-blue-500/50',
  'from-pink-500/50 to-rose-500/50',
  'from-green-500/50 to-teal-500/50',
  'from-amber-500/50 to-orange-500/50',
  'from-blue-500/50 to-cyan-500/50',
  'from-indigo-500/50 to-purple-500/50',
];

function gradient(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function Fallback({ name, size, shape, className }) {
  const sizeClass = SIZES[size] || SIZES.md;
  const shapeClass = shape === 'rounded' ? 'rounded-xl' : 'rounded-full';
  const initial = name?.[0]?.toUpperCase() || '?';
  return (
    <div className={`${sizeClass} ${shapeClass} bg-gradient-to-br ${gradient(name)} border-2 border-gray-700 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {initial}
    </div>
  );
}

export default function Avatar({ src, name = '', size = 'md', shape = 'circle', className = '' }) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = SIZES[size] || SIZES.md;
  const shapeClass = shape === 'rounded' ? 'rounded-xl' : 'rounded-full';

  if (!src || imgError) {
    return <Fallback name={name} size={size} shape={shape} className={className} />;
  }

  return (
    <img
      src={src}
      alt={name || 'User'}
      className={`${sizeClass} ${shapeClass} object-cover border-2 border-gray-700 flex-shrink-0 ${className}`}
      onError={() => setImgError(true)}
    />
  );
}