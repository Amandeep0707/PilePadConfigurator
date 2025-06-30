// src/components/OptionsColumn.jsx

import React from 'react';
import PriceDisplay from './PriceDisplay';
import { options } from '../data/configOptions';

const OptionsColumn = React.memo(function OptionsColumn({
  configOptions,
  width,
  length,
  color,
  onWidthChange,
  onLengthChange,
  onColorChange,
  priceDisplay
}) {
  const handleColorKeyDown = (e, colorId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onColorChange(colorId);
    }
  };
  
  return (
    <div className="options-column">
      <h2>Create Your PolePads</h2>

      <div className="option-group">
        <label>Sleeves Color</label>
        <div className="color-selector">
          {options.colors.map(c => (
            <div 
              key={c.id}
              className={`color-option ${color === c.id ? 'selected' : ''}`}
              onClick={() => onColorChange(c.id)}
              onKeyDown={(e) => handleColorKeyDown(e, c.id)}
              role="radio"
              aria-checked={color === c.id}
              tabIndex="0"
            >
              <div className={`color-swatch ${c.id}`} />
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* --- UPDATED: Width Buttons with Grid Layout --- */}
      <div className="option-group">
        <label>Width</label>
        <div className="options-grid">
          {configOptions.widths.map(w => (
            <button
              key={w}
              className={`option-button ${width === w ? 'selected' : ''}`}
              onClick={() => onWidthChange(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* --- UPDATED: Length Buttons with Grid Layout --- */}
      <div className="option-group">
        <label>Length</label>
        <div className="options-grid">
          {configOptions.lengths.map(l => (
            <button
              key={l.value}
              className={`option-button ${length === l.value ? 'selected' : ''}`}
              onClick={() => onLengthChange(l.value)}
            >
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