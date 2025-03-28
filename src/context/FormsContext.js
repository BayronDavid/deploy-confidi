'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
    const [isCurrentFormValid, setIsCurrentFormValid] = useState(false);
    const [submitCurrentForm, setSubmitCurrentForm] = useState(() => () => { return false; });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const initialLoad = sessionStorage.getItem('initialLoad');
            if (!initialLoad) {
                setIsCurrentFormValid(false);
                sessionStorage.setItem('initialLoad', 'true');
            }
        }
    }, []);

    useEffect(() => {
        setIsCurrentFormValid(false);
    }, [pathname]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const serializableData = serializeFormData(formData);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializableData));
            } catch (error) {
                console.error("Error saving form data:", error);
            }
        }
    }, [formData]);

    const serializeFormData = (data) => {
        const result = { ...data };
        Object.keys(result).forEach(groupId => {
            const group = result[groupId];
            if (group === "skipped") return;
            if (group instanceof File) {
                result[groupId] = {
                    __isFile: true,
                    name: group.name,
                    size: group.size,
                    type: group.type,
                    lastModified: group.lastModified,
                    ...(group.fileName ? { fileName: group.fileName } : {})
                };
            } else if (Array.isArray(group)) {
                result[groupId] = group.map((item, index) => {
                    if (item instanceof File) {
                        return {
                            __isFile: true,
                            name: item.name,
                            size: item.size,
                            type: item.type,
                            lastModified: item.lastModified,
                            ...(item.fileName ? { fileName: item.fileName } : {})
                        };
                    }
                    return item;
                });
            } else if (typeof group === 'object' && group !== null) {
                Object.keys(group).forEach(key => {
                    const value = group[key];
                    if (value === "skipped") return;
                    if (value instanceof File) {
                        result[groupId][key] = {
                            __isFile: true,
                            name: value.name,
                            size: value.size,
                            type: value.type,
                            lastModified: value.lastModified,
                            ...(value.fileName ? { fileName: value.fileName } : {})
                        };
                    } else if (Array.isArray(value)) {
                        result[groupId][key] = value.map((item, index) => {
                            if (item instanceof File) {
                                return {
                                    __isFile: true,
                                    name: item.name,
                                    size: item.size,
                                    type: item.type,
                                    lastModified: item.lastModified,
                                    ...(item.fileName ? { fileName: item.fileName } : {})
                                };
                            }
                            return item;
                        });
                    }
                });
            }
        });
        return result;
    };

    const updateFormData = useCallback((fieldId, value, instanceIndex = undefined) => {
        setFormData(prev => {
            if (instanceIndex !== undefined) {
                const existingGroup = Array.isArray(prev[fieldId]) 
                    ? prev[fieldId] 
                    : (prev[fieldId] ? [prev[fieldId]] : []);
                const updatedGroup = [...existingGroup];
                if (updatedGroup[instanceIndex]) {
                    updatedGroup[instanceIndex] = {
                        ...updatedGroup[instanceIndex],
                        ...value,
                        _id: updatedGroup[instanceIndex]._id || Date.now()
                    };
                } else {
                    updatedGroup[instanceIndex] = {
                        ...value,
                        _id: Date.now()
                    };
                }
                return { ...prev, [fieldId]: updatedGroup };
            }
            return { ...prev, [fieldId]: value };
        });
    }, []);

    const clearFormData = () => {
        setFormData({});
        if (typeof window !== 'undefined') {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    };

    const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

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

    const [formRef, setFormRef] = useState(null);

    const duplicateGroup = useCallback((groupId) => {
        setFormData(prevFormData => {
            if (!(groupId in prevFormData)) {
                return {
                    ...prevFormData,
                    [groupId]: [{ _id: Date.now() }]
                };
            }
            const currentGroupData = Array.isArray(prevFormData[groupId])
                ? prevFormData[groupId]
                : (prevFormData[groupId] ? [prevFormData[groupId]] : []);
            if (currentGroupData.length === 0) {
                return {
                    ...prevFormData,
                    [groupId]: [{ _id: Date.now() }]
                };
            }
            let lastInstance;
            try {
                lastInstance = JSON.parse(JSON.stringify(
                    Object.fromEntries(
                        Object.entries(currentGroupData[currentGroupData.length - 1] || {})
                            .filter(([key, value]) => 
                                typeof value !== 'function' && 
                                !(value instanceof File) &&
                                !key.startsWith('__')
                            )
                    )
                ));
            } catch (error) {
                console.error("Error al copiar la última instancia:", error);
                lastInstance = {};
            }
            const newInstance = {
                ...lastInstance,
                _id: Date.now() + Math.floor(Math.random() * 1000)
            };
            return {
                ...prevFormData,
                [groupId]: [...currentGroupData, newInstance]
            };
        });
    }, []);

    const deleteGroupInstance = useCallback((groupId, instanceIndex) => {
        setFormData(prev => {
            const existingGroup = Array.isArray(prev[groupId]) 
                ? [...prev[groupId]] 
                : (prev[groupId] ? [prev[groupId]] : []);
            if (existingGroup.length <= 1 && instanceIndex === 0) {
                return { ...prev, [groupId]: [] };
            }
            existingGroup.splice(instanceIndex, 1);
            return {
                ...prev,
                [groupId]: existingGroup
            };
        });
    }, []);

    const resetForm = useCallback(() => {
        setFormData({});
        setIsCurrentFormValid(false);
    }, []);

    const getDB = () => {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open("docsConfidi", 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("files")) {
                    db.createObjectStore("files", { keyPath: "fileName" });
                }
            };
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    };

    const saveFileToIDB = async (file) => {
        if (!file.fileName) return;
        try {
            const db = await getDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction("files", "readwrite");
                const store = tx.objectStore("files");
                store.put({ fileName: file.fileName, file });
                tx.oncomplete = () => {
                    console.log(`File saved: ${file.fileName}`);
                    resolve();
                };
                tx.onerror = (event) => {
                    console.error("Transaction error (save):", event.target.error);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error("Error saving file to IndexedDB:", error);
        }
    };

    const deleteFileFromIDB = async (fName) => {
        try {
            const db = await getDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction("files", "readwrite");
                const store = tx.objectStore("files");
                store.delete(fName);
                tx.oncomplete = () => {
                    console.log(`File deleted: ${fName}`);
                    resolve();
                };
                tx.onerror = (event) => {
                    console.error("Transaction error (delete):", event.target.error);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error("Error deleting file from IndexedDB:", error);
        }
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
                isCurrentFormValid,
                setIsCurrentFormValid,
                submitCurrentForm,
                setSubmitCurrentForm,
                isFileValue,
                formSubmitAttempted,
                setFormSubmitAttempted,
                formRef,
                setFormRef,
                resetForm,
                duplicateGroup,
                deleteGroupInstance,
                saveFileToIDB,
                deleteFileFromIDB
            }}
        >
            {children}
        </FormsContext.Provider>
    );
}
