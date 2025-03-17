"use client";
import React, { useEffect, useRef } from "react";
import { useFormsContext } from "@/context/FormsContext";
import FormGroup from "./FormGroup";
import useHasMounted from "@/hooks/useHasMounted";
import FormInput from "./FormInput";

function FormContainer({ formConfig }) {
    const hasMounted = useHasMounted();
    const initialValidationDone = useRef(false);
    const {
        formData,
        updateFormData,
        setIsCurrentFormValid,
        setSubmitCurrentForm,
        getFileFromStorage
    } = useFormsContext();

    // Establece inicialmente el formulario como inválido hasta que se complete la validación
    useEffect(() => {
        setIsCurrentFormValid(false);
    }, []);

    // Función auxiliar mejorada para verificar si un valor es un archivo válido
    const isValidFile = (value) => {
        // Primero verificar si es un objeto File directo
        if (value instanceof File) {
            return true;
        }
        
        // Si es un arreglo, verificar si contiene al menos un archivo válido
        if (Array.isArray(value) && value.length > 0) {
            return value.some(item => item instanceof File || (item && typeof item === 'object' && item.__isFile));
        }
        
        // Si es un objeto con indicador de archivo
        if (value && typeof value === 'object' && value.__isFile) {
            return true;
        }
        
        return false;
    };

    // Función mejorada para verificar si un campo de documento es válido
    const isDocumentFieldValid = (value, isOptional) => {
        // Si es opcional y está explícitamente marcado como "skipped"
        if (isOptional && value === "skipped") {
            return true;
        }
        
        // Para campos opcionales sin valor explícito o campos requeridos
        return isValidFile(value);
    };

    // Efecto de validación específico que se ejecuta una sola vez al montar el componente
    useEffect(() => {
        if (!formConfig || !formConfig.groups || !hasMounted || initialValidationDone.current) return;
        
        // Realizar validación inicial completa contra la estructura
        let formIsValid = true;
        
        // Verificar cada grupo definido en la configuración
        for (const group of formConfig.groups) {
            // Saltar grupos deshabilitados
            if (group.enabled === false) continue;
            
            if (group.inputs) {
                const groupData = formData[group.id] || {};
                
                // Verificar cada input definido en la configuración
                for (const input of (group.inputs || [])) {
                    if (input.enabled !== false && input.required) {
                        let inputIsValid = false;
                        
                        if (input.type === "documentRequest") {
                            const value = groupData[input.id];
                            inputIsValid = isDocumentFieldValid(value, input.isOptional);
                        } else if (input.type === "optionSelector") {
                            const value = groupData[input.id];
                            inputIsValid = Array.isArray(value) && value.length > 0;
                        } else {
                            inputIsValid = Boolean(groupData[input.id] && groupData[input.id] !== "");
                        }
                        
                        if (!inputIsValid) {
                            formIsValid = false;
                            break;
                        }
                    }
                }
                
                if (!formIsValid) break;
            } else {
                // Input directo
                if (group.enabled !== false && group.required) {
                    let inputIsValid = false;
                    
                    if (group.type === "documentRequest") {
                        const value = formData[group.id];
                        inputIsValid = isDocumentFieldValid(value, group.isOptional);
                    } else if (group.type === "optionSelector") {
                        const value = formData[group.id];
                        inputIsValid = Array.isArray(value) && value.length > 0;
                    } else {
                        inputIsValid = Boolean(formData[group.id] && formData[group.id] !== "");
                    }
                    
                    if (!inputIsValid) {
                        formIsValid = false;
                        break;
                    }
                }
            }
        }
        
        // Actualizar estado de validez
        setIsCurrentFormValid(formIsValid);
        initialValidationDone.current = true;
    }, [formConfig, formData, hasMounted]);

    // Validación general del formulario - Se ejecuta en cada cambio
    useEffect(() => {
        if (!formConfig || !formConfig.groups) {
            setIsCurrentFormValid(false);
            return;
        }

        // Siempre iniciar con validación positiva
        let formIsValid = true;

        // Verificar cada grupo
        for (const group of formConfig.groups) {
            // Si el grupo no está habilitado, lo saltamos
            if (group.enabled === false) continue;

            if (group.inputs) {
                const groupData = formData[group.id] || {};
                
                // Verificar cada input en el grupo
                for (const input of (group.inputs || [])) {
                    // Solo validar si tanto el grupo como el input están habilitados y son requeridos
                    if (input.enabled !== false && input.required) {
                        let inputIsValid = false;
                        
                        // Validación específica por tipo
                        if (input.type === "documentRequest") {
                            const value = groupData[input.id];
                            inputIsValid = isDocumentFieldValid(value, input.isOptional);
                        } else if (input.type === "optionSelector") {
                            const value = groupData[input.id];
                            inputIsValid = Array.isArray(value) && value.length > 0;
                        } else {
                            inputIsValid = Boolean(groupData[input.id] && groupData[input.id] !== "");
                        }
                        
                        // Si cualquier campo requerido no es válido, el formulario no es válido
                        if (!inputIsValid) {
                            formIsValid = false;
                            break;
                        }
                    }
                }
                
                // Si ya encontramos un campo inválido, no necesitamos revisar más
                if (!formIsValid) break;
            } else {
                // Input directo - solo validar si está habilitado y es requerido
                if (group.enabled !== false && group.required) {
                    let inputIsValid = false;
                    
                    // Validación específica por tipo
                    if (group.type === "documentRequest") {
                        const value = formData[group.id];
                        inputIsValid = isDocumentFieldValid(value, group.isOptional);
                    } else if (group.type === "optionSelector") {
                        const value = formData[group.id];
                        inputIsValid = Array.isArray(value) && value.length > 0;
                    } else {
                        inputIsValid = Boolean(formData[group.id] && formData[group.id] !== "");
                    }
                    
                    // Si cualquier campo requerido no es válido, el formulario no es válido
                    if (!inputIsValid) {
                        formIsValid = false;
                        break;
                    }
                }
            }
        }

        // Actualiza el estado de validez en el contexto
        setIsCurrentFormValid(formIsValid);
    }, [formData, formConfig, setIsCurrentFormValid]);

    const handleSubmit = () => {
        if (!formConfig) return false;

        // Recalcular validación por seguridad usando el mismo algoritmo
        let isFormValid = true;

        // Verificar cada grupo
        for (const group of formConfig.groups) {
            if (group.enabled === false) continue;

            if (group.inputs) {
                const groupData = formData[group.id] || {};
                
                for (const input of (group.inputs || [])) {
                    if (input.enabled !== false && input.required) {
                        let inputIsValid = false;
                        
                        if (input.type === "documentRequest") {
                            const value = groupData[input.id];
                            inputIsValid = isDocumentFieldValid(value, input.isOptional);
                        } else if (input.type === "optionSelector") {
                            const value = groupData[input.id];
                            inputIsValid = Array.isArray(value) && value.length > 0;
                        } else {
                            inputIsValid = Boolean(groupData[input.id] && groupData[input.id] !== "");
                        }
                        
                        if (!inputIsValid) {
                            isFormValid = false;
                            break;
                        }
                    }
                }
                
                if (!isFormValid) break;
            } else {
                if (group.enabled !== false && group.required) {
                    let inputIsValid = false;
                    
                    if (group.type === "documentRequest") {
                        const value = formData[group.id];
                        inputIsValid = isDocumentFieldValid(value, group.isOptional);
                    } else if (group.type === "optionSelector") {
                        const value = formData[group.id];
                        inputIsValid = Array.isArray(value) && value.length > 0;
                    } else {
                        inputIsValid = Boolean(formData[group.id] && formData[group.id] !== "");
                    }
                    
                    if (!inputIsValid) {
                        isFormValid = false;
                        break;
                    }
                }
            }
        }

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
