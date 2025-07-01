import React from "react";
import "../styles/PriceDisplay.css";

const PriceDisplay = React.memo(function PriceDisplay({
  basePrice,
  sleeveCost,
  totalPrice,
}) {
  const formatCurrency = (num) => `$${num.toFixed(2)}`;

  return (
    <div className="price-container">
      <div className="price-breakdown">
        {/* Show the base price of the environment */}
        <div className="price-row">
          <span>Base Price</span>
          <span>{formatCurrency(basePrice)}</span>
        </div>

        {/* Show the add-on cost for the sleeves */}
        <div className="price-row">
          <span>Sleeves Add-on</span>
          <span>{formatCurrency(sleeveCost)}</span>
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
