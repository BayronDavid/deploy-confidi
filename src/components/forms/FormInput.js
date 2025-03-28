// /components/FormInput.js
"use client";
import React, { useEffect } from "react";
import OptionSelector from "../imputs/OptionSelector";
import DocumentRequest from "../imputs/DocumentRequest";
import { useFormsContext } from "@/context/FormsContext";
import CustomTextInput from "../imputs/CustomTextInput";
import CustomSelector from "../imputs/CustomSelector";
import CustomTextarea from "../imputs/CustomTextarea";
import DynamicInputGrid from "../imputs/DynamicInputGrid";
import CalcoloDimensioneAziendale from "../imputs/CalcoloDimensioneAziendale";
import ElencoAffidamentiBancariLeasing from "../imputs/ElencoAffidamentiBancariLeasing";
import ElencoProprietaImmobiliariFuoriTrento from "../imputs/ElencoProprietaImmobiliariFuoriTrento";
import CustomChecklist from "../imputs/CustomChecklist";

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
        doc_title,
        doc_description,
        required,
        pattern,
        minLength,
        maxLength,
        multiple,
        maxSelections,
        fileName,
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
            } else if (type === "DynamicInputGrid") {
                // Validación para "DynamicInputGrid" - revisada para verificar la estructura completa
                isValid = value &&
                    Array.isArray(value.selectedValues) &&
                    value.selectedValues.length > 0 &&
                    Array.isArray(value.optionsData);
            } else if (type === "calcoloDimensioneAziendale") {
                // Validación ajustada para "calcoloDimensioneAziendale"
                isValid = value &&
                    value.richiedente &&
                    value.richiedente.denominazioneCf !== "";
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

    // renderizar envoltorio (título/desc) si lo necesitas
    const renderInputWithWrapper = (inputElement) => (
        <>
            {title && <h3>{title}</h3>}
            {description && <p style={{ marginBottom: "0.5rem" }}>{description}</p>}
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

        case "textarea":
            return renderInputWithWrapper(
                <CustomTextarea
                    label={label}
                    placeholder={placeholder || "Label Input"}
                    value={value || ""}
                    onChange={(val) => onChange(val)}
                    disabled={enabled === false}
                    required={required}
                    tooltip={tooltip}
                    rows={config.rows || 3} // default rows
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
                    title={doc_title}
                    description={doc_description}
                    tooltip={tooltip}
                    tc={tc}
                    isOptional={config.isOptional}
                    primaryButtonLabel={config.primaryButtonLabel || "Subir documento"}
                    skipButtonLabel={config.skipButtonLabel || "No"}
                    value={value}
                    onPrimaryClick={(file) => onChange(file)}
                    onSkip={(skipped) => onChange(skipped ? "skipped" : null)}
                    fileName={fileName || null}
                />
            );

        case "DynamicInputGrid":
            // Extraemos los valores de la estructura almacenada si existe
            let currentSelectedValues = [];
            let currentOptionsData = [];

            if (value && typeof value === 'object') {
                // Si ya tenemos un valor guardado con la estructura correcta
                if (Array.isArray(value.selectedValues)) {
                    currentSelectedValues = value.selectedValues;
                }
                if (Array.isArray(value.optionsData)) {
                    currentOptionsData = value.optionsData;
                }
            } else if (Array.isArray(value)) {
                // Retrocompatibilidad: si solo teníamos un array de ids seleccionados
                currentSelectedValues = value;
                currentOptionsData = options || [];
            }

            return renderInputWithWrapper(
                <DynamicInputGrid
                    label={label || ""}
                    options={currentOptionsData.length > 0 ? currentOptionsData : (options || [])}
                    selectedValues={currentSelectedValues}
                    onChange={(selectedValues, updatedOptions) => {
                        // Guardamos la estructura completa: selección + datos de todas las filas
                        onChange({
                            selectedValues: selectedValues,
                            optionsData: updatedOptions
                        });
                    }}
                    allowMultiple={config.allowMultiple || false}
                    isOptional={!required}
                    columns={config.columns || []}
                    warningMessage={config.warningMessage}
                    warningIcon={config.warningIcon}
                    className={config.className}
                    selectionMode={config.selectionMode || "buttons"}
                    allowAddRows={config.allowAddRows || false}
                />
            );

        case "calcoloDimensioneAziendale":
            return renderInputWithWrapper(
                <CalcoloDimensioneAziendale
                    value={value}
                    onChange={onChange}
                    isOptional={config.isOptional}
                    required={required !== false}
                />
            );

        case "elencoAffidamentiBancariLeasing":
            return renderInputWithWrapper(
                <ElencoAffidamentiBancariLeasing
                    value={value}
                    onChange={onChange}
                    isOptional={config.isOptional}
                    required={required !== false}
                />
            );
        case "elencoProprietaImmobiliariFuoriTrento":
            return renderInputWithWrapper(
                <ElencoProprietaImmobiliariFuoriTrento
                    value={value}
                    onChange={onChange}
                    isOptional={config.isOptional}
                    required={required !== false}
                />
            );
        case "checklist":
            return renderInputWithWrapper(
                <CustomChecklist
                    label={label}
                    options={options || []}             // Array con { value, label, required? }
                    value={Array.isArray(value) ? value : []}
                    onChange={onChange}
                    required={required}
                    tooltip={tooltip}
                />
            );

        default:
            return null;
    }
}

export default FormInput;
