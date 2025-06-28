import React from 'react';
import '../styles/PriceDisplay.css';

const PriceDisplay = React.memo(function PriceDisplay({ pricePerPole, totalPrice }) {
  const formatCurrency = (num) => `$${num.toFixed(2)}`;

  return (
    <div className="price-container">
      <div className="price-breakdown">
        <div className="price-row">
          {/* UPDATE: Show the dynamic price per pole */}
          <span>Price per PolePad</span>
          <span>{formatCurrency(pricePerPole)}</span>
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