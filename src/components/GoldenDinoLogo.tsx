import React from 'react';

export const GoldenDinoLogo: React.FC<{ className?: string; variant?: string }> = ({ className = "", variant = "classic" }) => {
  const getColor = () => {
    if (variant === 'neon') return '#00ff00';
    if (variant === 'midnight') return '#6366f1';
    return '#fab005';
  };

  const color = getColor();

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      <svg viewBox="0 0 100 100" className={`w-full h-full ${variant === 'neon' ? 'drop-shadow-[0_0_15px_rgba(0,255,0,0.8)]' : 'drop-shadow-[0_0_10px_rgba(250,176,5,0.8)]'}`}>
        {/* Tail */}
        <rect x="10" y="55" width="15" height="15" fill={color} />
        {/* Body */}
        <rect x="25" y="40" width="45" height="45" fill={color} />
        {/* Head */}
        <rect x="55" y="25" width="30" height="30" fill={color} />
        {/* Eye */}
        <rect x="73" y="33" width="6" height="6" fill="#000" />
        {/* Legs */}
        <rect x="35" y="85" width="8" height="8" fill={color} />
        <rect x="55" y="85" width="8" height="8" fill={color} />
      </svg>
    </div>
  );
};
