'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const FormsContext = createContext();

export const useFormsContext = () => useContext(FormsContext);

export const FormsProvider = ({ children }) => {
    const pathname = usePathname();
    const steps = ['Servici', 'Documenti', 'Dati', 'PEC'];
    
    // Map route segments to step indexes
    const routeToStepIndex = {
        'servici': 0,
        'documenti': 1,
        'dati': 2,
        'pec': 3
    };
    
    // Initialize with the correct step based on pathname
    const getInitialStep = () => {
        if (!pathname) return 0;
        
        const segments = pathname.split('/');
        const lastSegment = segments[segments.length - 1].toLowerCase();
        
        return routeToStepIndex[lastSegment] || 0;
    };
    
    const [currentStep, setCurrentStep] = useState(getInitialStep());

    // Update the currentStep based on route changes
    useEffect(() => {
        if (pathname) {
            const segments = pathname.split('/');
            const lastSegment = segments[segments.length - 1].toLowerCase();
            
            if (routeToStepIndex.hasOwnProperty(lastSegment)) {
                setCurrentStep(routeToStepIndex[lastSegment]);
            }
        }
    }, [pathname]);

    // Get route path for a given step index
    const getRouteForStep = (index) => {
        const step = steps[index].toLowerCase();
        return `/forms/${step}`;
    };

    return (
        <FormsContext.Provider value={{ 
            currentStep, 
            setCurrentStep, 
            steps,
            getRouteForStep
        }}>
            {children}
        </FormsContext.Provider>
    );
};

