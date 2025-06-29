import React from 'react';

interface LogoProps {
  variant?: 'default' | 'white' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-24 h-6',
    md: 'w-32 h-8',
    lg: 'w-40 h-10'
  };

  const logoSrc = {
    default: '/furlief-logo.svg',
    white: '/furlief-logo-white.svg',
    'icon-only': '/furlief-logo-icon-only.svg'
  };

  return (
    <img
      src={logoSrc[variant]}
      alt="Furlief Logo"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};

export default Logo;