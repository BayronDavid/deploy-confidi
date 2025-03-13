'use client';
import Button from '@/components/buttons/Button';
import React from 'react';
import './FormsFooter.css';
import { useFormsContext } from '@/context/FormsContext';
import { useRouter } from 'next/navigation';

function FormsFooter() {
    const router = useRouter();
    const { currentStep, steps, getRouteForStep } = useFormsContext();
    
    // Check if this is the last step
    const isLastStep = currentStep === steps.length - 1;
    
    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            const nextStep = currentStep + 1;
            const nextRoute = getRouteForStep(nextStep);
            router.push(nextRoute);
        }
    };

    // Don't render the button if we're on the last step
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
            />
        </div>
    );
}

export default FormsFooter;