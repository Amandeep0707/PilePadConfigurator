import React from "react";
import "../styles/PriceDisplay.css";

const PriceDisplay = React.memo(function PriceDisplay({
  totalPrice,
  totalRetailPrice,
}) {
  const formatCurrency = (num) => `$${num.toFixed(2)}`;

  const showRetailPrice = totalRetailPrice && totalRetailPrice > totalPrice;

  return (
    <div className="price-container">
      <div className="price-breakdown"></div>
      <div className="price-total">
        <span>Total Price</span>
        <div className="price-values">
          {showRetailPrice && (
            <span className="retail-price">
              {formatCurrency(totalRetailPrice)}
            </span>
          )}
          <span className="final-price">{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
});

export default PriceDisplay;
