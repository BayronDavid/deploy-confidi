// /components/FormInput.js
"use client";
import React, { useEffect } from "react";
import OptionSelector from "../imputs/OptionSelector";
import DocumentRequest from "../imputs/DocumentRequest";
import { useFormsContext } from "@/context/FormsContext";
import CustomTextInput from "../imputs/CustomTextInput";
import CustomSelector from "../imputs/CustomSelector";

function FormInput({ config, value, onChange }) {
    const {
        type,
        label,
        placeholder,
        enabled,
        min,
        max,
        options,
        tooltip,
        tc,
        title,
        description,
        required,
        pattern, // Añadimos soporte para pattern
        minLength, // Añadimos soporte para minLength
        maxLength, // Añadimos soporte para maxLength
        multiple, // Para selectores múltiples
        maxSelections, // Máximo de opciones seleccionables
    } = config;
    const { setIsCurrentFormValid } = useFormsContext();

    // Validar el valor actual y notificar al contexto si es inválido
    useEffect(() => {
        if (enabled !== false && required) {
            let isValid = true;

            if (type === "documentRequest") {
                // Validación para "documentRequest"
                isValid =
                    (config.isOptional && value === "skipped") ||
                    value instanceof File ||
                    (value &&
                        typeof value === "object" &&
                        (value.__isFile ||
                            (Array.isArray(value) &&
                                value.some(
                                    (item) =>
                                        item instanceof File ||
                                        (item && typeof item === "object" && item.__isFile)
                                ))));
            } else if (type === "optionSelector") {
                // Validación para "optionSelector"
                isValid = Array.isArray(value) && value.length > 0;
            } else if (type === "select" && multiple) {
                // Validación para selector múltiple
                isValid = Array.isArray(value) && value.length > 0;
            } else if (type === "select") {
                // Validación para selector único
                isValid = value !== null && value !== undefined && value !== "";
            } else {
                // Validación para texto, email, tel, number, etc.
                isValid = Boolean(value && value !== "");
            }

            // Si este campo es inválido, marcamos el form como inválido
            if (!isValid) {
                setIsCurrentFormValid(false);
            }
        }
    }, [value, required, type, enabled, config.isOptional, multiple]);

    // Si el input está deshabilitado explícitamente, no lo renderizamos
    if (enabled === false) {
        return null;
    }

    // Función para renderizar envoltorio (título/desc) si lo necesitas
    const renderInputWithWrapper = (inputElement) => (
        <>
            {/* {title && <h3>{title}</h3>} */}
            {/* {description && <p style={{ marginBottom: "0.5rem" }}>{description}</p>} */}
            {inputElement}
        </>
    );

    switch (type) {
        case "optionSelector":
            const selectedValues = Array.isArray(value) ? value : [];
            return renderInputWithWrapper(
                <OptionSelector
                    label={label}
                    options={options}
                    tooltip={tooltip}
                    selectedValues={selectedValues}
                    onChange={onChange}
                    allowMultiple={config.allowMultiple || false}
                />
            );

        case "text":
        case "email":
        case "tel":
        case "number":
            return renderInputWithWrapper(
                <CustomTextInput
                    type={type}
                    label={label}
                    placeholder={placeholder || "Label Input"}
                    value={value || ""}
                    onChange={(val) => onChange(val)}
                    disabled={enabled === false}
                    min={min}
                    max={max}
                    required={required}
                    pattern={pattern}
                    minLength={minLength}
                    maxLength={maxLength}
                    tooltip={tooltip}
                />
            );

        case "select":
            // Usar CustomSelector para reemplazar el select nativo
            return renderInputWithWrapper(
                <CustomSelector
                    label={label}
                    options={options || []}
                    value={multiple ? (Array.isArray(value) ? value : []) : value}
                    onChange={onChange}
                    disabled={enabled === false}
                    tooltip={tooltip}
                    required={required !== false}
                    multiple={multiple === true}
                    placeholder={placeholder || "Seleccione"}
                    maxSelections={maxSelections}
                />
            );

        case "documentRequest":
            return renderInputWithWrapper(
                <DocumentRequest
                    title={title}
                    description={description}
                    tooltip={tooltip}
                    tc={tc}
                    isOptional={config.isOptional}
                    primaryButtonLabel={config.primaryButtonLabel || "Subir documento"}
                    skipButtonLabel={config.skipButtonLabel || "No"}
                    value={value}
                    onPrimaryClick={(file) => onChange(file)}
                    onSkip={(skipped) => onChange(skipped ? "skipped" : null)}
                />
            );

        default:
            return null;
    }
}

export default FormInput;
