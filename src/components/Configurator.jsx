import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { options, pricing, environments } from '../data/configOptions';
import Visualizer from './Visualizer';
import OptionsColumn from './OptionsColumn';
import PriceDisplay from './PriceDisplay';
import '../styles/Configurator.css';

// Helper to sanitize URL params
const sanitize = (val, type = 'string') => {
  if (type === 'length') return val; // Length is already a clean string of numbers
  return val.replace(/[^a-zA-Z0-9-.]/g, '');
};

function Configurator({ onBack, onOpenModal }) {

  const { environmentId } = useParams();
  const environment = useMemo(() => environments.find(env => env.id === environmentId), [environmentId]);
  const [searchParams, setSearchParams] = useSearchParams();

  if (!environment) {
    return <div>Error: Environment not found. <button onClick={onBack}>Go Back</button></div>;
  }
  
  const isLift = environment.id.includes('lift');
  const configOptions = isLift ? options.lift : options.trailer;
  
  // --- STATE INITIALIZATION UPDATED ---
  const [width, setWidth] = useState(
    () => configOptions.widths.find(w => sanitize(w) === searchParams.get('width')) || configOptions.widths[0]
  );
  // Length state now finds the matching value, or defaults to the first value
  const [length, setLength] = useState(
    () => configOptions.lengths.find(l => l.value === searchParams.get('length'))?.value || (isLift ? '144' : configOptions.lengths[0].value)
  );
  const [color, setColor] = useState(
    () => options.colors.find(c => c.id === searchParams.get('color'))?.id || options.colors[0].id
  );

  const [totalPrice, setTotalPrice] = useState(0);
  
  const [copyButtonText, setCopyButtonText] = useState('Share Configuration');

  // NEW: State to control the 'copied' class
  const [isCopied, setIsCopied] = useState(false);

  // Use a ref to manage the timeout to prevent conflicts if the user clicks multiple times
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('width', sanitize(width));
    params.set('length', length); 
    params.set('color', color);
    setSearchParams(params, { replace: true });
  }, [width, length, color, setSearchParams]);

  useEffect(() => {
    const pricePerPole = pricing.calculatePricePerPole(width, length);
    const total = pricePerPole * environment.poles;
    setTotalPrice(total);
  }, [width, length, environment.poles]);

  const handleCopyLink = (event) => {
    event.stopPropagation();
    if (isCopied) return;

    // We no longer set the text here, only the `isCopied` state
    if (!navigator.clipboard) {
      console.error("Clipboard API not available.");
      setIsCopied(true); // Still trigger the visual "error" state
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 3000); // Give more time for an error message
      return;
    }

    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  // --- THIS IS THE CRITICAL CHANGE ---
  const handleAddToCartClick = (event) => {
    event.stopPropagation();
    // Find the full label for the current length value to show in the modal
    const lengthLabel = configOptions.lengths.find(l => l.value === length)?.label || length;

    const currentConfig = {
      environment: environment.name,
      poles: environment.poles,
      width,
      length: lengthLabel, // Pass the user-friendly label to the modal
      color,
      totalPrice,
    };
    onOpenModal(currentConfig);
  };
  
  const memoizedPriceDisplay = useMemo(() => (
    <PriceDisplay
        pricePerPole={totalPrice / environment.poles}
        totalPrice={totalPrice}
    />
  ), [totalPrice, environment.poles]);

  const handleWidthChange = useCallback(newWidth => setWidth(newWidth), []);
  const handleLengthChange = useCallback(newLength => setLength(newLength), []);
  const handleColorChange = useCallback(newColor => setColor(newColor), []);


  return (
    <div className="configurator-container">
      <button onClick={onBack} className="back-button">← Change Environment</button>
      
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
        <div className="action-buttons-container">
          <button 
            className={`action-button share-button ${isCopied ? 'copied' : ''}`} 
            onClick={(e) => handleCopyLink(e)}
            // Add this to prevent resizing
            style={{ position: 'relative' }}
          >
            {/* --- NEW: Two spans for a smooth cross-fade --- */}
            <span className={`button-text ${isCopied ? 'fade-out' : 'fade-in'}`}>
              Share Configuration
            </span>
            <span className={`button-text copied-text ${isCopied ? 'fade-in' : 'fade-out'}`}>
              {navigator.clipboard ? 'Link Copied!' : 'Not Supported'}
            </span>
          </button>
          <button 
            className="action-button add-to-cart-button" 
            onClick={(e) => handleAddToCartClick(e)}
          >
            Add to Cart
          </button>
      </div>
      </div>
    </div>
  );
}

export default Configurator;