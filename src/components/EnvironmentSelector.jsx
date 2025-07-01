import React from "react";
import { environments } from "../data/configOptions";
import "../styles/EnvironmentSelector.css";

function EnvironmentSelector({ onSelect }) {
  return (
    <div className="env-selector-container">
      <h2>Choose Your Environment</h2>
      <div className="env-options">
        {environments.map((env) => (
          <div
            key={env.id}
            className="env-option"
            onClick={() => onSelect(env)}
            tabIndex="0"
            role="button">
            <img src={env.image} alt={env.name} />
            <h3>{env.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnvironmentSelector;
