import React, { useState, useEffect } from "react";
import "./FidejussioneInputGroup.css";
import Button from "../buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useFormsContext } from "@/context/FormsContext";
import HtmlRenderer from "@/utils/HtmlRenderer";

/**
 * FidejussioneInputGroup:
 *   - Fully configurable component for showing a table of options with custom columns
 *   - All values and text are configurable through props
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
    // Access context to know if there was a submit attempt
    const { formSubmitAttempted } = useFormsContext();

    // Verify if the user has selected at least one option
    const [hasAction, setHasAction] = useState(false);
    // Track all option values for onChange
    const [optionsData, setOptionsData] = useState([]);

    useEffect(() => {
        setHasAction(selectedValues && selectedValues.length > 0);
        
        // Initialize options data
        if (options.length > 0 && optionsData.length === 0) {
            setOptionsData([...options]);
        }
    }, [selectedValues, options]);

    // Handle option selection (button click)
    const handleOptionClick = (value) => {
        if (!onChange) return;

        if (allowMultiple) {
            // "Checkbox" mode: add or remove the value from the array
            const isSelected = selectedValues.includes(value);
            const newSelected = isSelected
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];
            onChange(newSelected);
        } else {
            // "Radio" mode: only one value
            onChange([value]);
        }
    };

    // Handle input field changes for any column
    const handleFieldChange = (optionIndex, columnId, newValue) => {
        const updatedOptions = [...optionsData];
        const column = columns.find(col => col.id === columnId);
        
        if (column && column.fieldName) {
            updatedOptions[optionIndex][column.fieldName] = newValue;
            setOptionsData(updatedOptions);
            
            // Call the onChange handler with updated data
            if (onChange) {
                onChange(selectedValues, updatedOptions);
            }
        }
    };

    // Determine if we should show the warning (required field)
    const showWarning = !hasAction && formSubmitAttempted && !isOptional;

    // Render a column cell based on its type
    const renderColumnCell = (option, optionIndex, column) => {
        const { id, type, fieldName, prefix, suffix, width, inputProps = {} } = column;
        const value = option[fieldName];

        switch (type) {
            case "button":
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
                        <div className={`fidejussione-input-group__${id}-pill`}>
                            {prefix && <span>{prefix}</span>}
                            <input
                                type={type}
                                value={value}
                                onChange={(e) => handleFieldChange(optionIndex, id, e.target.value)}
                                {...inputProps}
                            />
                            {suffix && <span>{suffix}</span>}
                        </div>
                    </div>
                );
                
            default:
                return (
                    <div className={`fidejussione-input-group__${id}-col`}>
                        {value}
                    </div>
                );
        }
    };

    return (
        <div className={`fidejussione-input-group ${showWarning ? "fidejussione-input-group--pending-action" : ""} ${className}`}>
            {/* Main label */}
            {label && (
                <div className="fidejussione-input-group__label">
                    {HtmlRenderer(label)}
                </div>
            )}

            {/* Column headers */}
            {columns.length > 0 && (
                <div className="fidejussione-input-group__column-titles">
                    {columns.map(column => (
                        <div 
                            key={column.id} 
                            className={`fidejussione-input-group__column-title fidejussione-input-group__${column.id}-title`}
                        >
                            {HtmlRenderer(column.title || "")}
                        </div>
                    ))}
                </div>
            )}

            {/* Options list */}
            <div className="fidejussione-input-group__list">
                {options.map((option, optionIndex) => (
                    <div key={option.value} className="fidejussione-input-group__row">
                        {columns.map(column => (
                            <React.Fragment key={column.id}>
                                {renderColumnCell(option, optionIndex, column)}
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>

            {/* Warning if nothing is selected and it's required */}
            {showWarning && (
                <div className="fidejussione-input-group__warning">
                    {warningIcon ? <FontAwesomeIcon icon={warningIcon} /> : <FontAwesomeIcon icon={faExclamationCircle} />}
                    <span>{warningMessage || "È necessario selezionare un'opzione"}</span>
                </div>
            )}
        </div>
    );
}
