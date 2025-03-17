// /components/FormInput.js
"use client";
import React, { useEffect } from "react";
import OptionSelector from "../imputs/OptionSelector";
import DocumentRequest from "../imputs/DocumentRequest";
import { useFormsContext } from "@/context/FormsContext";

function FormInput({ config, value, onChange }) {
    const { type, label, placeholder, enabled, min, max, options, tooltip, tc, title, description, required } = config;
    const { setIsCurrentFormValid } = useFormsContext();

    // Validar el valor actual y notificar al contexto si es inválido
    useEffect(() => {
        if (enabled !== false && required) {
            let isValid = true;
            
            if (type === "documentRequest") {
                // Es válido solo si: es opcional y está marcado como skipped, o tiene un archivo válido
                isValid = (config.isOptional && value === "skipped") || 
                         (value instanceof File || (value && typeof value === 'object' && (value.__isFile || 
                          (Array.isArray(value) && value.some(item => 
                            item instanceof File || (item && typeof item === 'object' && item.__isFile)
                          )))));
            } else if (type === "optionSelector") {
                isValid = Array.isArray(value) && value.length > 0;
            } else {
                isValid = Boolean(value && value !== "");
            }
            
            // Si este campo es inválido, forzar a que el formulario se marque como inválido
            if (!isValid) {
                setIsCurrentFormValid(false);
            }
        }
    }, [value, required, type, enabled, config.isOptional]);

    // Si el input está deshabilitado explícitamente, no lo renderizamos
    if (enabled === false) {
        return null;
    }

    // Contenedor común para todos los inputs con título y descripción opcionales
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
            const commonProps = {
                value: value || "",
                onChange: (e) => onChange(e.target.value),
                placeholder: placeholder || "",
                disabled: enabled === false,
            };
            return renderInputWithWrapper(
                <div>
                    <label>
                        {label}
                        {tooltip && <span title={tooltip}> ?</span>}
                    </label>
                    <input type={type} {...commonProps} min={min} max={max} />
                </div>
            );
        case "select":
            const commonSelectProps = {
                value: value || "",
                onChange: (e) => onChange(e.target.value),
                placeholder: placeholder || "",
                disabled: enabled === false,
            };
            return renderInputWithWrapper(
                <div>
                    <label>
                        {label}
                        {tooltip && <span title={tooltip}> ?</span>}
                    </label>
                    <select {...commonSelectProps}>
                        <option value="">{placeholder || "Seleccione"}</option>
                        {options &&
                            options.map((option, idx) => (
                                <option key={idx} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                    </select>
                </div>
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
                    value={value} // Asegurarse de pasar el valor correctamente
                    onPrimaryClick={(file) => {
                        // Se asigna el archivo como valor
                        onChange(file);
                    }}
                    onSkip={(skipped) => {
                        // Si se pulsa "No", se asigna la cadena "skipped" como valor;
                        // si se desmarca, se asigna null para indicar que no hay decisión.
                        onChange(skipped ? "skipped" : null);
                    }}
                />
            );
        default:
            return null;
    }
}

export default FormInput;
