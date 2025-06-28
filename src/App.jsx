import { useState } from 'react';
import './styles/App.css';
import EnvironmentSelector from './components/EnvironmentSelector';
import Configurator from './components/Configurator';

function App() {
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);

  const handleEnvironmentSelect = (environment) => {
    setSelectedEnvironment(environment);
  };

  const handleBack = () => {
    setSelectedEnvironment(null);
  }

  return (
    <>
      <header className="app-header">
        <h1>Configurator WIP</h1>
        <p className="subtitle">PilePad Inc.</p>
      </header>
      <main className="app-main">
        {!selectedEnvironment ? (
          <EnvironmentSelector onSelect={handleEnvironmentSelect} />
        ) : (
          <Configurator environment={selectedEnvironment} onBack={handleBack} />
        )}
      </main>
      <footer className="app-footer">
        <p>May 2025</p>
      </footer>
    </>
  );
}

export default App;