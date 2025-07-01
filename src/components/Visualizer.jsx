import React, { useState, useEffect, useMemo } from "react";
import cld from "../cloudinary";
import { AdvancedImage, lazyload, responsive } from "@cloudinary/react";
import SkeletonLoader from "./SkeletonLoader";
import "../styles/Visualizer.css";

function sanitizeForFilename(type, value) {
  if (type === "width") {
    const sanitized = value.replace('"', "").replace(".", "p");
    return `w${sanitized.endsWith("p0") ? sanitized.slice(0, -2) : sanitized}`;
  }
  if (type === "length") {
    return `l${value}`;
  }
  return value;
}

function Visualizer({ environmentId, color, width, length }) {
  const [displayedImage, setDisplayedImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isEnlarged, setIsEnlarged] = useState(false);

  // NEW: State specifically for the lightbox loader
  const [isLightboxLoading, setIsLightboxLoading] = useState(true);

  const targetImageId = useMemo(() => {
    if (color === "none") {
      return `renders/${environmentId}_base`;
    }

    const sanitizedWidth = sanitizeForFilename("width", width);
    const sanitizedLength = sanitizeForFilename("length", length);
    return `renders/${environmentId}_${color}_${sanitizedWidth}_${sanitizedLength}`;
  }, [environmentId, color, width, length]);

  useEffect(() => {
    const cldImage = cld.image(targetImageId);
    const imageUrl = cldImage.toURL();

    if (displayedImage && imageUrl === displayedImage.toURL()) {
      setIsTransitioning(false);
      return;
    }

    setIsTransitioning(true);
    if (isEnlarged) setIsEnlarged(false);

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setDisplayedImage(cldImage);
    };

    img.onerror = () => {
      console.warn(
        `Render not found in Cloudinary: ${targetImageId}. Using fallback.`
      );
      const fallbackImage = cld.image("renders/trailer_grey_w2_l36");
      setDisplayedImage(fallbackImage);
    };
  }, [targetImageId]);

  useEffect(() => {
    if (displayedImage) {
      setIsTransitioning(false);
    }
  }, [displayedImage]);

  const handleImageClick = () => {
    if (!isTransitioning) {
      // When opening the lightbox, assume it will need to load.
      setIsLightboxLoading(true);
      setIsEnlarged(true);
    }
  };

  const handleCloseEnlarged = () => {
    setIsEnlarged(false);
  };

  // Event handlers for the enlarged image
  const handleLightboxImageLoad = () => {
    setIsLightboxLoading(false);
  };

  const handleLightboxImageError = () => {
    // If high-res fails, we still want to hide the loader and show whatever we can
    setIsLightboxLoading(false);
    console.error("High-resolution lightbox image failed to load.");
  };

  return (
    <>
      <div className="visualizer-wrapper" onClick={handleImageClick}>
        {isTransitioning && <SkeletonLoader />}

        {displayedImage && (
          <AdvancedImage
            key={displayedImage.publicID}
            cldImg={displayedImage}
            className={`visualizer-image ${isTransitioning ? "" : "loaded"}`}
            plugins={[lazyload(), responsive({ steps: 200 })]}
          />
        )}
      </div>

      {isEnlarged && (
        <div className="lightbox-overlay" onClick={handleCloseEnlarged}>
          {/* Show a spinner inside the lightbox while loading */}
          {isLightboxLoading && (
            <div className="lightbox-loader">
              <div className="spinner"></div>
            </div>
          )}

          <AdvancedImage
            cldImg={displayedImage}
            // Add a class to hide the image until it's loaded
            className={`lightbox-image ${isLightboxLoading ? "loading" : ""}`}
            // Use the onLoad and onError event handlers
            onLoad={handleLightboxImageLoad}
            onError={handleLightboxImageError}
            plugins={[responsive({ steps: 400 })]}
          />

          {/* Only show the close text after the image has loaded */}
          {!isLightboxLoading && (
            <span className="lightbox-close-text">Click anywhere to close</span>
          )}
        </div>
      )}
    </>
  );
}

export default Visualizer;
