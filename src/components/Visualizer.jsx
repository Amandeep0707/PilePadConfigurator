import { useState, useEffect, useMemo } from "react";
import cld from "../cloudinary";
import { AdvancedImage, lazyload, responsive } from "@cloudinary/react";
import SkeletonLoader from "./SkeletonLoader";
import "../styles/Visualizer.css";

function Visualizer({ environmentId, variant, color, showBoat }) {
  const [displayedImage, setDisplayedImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isLightboxLoading, setIsLightboxLoading] = useState(true);

  const targetImageId = useMemo(() => {
    // If we don't have a valid variant yet, return a fallback.
    if (!variant) {
      return "fallback";
    }

    const boatStatus = showBoat ? "withBoat" : "withoutBoat";

    // Sanitize width and length for the URL (e.g., 2.5 -> 2p5, 2.0 -> 2)
    const sanitize = (dimension) => {
      const num = parseFloat(dimension);
      // For whole numbers, return as is. For decimals, replace '.' with 'p'.
      return num % 1 === 0 ? String(num) : String(num).replace(".", "p");
    };
    const w = sanitize(variant.width);
    const l = sanitize(variant.length);

    // Construct the new image ID format
    // Example: lift4_withBoat_black_w4p5_l192
    return `/renders/${environmentId}_${boatStatus}_${color}_w${w}_l${l}`;
  }, [variant, environmentId, color, showBoat]);

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
      console.warn(`Image not found: ${targetImageId}. Using fallback.`);
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
