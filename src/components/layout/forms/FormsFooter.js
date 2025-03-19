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
        submitCurrentForm,
        setFormSubmitAttempted,
        formRef
    } = useFormsContext();

    // Check if this is the last step
    const isLastStep = currentStep === steps.length - 1;

    const handleNextStep = () => {
        // Marcamos que hubo un intento de envío
        setFormSubmitAttempted(true);
        
        // Técnica clave: validar de una manera que funcione consistentemente
        let formIsValid = true;
        
        if (formRef && formRef.current) {
            // Primero, hacer un reset de la validación para que el estado interno del formulario se limpie
            // Esto es crucial para que la validación se active en cada intento
            formRef.current.classList.remove('validated');
            void formRef.current.offsetWidth; // Forzar un reflow
            formRef.current.classList.add('validated');
            
            // Verificar validez
            formIsValid = formRef.current.checkValidity();
            
            if (!formIsValid) {
                // Obtenemos todos los inputs inválidos
                const invalidInputs = formRef.current.querySelectorAll(':invalid');
                
                // Si hay inputs inválidos, enfocamos solo el primero
                if (invalidInputs.length > 0) {
                    // Técnica crucial para que el navegador muestre la validación:
                    // Hacer que el elemento reporte su invalidad explícitamente
                    invalidInputs[0].focus();
                    
                    // Esto es lo que hace que aparezca el mensaje nativo cada vez
                    setTimeout(() => {
                        invalidInputs[0].reportValidity();
                    }, 100);
                    
                    return; // Detener aquí
                }
            }
        }
        
        // Validación personalizada
        const isSubmitSuccessful = submitCurrentForm();
        
        // Solo navegamos al siguiente paso si ambas validaciones pasan
        if (isSubmitSuccessful && currentStep < steps.length - 1) {
            const nextStep = currentStep + 1;
            const nextRoute = getRouteForStep(nextStep);
            // Reseteamos el estado ya que vamos a un nuevo formulario
            setFormSubmitAttempted(false);
            router.push(nextRoute);
        }
    };

    if (isLastStep) {
        return null;
    }

    return (
        <div className='forms-footer-container'>
            <Button
                label="Prossimo Passo"
                iconUrl="/ui/chevron-right.svg"
                onClick={handleNextStep}
                variant={"primary"}
                fancy={submitCurrentForm()}
                subtle={true}
            />
        </div>
    );
}

export default FormsFooter;