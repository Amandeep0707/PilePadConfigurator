import React, { useState, useEffect, useMemo } from "react";
import cld from "../cloudinary";
import { AdvancedImage, lazyload, responsive } from "@cloudinary/react";
import SkeletonLoader from "./SkeletonLoader";
import "../styles/Visualizer.css";

function Visualizer({ environmentId, variant, color }) {
  const [displayedImage, setDisplayedImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isLightboxLoading, setIsLightboxLoading] = useState(true);

  const targetImageId = useMemo(() => {
    const imagePathKey = `${environmentId}${
      color.charAt(0).toUpperCase() + color.slice(1)
    }`;
    // e.g., looks for 'lift2Black' in the imagePaths object
    if (variant.imagePaths && variant.imagePaths[imagePathKey]) {
      console.log("Selected Image: ", variant.imagePaths[imagePathKey]);
      return variant.imagePaths[imagePathKey];
    }
    // Fallback to a base image with no sleeves if no color/variant selected
    console.warn("Selected Fallback image.");
    return "fallback";
  }, [variant, environmentId, color]);

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
    img.onload = () => setDisplayedImage(cldImage);
    img.onerror = () => {
      console.warn(`Render not found: ${targetImageId}. Using fallback.`);
      setDisplayedImage(cld.image("fallback"));
    };
  }, [targetImageId]);

  useEffect(() => {
    if (displayedImage) setIsTransitioning(false);
  }, [displayedImage]);

  const handleImageClick = () => {
    if (!isTransitioning) {
      setIsLightboxLoading(true);
      setIsEnlarged(true);
    }
  };

  const handleCloseEnlarged = () => setIsEnlarged(false);
  const handleLightboxImageLoad = () => setIsLightboxLoading(false);
  const handleLightboxImageError = () => setIsLightboxLoading(false);

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
          {isLightboxLoading && (
            <div className="lightbox-loader">
              <div className="spinner"></div>
            </div>
          )}
          <AdvancedImage
            cldImg={displayedImage}
            className={`lightbox-image ${isLightboxLoading ? "loading" : ""}`}
            onLoad={handleLightboxImageLoad}
            onError={handleLightboxImageError}
            plugins={[responsive({ steps: 400 })]}
          />
          {!isLightboxLoading && (
            <span className="lightbox-close-text">Click anywhere to close</span>
          )}
        </div>
      )}
    </>
  );
}

export default Visualizer;
