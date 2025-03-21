import React, { useState, useEffect } from "react";
import "./FidejussioneInputGroup.css";
import Button from "../buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useFormsContext } from "@/context/FormsContext";
import HtmlRenderer from "@/utils/HtmlRenderer";

/**
 * FidejussioneInputGroup:
 *   - Componente de tabla muy configurable.
 *   - Permite selección (simple o múltiple) y edición condicional de columnas.
 *   - Usa 'requiresSelection' en columnas y 'disabledColumns' en cada fila para controlar el disabled.
 */
export default function FidejussioneInputGroup({
    label = "",
    options = [],
    selectedValues = [],
    onChange,
    allowMultiple = false,
    isOptional = false,
    columns = [],
    warningMessage = "",
    warningIcon = null,
    className = ""
}) {
    const { formSubmitAttempted } = useFormsContext();

    // Indica si hay al menos una opción seleccionada
    const [hasAction, setHasAction] = useState(false);

    // Datos locales de las opciones (por si se modifican campos dentro de cada fila)
    const [optionsData, setOptionsData] = useState([]);

    useEffect(() => {
        setHasAction(selectedValues && selectedValues.length > 0);

        // Inicializamos datos internos solo la primera vez que recibimos 'options'
        if (options.length > 0 && optionsData.length === 0) {
            setOptionsData([...options]);
        }
    }, [selectedValues, options]);

    // Maneja la selección (modo "radio" o "checkbox")
    const handleOptionClick = (value) => {
        if (!onChange) return;

        if (allowMultiple) {
            const isSelected = selectedValues.includes(value);
            const newSelected = isSelected
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];
            onChange(newSelected, optionsData);
        } else {
            onChange([value], optionsData);
        }
    };

    // Maneja cambios en los campos de una fila
    const handleFieldChange = (optionIndex, columnId, newValue) => {
        const updatedOptions = [...optionsData];
        const column = columns.find((col) => col.id === columnId);

        if (column && column.fieldName) {
            updatedOptions[optionIndex][column.fieldName] = newValue;
            setOptionsData(updatedOptions);

            // Notificamos al padre
            if (onChange) {
                onChange(selectedValues, updatedOptions);
            }
        }
    };

    // Determina si debemos mostrar advertencia (campo requerido y sin selección)
    const showWarning = !hasAction && formSubmitAttempted && !isOptional;

    // Lógica central para saber si una celda (input) está deshabilitada
    const isColumnDisabled = (option, column) => {
        const isRowSelected = selectedValues.includes(option.value);

        // 1) Si la fila indica que esta columna está forzada a disabled, se deshabilita
        if (option.disabledColumns?.includes(column.id)) {
            return true;
        }

        // 2) Si la columna requiere que la fila esté seleccionada, y la fila NO está seleccionada => disabled
        if (column.requiresSelection && !isRowSelected) {
            return true;
        }

        // 3) En caso contrario, está habilitado
        return false;
    };

    // Renderiza una celda según su tipo
    const renderColumnCell = (option, optionIndex, column) => {
        const {
            id,
            type,
            fieldName,
            prefix,
            suffix,
            width,
            inputProps = {}
        } = column;

        const value = option[fieldName];
        const disabled = isColumnDisabled(option, column);

        switch (type) {
            case "button":
                // Botón que selecciona/deselecciona la fila
                const isSelected = selectedValues.includes(option.value);
                const buttonVariant = isSelected ? "primary" : "secondary";
                return (
                    <div className={`fidejussione-input-group__${id}-col`}>
                        <Button
                            label={value}
                            variant={buttonVariant}
                            onClick={() => handleOptionClick(option.value)}
                            active={isSelected}
                            width={width || "100%"}
                        />
                    </div>
                );

            case "number":
            case "text":
                return (
                    <div className={`fidejussione-input-group__${id}-col`}>
                        <div className={`fidejussione-input-group__${id}-pill ${disabled ? "disabled" : ""}`}>
                            {prefix && <span>{prefix}</span>}
                            <input
                                type={type}
                                value={value}
                                onChange={(e) => handleFieldChange(optionIndex, id, e.target.value)}
                                disabled={disabled}
                                {...inputProps}
                            />
                            {suffix && <span>{suffix}</span>}
                        </div>
                    </div>
                );

            default:
                // Si en algún momento tienes otro tipo de celda (por ejemplo, select)
                return (
                    <div className={`fidejussione-input-group__${id}-col`}>
                        {value}
                    </div>
                );
        }
    };

    return (
        <div
            className={`fidejussione-input-group ${showWarning ? "fidejussione-input-group--pending-action" : ""
                } ${className}`}
        >
            {/* Título principal */}
            {label && (
                <div className="fidejussione-input-group__label">
                    {HtmlRenderer(label)}
                </div>
            )}

            {/* Cabeceras de columna */}
            {columns.length > 0 && (
                <div className="fidejussione-input-group__column-titles">
                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className={`fidejussione-input-group__column-title fidejussione-input-group__${column.id}-title`}
                        >
                            {HtmlRenderer(column.title || "")}
                        </div>
                    ))}
                </div>
            )}

            {/* Lista de filas (options) */}
            <div className="fidejussione-input-group__list">
                {optionsData.map((option, optionIndex) => {
                    const isRowSelected = selectedValues.includes(option.value);
                    return (
                        <div
                            key={option.value}
                            className={`fidejussione-input-group__row ${isRowSelected ? "fidejussione-input-group__row--active" : ""
                                }`}
                        >
                            {columns.map((column) => (
                                <React.Fragment key={column.id}>
                                    {renderColumnCell(option, optionIndex, column)}
                                </React.Fragment>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Advertencia si no se seleccionó nada y es obligatorio */}
            {showWarning && (
                <div className="fidejussione-input-group__warning">
                    {warningIcon ? (
                        <FontAwesomeIcon icon={warningIcon} />
                    ) : (
                        <FontAwesomeIcon icon={faExclamationCircle} />
                    )}
                    <span>{warningMessage || "È necessario selezionare un'opzione"}</span>
                </div>
            )}
        </div>
    );
}
