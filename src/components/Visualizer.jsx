import { useState, useEffect, useMemo } from "react";
import cld from "../cloudinary";
import { AdvancedImage, lazyload, responsive } from "@cloudinary/react";
import { Info } from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";
import "../styles/Visualizer.css";

function Visualizer({ environmentId, variant, color, showBoat, onInfoClick }) {
  const [displayedImage, setDisplayedImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isLightboxLoading, setIsLightboxLoading] = useState(true);

  const targetImageId = useMemo(() => {
    if (!variant) {
      return "fallback";
    }

    const boatStatus = showBoat ? "withBoat" : "withoutBoat";
    const sanitize = (dimension) => {
      const num = parseFloat(dimension);
      return num % 1 === 0 ? String(num) : String(num).replace(".", "p");
    };
    const w = sanitize(variant.width);
    const l = sanitize(variant.length);

    return `/renders/${environmentId}_${boatStatus}_${color}_w${w}_l${l}`;
  }, [variant, environmentId, color, showBoat]);

  useEffect(() => {
    const cldImage = cld.image(targetImageId).quality("auto").format("auto");
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
      setDisplayedImage(cld.image("fallback").quality("auto").format("auto"));
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
      <div className="visualizer-wrapper">
        {isTransitioning && <SkeletonLoader />}
        {displayedImage && (
          <>
            <AdvancedImage
              key={displayedImage.publicID}
              cldImg={displayedImage}
              className={`visualizer-image ${isTransitioning ? "" : "loaded"}`}
              plugins={[lazyload(), responsive({ steps: 200 })]}
              onClick={handleImageClick}
            />
            <Info
              className="info-icon"
              color="white"
              size={24}
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick();
              }}
            />
          </>
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
