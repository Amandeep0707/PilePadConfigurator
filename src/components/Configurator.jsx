// src/components/Configurator.jsx

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { environments, options, findVariant } from "../data/configProcessor";
import Visualizer from "./Visualizer";
import OptionsColumn from "./OptionsColumn";
import PriceDisplay from "./PriceDisplay";
import "../styles/Configurator.css";

function Configurator({ onBack, onOpenModal }) {
  const { environmentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const environment = useMemo(
    () => environments.find((env) => env.id === environmentId),
    [environmentId]
  );

  if (!environment) {
    return <p>Loading environment...</p>;
  }

  // A single state object for the entire configuration.
  const [config, setConfig] = useState(() => {
    const initialWidth =
      parseFloat(searchParams.get("width")) || options.widths[0].value;
    const initialLength =
      parseFloat(searchParams.get("length")) || options.lengths[0].value;
    const initialColor = searchParams.get("color") || options.colors[0].id; // Default to 'none'
    return {
      width: initialWidth,
      length: initialLength,
      color: initialColor,
    };
  });

  // Find the matching product variant based on the current config.
  const foundVariant = useMemo(() => findVariant(config), [config]);

  // Derived state for the total price.
  const totalPrice = useMemo(() => {
    // The price is based on the found variant, multiplied by the number of poles.
    if (foundVariant) {
      return foundVariant.price * environment.poles;
    }
    // If no variant (e.g., color is 'none'), there is no cost for sleeves.
    return 0;
  }, [foundVariant, environment.poles]);

  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  // Effect to sync state back to URL query parameters.
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("width", config.width);
    params.set("length", config.length);
    params.set("color", config.color);
    setSearchParams(params, { replace: true });
  }, [config, setSearchParams]);

  const handleConfigChange = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCopyLink = (event) => {
    event.stopPropagation();
    if (isCopied) return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleAddToCartClick = (event) => {
    event.stopPropagation();
    if (!foundVariant) return; // Prevent adding to cart if no valid variant is selected

    onOpenModal({
      // Pass all relevant data to the modal, including for Zoho
      ...foundVariant, // This includes sku, price, variantName, etc.
      environmentName: environment.name,
      poles: environment.poles,
      totalPrice: totalPrice,
    });
  };

  return (
    <div className="configurator-container">
      <button onClick={onBack} className="back-button">
        ← Change Environment
      </button>

      <div className="configurator-main">
        <div className="visualizer-column">
          <Visualizer
            environmentId={environment.id}
            variant={foundVariant} // Pass the whole variant object
          />
        </div>

        <div className="options-panel-wrapper">
          <OptionsColumn
            options={options}
            config={config}
            onConfigChange={handleConfigChange}
            priceDisplay={
              <PriceDisplay
                variantPrice={foundVariant ? foundVariant.price : 0}
                totalPrice={totalPrice}
              />
            }
          />

          <div className="action-buttons-container">
            <button
              className={`action-button share-button ${
                isCopied ? "copied" : ""
              }`}
              onClick={handleCopyLink}
              style={{ position: "relative" }}>
              <span
                className={`button-text ${isCopied ? "fade-out" : "fade-in"}`}>
                Share Configuration
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
              onClick={handleAddToCartClick}
              disabled={!foundVariant} // Disable if no valid variant is selected
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
