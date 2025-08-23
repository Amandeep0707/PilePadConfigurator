import { useState, useEffect, useMemo } from "react";
import cld from "../cloudinary";
import { AdvancedImage, lazyload, responsive } from "@cloudinary/react";
import { Info, Moon } from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";
import { MoonLoader } from "react-spinners";
import "../styles/Visualizer.css";

function Visualizer({ environmentId, variant, color, showBoat, onInfoClick }) {
  const [currentImage, setCurrentImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // NEW: State for the small loader for subsequent loads
  const [isSubsequentLoading, setIsSubsequentLoading] = useState(false);

  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isLightboxLoading, setIsLightboxLoading] = useState(true);

  const targetImageId = useMemo(() => {
    // ... (logic remains the same)
    if (!variant) return "fallback";
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

    if (currentImage && imageUrl === currentImage.toURL()) {
      return;
    }

    // NEW: If this is not the first load, show the small loader
    if (!isInitialLoading) {
      setIsSubsequentLoading(true);
    }

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setPreviousImage(currentImage);
      setCurrentImage(cldImage);

      if (isInitialLoading) setIsInitialLoading(false);

      // NEW: Hide the small loader once the image is ready
      setIsSubsequentLoading(false);
    };

    img.onerror = () => {
      console.warn(`Image not found: ${targetImageId}. Using fallback.`);
      const fallback = cld.image("fallback").quality("auto").format("auto");
      setPreviousImage(currentImage);
      setCurrentImage(fallback);

      if (isInitialLoading) setIsInitialLoading(false);

      // NEW: Also hide the loader on error
      setIsSubsequentLoading(false);
    };
  }, [targetImageId]);

  // ... (other handlers remain the same)
  const handleImageClick = () => {
    if (!isInitialLoading) {
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
        {isInitialLoading && <SkeletonLoader />}

        {previousImage && (
          <AdvancedImage
            key={`${previousImage.publicID}-previous`}
            cldImg={previousImage}
            className="visualizer-image loaded"
            plugins={[responsive({ steps: 200 })]}
          />
        )}

        {currentImage && (
          <AdvancedImage
            key={currentImage.publicID}
            cldImg={currentImage}
            className="visualizer-image loaded"
            plugins={[lazyload(), responsive({ steps: 200 })]}
            onClick={handleImageClick}
          />
        )}

        {isSubsequentLoading && (
          <div className="loader-container">
            <MoonLoader color="#ffffff" size={24} />
          </div>
        )}

        {!isInitialLoading && (
          <Info
            className="info-icon"
            color="white"
            size={24}
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick();
            }}
          />
        )}
      </div>

      {/* ... (lightbox logic remains the same) ... */}
      {isEnlarged && (
        <div className="lightbox-overlay" onClick={handleCloseEnlarged}>
          {isLightboxLoading && (
            <div className="lightbox-loader">
              <div className="spinner"></div>
            </div>
          )}
          <AdvancedImage
            cldImg={currentImage}
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
