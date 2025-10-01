import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "../styles/ProductDescription.css";

const ProductDescription = ({ isOpen, onClose, description }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="product-modal-header">
          <h3 className="product-modal-title">Product Information</h3>
          <button className="product-modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="product-modal-content">
          {description ? (
            <p>{description.trim()}</p>
          ) : (
            <p>No description available.</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductDescription;
