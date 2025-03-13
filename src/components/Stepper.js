import React from 'react';
import './Stepper.css';

function Stepper({ steps, currentStep, onStepClick }) {
    return (
        <div className="stepper">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div
                        className={`stepper__item ${index === currentStep ? 'stepper__item--active' : ''
                            }`}
                        onClick={() => onStepClick(index)}
                    >
                        <div className="stepper__circle">{index + 1}</div>
                        <span className="stepper__label">{step}</span>
                    </div>
                    {/* Línea divisoria entre pasos (no se muestra después del último) */}
                    {index < steps.length - 1 && <div className="stepper__divider" />}
                </React.Fragment>
            ))}
        </div>
    );
}

export default Stepper;
