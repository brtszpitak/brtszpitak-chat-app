import React from 'react';

export default function AvatarFace() {
  // simple SVG placeholder; can be swapped with 3D later
  return (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 999,
        background: '#f2f2f2',
        display: 'grid',
        placeItems: 'center',
        border: '1px solid #ddd',
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="16" r="10" fill="#ccc" />
        <rect x="10" y="30" width="28" height="10" rx="5" fill="#ccc" />
      </svg>
    </div>
  );
}
