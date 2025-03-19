"use client";
import React, { useState } from "react";
import "./CustomTextInput.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../modal/Modal';
import { useFormsContext } from '@/context/FormsContext';

function CustomTextInput({
    type = "text",
    label = "Label",
    value = "",
    onChange,
    disabled = false,
    min,
    max,
    tooltip,
    required = true,
    pattern,
    minLength,
    maxLength,
}) {
    const [focused, setFocused] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const { formSubmitAttempted } = useFormsContext();

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const handleTooltipToggle = (e) => {
        e.stopPropagation(); // Prevent input focus
        setIsTooltipOpen(!isTooltipOpen);
    };

    const isEmpty = value === "";
    const showValidationError = required && isEmpty && formSubmitAttempted;

    // Validación personalizada para email, telefono, etc.
    const validatePattern = () => {
        if (!pattern || !value) return true;
        const regex = new RegExp(pattern);
        return regex.test(value);
    };

    const validateMinMax = () => {
        if (type !== 'number' || !value) return true;
        const numValue = parseFloat(value);
        if (min !== undefined && numValue < min) return false;
        if (max !== undefined && numValue > max) return false;
        return true;
    };

    const validateMinMaxLength = () => {
        if (!value) return true;
        if (minLength !== undefined && value.length < minLength) return false;
        if (maxLength !== undefined && value.length > maxLength) return false;
        return true;
    };

    const isInvalid = (required && isEmpty) || !validatePattern() || !validateMinMax() || !validateMinMaxLength();
    const showError = isInvalid && formSubmitAttempted;

    return (
        <div
            className={`custom-text-input
                ${disabled ? "custom-text-input--disabled" : ""}
                ${focused ? "custom-text-input--typing" : ""}
                ${value ? "custom-text-input--has-value" : ""}
                ${showError ? "custom-text-input--validation-error" : ""}`}
        >
            <div className="custom-text-input__wrapper">
                <input
                    className="custom-text-input__input"
                    type={type}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={disabled}
                    min={min}
                    max={max}
                    required={required}
                    pattern={pattern}
                    minLength={minLength}
                    maxLength={maxLength}
                />
                <label className="custom-text-input__label">
                    {label}
                    {tooltip && (
                        <span className="custom-text-input__tooltip-icon" onClick={handleTooltipToggle}>
                            <FontAwesomeIcon icon={faQuestionCircle} />
                        </span>
                    )}
                </label>
            </div>
            
            {/* Mensajes de error personalizados */}
            {showError && (
                <div className="custom-text-input__warning">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <span>
                        {isEmpty ? "Questo campo è obbligatorio" : 
                         !validatePattern() ? "Formato non valido" :
                         !validateMinMax() ? `Valore deve essere tra ${min || '-∞'} e ${max || '∞'}` :
                         !validateMinMaxLength() ? `Lunghezza deve essere tra ${minLength || '0'} e ${maxLength || '∞'} caratteri` :
                         "Valore non valido"}
                    </span>
                </div>
            )}

            {/* Tooltip Modal */}
            {tooltip && (
                <Modal 
                    isOpen={isTooltipOpen} 
                    onClose={() => setIsTooltipOpen(false)}
                    title={label}
                >
                    <div>{tooltip}</div>
                </Modal>
            )}
        </div>
    );
}

export default CustomTextInput;
