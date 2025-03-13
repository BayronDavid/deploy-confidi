// /components/FormInput.js
"use client";
import React from "react";

function FormInput({ config, value, onChange }) {
    const { type, label, placeholder, enabled, min, max, options, tooltip } = config;

    const commonProps = {
        value: value || "",
        onChange: (e) => onChange(e.target.value),
        placeholder: placeholder || "",
        disabled: enabled === false,
    };

    if (type === "text" || type === "email" || type === "tel" || type === "number") {
        return (
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    {label}
                    {tooltip && <span title={tooltip}> ?</span>}
                </label>
                <input type={type} {...commonProps} min={min} max={max} />
            </div>
        );
    } else if (type === "select") {
        return (
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    {label}
                    {tooltip && <span title={tooltip}> ?</span>}
                </label>
                <select {...commonProps}>
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
    }
    // Se pueden agregar más tipos de inputs según necesidad
    return null;
}

export default FormInput;
