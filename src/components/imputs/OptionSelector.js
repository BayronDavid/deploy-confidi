// /components/OptionSelector.js
import React, { useState } from 'react';
import './OptionSelector.css';
import Button from '../buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../modal/Modal';

/**
 * OptionSelector: Muestra un label y una lista de opciones.
 *
 * Props:
 *  - label: Texto descriptivo.
 *  - options: Array de objetos { label: string, value: string, tooltip: string }.
 *  - selectedValues: Array con los valores seleccionados actualmente.
 *  - onChange: Callback que recibe el array de valores seleccionados al cambiar.
 *  - allowMultiple: boolean, true = modo "checkbox", false = modo "radio".
 *  - tooltip: Contenido de información adicional para mostrar en un modal.
 *  - buttonWidth: Ancho consistente para todos los botones (ej: '150px', '100%').
 */
function OptionSelector({
    label,
    options = [],
    selectedValues = [],
    onChange,
    allowMultiple = false,
    tooltip,
    buttonWidth = "90%",
}) {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [activeOptionTooltip, setActiveOptionTooltip] = useState(null);
    const [activeOptionLabel, setActiveOptionLabel] = useState("");

    // Nos aseguramos que selectedValues es un array
    if (!Array.isArray(selectedValues)) {
        selectedValues = [];
    }

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

    const handleTooltipToggle = () => {
        setIsTooltipOpen(!isTooltipOpen);
    };

    const handleOptionTooltipToggle = (tooltip, optionLabel) => {
        setActiveOptionTooltip(tooltip);
        setActiveOptionLabel(optionLabel);
        setIsTooltipOpen(true);
    };

    return (
        <div className="option-selector">
            {label && (
                <div className="option-selector__label">
                    {label}
                    {tooltip && (
                        <span className="option-selector__tooltip-icon" onClick={handleTooltipToggle}>
                            <FontAwesomeIcon icon={faQuestionCircle} />
                        </span>
                    )}
                </div>
            )}
            <div className="option-selector__list">
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    const buttonVariant = isSelected ? 'accent' : 'neutral';
                    return (
                        <div key={option.value} className="option-selector__option-container">
                            <Button
                                label={option.label}
                                variant={buttonVariant}
                                onClick={() => handleOptionClick(option.value)}
                                tooltipTitle={option.label}
                                width={buttonWidth}
                            >
                                {option.tooltip}
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Modal para el tooltip del selector o de una opción específica */}
            <Modal 
                isOpen={isTooltipOpen} 
                onClose={() => setIsTooltipOpen(false)}
                title={activeOptionTooltip ? activeOptionLabel : label}
            >
                <div>{activeOptionTooltip || tooltip}</div>
            </Modal>
        </div>
    );
}

export default OptionSelector;
