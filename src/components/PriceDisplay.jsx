import React from 'react';
import '../styles/PriceDisplay.css';

// Using React.memo to prevent re-renders when props are identical
const PriceDisplay = React.memo(function PriceDisplay({ poles, pricePerPole, totalPrice }) {

  const formatCurrency = (num) => `$${num.toFixed(2)}`;

  return (
    <div className="price-container">
      <div className="price-breakdown">
        <div className="price-row">
          <span>{poles}-Pole Set @ {formatCurrency(pricePerPole)}/each</span>
          {/* --- THIS IS THE CORRECTED LINE --- */}
          <span>{formatCurrency(poles * pricePerPole)}</span>
        </div>
      </div>
      <div className="price-total">
        <span>Total Cost</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
    </div>
  );
});

export default PriceDisplay;