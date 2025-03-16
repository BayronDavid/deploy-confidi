// /context/FormsContext.js
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
    // Nuevo almacén en memoria para archivos
    const [filesStorage, setFilesStorage] = useState({});
    
    const loadInitialFormData = () => {
        try {
            const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // Restaurar referencias a archivos previamente guardados
                return parsedData;
            }
        } catch (error) {
            console.error("Error loading form data:", error);
        }
        return {};
    };

    const [formData, setFormData] = useState(loadInitialFormData());
    // Nuevo estado para la validez del formulario actual
    const [isCurrentFormValid, setIsCurrentFormValid] = useState(false);
    // Nuevo estado para la función de envío del formulario actual
    const [submitCurrentForm, setSubmitCurrentForm] = useState(() => () => {});

    useEffect(() => {
        try {
            // Necesitamos crear una copia del formData que sea serializable
            const serializableData = serializeFormData(formData);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializableData));
        } catch (error) {
            console.error("Error saving form data:", error);
        }
    }, [formData]);

    // Función para serializar datos del formulario, convirtiendo File objects a metadatos
    const serializeFormData = (data) => {
        const result = { ...data };
        
        // Recorre los grupos del formulario
        Object.keys(result).forEach(groupId => {
            const group = result[groupId];
            
            // Si es un objeto File directo en el grupo
            if (group instanceof File) {
                // Guardamos el archivo en el almacén de archivos
                setFilesStorage(prev => ({ ...prev, [`${groupId}`]: group }));
                
                // Reemplazamos con metadatos
                result[groupId] = {
                    __isFile: true,
                    name: group.name,
                    size: group.size,
                    type: group.type,
                    lastModified: group.lastModified,
                };
            }
            // Si es un objeto con posibles archivos en sus propiedades
            else if (typeof group === 'object' && group !== null && !(group instanceof Array)) {
                Object.keys(group).forEach(key => {
                    if (group[key] instanceof File) {
                        // Guardamos el archivo en el almacén de archivos
                        setFilesStorage(prev => ({ ...prev, [`${groupId}.${key}`]: group[key] }));
                        
                        // Reemplazamos con metadatos
                        result[groupId][key] = {
                            __isFile: true,
                            name: group[key].name,
                            size: group[key].size,
                            type: group[key].type,
                            lastModified: group[key].lastModified,
                        };
                    }
                });
            }
        });
        
        return result;
    };

    // Actualización: gestiona archivos preservando su instancia en memoria
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
                [groupId]: Array.isArray(data) ? data : { ...(prev[groupId] || {}), ...data },
            };
        });
    };

    const clearFormData = () => {
        setFormData({});
        setFilesStorage({});
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    // Función para obtener los archivos reales cuando sean necesarios
    const getFileFromStorage = (fileKey) => {
        return filesStorage[fileKey] || null;
    };

    // Función para verificar si un valor es un archivo (original o serializado)
    const isFileValue = (value) => {
        return value instanceof File || 
               (value && typeof value === 'object' && value.__isFile);
    };

    const getRouteForStep = (index) => {
        const step = steps[index].toLowerCase();
        return `/forms/${step}`;
    };

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
                // Nuevos valores para el contexto
                isCurrentFormValid,
                setIsCurrentFormValid,
                submitCurrentForm,
                setSubmitCurrentForm,
                // Nueva función para obtener archivos
                getFileFromStorage,
                isFileValue,
            }}
        >
            {children}
        </FormsContext.Provider>
    );
}

