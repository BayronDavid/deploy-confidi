// /imputs/CustomChecklist.js
import React from "react";
import "./CustomChecklist.css";
import { useFormsContext } from "@/context/FormsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

/**
 * CustomChecklist
 * 
 * @param {string}   label     - Etiqueta del bloque de checks.
 * @param {boolean}  required  - Indica si el bloque es obligatorio.
 * @param {Array}    options   - Lista de ítems. Cada ítem es un objeto { value, label, required? }.
 * @param {Array}    value     - Array con los values seleccionados.
 * @param {Function} onChange  - Callback que recibe el nuevo array de valores seleccionados.
 * @param {string}   tooltip   - Texto de ayuda (opcional).
 */
function CustomChecklist({ label, required = false, options = [], value = [], onChange, tooltip }) {
    const { formSubmitAttempted } = useFormsContext();

    // Maneja la selección/deselección de cada checkbox.
    const handleCheck = (itemValue) => {
        let newValue = [...value];
        if (newValue.includes(itemValue)) {
            newValue = newValue.filter((val) => val !== itemValue);
        } else {
            newValue.push(itemValue);
        }
        onChange(newValue);
    };

    return (
        <div className="custom-checklist">
            {label && (
                <label className="custom-checklist__label">
                    {label}
                    {required && <span className="requiredIndicator">*</span>}
                </label>
            )}

            {tooltip && <div className="custom-checklist__tooltip">{tooltip}</div>}

            <ul className="custom-checklist__list">
                {options.map((opt) => {
                    const isChecked = value.includes(opt.value);
                    // Si la opción es requerida, el formulario fue enviado y no está marcada
                    const optError = formSubmitAttempted && opt.required && !isChecked;
                    return (
                        <li key={opt.value} className={`custom-checklist__item ${optError ? "custom-checklist__item--error" : ""}`}>
                            <label className="custom-checklist__item-label">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleCheck(opt.value)}
                                    // Se mantiene el required para accesibilidad (aunque la validación se muestra manualmente)
                                    required={opt.required}
                                />
                                <span className="custom-checklist__item-text">{opt.label}</span>
                            </label>
                            {optError && (
                                <div className="custom-checklist__warning">
                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                    <span>Questo campo è obbligatorio</span>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default CustomChecklist;
