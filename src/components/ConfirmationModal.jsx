// src/components/SimpleModal.jsx

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/ConfirmationModal.css'; // We can reuse the same CSS

const SimpleModal = ({ isOpen, closeModal, config, onConfirm }) => {
  // Effect to handle the 'Escape' key press to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  // If the modal isn't open, render nothing.
  if (!isOpen) {
    return null;
  }

  const formatCurrency = (num) => `$${num.toFixed(2)}`;

  // Use a portal to render the modal at the top of the DOM tree
  return createPortal(
    // The overlay div, which closes the modal when clicked
    <div className="modal-overlay" onClick={closeModal}>
      {/* The modal panel itself. We stop propagation here to prevent clicks inside from closing it. */}
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Confirm Your Configuration</h3>

        {config ? (
          <>
            <div className="modal-summary">
              <p>You are adding the following item to your cart:</p>
              <ul>
                <li><strong>Environment:</strong> {config.environment}</li>
                <li><strong>Poles:</strong> {config.poles}</li>
                <li><strong>Width:</strong> {config.width}</li>
                <li><strong>Length:</strong> {config.length}</li>
                <li><strong>Color:</strong> <span className="capitalize">{config.color}</span></li>
              </ul>
              <p className="modal-total">
                <strong>Total:</strong> {formatCurrency(config.totalPrice)}
              </p>
            </div>

            <div className="modal-buttons">
              <button type="button" className="button-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="button" className="button-primary" onClick={onConfirm}>
                Add to Cart
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

export default SimpleModal;