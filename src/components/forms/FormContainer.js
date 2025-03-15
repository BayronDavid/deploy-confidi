"use client";
import React, { useEffect } from "react";
import { useFormsContext } from "@/context/FormsContext";
import FormGroup from "./FormGroup";
import useHasMounted from "@/hooks/useHasMounted";

import FormInput from "./FormInput";

function FormContainer({ formConfig }) {
    const hasMounted = useHasMounted();
    const {
        formData,
        updateFormData,
        setIsCurrentFormValid,
        setSubmitCurrentForm
    } = useFormsContext();

    // Inicializa los datos de cada grupo, ya sea un grupo de inputs o un input directo
    useEffect(() => {
        if (!formConfig || !formConfig.groups) return;

        const isValid = formConfig.groups.every((group) => {
            // Si el grupo no está habilitado, no afecta la validez del formulario
            if (group.enabled === false) return true;

            // Si el input es de tipo documentRequest, validamos de forma especial
            if (group.type === "documentRequest") {
                const value = formData[group.id];
                if (group.isOptional) {
                    // Opcional: válido si se subió un archivo o se marcó "No"
                    return (
                        (value && typeof value === "object" && value instanceof File) ||
                        value === "skipped"
                    );
                } else {
                    // Obligatorio: solo válido si se subió un archivo
                    return value && typeof value === "object" && value instanceof File;
                }
            }

            // Validación para inputs directos (no agrupados)
            if (group.inputs === undefined) {
                // Para otros tipos, se requiere que tenga algún valor
                return formData[group.id] && formData[group.id] !== "";
            }

            // Si es un grupo con inputs, se recorre cada uno:
            const groupData = formData[group.id] || {};
            return (group.inputs || []).every((input) => {
                if (input.enabled !== false && input.required) {
                    // Validación especial para documentRequest dentro de grupos
                    if (input.type === "documentRequest") {
                        const value = groupData[input.id];
                        if (input.isOptional) {
                            // Opcional: válido si se subió un archivo o se marcó "No"
                            return (
                                (value && typeof value === "object" && value instanceof File) ||
                                value === "skipped"
                            );
                        } else {
                            // Obligatorio: solo válido si se subió un archivo
                            return value && typeof value === "object" && value instanceof File;
                        }
                    }
                    
                    if (input.type === "optionSelector") {
                        const value = groupData[input.id];
                        return Array.isArray(value) && value.length > 0;
                    }
                    return groupData[input.id] && groupData[input.id] !== "";
                }
                return true;
            });
        });

        // Actualiza el estado de validez en el contexto
        setIsCurrentFormValid(isValid);
    }, [formData, formConfig, setIsCurrentFormValid]);


    // Validación general del formulario - corrección clave aquí
    useEffect(() => {
        if (!formConfig || !formConfig.groups) return;

        const isValid = formConfig.groups.every((group) => {
            // Si el grupo no está habilitado, no afecta la validez del formulario
            if (group.enabled === false) return true;

            if (group.inputs) {
                const groupData = formData[group.id] || {};
                return (group.inputs || []).every((input) => {
                    // Solo validar si tanto el grupo como el input están habilitados
                    if (input.enabled !== false && input.required) {
                        // Validación especial para documentRequest dentro de grupos
                        if (input.type === "documentRequest") {
                            const value = groupData[input.id];
                            if (input.isOptional) {
                                // Opcional: válido si se subió un archivo o se marcó "No"
                                return (
                                    (value && typeof value === "object" && value instanceof File) ||
                                    value === "skipped"
                                );
                            } else {
                                // Obligatorio: solo válido si se subió un archivo
                                return value && typeof value === "object" && value instanceof File;
                            }
                        }
                        
                        // Validación especial para optionSelector
                        if (input.type === "optionSelector") {
                            const value = groupData[input.id];
                            return Array.isArray(value) && value.length > 0;
                        }
                        return groupData[input.id] && groupData[input.id] !== "";
                    }
                    return true;
                });
            } else {
                // Input directo - solo validar si está habilitado
                if (group.enabled !== false && group.required) {
                    // Validación especial para documentRequest directo
                    if (group.type === "documentRequest") {
                        const value = formData[group.id];
                        if (group.isOptional) {
                            // Opcional: válido si se subió un archivo o se marcó "No"
                            return (
                                (value && typeof value === "object" && value instanceof File) ||
                                value === "skipped"
                            );
                        } else {
                            // Obligatorio: solo válido si se subió un archivo
                            return value && typeof value === "object" && value instanceof File;
                        }
                    }
                    
                    // Validación especial para optionSelector directo
                    if (group.type === "optionSelector") {
                        const value = formData[group.id];
                        return Array.isArray(value) && value.length > 0;
                    }
                    return formData[group.id] && formData[group.id] !== "";
                }
                return true;
            }
        });

        // Actualiza el estado de validez en el contexto
        setIsCurrentFormValid(isValid);
    }, [formData, formConfig, setIsCurrentFormValid]);

    const handleSubmit = () => {
        if (!formConfig) return false;

        // Recalcular validación por seguridad
        const isFormValid = formConfig.groups.every((group) => {
            if (group.enabled === false) return true;

            if (group.inputs) {
                const groupData = formData[group.id] || {};
                return (group.inputs || []).every((input) => {
                    if (input.enabled !== false && input.required) {
                        // Validación especial para documentRequest dentro de grupos
                        if (input.type === "documentRequest") {
                            const value = groupData[input.id];
                            if (input.isOptional) {
                                return (
                                    (value && typeof value === "object" && value instanceof File) ||
                                    value === "skipped"
                                );
                            } else {
                                return value && typeof value === "object" && value instanceof File;
                            }
                        }
                        
                        // Validación especial para optionSelector
                        if (input.type === "optionSelector") {
                            const value = groupData[input.id];
                            return Array.isArray(value) && value.length > 0;
                        }
                        return groupData[input.id] && groupData[input.id] !== "";
                    }
                    return true;
                });
            } else {
                if (group.enabled !== false && group.required) {
                    // Validación especial para documentRequest directo
                    if (group.type === "documentRequest") {
                        const value = formData[group.id];
                        if (group.isOptional) {
                            return (
                                (value && typeof value === "object" && value instanceof File) ||
                                value === "skipped"
                            );
                        } else {
                            return value && typeof value === "object" && value instanceof File;
                        }
                    }
                    
                    // Validación especial para optionSelector directo
                    if (group.type === "optionSelector") {
                        const value = formData[group.id];
                        return Array.isArray(value) && value.length > 0;
                    }
                    return formData[group.id] && formData[group.id] !== "";
                }
                return true;
            }
        });

        if (isFormValid) {
            // formConfig.onSubmit && formConfig.onSubmit(formData);
            return true; // Indica que el envío fue exitoso
        } else {
            alert("Por favor, complete todos los campos requeridos.");
            return false; // Indica que el envío falló
        }
    };

    // Proporciona la función de submit al contexto
    useEffect(() => {
        setSubmitCurrentForm(() => handleSubmit);
        // Limpieza al desmontar
        return () => setSubmitCurrentForm(() => () => { return false; });
    }, [setSubmitCurrentForm, formConfig, formData]);

    if (!hasMounted) return null;
    if (!formConfig || !formConfig.groups) {
        return <div>Configuración no encontrada para el formulario</div>;
    }

    return (
        <>
            {/* Título y descripción SOLO a nivel de formulario, si existen */}
            {formConfig.title && <h1>{formConfig.title}</h1>}
            {formConfig.description && <p>{formConfig.description}</p>}

            {formConfig.groups.map((group) => {
                // No renderizar grupos deshabilitados
                if (group.enabled === false) return null;

                if (group.inputs) {
                    return (
                        <FormGroup
                            key={group.id}
                            group={group}
                            groupData={formData[group.id]}
                        />
                    );
                } else {
                    // Para inputs directos, creamos un contenedor pero sin duplicar título/descripción
                    return (
                        <>
                            <FormInput
                                config={group}
                                value={formData[group.id]}
                                onChange={(value) => updateFormData(group.id, value)}
                            />
                        </>
                    );
                }
            })}
        </>
    );
}

export default FormContainer;
