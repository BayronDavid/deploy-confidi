"use client";
import React, { useState } from "react";
import "./CustomTextInput.css";

function CustomTextInput({
    type = "text",
    label = "Label",
    value = "",
    onChange,
    disabled = false,
    min,
    max,
    tooltip,
}) {
    const [focused, setFocused] = useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div
            className={`custom-text-input-container
        ${disabled ? "disabled" : ""}
        ${focused ? "typing" : ""}
        ${value ? "has-value" : ""}`}
        >
            <div className="input-wrapper">
                <input
                    type={type}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={disabled}
                    min={min}
                    max={max}
                />
                <label className="floating-label">
                    {label}
                    {tooltip && <span title={tooltip}> ?</span>}
                </label>
            </div>
        </div>
    );
}

export default CustomTextInput;
