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
        setSubmitCurrentForm,
        getFileFromStorage
    } = useFormsContext();

    // Función auxiliar para verificar si un valor es un archivo válido
    const isValidFile = (value, fileKey) => {
        // Primero verificar si es un objeto File directo
        if (value instanceof File) {
            return true;
        }
        
        // Si es un objeto con indicador de archivo, buscar en fileStorage
        if (value && typeof value === 'object' && value.__isFile) {
            // Para validación, consideramos válido incluso si no tenemos el archivo
            // porque el archivo se habrá perdido al recargar, pero sus metadatos siguen siendo válidos
            return true;
        }
        
        return false;
    };

    // Función para verificar si un campo de documento es válido
    const isDocumentFieldValid = (value, fileKey, isOptional) => {
        // Para campos opcionales, debe tener un valor explícito: o un archivo o "skipped"
        if (isOptional) {
            // Debe tener algún valor, no puede estar indefinido o null
            return value === "skipped" || isValidFile(value, fileKey);
        }
        
        // Para campos requeridos, sólo se acepta un archivo válido
        return isValidFile(value, fileKey);
    };

    // Validación general del formulario
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
                            return isDocumentFieldValid(
                                value, 
                                `${group.id}.${input.id}`, 
                                input.isOptional
                            );
                        }
                        
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
                        return isDocumentFieldValid(
                            value, 
                            group.id, 
                            group.isOptional
                        );
                    }
                    
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
    }, [formData, formConfig, setIsCurrentFormValid, getFileFromStorage]);

    const handleSubmit = () => {
        if (!formConfig) return false;

        // Recalcular validación por seguridad usando las mismas funciones auxiliares
        const isFormValid = formConfig.groups.every((group) => {
            if (group.enabled === false) return true;

            if (group.inputs) {
                const groupData = formData[group.id] || {};
                return (group.inputs || []).every((input) => {
                    if (input.enabled !== false && input.required) {
                        // Validación especial para documentRequest dentro de grupos
                        if (input.type === "documentRequest") {
                            const value = groupData[input.id];
                            return isDocumentFieldValid(
                                value, 
                                `${group.id}.${input.id}`, 
                                input.isOptional
                            );
                        }
                        
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
                        return isDocumentFieldValid(
                            value, 
                            group.id, 
                            group.isOptional
                        );
                    }
                    
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
            return true;
        } else {
            alert("Por favor, complete todos los campos requeridos.");
            return false;
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

    // Logging para depuración
    console.log("FormData actual:", formData);

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
