import React from "react";
import "../styles/PriceDisplay.css";

const PriceDisplay = React.memo(function PriceDisplay({
  quantity,
  totalPrice,
  totalRetailPrice,
}) {
  const formatCurrency = (num) => `$${num.toFixed(2)}`;

  const showRetailPrice = totalRetailPrice > 0 && totalRetailPrice > totalPrice;

  return (
    <div className="price-container">
      <div className="price-breakdown"></div>
      <div className="price-total">
        <div>
          <span>Total Price</span>
          <span className="quantity">{`(${quantity}-Pack)`}</span>
        </div>
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
