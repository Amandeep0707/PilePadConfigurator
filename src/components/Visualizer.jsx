import React, { useState, useEffect, useMemo } from 'react';
import cld from '../cloudinary'; // Import our configured Cloudinary instance
import { AdvancedImage, lazyload, responsive } from '@cloudinary/react';
import '../styles/Visualizer.css';

/**
 * Sanitizes configuration options to match the required filename format.
 * (This function remains unchanged)
 */
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

  // Memoize the calculation of the target image's Public ID for Cloudinary
  const targetImageId = useMemo(() => {
    const sanitizedWidth = sanitizeForFilename('width', width);
    const sanitizedLength = sanitizeForFilename('length', length);
    // This creates the path inside your Cloudinary library, e.g., "renders/lift4_grey_w3_l144"
    return `renders/${environmentId}_${color}_${sanitizedWidth}_${sanitizedLength}`;
  }, [environmentId, color, width, length]);

  // The preloading logic now uses Cloudinary URLs
  useEffect(() => {
    // Create a Cloudinary image object from the ID
    const cldImage = cld.image(targetImageId);
    // Get the full URL string for the Image() constructor
    const imageUrl = cldImage.toURL();

    if (imageUrl === displayedImage?.toURL()) return;

    setIsLoading(true);
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      // On success, we store the Cloudinary object itself in state
      setDisplayedImage(cldImage);
      setIsLoading(false);
    };

    img.onerror = () => {
      console.warn(`Render not found in Cloudinary: ${targetImageId}. Using fallback.`);
      // The fallback is also a Cloudinary image object
      const fallbackImage = cld.image('renders/trailer_grey_w2_l36');
      setDisplayedImage(fallbackImage);
      setIsLoading(false);
    };

  }, [targetImageId, displayedImage]);

  return (
    <div className="visualizer-wrapper">
      {/* Conditionally render the AdvancedImage component */}
      {displayedImage && (
        <AdvancedImage
          // The key should be the unique identifier to force re-render
          key={displayedImage.publicID}
          cldImg={displayedImage}
          // The plugins add performance benefits like lazy loading and automatic responsive sizing.
          plugins={[lazyload(), responsive({ steps: 200 })]}
          // We can remove the old className logic as AdvancedImage handles loading states
        />
      )}
      
      {isLoading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default Visualizer;