// /components/OptionSelector.js
import React, { useState, useEffect } from 'react';
import './OptionSelector.css';
import Button from '../buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../modal/Modal';
import { useFormsContext } from '@/context/FormsContext';

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
 *  - isOptional: boolean, indica si la selección es opcional.
 */
function OptionSelector({
    label,
    options = [],
    selectedValues = [],
    onChange,
    allowMultiple = false,
    tooltip,
    buttonWidth = "90%",
    isOptional = false,
}) {
    const { formSubmitAttempted } = useFormsContext();
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [activeOptionTooltip, setActiveOptionTooltip] = useState(null);
    const [activeOptionLabel, setActiveOptionLabel] = useState("");
    const [hasAction, setHasAction] = useState(false);

    // Nos aseguramos que selectedValues es un array
    if (!Array.isArray(selectedValues)) {
        selectedValues = [];
    }

    // Verificar si el usuario ha seleccionado alguna opción
    useEffect(() => {
        setHasAction(selectedValues && selectedValues.length > 0);
    }, [selectedValues]);

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

    return (
        <div className={`option-selector ${isOptional && !hasAction && formSubmitAttempted ? 'option-selector--pending-action' : ''}`}>
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
                    const buttonVariant = isSelected ? 'primary' : 'secondary';
                    return (
                        <div key={option.value} className="option-selector__option-container">
                            <Button
                                label={option.label}
                                variant={buttonVariant}
                                onClick={() => handleOptionClick(option.value)}
                                active={isSelected}
                                tooltipTitle={option.label}
                                width={buttonWidth}
                            >
                                {option.tooltip}
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Solo mostrar advertencia después de un intento de envío */}
            {!hasAction && formSubmitAttempted && (
                <div className="option-selector__warning">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <span>È necessario selezionare un'opzione</span>
                </div>
            )}

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
