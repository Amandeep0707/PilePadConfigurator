import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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

  const [config, setConfig] = useState(() => {
    const initialWidth =
      parseFloat(searchParams.get("width")) || options.widths[0].value;
    const initialLength =
      parseFloat(searchParams.get("length")) || options.lengths[0].value;
    const initialColor = searchParams.get("color") || options.colors[0].id;
    return {
      width: initialWidth,
      length: initialLength,
      color: initialColor,
    };
  });

  const foundVariant = useMemo(
    () => findVariant(config),
    [config.width, config.length]
  );

  const totalPrice = useMemo(() => {
    if (foundVariant) {
      return foundVariant.price * environment.poles;
    }
    return 0;
  }, [foundVariant, config.color, environment.poles]);

  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

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

    onOpenModal({
      ...foundVariant,
      environmentName: environment.name,
      poles: environment.poles,
      totalPrice: totalPrice,
      selectedColor: config.color,
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
            variant={foundVariant}
            color={config.color}
          />
        </div>
        <div className="options-panel-wrapper">
          <OptionsColumn
            options={options}
            config={config}
            onConfigChange={handleConfigChange}
            priceDisplay={<PriceDisplay totalPrice={totalPrice} />}
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
              onClick={handleAddToCartClick}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configurator;
