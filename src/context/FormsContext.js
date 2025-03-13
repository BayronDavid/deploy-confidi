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
    const loadInitialFormData = () => {
        try {
            const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedData) return JSON.parse(storedData);
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
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
        } catch (error) {
            console.error("Error saving form data:", error);
        }
    }, [formData]);

    // Actualización: si "data" es un array (como en OptionSelector) lo asigna directamente,
    // de lo contrario, hace un merge con el estado previo.
    const updateFormData = (groupId, data) => {
        setFormData((prev) => ({
            ...prev,
            [groupId]: Array.isArray(data) ? data : { ...(prev[groupId] || {}), ...data },
        }));
    };

    const clearFormData = () => {
        setFormData({});
        localStorage.removeItem(LOCAL_STORAGE_KEY);
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
            }}
        >
            {children}
        </FormsContext.Provider>
    );
}

