import React from "react";

const OptionsColumn = React.memo(function OptionsColumn({
  options,
  config,
  onConfigChange,
  priceDisplay,
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

      <div className="option-group">
        <label>Sleeves Color</label>
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

      {priceDisplay}
    </div>
  );
});

export default OptionsColumn;
