"use client";
import React, { useState, useEffect, useRef } from "react";
import "./CustomSelector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faExclamationCircle,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../modal/Modal";
import { useFormsContext } from "@/context/FormsContext";
import Image from "next/image";
import HtmlRenderer from '@/utils/HtmlRenderer';

// Funciones de validación
const validateRequired = (value, isMultiple) => {
  if (isMultiple) {
    return Array.isArray(value) && value.length > 0;
  }
  return value !== null && value !== undefined && value !== "";
};

function CustomSelector({
  label = "Seleziona un'opzione",
  options = [],
  value = null,
  onChange,
  disabled = false,
  tooltip,
  required = true,
  multiple = false,
  placeholder = "Seleziona...",
  maxSelections,
  width,
  floatingOptions = false,
}) {
  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const { formSubmitAttempted } = useFormsContext();

  const selectorRef = useRef(null);
  const dropdownRef = useRef(null);
  const wrapperRef = useRef(null);

  // Determinar si el selector tiene valor
  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : value !== null && value !== undefined && value !== "";

  // Función para validar el campo
  const validateField = () => {
    const errors = [];

    if (required && !validateRequired(value, multiple)) {
      errors.push("Questo campo è obbligatorio");
    }

    if (multiple && maxSelections && Array.isArray(value) && value.length > maxSelections) {
      errors.push(`È possibile selezionare al massimo ${maxSelections} opzioni`);
    }

    return errors;
  };

  // Ejecutar validación cuando cambian las props relevantes
  useEffect(() => {
    const errors = validateField();
    setErrorMessages(errors);
  }, [value, required, multiple, maxSelections]);

  // Mostrar error solo si ya se intentó enviar el formulario
  const showError = formSubmitAttempted && errorMessages.length > 0;

  // Manejar clic fuera del componente para cerrar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Enfocar si hay error después de intentar enviar
  useEffect(() => {
    if (formSubmitAttempted && showError && selectorRef.current) {
      // Si el selector no tiene ya el foco, lo enfocamos
      if (!focused) {
        selectorRef.current.focus();
        setFocused(true);
      }
    }
  }, [formSubmitAttempted, showError, focused]);

  const handleFocus = () => {
    if (!disabled) {
      setFocused(true);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocused(true);
    }
  };

  const handleOptionClick = (optionValue, e) => {
    if (multiple) {
      e.stopPropagation();
      const currentValues = Array.isArray(value) ? [...value] : [];
      const valueIndex = currentValues.indexOf(optionValue);

      if (valueIndex >= 0) {
        // Eliminar valor si ya está seleccionado
        currentValues.splice(valueIndex, 1);
      } else {
        // Añadir valor solo si no supera el máximo
        if (!maxSelections || currentValues.length < maxSelections) {
          currentValues.push(optionValue);
        }
      }

      if (onChange) {
        onChange(currentValues);
      }
    } else {
      // Para selector único se cierra el dropdown después de seleccionar
      if (onChange) {
        onChange(optionValue);
      }
      setIsOpen(false);
    }
  };

  const handleTooltipToggle = (e) => {
    e.stopPropagation();
    setIsTooltipOpen(!isTooltipOpen);
  };

  // Obtener etiquetas para mostrar el valor seleccionado
  const getDisplayValue = () => {
    if (!hasValue) return placeholder;

    if (multiple) {
      const selectedLabels = options
        .filter(option => Array.isArray(value) && value.includes(option.value))
        .map(option => option.label);

      if (selectedLabels.length <= 2) {
        return selectedLabels.join(", ");
      }
      return `${selectedLabels.length} selezionati`;
    } else {
      const selectedOption = options.find(option => option.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  return (
    <div
      ref={selectorRef}
      className={`custom-selector
        ${disabled ? "custom-selector--disabled" : ""}
        ${focused ? "custom-selector--typing" : ""}
        ${hasValue ? "custom-selector--has-value" : ""}
        ${showError ? "custom-selector--validation-error" : ""}
        ${isOpen ? "custom-selector--open" : ""}
        ${multiple ? "custom-selector--multiple" : ""}
        ${floatingOptions ? "custom-selector--floating-options" : ""}`}
      tabIndex={disabled ? -1 : 0}
      onFocus={handleFocus}
      onClick={handleClick}
      style={width ? { width, maxWidth: width } : undefined}
    >
      <div className="custom-selector__wrapper no-select" ref={wrapperRef}>
        <div className="custom-selector__value">
          {getDisplayValue()}
        </div>

        <div className="custom-selector__icon">
          <img
            src="/ui/chevron-down.svg"
            alt={isOpen ? "Chiudi" : "Apri"}
            width={14}
            height={14}
            className="custom-selector__chevron"
          />
        </div>

        <label className="custom-selector__label">
          {HtmlRenderer(label)}
          {tooltip && (
            <span className="custom-selector__tooltip-icon" onClick={handleTooltipToggle}>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </span>
          )}
        </label>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`custom-selector__dropdown ${floatingOptions ? 'custom-selector__dropdown--floating' : ''}`}
          style={floatingOptions ? {
            width: wrapperRef.current?.offsetWidth + 2 + 'px', // Match exact width of wrapper
            top: wrapperRef.current?.offsetHeight + 'px'    // Position right below the wrapper
          } : undefined}
        >
          {options.length === 0 ? (
            <div className="custom-selector__no-options">Nessuna opzione disponibile</div>
          ) : (
            options.map((option) => {
              const isSelected = multiple
                ? Array.isArray(value) && value.includes(option.value)
                : value === option.value;

              return (
                <div
                  key={option.value || `option-${option.label}`}
                  className={`custom-selector__option ${isSelected ? "custom-selector__option--selected" : ""}`}
                  onClick={(e) => handleOptionClick(option.value, e)}
                >
                  {multiple && (
                    <div className="custom-selector__checkbox">
                      {isSelected ? (
                        <FontAwesomeIcon icon={faCheck} />
                      ) : (
                        <span style={{ visibility: "hidden" }}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                    </div>
                  )}
                  <div className="custom-selector__option-label">{option.label}</div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Mostrar errores */}
      {showError && (
        <div className="custom-selector__warning">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {errorMessages.map((msg, idx) => (
            <span key={`error-${idx}`}>{msg}</span>
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

export default CustomSelector;
