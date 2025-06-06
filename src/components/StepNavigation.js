/**
 * Componente de navegación entre pasos
 * Muestra el progreso del usuario en el proceso
 */

import React from 'react';
import { __ } from '@wordpress/i18n';

const StepNavigation = ({ currentStep, totalSteps, onStepChange }) => {
    const steps = [
        { number: 1, title: __('Ingresos', 'economilenial-budget'), icon: '💰' },
        { number: 2, title: __('Gastos', 'economilenial-budget'), icon: '🛒' },
        { number: 3, title: __('Análisis', 'economilenial-budget'), icon: '📊' },
        { number: 4, title: __('Ajustes', 'economilenial-budget'), icon: '⚖️' },
        { number: 5, title: __('Exportar', 'economilenial-budget'), icon: '📁' }
    ];

    return (
        <div className="step-navigation">
            <div className="steps-container">
                {steps.map((step) => (
                    <div 
                        key={step.number}
                        className={`step-item ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                        onClick={() => onStepChange(step.number)}
                    >
                        <div className="step-icon">
                            {currentStep > step.number ? '✅' : step.icon}
                        </div>
                        <div className="step-title">{step.title}</div>
                        <div className="step-number">{step.number}</div>
                    </div>
                ))}
            </div>
            
            {/* Barra de progreso */}
            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
            </div>
            
            <div className="progress-text">
                {__('Paso', 'economilenial-budget')} {currentStep} {__('de', 'economilenial-budget')} {totalSteps}
            </div>
        </div>
    );
};

export default StepNavigation;
