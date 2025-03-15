// /components/FormInput.js
"use client";
import React from "react";
import OptionSelector from "../imputs/OptionSelector";
import DocumentRequest from "../imputs/DocumentRequest";

function FormInput({ config, value, onChange }) {
    const { type, label, placeholder, enabled, min, max, options, tooltip, title, description } = config;

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
                    isOptional={config.isOptional}
                    primaryButtonLabel={config.primaryButtonLabel || "Subir documento"}
                    skipButtonLabel={config.skipButtonLabel || "No"}
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
