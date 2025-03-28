import React from 'react';
import './ToggleButtonGroup.css'; // Puedes crear estilos específicos o reutilizar estilos existentes

// options: [{ label, value }]
// activeValue: el valor seleccionado actualmente
// onChange: callback con el nuevo valor
function ToggleButtonGroup({ options = [], activeValue, onChange }) {
  return (
    <div className="toggle-button-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`toggle-button ${activeValue === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default ToggleButtonGroup;
