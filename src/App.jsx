// src/App.jsx

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './styles/App.css';
import { environments } from './data/configOptions';
import EnvironmentSelector from './components/EnvironmentSelector';
import Configurator from './components/Configurator';
import SimpleModal from './components/ConfirmationModal'; // Renamed SimpleModal to ConfirmationModal

function App() {
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // This effect runs once on load to set the initial environment from the URL
  useEffect(() => {
    const path = location.pathname.replace('/', ''); // e.g., get 'trailer' from '/trailer'
    const initialEnv = environments.find(env => env.id === path);
    if (initialEnv) {
      setSelectedEnvironment(initialEnv);
    }
  }, []); // Empty dependency array means it runs only once on mount

  const handleEnvironmentSelect = (environment) => {
    setSelectedEnvironment(environment);
    // When an environment is selected, navigate to its specific URL
    navigate(`/${environment.id}`);
  };

  const handleBack = () => {
    setSelectedEnvironment(null);
    // When going back, navigate to the home page
    navigate('/');
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
        {/* Use the Routes component to define page structure */}
        <Routes>
          <Route 
            path="/" 
            element={<EnvironmentSelector onSelect={handleEnvironmentSelect} />} 
          />
          {/* Create a dynamic route for the configurator */}
          <Route 
            path="/:environmentId" 
            element={
              selectedEnvironment ? (
                <Configurator
                  environment={selectedEnvironment}
                  onBack={handleBack}
                  onOpenModal={openConfirmationModal}
                />
              ) : (
                // If user lands on a configurator URL directly, but state isn't ready,
                // you could show a loader or redirect. For now, we show nothing briefly.
                <p>Loading environment...</p>
              )
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