"use client";
import React, { useState, useEffect, useRef } from "react";
import "./CustomTextInput.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "../modal/Modal";
import { useFormsContext } from "@/context/FormsContext";
import HtmlRenderer from '@/utils/HtmlRenderer';

// Funciones de validación (pueden extraerse en un módulo "validators.js" si se prefiere)
const validateRequired = (value) => {
    return value !== null && value !== undefined && value.trim() !== "";
};

const validateEmail = (value) => {
    // Regex robusto para email (no perfecto, pero funcional para la mayoría de casos)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};

const validatePattern = (value, pattern) => {
    try {
        const regex = new RegExp(pattern);
        return regex.test(value);
    } catch (err) {
        console.error("Espressione regolare non valida", err);
        return false;
    }
};

const validateMinMax = (value, min, max, type) => {
    if (type !== "number" || !value) return true;
    const numValue = parseFloat(value);
    if (min !== undefined && numValue < min) return false;
    if (max !== undefined && numValue > max) return false;
    return true;
};

const validateMinMaxLength = (value, minLength, maxLength) => {
    if (!value) return true;
    if (minLength !== undefined && value.length < minLength) return false;
    if (maxLength !== undefined && value.length > maxLength) return false;
    return true;
};

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
    autoFocus = false,
}) {
    const [focused, setFocused] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const { formSubmitAttempted } = useFormsContext();
    const inputRef = useRef(null);

    // Autoenfoque al montar si se indica
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    // Función que valida el campo y acumula los mensajes de error en italiano
    const validateField = () => {
        const errors = [];

        // Validación required
        if (required && !validateRequired(value)) {
            errors.push("Questo campo è obbligatorio");
        }
        // Validación per tipo email
        if (type === "email" && value) {
            if (!validateEmail(value)) {
                errors.push("Il formato dell'email non è valido");
            }
        }
        // Validación por pattern personalizado
        if (pattern && value && !validatePattern(value, pattern)) {
            errors.push("Il formato non è valido");
        }
        // Validación de min/max (para tipo number)
        if (type === "number" && value) {
            if (min !== undefined && parseFloat(value) < min) {
                errors.push(`Il valore deve essere almeno ${min}`);
            }
            if (max !== undefined && parseFloat(value) > max) {
                errors.push(`Il valore deve essere al massimo ${max}`);
            }
        }
        // Validación de minLength y maxLength
        if (value) {
            if (minLength !== undefined && value.length < minLength) {
                errors.push(`La lunghezza minima è di ${minLength} caratteri`);
            }
            if (maxLength !== undefined && value.length > maxLength) {
                errors.push(`La lunghezza massima è di ${maxLength} caratteri`);
            }
        }
        return errors;
    };

    // Ejecutar validación cada vez que cambian las props relevantes
    useEffect(() => {
        const errors = validateField();
        setErrorMessages(errors);
    }, [value, required, type, pattern, min, max, minLength, maxLength]);

    // Se muestra error solo si ya se intentó enviar el formulario
    const showError = formSubmitAttempted && errorMessages.length > 0;

    // Si hay error y el input es el primero (o uno de los inputs) inválido, se autoenfoca
    useEffect(() => {
        if (formSubmitAttempted && showError && inputRef.current) {
            // Si el input no tiene ya el foco, lo enfocamos
            if (document.activeElement !== inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [formSubmitAttempted, showError]);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };
    const handleTooltipToggle = (e) => {
        e.stopPropagation(); // Evita que el clic active el enfoque
        setIsTooltipOpen(!isTooltipOpen);
    };

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
                    ref={inputRef}
                    className="custom-text-input__input"
                    type={type}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={disabled}
                // Nota: no se usan atributos nativi di validazione
                />
                <label className="custom-text-input__label">
                    {HtmlRenderer(label)}
                    {tooltip && (
                        <span className="custom-text-input__tooltip-icon" onClick={handleTooltipToggle}>
                            <FontAwesomeIcon icon={faQuestionCircle} />
                        </span>
                    )}
                </label>
            </div>

            {/* Mostrar lista de errores (si hay varios) */}
            {showError && (
                <div className="custom-text-input__warning">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                        {errorMessages.map((msg, idx) => (
                            <span key={idx}>{msg}</span>
                        ))}
                </div>
            )}

            {tooltip && (
                <Modal
                    isOpen={isTooltipOpen}
                    onClose={() => setIsTooltipOpen(false)}
                    title={HtmlRenderer(label)}
                >
                    <div>{HtmlRenderer(tooltip)}</div>
                </Modal>
            )}
        </div>
    );
}

export default CustomTextInput;
