import React, { useState, useEffect } from "react";
import "./FidejussioneInputGroup.css";
import Button from "../buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useFormsContext } from "@/context/FormsContext";
import HtmlRenderer from "@/utils/HtmlRenderer";
import CustomSelector from "./CustomSelector"; // Importación de CustomSelector

/**
 * FidejussioneInputGroup:
 *   - Componente de tabla muy configurable.
 *   - Permite selección (simple o múltiple) y edición condicional de columnas.
 *   - Usa 'requiresSelection' en columnas y 'disabledColumns' en cada fila para controlar el disabled.
 *   - Permite configurar ancho de columnas mediante la propiedad 'width' de cada columna.
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

        // Actualizamos los datos internos siempre que cambian las opciones externas
        if (options.length > 0) {
            setOptionsData([...options]);
        }
    }, [selectedValues, options]);

    // Maneja la selección (modo "radio" o "checkbox")
    const handleOptionClick = (value) => {
        if (!onChange) return;

        let newSelected;
        
        if (allowMultiple) {
            const isSelected = selectedValues.includes(value);
            newSelected = isSelected
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];
        } else {
            newSelected = [value];
        }
        
        // Importante: siempre pasamos todos los datos actualizados al padre
        onChange(newSelected, optionsData);
    };

    // Maneja cambios en los campos de una fila
    const handleFieldChange = (optionIndex, columnId, newValue) => {
        const updatedOptions = [...optionsData];
        const column = columns.find((col) => col.id === columnId);

        if (column && column.fieldName) {
            updatedOptions[optionIndex][column.fieldName] = newValue;
            setOptionsData(updatedOptions);

            // Notificamos al padre con todos los datos actualizados
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

        // 2) Verificamos si la fila tiene un selector (que actúa como selector principal)
        const hasSelector = columns.some(col => col.type === "selector");
        
        // 3) Si la columna requiere que la fila esté seleccionada y la fila NO está seleccionada
        // y además NO hay un selector en la fila => disabled
        if (column.requiresSelection && !isRowSelected && !hasSelector) {
            return true;
        }

        // 4) En caso contrario, está habilitado
        return false;
    };

    // Obtiene el estilo de ancho para una columna
    const getColumnWidth = (column) => {
        // Si la columna define un ancho, lo usamos
        if (column.width) {
            return { flex: `0 0 ${column.width}` };
        }
        
        // Si no, usamos un ancho por defecto
        return { flex: '1' };
    };

    // Renderiza una celda según su tipo
    const renderColumnCell = (option, optionIndex, column) => {
        const {
            id,
            type,
            fieldName,
            prefix,
            suffix,
            inputWidth,
            inputProps = {}
        } = column;

        const value = option[fieldName];
        const disabled = isColumnDisabled(option, column);
        const columnStyle = getColumnWidth(column);

        switch (type) {
            case "button":
                // Botón que selecciona/deselecciona la fila
                const isSelected = selectedValues.includes(option.value);
                const buttonVariant = isSelected ? "primary" : "secondary";
                return (
                    <div className="option-grid__column" style={columnStyle}>
                        <Button
                            label={value}
                            variant={buttonVariant}
                            onClick={() => handleOptionClick(option.value)}
                            active={isSelected}
                            width={inputWidth || "100%"}
                        />
                    </div>
                );
                
            case "selector":
                // Selector personalizado que permite selección múltiple o única
                return (
                    <div className="option-grid__column" style={columnStyle}>
                        <CustomSelector
                            label={column.label || ""} 
                            options={option.selectorOptions || []}
                            value={value}
                            onChange={(newValue) => handleFieldChange(optionIndex, id, newValue)}
                            disabled={disabled}
                            tooltip={column.tooltip}
                            required={column.required !== false}
                            multiple={column.multiple === true}
                            placeholder={column.placeholder || "Seleziona..."}
                            maxSelections={column.maxSelections}
                        />
                    </div>
                );

            case "number":
            case "text":
                return (
                    <div className="option-grid__column" style={columnStyle}>
                        <div 
                            className={`option-grid__input-pill ${disabled ? "disabled" : ""}`}
                            style={inputWidth ? { width: inputWidth } : null}
                        >
                            {prefix && <span>{prefix}</span>}
                            <input
                                type={type}
                                value={value}
                                placeholder={column.placeholder || option?.placeholder || ""}
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
                    <div className="option-grid__column" style={columnStyle}>
                        {value}
                    </div>
                );
        }
    };

    return (
        <div
            className={`option-grid ${showWarning ? "option-grid--pending-action" : ""
                } ${className}`}
        >
            {/* Título principal */}
            {label && (
                <div className="option-grid__label">
                    {HtmlRenderer(label)}
                </div>
            )}

            {/* Cabeceras de columna */}
            {columns.length > 0 && (
                <div className="option-grid__column-titles">
                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className="option-grid__column-title"
                            style={getColumnWidth(column)}
                        >
                            {HtmlRenderer(column.title || "")}
                        </div>
                    ))}
                </div>
            )}

            {/* Lista de filas (options) */}
            <div className="option-grid__list">
                {optionsData.map((option, optionIndex) => {
                    const isRowSelected = selectedValues.includes(option.value);
                    return (
                        <div
                            key={option.value}
                            className={`option-grid__row ${isRowSelected ? "option-grid__row--active" : ""
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
                <div className="option-grid__warning">
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
