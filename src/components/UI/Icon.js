import React, { Suspense, lazy } from 'react';

// Lazy load each icon individually
const icons = {
  up: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaArrowUp }))),
  down: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaArrowDown }))),
  trash: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaTrash }))),
  user: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaUser }))),
  circle: lazy(() => import('react-icons/fa6').then(mod => ({ default: mod.FaRegCircleStop }))),
};

// Fallback while icon loads
const IconFallback = ({ size = '1em' }) => (
  <span 
    style={{ 
      width: size, 
      height: size, 
      display: 'inline-block',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px'
    }} 
  />
);

const Icon = ({ name, size = '1em', ...props }) => {
  const IconComponent = icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <Suspense fallback={<IconFallback size={size} />}>
      <IconComponent size={size} {...props} />
    </Suspense>
  );
};

export default Icon;