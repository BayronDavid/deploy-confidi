'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const FormsContext = createContext();

export const useFormsContext = () => useContext(FormsContext);

export function FormsProvider({ children }) {
    const pathname = usePathname();
    const steps = ['Servici', 'Documenti', 'Dati', 'PEC'];
    const routeToStepIndex = {
        servici: 0,
        documenti: 1,
        dati: 2,
        pec: 3,
    };

    const getInitialStep = () => {
        if (!pathname) return 0;
        const segments = pathname.split('/');
        const lastSegment = segments[segments.length - 1].toLowerCase();
        return routeToStepIndex[lastSegment] || 0;
    };

    const [currentStep, setCurrentStep] = useState(getInitialStep());
    useEffect(() => {
        if (pathname) {
            const segments = pathname.split('/');
            const lastSegment = segments[segments.length - 1].toLowerCase();
            if (routeToStepIndex.hasOwnProperty(lastSegment)) {
                setCurrentStep(routeToStepIndex[lastSegment]);
            }
        }
    }, [pathname]);

    const LOCAL_STORAGE_KEY = 'formData';
    // almace en memoria para archivos
    const [filesStorage, setFilesStorage] = useState({});

    const loadInitialFormData = () => {
        if (typeof window !== 'undefined') {
            try {
                const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    return parsedData;
                }
            } catch (error) {
                console.error("Error loading form data:", error);
            }
        }
        return {};
    };

    const [formData, setFormData] = useState(loadInitialFormData());
    // Siempre iniciar como inválido para forzar validación
    const [isCurrentFormValid, setIsCurrentFormValid] = useState(false);
    const [submitCurrentForm, setSubmitCurrentForm] = useState(() => () => { return false; });

    // Asegurarse de que después de recargar la página, se empieza siempre con validez falsa
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const initialLoad = sessionStorage.getItem('initialLoad');
            if (!initialLoad) {
                setIsCurrentFormValid(false);
                sessionStorage.setItem('initialLoad', 'true');
            }
        }
    }, []);

    // Al navegar entre rutas, reiniciar el estado de validez
    useEffect(() => {
        setIsCurrentFormValid(false);
    }, [pathname]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // Necesitamos crear una copia del formData que sea serializable
                const serializableData = serializeFormData(formData);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializableData));
            } catch (error) {
                console.error("Error saving form data:", error);
            }
        }
    }, [formData]);

    // Mejorado: serializar datos del formulario, convirtiendo File objects a metadatos
    const serializeFormData = (data) => {
        const result = { ...data };

        // Recorre los grupos del formulario
        Object.keys(result).forEach(groupId => {
            const group = result[groupId];

            // Si es "skipped", mantenerlo así
            if (group === "skipped") {
                return;
            }

            // Si es un objeto File directo en el grupo
            if (group instanceof File) {
                // Guardamos el archivo en el almacén de archivos
                setFilesStorage(prev => ({ ...prev, [groupId]: group }));

                // Reemplazamos con metadatos
                result[groupId] = {
                    __isFile: true,
                    name: group.name,
                    size: group.size,
                    type: group.type,
                    lastModified: group.lastModified,
                };
            }
            // Si es un array que podría contener archivos
            else if (Array.isArray(group)) {
                const newArray = group.map((item, index) => {
                    if (item instanceof File) {
                        // Guardamos el archivo en el almacén de archivos
                        setFilesStorage(prev => ({ ...prev, [`${groupId}[${index}]`]: item }));
                        
                        // Reemplazamos con metadatos
                        return {
                            __isFile: true,
                            name: item.name,
                            size: item.size,
                            type: item.type,
                            lastModified: item.lastModified,
                        };
                    }
                    return item;
                });
                result[groupId] = newArray;
            }
            // Si es un objeto con posibles archivos en sus propiedades
            else if (typeof group === 'object' && group !== null) {
                Object.keys(group).forEach(key => {
                    const value = group[key];
                    
                    // Si es "skipped", mantenerlo así
                    if (value === "skipped") {
                        return;
                    }
                    
                    if (value instanceof File) {
                        // Guardamos el archivo en el almacén de archivos
                        setFilesStorage(prev => ({ ...prev, [`${groupId}.${key}`]: value }));

                        // Reemplazamos con metadatos
                        result[groupId][key] = {
                            __isFile: true,
                            name: value.name,
                            size: value.size,
                            type: value.type,
                            lastModified: value.lastModified,
                        };
                    } else if (Array.isArray(value)) {
                        const newArray = value.map((item, index) => {
                            if (item instanceof File) {
                                // Guardamos el archivo en el almacén de archivos
                                setFilesStorage(prev => ({ ...prev, [`${groupId}.${key}[${index}]`]: item }));
                                
                                // Reemplazamos con metadatos
                                return {
                                    __isFile: true,
                                    name: item.name,
                                    size: item.size,
                                    type: item.type,
                                    lastModified: item.lastModified,
                                };
                            }
                            return item;
                        });
                        result[groupId][key] = newArray;
                    }
                });
            }
        });

        return result;
    };

    // Actualización mejorada: gestiona archivos preservando su instancia en memoria
    const updateFormData = (groupId, data) => {
        setFormData((prev) => {
            // Si estamos actualizando con un archivo o una lista que contiene archivos
            if (data instanceof File ||
                (Array.isArray(data) && data.some(item => item instanceof File))) {
                // Guardar los archivos en memoria
                if (Array.isArray(data)) {
                    // Para arrays de archivos (multiple)
                    data.forEach((item, index) => {
                        if (item instanceof File) {
                            setFilesStorage(prevFiles => ({
                                ...prevFiles,
                                [`${groupId}[${index}]`]: item
                            }));
                        }
                    });
                } else {
                    // Para un solo archivo
                    setFilesStorage(prevFiles => ({
                        ...prevFiles,
                        [groupId]: data
                    }));
                }
            } else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                // Si es un objeto (como en un grupo), revisar si alguna propiedad es un archivo
                Object.keys(data).forEach(key => {
                    if (data[key] instanceof File) {
                        setFilesStorage(prevFiles => ({
                            ...prevFiles,
                            [`${groupId}.${key}`]: data[key]
                        }));
                    }
                });
            }

            return {
                ...prev,
                [groupId]: data
            };
        });
    };

    const clearFormData = () => {
        setFormData({});
        setFilesStorage({});
        if (typeof window !== 'undefined') {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    };
    
    // Nuevo estado para rastrear intentos de envío del formulario
    const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

    // obtener los archivos reales cuando sean necesarios - sin logging
    const getFileFromStorage = (fileKey) => {
        const file = filesStorage[fileKey];
        return file || null;
    };

    // verificar si un valor es un archivo (original o serializado) - sin logging
    const isFileValue = (value) => {
        return value instanceof File ||
            (value && typeof value === 'object' && value.__isFile) ||
            (Array.isArray(value) && value.some(item => 
                item instanceof File || (item && typeof item === 'object' && item.__isFile)
            ));
    };

    const getRouteForStep = (index) => {
        const step = steps[index].toLowerCase();
        return `/forms/${step}`;
    };

    // Nueva referencia para el formulario actual
    const [formRef, setFormRef] = useState(null);

    return (
        <FormsContext.Provider
            value={{
                currentStep,
                setCurrentStep,
                steps,
                getRouteForStep,
                formData,
                updateFormData,
                clearFormData,
                isCurrentFormValid,
                setIsCurrentFormValid,
                submitCurrentForm,
                setSubmitCurrentForm,
                getFileFromStorage,
                isFileValue,
                formSubmitAttempted,
                setFormSubmitAttempted,
                formRef,
                setFormRef,
            }}
        >
            {children}
        </FormsContext.Provider>
    );
}
