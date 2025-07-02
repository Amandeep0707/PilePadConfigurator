import React from "react";
import "../styles/PriceDisplay.css";

const PriceDisplay = React.memo(function PriceDisplay({ totalPrice }) {
  const formatCurrency = (num) => `$${num.toFixed(2)}`;

  return (
    <div className="price-container">
      <div className="price-breakdown"></div>
      <div className="price-total">
        <span>Total Price</span>
        <span className="">{formatCurrency(totalPrice)}</span>
      </div>
    </div>
  );
});

export default PriceDisplay;
