import React, { useState, useEffect } from "react";
import "./FidejussioneInputGroup.css";
import Button from "../buttons/Button"; // Ajusta la ruta según tu estructura
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useFormsContext } from "@/context/FormsContext";

/**
 * FidejussioneInputGroup:
 *   - Muestra un label principal.
 *   - Renderiza una lista de opciones (cada una con su botón, importo y durata).
 *   - Permite seleccionar una o varias, según `allowMultiple`.
 *   - Muestra advertencia si el campo es obligatorio y no se ha seleccionado nada tras submit.
 *
 * Props:
 *  - label: Texto descriptivo para el grupo.
 *  - options: Array de objetos con la forma:
 *       { label: string, value: string, importo: string, durata: string }
 *  - selectedValues: Array con los `value` seleccionados actualmente.
 *  - onChange: Callback que recibe:
 *       - en modo radio (allowMultiple=false), un array con el value seleccionado.
 *       - en modo checkbox (allowMultiple=true), un array con todos los values seleccionados.
 *       - adicionalmente, si deseas capturar cambios de importo/durata, 
 *         puedes mantener un estado externo sincronizado con `options`.
 *  - allowMultiple: boolean, true = modo "checkbox", false = modo "radio".
 *  - isOptional: boolean, indica si la selección es opcional (afecta la validación visual).
 *  - buttonWidth: Ancho para todos los botones (por defecto “100%”).
 */
export default function FidejussioneInputGroup({
    label = "Scegli la tipologia di fidejussione",
    options = [],
    selectedValues = [],
    onChange,
    allowMultiple = false,
    isOptional = false,
    buttonWidth = "100%",
}) {
    // Accedemos al contexto para saber si hubo intento de submit
    const { formSubmitAttempted } = useFormsContext();

    // Verificamos si el usuario ha seleccionado al menos una opción
    const [hasAction, setHasAction] = useState(false);

    useEffect(() => {
        setHasAction(selectedValues && selectedValues.length > 0);
    }, [selectedValues]);

    // Al hacer clic en una opción (botón)
    const handleOptionClick = (value) => {
        if (!onChange) return;

        if (allowMultiple) {
            // "Checkbox": agrega o quita el valor del array
            const isSelected = selectedValues.includes(value);
            const newSelected = isSelected
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];
            onChange(newSelected);
        } else {
            // "Radio": solo un valor
            onChange([value]);
        }
    };

    // Al cambiar el valor de "Importo" en una opción
    const handleImportoChange = (optionValue, newImporto) => {
        // Aquí NO mutamos "options" directamente (depende de tu lógica).
        // Normalmente se maneja en el estado padre, o en un callback adicional.
        // Por ejemplo, si el padre controla las "options" con importo/durata, 
        // podrías llamarle con un onChangeOptions(...) 
        // o tener un callback distinto. Aquí solo se muestra la idea:
        console.log(`Importo cambiado para ${optionValue}:`, newImporto);
    };

    // Al cambiar el valor de "Durata" en una opción
    const handleDurataChange = (optionValue, newDurata) => {
        console.log(`Durata cambiada para ${optionValue}:`, newDurata);
    };

    // Determinamos si debemos mostrar la advertencia (campo requerido)
    const showWarning = !hasAction && formSubmitAttempted && !isOptional;

    return (
        <div
            className={`fidejussione-input-group ${showWarning ? "fidejussione-input-group--pending-action" : ""
                }`}
        >
            {/* Etiqueta principal */}
            {label && (
                <div className="fidejussione-input-group__label">
                    {label}
                </div>
            )}

            {/* Lista de opciones */}
            <div className="fidejussione-input-group__list">
                {options.map((option) => {
                    const { label, value, importo, durata } = option;
                    const isSelected = selectedValues.includes(value);

                    // El botón cambia de variante según si está seleccionado o no
                    const buttonVariant = isSelected ? "primary" : "secondary";

                    return (
                        <div key={value} className="fidejussione-input-group__row">
                            {/* Botón principal (columna izquierda) */}
                            <div className="fidejussione-input-group__left">
                                <Button
                                    label={label}
                                    variant={buttonVariant}
                                    onClick={() => handleOptionClick(value)}
                                    active={isSelected}
                                    width={buttonWidth}
                                >
                                    {/* Puedes inyectar aquí children si deseas */}
                                </Button>
                            </div>

                            {/* Columna "Importo" */}
                            <div className="fidejussione-input-group__importo-pill">
                                <span>€</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={importo}
                                    onChange={(e) => handleImportoChange(value, e.target.value)}
                                />
                            </div>

                            {/* Columna "Durata" */}
                            <div className="fidejussione-input-group__durata-pill">
                                <input
                                    type="text"
                                    value={durata}
                                    onChange={(e) => handleDurataChange(value, e.target.value)}
                                />
                                <span>Mesi</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Advertencia si no se ha seleccionado nada y es requerido */}
            {showWarning && (
                <div className="fidejussione-input-group__warning">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <span>È necessario selezionare un'opzione</span>
                </div>
            )}
        </div>
    );
}
