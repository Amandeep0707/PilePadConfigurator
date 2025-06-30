// src/components/ConfirmationModal.jsx

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, closeModal, config, onConfirm }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const formatCurrency = (num) => `$${num.toFixed(2)}`;

  // Calculate the cost breakdown for the modal display
  const isSleeveSelected = config && config.color !== 'none';
  const basePrice = isSleeveSelected ? config.totalPrice - (config.totalPrice - config.basePrice) : config.totalPrice;
  const sleeveCost = isSleeveSelected ? config.totalPrice - config.basePrice : 0;

  return createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Confirm Your Order</h3>

        {config ? (
          <>
            <div className="modal-summary">
              <p>Please review the items you are adding to your cart:</p>
              
              {/* --- NEW: Detailed Breakdown --- */}
              <div className="summary-item">
                <span className="summary-label">{config.environment}</span>
                <span className="summary-value">{formatCurrency(config.basePrice)}</span>
              </div>
              
              {isSleeveSelected && (
                <div className="summary-item summary-addon">
                  <span className="summary-label">
                    PolePad Sleeves ({config.poles}x, {config.width}, {config.length}, <span className="capitalize">{config.color}</span>)
                  </span>
                  <span className="summary-value">{formatCurrency(sleeveCost)}</span>
                </div>
              )}

              {!isSleeveSelected && (
                 <div className="summary-item summary-addon">
                  <span className="summary-label">
                    PolePad Sleeves
                  </span>
                  <span className="summary-value">Not Selected</span>
                </div>
              )}

            </div>

            <div className="modal-total-section">
              <span className="summary-label">Total Cost</span>
              <span className="summary-value total-value">{formatCurrency(config.totalPrice)}</span>
            </div>

            <div className="modal-buttons">
              <button type="button" className="button-secondary" onClick={closeModal}>
                Edit Configuration
              </button>
              <button type="button" className="button-primary" onClick={onConfirm}>
                Confirm & Add to Cart
              </button>
            </div>
          </>
        ) : (
          <div className="modal-summary"><p>Loading details...</p></div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;