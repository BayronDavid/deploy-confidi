import React from 'react';
import './OptionSelector.css';
import Button from '../buttons/Button';

/**
 * OptionSelector: Muestra un label y una lista de opciones,
 *
 * Props:
 *  - label: Texto que describe el grupo de opciones
 *  - options: Array de objetos { label: string, value: string }
 *  - selectedValues: Array con los valores seleccionados actualmente
 *  - onChange: Callback que recibe el array de valores seleccionados al cambiar
 *  - allowMultiple: boolean, true = modo "checkbox", false = modo "radio"
 */
function OptionSelector({
    label,
    options = [],
    selectedValues = [],
    onChange,
    allowMultiple = false, // por defecto: selección única
}) {
    // Maneja el clic en una opción
    const handleOptionClick = (value) => {
        if (!onChange) return;

        if (allowMultiple) {
            // Modo "checkbox": Agrega o quita del array
            const isSelected = selectedValues.includes(value);
            const newSelected = isSelected
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];
            onChange(newSelected);
        } else {
            // Modo "radio": solo un valor seleccionado
            onChange([value]);
        }
    };

    return (
        <div className="option-selector">
            {label && <div className="option-selector__label">{label}</div>}
            <div className="option-selector__list">
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);

                    const buttonVariant = isSelected ? 'accent' : 'neutral';

                    return (
                        <Button
                            key={option.value}
                            label={option.label}
                            variant={buttonVariant}
                            onClick={() => handleOptionClick(option.value)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default OptionSelector;
