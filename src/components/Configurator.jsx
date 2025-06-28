import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { options, pricing } from '../data/configOptions';
import Visualizer from './Visualizer';
import OptionsColumn from './OptionsColumn';
import PriceDisplay from './PriceDisplay';
import '../styles/Configurator.css';

function Configurator({ environment, onBack }) {
  const isLift = environment.id.includes('lift');
  const configOptions = isLift ? options.lift : options.trailer;

  const [width, setWidth] = useState(configOptions.widths[0]);
  const [length, setLength] = useState(
    isLift ? "144\" (12.0')" : configOptions.lengths[0]
  );
  const [color, setColor] = useState(options.colors[0].id);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = pricing.perPole * environment.poles;
    setTotalPrice(total);
  }, [environment.poles]);

  const handleAddToCart = () => {
    const configuration = {
      environment: environment.name,
      poles: environment.poles,
      width,
      length,
      color,
      totalPrice: totalPrice.toFixed(2),
    };
    alert(`Added to cart: \n${JSON.stringify(configuration, null, 2)}`);
  };
  
  const memoizedPriceDisplay = useMemo(() => (
    <PriceDisplay
        poles={environment.poles}
        pricePerPole={pricing.perPole}
        totalPrice={totalPrice}
    />
  ), [totalPrice, environment.poles]);

  const handleWidthChange = useCallback(newWidth => setWidth(newWidth), []);
  const handleLengthChange = useCallback(newLength => setLength(newLength), []);
  const handleColorChange = useCallback(newColor => setColor(newColor), []);

  return (
    <div className="configurator-container">
      <button onClick={onBack} className="back-button">← Change Environment</button>
      
      {/* The main grid now contains all three primary sections */}
      <div className="configurator-main">
        <div className="visualizer-column">
          <Visualizer
            environmentId={environment.id}
            color={color}
            width={width}
            length={length}
          />
        </div>
        
        <OptionsColumn
            configOptions={configOptions}
            width={width}
            length={length}
            color={color}
            onWidthChange={handleWidthChange}
            onLengthChange={handleLengthChange}
            onColorChange={handleColorChange}
            priceDisplay={memoizedPriceDisplay}
        />

        {/* The button container is now a direct child of the grid */}
        <div className="add-to-cart-container">
           <button className="add-to-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
}

export default Configurator;