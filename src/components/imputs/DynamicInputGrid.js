import React, { useState, useEffect } from "react";
import "./DynamicInputGrid.css";
import Button from "../buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useFormsContext } from "@/context/FormsContext";
import HtmlRenderer from "@/utils/HtmlRenderer";
import CustomSelector from "./CustomSelector";

/* Subcomponentes de celda */

// Celda que muestra un botón para seleccionar/deseleccionar la fila

const OptionButtonCell = ({
    option,
    optionIndex,
    column,
    selectedValues,
    handleOptionClick,
    getColumnWidth,
    inputWidth,
}) => {
    const value = option[column.fieldName];
    const isSelected = selectedValues.includes(option.value);
    const buttonVariant = isSelected ? "primary" : "secondary";
    const style = getColumnWidth(column);
    return (
        <div className="option-grid__column" style={style}>
            <Button
                label={value}
                variant={buttonVariant}
                onClick={() => handleOptionClick(option.value)}
                active={isSelected}
                width={inputWidth || "100%"}
            />
        </div>
    );
};

// Celda con selector personalizado
const OptionSelectorCell = ({
    option,
    optionIndex,
    column,
    handleFieldChange,
    getColumnWidth,
    disabled,
}) => {
    const style = getColumnWidth(column);
    return (
        <div className="option-grid__column" style={style}>
            <CustomSelector
                label={column.label || ""}
                options={option.selectorOptions || []}
                value={option[column.fieldName]}
                onChange={(newValue) => handleFieldChange(optionIndex, column.id, newValue)}
                disabled={disabled}
                tooltip={column.tooltip}
                required={column.required !== false}
                multiple={column.multiple === true}
                placeholder={column.placeholder || "Seleziona..."}
                maxSelections={column.maxSelections}
            />
        </div>
    );
};

// Celda con input simple (número o texto)
const OptionInputCell = ({
    option,
    optionIndex,
    column,
    handleFieldChange,
    getColumnWidth,
    disabled,
}) => {
    const style = getColumnWidth(column);
    const value = option[column.fieldName];
    return (
        <div className="option-grid__column" style={style}>
            <div
                className={`option-grid__input-pill ${disabled ? "disabled" : ""}`}
                style={column.inputWidth ? { width: column.inputWidth } : null}
            >
                {column.prefix && <span>{column.prefix}</span>}
                <input
                    type={column.type}
                    value={value}
                    placeholder={column.placeholder || option?.placeholder || ""}
                    onChange={(e) => handleFieldChange(optionIndex, column.id, e.target.value)}
                    disabled={disabled}
                    {...(column.inputProps || {})}
                />
                {column.suffix && <span>{column.suffix}</span>}
            </div>
        </div>
    );
};

// Celda por defecto para otros casos
const DefaultCell = ({ option, column, getColumnWidth }) => {
    const style = getColumnWidth(column);
    const value = option[column.fieldName];
    return (
        <div className="option-grid__column" style={style}>
            {value}
        </div>
    );
};

// Componente que selecciona qué celda renderizar
const GridCell = ({
    option,
    optionIndex,
    column,
    selectedValues,
    handleOptionClick,
    handleFieldChange,
    isColumnDisabled,
    getColumnWidth,
}) => {
    const disabled = isColumnDisabled(option, column);
    switch (column.type) {
        case "button":
            return (
                <OptionButtonCell
                    option={option}
                    optionIndex={optionIndex}
                    column={column}
                    selectedValues={selectedValues}
                    handleOptionClick={handleOptionClick}
                    getColumnWidth={getColumnWidth}
                    inputWidth={column.inputWidth}
                />
            );
        case "selector":
            return (
                <OptionSelectorCell
                    option={option}
                    optionIndex={optionIndex}
                    column={column}
                    handleFieldChange={handleFieldChange}
                    getColumnWidth={getColumnWidth}
                    disabled={disabled}
                />
            );
        case "number":
        case "text":
            return (
                <OptionInputCell
                    option={option}
                    optionIndex={optionIndex}
                    column={column}
                    handleFieldChange={handleFieldChange}
                    getColumnWidth={getColumnWidth}
                    disabled={disabled}
                />
            );
        default:
            return <DefaultCell option={option} column={column} getColumnWidth={getColumnWidth} />;
    }
};

// Componente para cada fila de la grilla
const GridRow = ({
    option,
    optionIndex,
    columns,
    selectedValues,
    handleOptionClick,
    handleFieldChange,
    isColumnDisabled,
    getColumnWidth,
    allowAddRows,
    handleRemoveRow,
}) => {
    const isRowSelected = selectedValues.includes(option.value);
    return (
        <div
            key={option.value}
            className={`option-grid__row ${isRowSelected ? "option-grid__row--active" : ""}`}
        >
            {columns.map((column) => (
                <GridCell
                    key={column.id}
                    option={option}
                    optionIndex={optionIndex}
                    column={column}
                    selectedValues={selectedValues}
                    handleOptionClick={handleOptionClick}
                    handleFieldChange={handleFieldChange}
                    isColumnDisabled={isColumnDisabled}
                    getColumnWidth={getColumnWidth}
                />
            ))}
            {allowAddRows && (
                <div className="option-grid__column option-grid__delete-column" style={{ flex: "0 0 60px" }}>
                    {optionIndex > 0 && (
                        <button
                            className="option-grid__remove-btn"
                            onClick={() => handleRemoveRow(optionIndex)}
                            title="Eliminar fila"
                            type="button"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

/* Componente principal refactorizado */

const DynamicInputGrid = ({
    label = "",
    options = [],
    selectedValues = [],
    onChange,
    allowMultiple = false,
    isOptional = false,
    columns = [],
    warningMessage = "",
    warningIcon = null,
    className = "",
    allowAddRows = false,
}) => {
    const { formSubmitAttempted } = useFormsContext();

    // Estado para determinar si hay al menos una opción seleccionada
    const [hasAction, setHasAction] = useState(false);
    // Datos locales para las opciones (para modificaciones internas)
    const [optionsData, setOptionsData] = useState([]);

    useEffect(() => {
        setHasAction(selectedValues && selectedValues.length > 0);
        if (options.length > 0) {
            setOptionsData([...options]);
        }
    }, [selectedValues, options]);

    // Manejo de la selección (radio o checkbox)
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
        onChange(newSelected, optionsData);
    };

    // Manejo de cambios en los inputs de cada fila
    const handleFieldChange = (optionIndex, columnId, newValue) => {
        const updatedOptions = [...optionsData];
        const column = columns.find((col) => col.id === columnId);
        if (column && column.fieldName) {
            updatedOptions[optionIndex][column.fieldName] = newValue;
            setOptionsData(updatedOptions);
            if (onChange) {
                onChange(selectedValues, updatedOptions);
            }
        }
    };

    // Función para añadir una nueva fila basada en la primera
    const handleAddRow = () => {
        if (optionsData.length === 0) return;
        const baseRow = optionsData[0];
        const newRow = { ...baseRow };
        newRow.value = `row_${Date.now()}`;
        columns.forEach((column) => {
            if (column.fieldName && column.type !== "selector") {
                newRow[column.fieldName] = "";
            }
        });
        if (baseRow.selectorOptions) {
            newRow.selectorOptions = [...baseRow.selectorOptions];
        }
        const updatedOptions = [...optionsData, newRow];
        setOptionsData(updatedOptions);
        if (onChange) {
            onChange(selectedValues, updatedOptions);
        }
    };

    // Función para eliminar una fila (excepto la primera)
    const handleRemoveRow = (index) => {
        if (optionsData.length <= 1 || index === 0) return;
        const updatedOptions = [...optionsData];
        updatedOptions.splice(index, 1);
        const updatedSelectedValues = selectedValues.filter((value) =>
            updatedOptions.some((option) => option.value === value)
        );
        setOptionsData(updatedOptions);
        if (onChange) {
            onChange(updatedSelectedValues, updatedOptions);
        }
    };

    // Lógica para determinar si una celda debe estar deshabilitada
    const isColumnDisabled = (option, column) => {
        const isRowSelected = selectedValues.includes(option.value);
        if (option.disabledColumns?.includes(column.id)) {
            return true;
        }
        const hasSelector = columns.some((col) => col.type === "selector");
        if (column.requiresSelection && !isRowSelected && !hasSelector) {
            return true;
        }
        return false;
    };

    // Función para obtener el estilo de ancho de cada columna
    const getColumnWidth = (column) => {
        if (column.width) {
            return { flex: `0 0 ${column.width}` };
        }
        return { flex: "1" };
    };

    // Mostrar advertencia si el campo es obligatorio y no se ha seleccionado nada
    const showWarning = !hasAction && formSubmitAttempted && !isOptional;

    return (
        <div className={`option-grid ${showWarning ? "option-grid--pending-action" : ""} ${className}`}>
            {label && (
                <div className="option-grid__label">
                    {HtmlRenderer(label)}
                </div>
            )}

            {columns.length > 0 && (
                <div className="option-grid__column-titles">
                    {columns.map((column) => (
                        <div key={column.id} className="option-grid__column-title" style={getColumnWidth(column)}>
                            {HtmlRenderer(column.title || "")}
                        </div>
                    ))}
                    {allowAddRows && <div className="option-grid__column-title" style={{ flex: "0 0 60px" }}></div>}
                </div>
            )}

            <div className="option-grid__list">
                {optionsData.map((option, optionIndex) => (
                    <GridRow
                        key={option.value}
                        option={option}
                        optionIndex={optionIndex}
                        columns={columns}
                        selectedValues={selectedValues}
                        handleOptionClick={handleOptionClick}
                        handleFieldChange={handleFieldChange}
                        isColumnDisabled={isColumnDisabled}
                        getColumnWidth={getColumnWidth}
                        allowAddRows={allowAddRows}
                        handleRemoveRow={handleRemoveRow}
                    />
                ))}
            </div>

            {allowAddRows && (
                <div className="option-grid__add-row">
                    <Button
                        label="Aggiungi Riga"
                        variant="primary"
                        onClick={handleAddRow}
                        icon={faPlus}
                        size="medium"
                        className="add-row-button"
                    />
                </div>
            )}

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
};

export default DynamicInputGrid;
