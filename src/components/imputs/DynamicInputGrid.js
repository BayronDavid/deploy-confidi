"use client";
import React, { useState, useEffect } from "react";
import "./DynamicInputGrid.css";
import Button from "../buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useFormsContext } from "@/context/FormsContext";
import HtmlRenderer from "@/utils/HtmlRenderer";
import CustomSelector from "./CustomSelector";

/* ====================== */
/*   SUBCOMPONENTES DE CELDA   */
/* ====================== */

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

    console.log({ column });
    

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
                width={column.width || null}
                floatingOptions = {column.floatingOptions || false}
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

/* ====================== */
/*  NUEVO: CELDA MULTI-INPUT  */
/* ====================== */

const OptionMultiInputCell = ({
    option,
    optionIndex,
    column,
    handleFieldChange,
    getColumnWidth,
    disabled,
}) => {
    const style = getColumnWidth(column);

    // Suponemos que los valores de los subcampos se almacenan en option[column.fieldName] como un objeto
    // Ejemplo:
    // option[column.fieldName] = {
    //   subField1: "valor1",
    //   subField2: "valor2",
    //   ...
    // }
    const multiInputData = option[column.fieldName] || {};

    // Maneja los cambios en cada subcampo
    const handleSubfieldChange = (subField, newValue) => {
        // Clonamos el objeto de subcampos
        const updated = { ...multiInputData, [subField.fieldName]: newValue };
        // Llamamos al handleFieldChange para que se actualice la fila completa
        handleFieldChange(optionIndex, column.id, updated);
    };

    return (
        <div className="option-grid__column" style={style}>
            <div className="multi-input-wrapper">
                {column.multiFields?.map((subField) => {
                    const subValue = multiInputData[subField.fieldName] || "";
                    return (
                        <div
                            key={subField.fieldName}
                            className={`option-grid__input-pill ${disabled ? "disabled" : ""}`}
                            style={subField.inputWidth ? { width: subField.inputWidth } : null}
                        >
                            {subField.prefix && <span>{subField.prefix}</span>}
                            <input
                                type={subField.type}
                                value={subValue}
                                placeholder={subField.placeholder || ""}
                                onChange={(e) => handleSubfieldChange(subField, e.target.value)}
                                disabled={disabled}
                                {...(subField.inputProps || {})}
                            />
                            {subField.suffix && <span>{subField.suffix}</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ====================== */
/*  NUEVO: CELDA COMPUTADA  */
/* ====================== */

const OptionComputedCell = ({
    option,
    column,
    getColumnWidth,
}) => {
    const style = getColumnWidth(column);
    // El valor ya está calculado en handleFieldChange
    const value = option[column.fieldName];

    return (
        <div className="option-grid__column" style={style}>
            {/* Mostramos el valor en un pill "deshabilitado" para que sea visualmente claro que no se edita */}
            <div className="option-grid__input-pill disabled" style={{ width: "100%" }}>
                {value}
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

/* ====================== */
/*  SWITCH DE RENDERIZADO DE CELDAS  */
/* ====================== */
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
        case "multiInput":
            return (
                <OptionMultiInputCell
                    option={option}
                    optionIndex={optionIndex}
                    column={column}
                    handleFieldChange={handleFieldChange}
                    getColumnWidth={getColumnWidth}
                    disabled={disabled}
                />
            );
        case "computed":
            return (
                <OptionComputedCell
                    option={option}
                    column={column}
                    getColumnWidth={getColumnWidth}
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
            return (
                <DefaultCell
                    option={option}
                    column={column}
                    getColumnWidth={getColumnWidth}
                />
            );
    }
};

/* ====================== */
/*  COMPONENTE DE FILA   */
/* ====================== */
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

/* ====================== */
/* COMPONENTE PRINCIPAL  */
/* ====================== */
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
            // Asignamos el valor
            updatedOptions[optionIndex][column.fieldName] = newValue;

            // Recalcular valores "computed" en esta misma fila
            columns.forEach((col) => {
                if (col.type === "computed" && typeof col.compute === "function") {
                    updatedOptions[optionIndex][col.fieldName] = col.compute(updatedOptions[optionIndex]);
                }
            });

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
                // Para multiInput, reiniciamos el objeto
                if (column.type === "multiInput") {
                    const emptyObject = {};
                    column.multiFields?.forEach((sub) => {
                        emptyObject[sub.fieldName] = "";
                    });
                    newRow[column.fieldName] = emptyObject;
                }
                // Para los demás, simplemente vaciamos la cadena
                else {
                    newRow[column.fieldName] = "";
                }
            }
        });

        // Si existía la propiedad selectorOptions, la copiamos
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

        // Actualizar los valores seleccionados si la fila removida estaba seleccionada
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
