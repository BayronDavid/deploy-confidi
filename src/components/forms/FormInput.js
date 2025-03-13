// /components/FormInput.js
"use client";
import React from "react";
import OptionSelector from "../imputs/OptionSelector";

function FormInput({ config, value, onChange }) {
    const { type, label, placeholder, enabled, min, max, options, tooltip } = config;

    // Renderizamos según el tipo del input
    switch (type) {
        case "optionSelector":
            // Para OptionSelector, nos aseguramos de que el value sea un array
            const selectedValues = Array.isArray(value) ? value : [];
            return (
                <div style={{ marginBottom: "1rem" }}>
                    <OptionSelector
                        label={label}
                        options={options}
                        selectedValues={selectedValues}
                        onChange={onChange}
                        allowMultiple={config.allowMultiple || false}
                    />
                </div>
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
            return (
                <div style={{ marginBottom: "1rem" }}>
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
            return (
                <div style={{ marginBottom: "1rem" }}>
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

        default:
            return null;
    }
}

export default FormInput;
