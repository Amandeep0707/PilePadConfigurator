// src/components/PriceDisplay.jsx

import React from "react";
import "../styles/PriceDisplay.css";

const PriceDisplay = React.memo(function PriceDisplay({
  variantPrice,
  totalPrice,
}) {
  const formatCurrency = (num) => `$${num.toFixed(2)}`;

  return (
    <div className="price-container">
      <div className="price-breakdown">
        <div className="price-row">
          <span>Price per PolePad</span>
          <span>{formatCurrency(variantPrice)}</span>
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
