// src/components/Visualizer.jsx

import React, { useState, useEffect, useMemo } from 'react';
import cld from '../cloudinary';
import { AdvancedImage, lazyload, responsive } from '@cloudinary/react';
import '../styles/Visualizer.css';

// (sanitizeForFilename function remains unchanged)
function sanitizeForFilename(type, value) {
  if (type === 'width') {
    const sanitized = value.replace('"', '').replace('.', 'p');
    return `w${sanitized.endsWith('p0') ? sanitized.slice(0, -2) : sanitized}`;
  }
  if (type === 'length') {
    const inches = parseInt(value, 10);
    return `l${inches}`;
  }
  return value;
}

function Visualizer({ environmentId, color, width, length }) {
  const [displayedImage, setDisplayedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetImageId = useMemo(() => {
    const sanitizedWidth = sanitizeForFilename('width', width);
    const sanitizedLength = sanitizeForFilename('length', length);
    return `renders/${environmentId}_${color}_${sanitizedWidth}_${sanitizedLength}`;
  }, [environmentId, color, width, length]);

  useEffect(() => {
    const cldImage = cld.image(targetImageId);
    const imageUrl = cldImage.toURL();

    if (displayedImage && imageUrl === displayedImage.toURL()) {
        setIsLoading(false); // Ensure loader is off if image is already loaded
        return;
    };
    
    setIsLoading(true);
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setDisplayedImage(cldImage);
      setIsLoading(false);
    };

    img.onerror = () => {
      console.warn(`Render not found in Cloudinary: ${targetImageId}. Using fallback.`);
      const fallbackImage = cld.image('renders/trailer_grey_w2_l36');
      setDisplayedImage(fallbackImage);
      setIsLoading(false);
    };
  }, [targetImageId]); // Simplified dependency array

  return (
    // This wrapper is ONLY for establishing the aspect-ratio box.
    <div className="visualizer-wrapper">
      {/* The spinner is a direct child */}
      {isLoading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}
      
      {/* The AdvancedImage is also a direct child. We pass the styles to it. */}
      {displayedImage && (
        <AdvancedImage
          key={displayedImage.publicID}
          cldImg={displayedImage}
          // --- THIS IS THE CRITICAL CHANGE ---
          // Apply the positioning and fade classes directly to the component.
          className={`visualizer-image ${isLoading ? 'loading' : 'loaded'}`}
          plugins={[lazyload(), responsive({ steps: 200 })]}
        />
      )}
    </div>
  );
}

export default Visualizer;