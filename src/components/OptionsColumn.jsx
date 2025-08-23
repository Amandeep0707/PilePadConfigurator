import React from "react";
import { Share, ShoppingCart } from "lucide-react";

const OptionsColumn = React.memo(function OptionsColumn({
  options,
  config,
  polesQuantity,
  onConfigChange,
  priceDisplay,
  handleCopyLink,
  handleAddToCartClick,
  isCopied,
}) {
  const handleColorToggle = (colorId) => {
    // If the color is currently selected, deselect it (set to none)
    // If it's not selected, select it
    const newColor = config.color === colorId ? "none" : colorId;
    onConfigChange("color", newColor);
  };

  const handleColorKeyDown = (e, colorId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleColorToggle(colorId);
    }
  };

  return (
    <div className="options-column">
      <h2>Create Your PolePads</h2>

      {/* Options { Width, Length, Color} */}
      <div className="option-group">
        <div className="option-title">
          <label>Select Your PolePad Diameter</label>
          <a className="option-group-description">
            We highly recommend choosing a diameter AT LEAST .5” larger than
            your lift pole diameter.
          </a>
        </div>
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
        <div className="option-title">
          <label>Select your PolePad length</label>
        </div>
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
          <div className="option-title">
            <label>Select Your PolePad Color</label>
            <a className="option-group-description">
              A color must be selected to place items in the cart.
            </a>
          </div>
          <button
            className={`toggle-button ${config.showBoat ? "active" : ""}`}
            onClick={() => onConfigChange("showBoat", !config.showBoat)}>
            Show Boat
          </button>
        </div>
        <div className="color-selector">
          {options.colors
            .filter((c) => c.id !== "none") // Remove the "none" option
            .map((c) => (
              <div
                key={c.id}
                className={`color-option toggle-color ${
                  config.color === c.id ? "selected" : ""
                }`}
                onClick={() => handleColorToggle(c.id)}
                onKeyDown={(e) => handleColorKeyDown(e, c.id)}
                role="button"
                aria-pressed={config.color === c.id}
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
            className={`action-button add-to-cart-button ${
              config.color === "none" ? "disabled" : ""
            }`}
            onClick={handleAddToCartClick}
            disabled={config.color === "none"} // Disable if no color is selected
            title={
              config.color === "none" ? "Please select a sleeve color" : ""
            }>
            <ShoppingCart size={16} strokeWidth={3} />
            Add to Cart
          </button>
        </div>
      </div>
      <div className="external-link-container">
        <span className="external-link-heading">
          {`You’re purchasing a ${polesQuantity}-pack of custom PolePads. Need a different
          quantity?`}
        </span>
        <a
          className="external-link"
          href="https://pilepad.com/shop/polepad"
          rel="https://pile-pad-configurator.vercel.app/">
          Shop Here
        </a>
      </div>
    </div>
  );
});

export default OptionsColumn;
