import React from "react";
import { Share, ShoppingCart } from "lucide-react";

const OptionsColumn = React.memo(function OptionsColumn({
  options,
  config,
  onConfigChange,
  priceDisplay,
  handleCopyLink,
  handleAddToCartClick,
  isCopied,
}) {
  const handleColorKeyDown = (e, colorId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onConfigChange("color", colorId);
    }
  };

  return (
    <div className="options-column">
      <h2>Create Your PolePads</h2>

      {/* Options { Width, Length, Color} */}
      <div className="option-group">
        <label>Width</label>
        <div className="options-grid">
          {options.widths.map((w) => (
            <button
              key={w.value}
              className={`option-button ${
                config.width === w.value ? "selected" : ""
              }`}
              onClick={() => onConfigChange("width", w.value)}>
              {w.label}
            </button>
          ))}
        </div>
      </div>
      <div className="option-group">
        <label>Length</label>
        <div className="options-grid">
          {options.lengths.map((l) => (
            <button
              key={l.value}
              className={`option-button ${
                config.length === l.value ? "selected" : ""
              }`}
              onClick={() => onConfigChange("length", l.value)}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <div className="option-group">
        <div className="label-container">
          <label>Sleeves Color</label>
          <button
            className={`toggle-button ${config.showBoat ? "active" : ""}`}
            onClick={() => onConfigChange("showBoat", !config.showBoat)}>
            Show Boat
          </button>
        </div>
        <div className="color-selector">
          {options.colors.map((c) => (
            <div
              key={c.id}
              className={`color-option ${
                config.color === c.id ? "selected" : ""
              }`}
              onClick={() => onConfigChange("color", c.id)}
              onKeyDown={(e) => handleColorKeyDown(e, c.id)}
              role="radio"
              aria-checked={config.color === c.id}
              tabIndex="0">
              <div className={`color-swatch ${c.id}`} />
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="price-info">
        {priceDisplay}

        {/* Action Buttons */}
        <div className="action-buttons-container">
          <button
            className={`action-button share-button ${isCopied ? "copied" : ""}`}
            onClick={handleCopyLink}
            style={{ position: "relative" }}>
            <span
              className={`button-text ${isCopied ? "fade-out" : "fade-in"}`}>
              <Share size={16} />
              Share
            </span>
            <span
              className={`button-text copied-text ${
                isCopied ? "fade-in" : "fade-out"
              }`}>
              Link Copied!
            </span>
          </button>
          <button
            className="action-button add-to-cart-button"
            onClick={handleAddToCartClick}>
            <ShoppingCart size={16} strokeWidth={3} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

export default OptionsColumn;
