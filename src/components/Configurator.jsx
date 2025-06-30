import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { options, pricing, environments } from '../data/configOptions';
import Visualizer from './Visualizer';
import OptionsColumn from './OptionsColumn';
import PriceDisplay from './PriceDisplay';
import '../styles/Configurator.css';

const sanitize = (val) => val.replace(/[^a-zA-Z0-9-.]/g, '');

function Configurator({ onBack, onOpenModal }) {
  const { environmentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // The environment is now derived directly and memoized. It's the source of truth.
  const environment = useMemo(() => environments.find(env => env.id === environmentId), [environmentId]);

  // If the URL is invalid or still loading, show a fallback.
  if (!environment) {
    return <p>Loading environment...</p>;
  }

  const isLift = environment.id.includes('lift');
  const configOptions = isLift ? options.lift : options.trailer;
  
  // A single state object for the entire configuration.
  const [config, setConfig] = useState(() => {
    // This initializer function runs only once, synchronously, before the first render.
    const initialWidth = configOptions.widths.find(w => sanitize(w) === searchParams.get('width')) || configOptions.widths[0];
    const initialLength = configOptions.lengths.find(l => l.value === searchParams.get('length'))?.value || (isLift ? '144' : configOptions.lengths[0].value);
    const initialColor = options.colors.find(c => c.id === searchParams.get('color'))?.id || options.colors[1].id;
    return {
      width: initialWidth,
      length: initialLength,
      color: initialColor,
    };
  });

  // Derived state for the total price, memoized to recalculate only when inputs change.
  const totalPrice = useMemo(() => {
    let finalTotal = environment.basePrice;
    if (config.color !== 'none') {
      const sleeveCost = pricing.calculateSleeveAddonCost(config.width, config.length) * environment.poles;
      finalTotal += sleeveCost;
    }
    return finalTotal;
  }, [config.width, config.length, config.color, environment]);

  // UI state for the copy button.
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  // Effect to sync the state back to the URL's query parameters.
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('width', sanitize(config.width));
    params.set('length', config.length);
    params.set('color', config.color);
    setSearchParams(params, { replace: true });
  }, [config, setSearchParams]);

  // Use useCallback for handlers to ensure they are stable and don't cause re-renders.
  // We use the functional form of setState (prev => ...) so we don't need 'config' in the dependency array.
  const handleWidthChange = useCallback((newWidth) => setConfig(prev => ({ ...prev, width: newWidth })), []);
  const handleLengthChange = useCallback((newLength) => setConfig(prev => ({ ...prev, length: newLength })), []);
  const handleColorChange = useCallback((newColor) => setConfig(prev => ({ ...prev, color: newColor })), []);
  
  const handleCopyLink = (event) => {
    event.stopPropagation();
    if (isCopied) return;
    if (!navigator.clipboard) {
      setIsCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 3000);
      return;
    }
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleAddToCartClick = (event) => {
    event.stopPropagation();
    const lengthLabel = configOptions.lengths.find(l => l.value === config.length)?.label || config.length;
    onOpenModal({
      environment: environment.name,
      basePrice: environment.basePrice,
      poles: environment.poles,
      width: config.width,
      length: lengthLabel,
      color: config.color,
      totalPrice: totalPrice,
    });
  };

  return (
    <div className="configurator-container">
      <button onClick={onBack} className="back-button">← Change Environment</button>
      
      <div className="configurator-main">
        <div className="visualizer-column">
          <Visualizer
            environmentId={environment.id}
            color={config.color}
            width={config.width}
            length={config.length}
          />
        </div>
        
        <div className="options-panel-wrapper">
          <OptionsColumn
              configOptions={configOptions}
              width={config.width}
              length={config.length}
              color={config.color}
              onWidthChange={handleWidthChange}
              onLengthChange={handleLengthChange}
              onColorChange={handleColorChange}
              priceDisplay={
                <PriceDisplay
                  basePrice={environment.basePrice}
                  sleeveCost={config.color === 'none' ? 0 : (totalPrice - environment.basePrice)}
                  totalPrice={totalPrice}
                />
              }
          />

          <div className="action-buttons-container">
            <button 
              className={`action-button share-button ${isCopied ? 'copied' : ''}`} 
              onClick={handleCopyLink} // Pass the event object implicitly
              style={{ position: 'relative' }}
            >
              <span className={`button-text ${isCopied ? 'fade-out' : 'fade-in'}`}>
                Share Configuration
              </span>
              <span className={`button-text copied-text ${isCopied ? 'fade-in' : 'fade-out'}`}>
                {navigator.clipboard ? 'Link Copied!' : 'Not Supported'}
              </span>
            </button>
            <button 
              className="action-button add-to-cart-button" 
              onClick={handleAddToCartClick} // Pass the event object implicitly
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configurator;