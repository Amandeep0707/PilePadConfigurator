import React from 'react';
import '../styles/SkeletonLoader.css';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-image"></div>
    </div>
  );
};

export default SkeletonLoader;