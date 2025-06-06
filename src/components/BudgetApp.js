/**
 * Componente principal de la aplicación de presupuesto
 * Maneja el estado global y la navegación entre pasos
 */

import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

// Hooks personalizados
import useLocalStorage from '../hooks/useLocalStorage';
import useBudgetCalculations from '../hooks/useBudgetCalculations';

// Componentes
import StepNavigation from './StepNavigation';
import IncomeStep from './IncomeStep';
import ExpenseStep from './ExpenseStep';
import BudgetVisualization from './BudgetVisualization';
import BudgetAdjustment from './BudgetAdjustment';
import ExportTools from './ExportTools';
import AlertSystem from './AlertSystem';

// Utilidades
import { validateBudgetData, calculatePercentages } from '../utils/budgetCalculations';

const BudgetApp = ({ 
    apiUrl, 
    nonce, 
    isLoggedIn, 
    userId, 
    attributes, 
    containerId 
}) => {
    // Estado principal del presupuesto
    const [budgetData, setBudgetData] = useLocalStorage('economilenial-budget', {
        ingresos: [],
        gastos: {
            necesidades: [],
            deseos: [],
            ahorroInversion: []
        },
        distribucion: {
            necesidades: 50,
            deseos: 30,
            ahorroInversion: 20
        },
        alertas: []
    });

    // Estado de la aplicación
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [lastSaved, setLastSaved] = useState(null);

    // Cálculos derivados usando hook personalizado
    const calculations = useBudgetCalculations(budgetData);

    /**
     * Cargar datos del servidor si el usuario está logueado
     */
    useEffect(() => {
        if (isLoggedIn && apiUrl) {
            loadBudgetFromServer();
        }
    }, [isLoggedIn, apiUrl]);

    /**
     * Validar datos cada vez que cambien
     */
    useEffect(() => {
        const validation = validateBudgetData(budgetData);
        setErrors(validation.errors);
    }, [budgetData]);

    /**
     * Cargar presupuesto desde el servidor
     */
    const loadBudgetFromServer = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${apiUrl}budget`, {
                headers: {
                    'X-WP-Nonce': nonce
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setBudgetData(result.data);
                    setLastSaved(result.last_updated);
                }
            }
        } catch (error) {
            console.error('Error loading budget:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Guardar presupuesto en el servidor
     */
    const saveBudgetToServer = async () => {
        if (!isLoggedIn || !apiUrl) return;

        try {
            setIsLoading(true);
            const response = await fetch(`${apiUrl}budget`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                },
                body: JSON.stringify({
                    budget_data: budgetData
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setLastSaved(new Date().toISOString());
                }
            }
        } catch (error) {
            console.error('Error saving budget:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Actualizar ingresos
     */
    const updateIngresos = (nuevosIngresos) => {
        setBudgetData(prev => ({
            ...prev,
            ingresos: nuevosIngresos
        }));
    };

    /**
     * Actualizar gastos por categoría
     */
    const updateGastos = (categoria, nuevosGastos) => {
        setBudgetData(prev => ({
            ...prev,
            gastos: {
                ...prev.gastos,
                [categoria]: nuevosGastos
            }
        }));
    };

    /**
     * Actualizar distribución porcentual
     */
    const updateDistribucion = (nuevaDistribucion) => {
        setBudgetData(prev => ({
            ...prev,
            distribucion: nuevaDistribucion
        }));
    };

    /**
     * Navegar al siguiente paso
     */
    const nextStep = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    /**
     * Navegar al paso anterior
     */
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    /**
     * Renderizar el paso actual
     */
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <IncomeStep
                        ingresos={budgetData.ingresos}
                        onUpdate={updateIngresos}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <ExpenseStep
                        gastos={budgetData.gastos}
                        ingresoTotal={calculations.ingresoTotal}
                        onUpdate={updateGastos}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 3:
                return (
                    <BudgetVisualization
                        budgetData={budgetData}
                        calculations={calculations}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 4:
                return (
                    <BudgetAdjustment
                        budgetData={budgetData}
                        calculations={calculations}
                        onUpdateDistribucion={updateDistribucion}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 5:
                return (
                    <ExportTools
                        budgetData={budgetData}
                        calculations={calculations}
                        apiUrl={apiUrl}
                        nonce={nonce}
                        onPrev={prevStep}
                        onSave={saveBudgetToServer}
                        showExport={attributes.showExport}
                    />
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="economilenial-budget-loading">
                <div className="loading-spinner"></div>
                <p>{__('Cargando...', 'economilenial-budget')}</p>
            </div>
        );
    }

    return (
        <div className="economilenial-budget-app">
            {/* Encabezado */}
            <div className="budget-header">
                <h2 className="budget-title">
                    🎯 {__('Tu Presupuesto Economilenial', 'economilenial-budget')}
                </h2>
                <p className="budget-subtitle">
                    {__('¡Vamos a domar tus gastos con la regla 50-30-20!', 'economilenial-budget')}
                </p>
            </div>

            {/* Navegación de pasos */}
            <StepNavigation 
                currentStep={currentStep}
                totalSteps={5}
                onStepChange={setCurrentStep}
            />

            {/* Sistema de alertas */}
            <AlertSystem 
                budgetData={budgetData}
                calculations={calculations}
                errors={errors}
            />

            {/* Contenido del paso actual */}
            <div className="budget-step-content">
                {renderCurrentStep()}
            </div>

            {/* Información de guardado */}
            {isLoggedIn && lastSaved && (
                <div className="budget-save-info">
                    <small>
                        {__('Último guardado:', 'economilenial-budget')} {new Date(lastSaved).toLocaleString()}
                    </small>
                </div>
            )}
        </div>
    );
};

export default BudgetApp;
