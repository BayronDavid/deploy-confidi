'use client';
import React from 'react'
import './FormsHeader.css'
import Stepper from '../../Stepper';
import { useRouter } from 'next/navigation';
import { useFormsContext } from '@/context/FormsContext';

function FormsHeader() {
    const router = useRouter();
    const { currentStep, setCurrentStep, steps, getRouteForStep } = useFormsContext();

    const handleStepClick = (index) => {
        setCurrentStep(index);
        // Use the helper function to get the route
        const route = getRouteForStep(index);
        router.push(route);
    };

    return (
        <div className="forms-header-container">
            <h1>MODULO DI RICHIESTA</h1>
            <Stepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={handleStepClick}
            />
        </div>
    )
}

export default FormsHeader