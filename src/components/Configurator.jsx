import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { environments, options, findVariant } from "../data/configProcessor";
import Visualizer from "./Visualizer";
import OptionsColumn from "./OptionsColumn";
import PriceDisplay from "./PriceDisplay";
import ProductDescription from "./ProductDescription"; // Import the new component
import "../styles/Configurator.css";

function Configurator({ onBack, onOpenModal }) {
  const { environmentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const environment = useMemo(
    () => environments.find((env) => env.id === environmentId),
    [environmentId]
  );

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false); // State for the new modal

  if (!environment) {
    return <p>Loading environment...</p>;
  }

  const [config, setConfig] = useState(() => {
    const initialShowBoat = searchParams.get("showBoat") !== "false";
    const initialWidth =
      parseFloat(searchParams.get("width")) || options.widths[0].value;
    const initialLength =
      parseFloat(searchParams.get("length")) || options.lengths[0].value;
    const initialColor = searchParams.get("color") || options.colors[0].id;
    return {
      width: initialWidth,
      length: initialLength,
      color: initialColor,
      showBoat: initialShowBoat,
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
  }, [foundVariant, environment.poles]);

  const totalRetailPrice = useMemo(() => {
    if (foundVariant && foundVariant.retailPrice) {
      return foundVariant.retailPrice * environment.poles;
    }
    return 0;
  }, [foundVariant, environment.poles]);

  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("width", config.width);
    params.set("length", config.length);
    params.set("color", config.color);
    params.set("showBoat", config.showBoat);
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
      totalRetailPrice: totalRetailPrice,
      selectedColor: config.color,
    });
  };

  return (
    <div className="configurator-container">
      <button onClick={onBack} className="back-button">
        <ArrowLeft />
        Change Environment
      </button>
      <div className="configurator-main">
        <div className="visualizer-column">
          <Visualizer
            environmentId={environment.id}
            variant={foundVariant}
            color={config.color}
            showBoat={config.showBoat}
            onInfoClick={() => setIsDescriptionOpen(true)} // Pass the handler
          />
        </div>
        <OptionsColumn
          options={options}
          config={config}
          onConfigChange={handleConfigChange}
          description={foundVariant?.description}
          priceDisplay={
            <PriceDisplay
              totalPrice={totalPrice}
              totalRetailPrice={totalRetailPrice}
            />
          }
          handleCopyLink={handleCopyLink}
          handleAddToCartClick={handleAddToCartClick}
          isCopied={isCopied}
        />
      </div>
      <ProductDescription
        isOpen={isDescriptionOpen}
        onClose={() => setIsDescriptionOpen(false)}
        description={foundVariant?.description}
      />
    </div>
  );
}

export default Configurator;
