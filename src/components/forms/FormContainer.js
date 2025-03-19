"use client";
import React, { useEffect, useRef } from "react";
import { useFormsContext } from "@/context/FormsContext";
import FormGroup from "./FormGroup";
import useHasMounted from "@/hooks/useHasMounted";
import FormInput from "./FormInput";
import Accordion from "../Accordion";

/**
 * Verifica si un valor es un archivo o lista de archivos válidos.
 */
function isValidFile(value) {
    if (!value) return false;

    // Caso: archivo único
    if (value instanceof File) return true;

    // Caso: array de archivos
    if (Array.isArray(value)) {
        return value.some(
            (item) =>
                item instanceof File ||
                (item && typeof item === "object" && item.__isFile)
        );
    }

    // Caso: objeto con marca de __isFile
    return value && typeof value === "object" && value.__isFile;
}

/**
 * Valida el valor de un "documentRequest".
 * - Si es opcional, "skipped" cuenta como válido.
 * - Si es requerido, no se permite "skipped".
 * - En ambos casos, si no es "skipped", debe haber un archivo válido.
 */
function validateDocumentRequest(value, isOptional) {
    if (isOptional && value === "skipped") {
        return true;
    }
    if (!isOptional && value === "skipped") {
        return false;
    }
    return isValidFile(value);
}

/**
 * Valida un input cualquiera según su tipo, configuración (required, isOptional, etc.) y su valor en formData.
 */
function validateInput(groupData, input) {
    if (input.enabled === false) return true;

    const value = groupData[input.id];

    if (input.type === "documentRequest") {
        return validateDocumentRequest(value, input.isOptional);
    } else if (input.type === "optionSelector") {
        if (input.required) {
            return Array.isArray(value) && value.length > 0;
        } else {
            return true;
        }
    } else {
        if (input.required) {
            return Boolean(value && value !== "");
        } else {
            return true;
        }
    }
}

function FormContainer({ formConfig }) {
    const hasMounted = useHasMounted();
    const initialValidationDone = useRef(false);
    const {
        formData,
        updateFormData,
        setIsCurrentFormValid,
        setSubmitCurrentForm,
    } = useFormsContext();

    // Al montar, forzamos inicialmente el formulario a "inválido" hasta que se complete la validación.
    useEffect(() => {
        setIsCurrentFormValid(false);
    }, []);

    /**
     * Efecto: Validación inicial (solo una vez).
     * Recorre todos los grupos e inputs para determinar si el formulario es válido al cargar.
     */
    useEffect(() => {
        if (
            !formConfig ||
            !formConfig.groups ||
            !hasMounted ||
            initialValidationDone.current
        )
            return;

        let formIsValid = true;

        for (const group of formConfig.groups) {
            if (group.enabled === false) continue;

            if (group.inputs) {
                const groupData = formData[group.id] || {};
                for (const input of group.inputs) {
                    if (!validateInput(groupData, input)) {
                        formIsValid = false;
                        break;
                    }
                }
            } else {
                if (!validateInput(formData, group)) {
                    formIsValid = false;
                }
            }

            if (!formIsValid) break;
        }

        setIsCurrentFormValid(formIsValid);
        initialValidationDone.current = true;
    }, [formConfig, formData, hasMounted, setIsCurrentFormValid]);

    /**
     * Efecto: Validación en cada cambio de formData o formConfig.
     */
    useEffect(() => {
        if (!formConfig || !formConfig.groups) {
            setIsCurrentFormValid(false);
            return;
        }

        let formIsValid = true;

        for (const group of formConfig.groups) {
            if (group.enabled === false) continue;

            if (group.inputs) {
                const groupData = formData[group.id] || {};
                for (const input of group.inputs) {
                    if (!validateInput(groupData, input)) {
                        formIsValid = false;
                        break;
                    }
                }
            } else {
                if (!validateInput(formData, group)) {
                    formIsValid = false;
                }
            }

            if (!formIsValid) break;
        }

        setIsCurrentFormValid(formIsValid);
    }, [formData, formConfig, setIsCurrentFormValid]);

    /**
     * handleSubmit: se llama cuando se hace click en "Próximo paso".
     * Revalida por seguridad y retorna true/false.
     */
    const handleSubmit = () => {
        if (!formConfig) return false;

        let isFormValid = true;

        for (const group of formConfig.groups) {
            if (group.enabled === false) continue;

            if (group.inputs) {
                const groupData = formData[group.id] || {};
                for (const input of group.inputs) {
                    if (!validateInput(groupData, input)) {
                        isFormValid = false;
                        break;
                    }
                }
            } else {
                if (!validateInput(formData, group)) {
                    isFormValid = false;
                }
            }

            if (!isFormValid) break;
        }

        return isFormValid;
    };

    // Se registra la función de submit en el contexto.
    useEffect(() => {
        setSubmitCurrentForm(() => handleSubmit);
        return () => setSubmitCurrentForm(() => () => false);
    }, [setSubmitCurrentForm, formConfig, formData]);

    if (!hasMounted) return null;
    if (!formConfig || !formConfig.groups) {
        return <div>Configuración no encontrada para el formulario</div>;
    }

    return (
        <>
            {formConfig.title && <h1>{formConfig.title}</h1>}
            {formConfig.description && <p>{formConfig.description}</p>}

            {formConfig.groups.map((group) => {
                if (group.enabled === false) return null;

                // Si el grupo debe mostrarse como acordeón:
                if (group.isAccordion) {
                    return (
                        <Accordion
                            key={group.id}
                            title={group.accordionTitle || group.title || "Sección"}
                            defaultOpen={group.defaultOpen}
                        >
                            {group.inputs ? (
                                <FormGroup 
                                    group={group} 
                                    groupData={formData[group.id]} 
                                    isInAccordion={true}
                                />
                            ) : (
                                <div>
                                    <FormInput
                                        config={group}
                                        value={formData[group.id]}
                                        onChange={(value) => updateFormData(group.id, value)}
                                    />
                                </div>
                            )}
                        </Accordion>
                    );
                }

                // Caso normal (sin acordeón)
                if (group.inputs) {
                    return (
                        <FormGroup
                            key={group.id}
                            group={group}
                            groupData={formData[group.id]}
                        />
                    );
                } else {
                    return (
                        <div key={group.id}>
                            <FormInput
                                config={group}
                                value={formData[group.id]}
                                onChange={(value) => updateFormData(group.id, value)}
                            />
                        </div>
                    );
                }
            })}
        </>
    );
}

export default FormContainer;
