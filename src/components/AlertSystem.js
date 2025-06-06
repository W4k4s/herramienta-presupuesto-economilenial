/**
 * Sistema de alertas inteligentes
 * Detecta errores comunes y muestra consejos educativos
 */

import React from 'react';
import { __ } from '@wordpress/i18n';

const AlertSystem = ({ budgetData, calculations, errors }) => {
    
    /**
     * Generar alertas basadas en los cálculos
     */
    const generateAlerts = () => {
        const alerts = [];

        // Alertas de errores críticos
        errors.forEach(error => {
            alerts.push({
                type: 'error',
                icon: '🚨',
                message: error,
                priority: 'high'
            });
        });

        // Alertas del semáforo 50-30-20
        if (calculations.semaforoColors.necesidades === 'red') {
            alerts.push({
                type: 'warning',
                icon: '⚠️',
                message: __('Tus necesidades están muy alejadas del 50% recomendado', 'economilenial-budget'),
                tip: __('Revisa si algunos gastos clasificados como "necesidades" son realmente "deseos"', 'economilenial-budget'),
                priority: 'medium'
            });
        }

        if (calculations.semaforoColors.ahorroInversion === 'red' && calculations.porcentajesActuales.ahorroInversion < 15) {
            alerts.push({
                type: 'info',
                icon: '💰',
                message: __('Tu ahorro está por debajo del 20%', 'economilenial-budget'),
                tip: __('Recuerda: el ahorro es tu "yo del futuro" agradeciéndotelo por adelantado', 'economilenial-budget'),
                priority: 'medium'
            });
        }

        // Alertas de gastos variables altos
        const gastosVariables = budgetData.gastos.deseos?.filter(gasto => 
            ['entretenimiento', 'compras', 'salidas'].includes(gasto.concepto?.toLowerCase())
        ) || [];
        
        const totalVariables = gastosVariables.reduce((total, gasto) => total + gasto.cantidad, 0);
        
        if (calculations.ingresoTotal > 0 && (totalVariables / calculations.ingresoTotal) > 0.25) {
            alerts.push({
                type: 'tip',
                icon: '💡',
                message: __('Tus gastos variables son altos', 'economilenial-budget'),
                tip: __('Considera implementar la regla de las 24 horas antes de compras no planificadas', 'economilenial-budget'),
                priority: 'low'
            });
        }

        // Consejos educativos si todo está bien
        if (alerts.length === 0 && calculations.ingresoTotal > 0) {
            alerts.push({
                type: 'success',
                icon: '🎉',
                message: __('¡Excelente! Tu presupuesto sigue la regla 50-30-20', 'economilenial-budget'),
                tip: __('Mantén este buen hábito y revisa tu presupuesto mensualmente', 'economilenial-budget'),
                priority: 'low'
            });
        }

        return alerts.sort((a, b) => {
            const priorities = { high: 3, medium: 2, low: 1 };
            return priorities[b.priority] - priorities[a.priority];
        });
    };

    const alerts = generateAlerts();

    if (alerts.length === 0) return null;

    return (
        <div className="alert-system">
            {alerts.map((alert, index) => (
                <div key={index} className={`alert alert-${alert.type}`}>
                    <div className="alert-content">
                        <div className="alert-header">
                            <span className="alert-icon">{alert.icon}</span>
                            <span className="alert-message">{alert.message}</span>
                        </div>
                        {alert.tip && (
                            <div className="alert-tip">
                                <strong>{__('Consejo:', 'economilenial-budget')}</strong> {alert.tip}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlertSystem;
