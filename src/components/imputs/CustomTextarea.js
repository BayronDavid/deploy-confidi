import React, { useState, useRef } from "react";
import "./CustomTextarea.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "../modal/Modal";

function CustomTextarea({
    label,
    placeholder = "",
    value = "",
    onChange,
    disabled = false,
    required = false,
    tooltip,
    rows = 3,
    ...rest
}) {
    const [focused, setFocused] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    
    // Usar useRef en lugar de calcular esto en cada render
    const textareaRef = useRef(null);
    
    // Determinar si el textarea tiene un valor (como propiedad calculada, no estado)
    const hasValue = Boolean(value && value.trim() !== "");

    const handleFocus = () => {
        if (!disabled) {
            setFocused(true);
        }
    };

    const handleBlur = () => {
        setFocused(false);
    };

    const handleChange = (e) => {
        // Evitar actualizaciones de estado innecesarias
        const newValue = e.target.value;
        onChange(newValue);
    };

    const handleTooltipToggle = (e) => {
        e.stopPropagation();
        setIsTooltipOpen(!isTooltipOpen);
    };

    return (
        <div className={`custom-textarea
            ${disabled ? "custom-textarea--disabled" : ""}
            ${focused ? "custom-textarea--typing" : ""}
            ${hasValue ? "custom-textarea--has-value" : ""}`}>
            
            <div className="custom-textarea__wrapper">
                <textarea
                    ref={textareaRef}
                    className="custom-textarea__textarea"
                    placeholder=""
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required={required}
                    rows={rows}
                    {...rest}
                />
                
                <label className="custom-textarea__label">
                    {label}
                    {tooltip && (
                        <span className="custom-textarea__tooltip-icon" onClick={handleTooltipToggle}>
                            <FontAwesomeIcon icon={faQuestionCircle} />
                        </span>
                    )}
                </label>
            </div>
            
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

export default CustomTextarea;
