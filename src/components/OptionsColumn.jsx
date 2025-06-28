// src/components/OptionsColumn.jsx

import React from 'react';
import PriceDisplay from './PriceDisplay';
import { options } from '../data/configOptions';

const OptionsColumn = React.memo(function OptionsColumn({
  configOptions,
  width,
  length, // This is now a value like "192"
  color,
  onWidthChange,
  onLengthChange,
  onColorChange,
  priceDisplay
}) {
  // ... (handleColorKeyDown remains the same)
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
        <label htmlFor="width-select">Width</label>
        <select id="width-select" value={width} onChange={(e) => onWidthChange(e.target.value)}>
          {configOptions.widths.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      <div className="option-group">
        <label htmlFor="length-select">Length</label>
        {/* --- UPDATE TO RENDER OPTIONS FROM THE NEW OBJECT STRUCTURE --- */}
        <select id="length-select" value={length} onChange={(e) => onLengthChange(e.target.value)}>
          {configOptions.lengths.map(l => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* ... (color selector remains the same) ... */}
       <div className="option-group">
        <label>Color</label>
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
      
      {priceDisplay}
    </div>
  );
});

export default OptionsColumn;