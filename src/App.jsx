// src/App.jsx

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./styles/App.css";
import { environments } from "./data/configOptions";
import EnvironmentSelector from "./components/EnvironmentSelector";
import Configurator from "./components/Configurator";
import SimpleModal from "./components/ConfirmationModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState(null);

  const navigate = useNavigate();

  // This logic is now purely for navigation, not for passing props.
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
    console.log("Submitting to backend:", tempConfig);
    alert(`${tempConfig.environment} has been added to your cart!`);
    setIsModalOpen(false);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SimpleModal
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
