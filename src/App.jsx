// src/App.jsx

import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./styles/App.css";
import EnvironmentSelector from "./components/EnvironmentSelector";
import Configurator from "./components/Configurator";
import ConfirmationModal from "./components/ConfirmationModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState(null);
  const navigate = useNavigate();

  const handleEnvironmentSelect = (environment) => {
    navigate(`/${environment.id}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  const openConfirmationModal = (config) => {
    setTempConfig(config);
    setIsModalOpen(true);
  };

  const handleConfirmAddToCart = () => {
    if (!tempConfig) return;
    // For future Zoho integration, tempConfig contains sku, variantId, etc.
    console.log("Submitting to backend:", tempConfig);
    alert(`${tempConfig.variantName} has been added to your cart!`);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        config={tempConfig}
        onConfirm={handleConfirmAddToCart}
      />

      <header className="app-header">
        <h1>Configurator WIP</h1>
        <p className="subtitle">PilePad Inc.</p>
      </header>
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<EnvironmentSelector onSelect={handleEnvironmentSelect} />}
          />
          <Route
            path="/:environmentId"
            element={
              <Configurator
                onBack={handleBack}
                onOpenModal={openConfirmationModal}
              />
            }
          />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>May 2025</p>
      </footer>
    </>
  );
}

export default App;
