import React from 'react';
import PriceDisplay from './PriceDisplay'; // Assuming PriceDisplay is in the same folder or update path
import { options } from '../data/configOptions';

// We wrap the entire component in React.memo
// It will only re-render if its props (like configOptions, width, length, etc.) change.
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
        <select id="length-select" value={length} onChange={(e) => onLengthChange(e.target.value)}>
          {configOptions.lengths.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="option-group">
        <label>Color</label>
        <div className="color-selector">
          {options.colors.map(c => (
            <div key={c.id} className={`color-option ${color === c.id ? 'selected' : ''}`} onClick={() => onColorChange(c.id)}>
              <div className={`color-swatch ${c.id}`} />
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* We pass the PriceDisplay as a prop to further isolate it */}
      {priceDisplay}
    </div>
  );
});

export default OptionsColumn;