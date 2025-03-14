'use client';
import Button from '@/components/buttons/Button';
import React from 'react';
import './FormsFooter.css';
import { useFormsContext } from '@/context/FormsContext';
import { useRouter } from 'next/navigation';

function FormsFooter() {
    const router = useRouter();
    const { 
        currentStep, 
        steps, 
        getRouteForStep,
        isCurrentFormValid,
        submitCurrentForm 
    } = useFormsContext();
    
    // Check if this is the last step
    const isLastStep = currentStep === steps.length - 1;
    
    const handleNextStep = () => {
        // Primero validamos y enviamos el formulario actual
        const isSubmitSuccessful = submitCurrentForm();
        
        // Solo navegamos al siguiente paso si el formulario es válido y se envió correctamente
        if (isSubmitSuccessful && currentStep < steps.length - 1) {
            const nextStep = currentStep + 1;
            const nextRoute = getRouteForStep(nextStep);
            router.push(nextRoute);
        }
    };

    // En el último paso, podríamos mostrar un botón diferente o no mostrar ninguno
    if (isLastStep) {
        return null;
    }

    return (
        <div className='forms-footer-container'>
            <Button
                label="Prossimo Passo"
                iconUrl="/ui/Chevron_Right.svg"
                onClick={handleNextStep}
                variant="primary"
                disabled={!isCurrentFormValid}
            />
        </div>
    );
}

export default FormsFooter;