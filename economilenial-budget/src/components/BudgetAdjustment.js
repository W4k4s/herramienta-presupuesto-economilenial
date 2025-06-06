/**
 * Paso 4: Ajuste Flexible del Presupuesto
 * Permite ajustar distribución con sliders manteniendo equilibrio
 */

import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

const BudgetAdjustment = ({ budgetData, calculations, onUpdateDistribucion, onNext, onPrev }) => {
    // Estado local para los ajustes
    const [ajustes, setAjustes] = useState({
        necesidades: calculations.porcentajesActuales.necesidades || 50,
        deseos: calculations.porcentajesActuales.deseos || 30,
        ahorroInversion: calculations.porcentajesActuales.ahorroInversion || 20
    });

    const [dragActive, setDragActive] = useState(null);
    const [needsBalance, setNeedsBalance] = useState(false);

    /**
     * Verificar si los porcentajes suman 100%
     */
    useEffect(() => {
        const total = ajustes.necesidades + ajustes.deseos + ajustes.ahorroInversion;
        setNeedsBalance(Math.abs(total - 100) > 0.1);
    }, [ajustes]);

    /**
     * Manejar cambio en slider
     */
    const handleSliderChange = (categoria, nuevoValor) => {
        setAjustes(prev => ({
            ...prev,
            [categoria]: parseFloat(nuevoValor)
        }));
    };

    /**
     * Balancear automáticamente los porcentajes
     */
    const autoBalance = () => {
        const total = ajustes.necesidades + ajustes.deseos + ajustes.ahorroInversion;
        const diferencia = 100 - total;
        
        // Distribuir la diferencia proporcionalmente
        const factor = 100 / total;
        
        setAjustes({
            necesidades: ajustes.necesidades * factor,
            deseos: ajustes.deseos * factor,
            ahorroInversion: ajustes.ahorroInversion * factor
        });
    };

    /**
     * Restaurar valores ideales 50-30-20
     */
    const restaurarIdeales = () => {
        setAjustes({
            necesidades: 50,
            deseos: 30,
            ahorroInversion: 20
        });
    };

    /**
     * Aplicar cambios al presupuesto
     */
    const aplicarCambios = () => {
        // Calcular nuevos montos basados en porcentajes ajustados
        const nuevaDistribucion = {
            necesidades: ajustes.necesidades,
            deseos: ajustes.deseos,
            ahorroInversion: ajustes.ahorroInversion
        };

        onUpdateDistribucion(nuevaDistribucion);
        onNext();
    };

    /**
     * Calcular nuevo monto para una categoría
     */
    const calcularNuevoMonto = (categoria) => {
        return (calculations.ingresoTotal * ajustes[categoria]) / 100;
    };

    /**
     * Obtener diferencia con monto actual
     */
    const calcularDiferencia = (categoria) => {
        const montoActual = calculations.gastosPorCategoria[categoria];
        const montoNuevo = calcularNuevoMonto(categoria);
        return montoNuevo - montoActual;
    };

    /**
     * Obtener color del semáforo para el nuevo porcentaje
     */
    const getSemaforoColor = (categoria) => {
        const ideal = categoria === 'necesidades' ? 50 : categoria === 'deseos' ? 30 : 20;
        const diferencia = Math.abs(ajustes[categoria] - ideal);
        
        if (diferencia <= 2) return 'green';
        if (diferencia <= 5) return 'amber';
        return 'red';
    };

    const categorias = [
        {
            key: 'necesidades',
            nombre: __('Necesidades', 'economilenial-budget'),
            icon: '🏠',
            color: '#37B8AF',
            ideal: 50
        },
        {
            key: 'deseos',
            nombre: __('Deseos', 'economilenial-budget'),
            icon: '🛍️',
            color: '#0F4C5C',
            ideal: 30
        },
        {
            key: 'ahorroInversion',
            nombre: __('Ahorro/Inversión', 'economilenial-budget'),
            icon: '💰',
            color: '#E8F4F8',
            ideal: 20
        }
    ];

    return (
        <div className="budget-adjustment">
            <div className="step-header">
                <h3>⚖️ {__('Ajusta tu Presupuesto', 'economilenial-budget')}</h3>
                <p>{__('Usa los sliders para redistribuir tu presupuesto de forma flexible', 'economilenial-budget')}</p>
            </div>

            {/* Advertencia si no está balanceado */}
            {needsBalance && (
                <div className="balance-warning">
                    <div className="warning-content">
                        <span className="warning-icon">⚠️</span>
                        <span className="warning-text">
                            {__('Los porcentajes no suman 100%. Usa el botón "Cuadrar" para balancear.', 'economilenial-budget')}
                        </span>
                        <button onClick={autoBalance} className="btn btn-primary btn-small">
                            {__('Cuadrar', 'economilenial-budget')}
                        </button>
                    </div>
                </div>
            )}

            {/* Controles de ajuste por categoría */}
            <div className="adjustment-controls">
                {categorias.map((categoria) => {
                    const semaforoColor = getSemaforoColor(categoria.key);
                    const diferencia = calcularDiferencia(categoria.key);
                    const porcentajeActual = ajustes[categoria.key];

                    return (
                        <div key={categoria.key} className="category-adjustment">
                            <div className="category-header">
                                <div className="category-info">
                                    <span className="category-icon">{categoria.icon}</span>
                                    <span className="category-name">{categoria.nombre}</span>
                                    <span className={`semaforo-indicator semaforo-${semaforoColor}`}>
                                        {semaforoColor === 'green' ? '🟢' : semaforoColor === 'amber' ? '🟡' : '🔴'}
                                    </span>
                                </div>
                                <div className="category-percentage">
                                    <span className="current-percentage">{porcentajeActual.toFixed(1)}%</span>
                                    <span className="ideal-percentage">({categoria.ideal}% ideal)</span>
                                </div>
                            </div>

                            {/* Slider */}
                            <div className="slider-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={porcentajeActual}
                                    onChange={(e) => handleSliderChange(categoria.key, e.target.value)}
                                    className="category-slider"
                                    style={{ 
                                        background: `linear-gradient(to right, ${categoria.color} 0%, ${categoria.color} ${porcentajeActual}%, #ddd ${porcentajeActual}%, #ddd 100%)`
                                    }}
                                />
                                <div className="slider-labels">
                                    <span>0%</span>
                                    <span className="ideal-marker" style={{ left: `${categoria.ideal}%` }}>
                                        {categoria.ideal}%
                                    </span>
                                    <span>100%</span>
                                </div>
                            </div>

                            {/* Información de montos */}
                            <div className="amount-info">
                                <div className="amount-row">
                                    <span className="amount-label">{__('Monto actual:', 'economilenial-budget')}</span>
                                    <span className="amount-value">{calculations.gastosPorCategoria[categoria.key].toFixed(2)}€</span>
                                </div>
                                <div className="amount-row">
                                    <span className="amount-label">{__('Nuevo monto:', 'economilenial-budget')}</span>
                                    <span className="amount-value">{calcularNuevoMonto(categoria.key).toFixed(2)}€</span>
                                </div>
                                <div className="amount-row">
                                    <span className="amount-label">{__('Diferencia:', 'economilenial-budget')}</span>
                                    <span className={`amount-value ${diferencia >= 0 ? 'positive' : 'negative'}`}>
                                        {diferencia >= 0 ? '+' : ''}{diferencia.toFixed(2)}€
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Resumen total */}
            <div className="adjustment-summary">
                <div className="summary-card">
                    <h4>{__('Resumen del Ajuste', 'economilenial-budget')}</h4>
                    <div className="summary-grid">
                        <div className="summary-item">
                            <span className="summary-label">{__('Total ajustado:', 'economilenial-budget')}</span>
                            <span className="summary-value">
                                {(ajustes.necesidades + ajustes.deseos + ajustes.ahorroInversion).toFixed(1)}%
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">{__('Nuevos gastos totales:', 'economilenial-budget')}</span>
                            <span className="summary-value">
                                {(calcularNuevoMonto('necesidades') + calcularNuevoMonto('deseos') + calcularNuevoMonto('ahorroInversion')).toFixed(2)}€
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">{__('Balance restante:', 'economilenial-budget')}</span>
                            <span className={`summary-value ${calculations.ingresoTotal - (calcularNuevoMonto('necesidades') + calcularNuevoMonto('deseos') + calcularNuevoMonto('ahorroInversion')) >= 0 ? 'positive' : 'negative'}`}>
                                {(calculations.ingresoTotal - (calcularNuevoMonto('necesidades') + calcularNuevoMonto('deseos') + calcularNuevoMonto('ahorroInversion'))).toFixed(2)}€
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones de acción rápida */}
            <div className="quick-actions">
                <button onClick={restaurarIdeales} className="btn btn-secondary">
                    🎯 {__('Restaurar 50-30-20', 'economilenial-budget')}
                </button>
                <button onClick={autoBalance} className="btn btn-secondary" disabled={!needsBalance}>
                    ⚖️ {__('Cuadrar a 100%', 'economilenial-budget')}
                </button>
            </div>

            {/* Consejos dinámicos */}
            <div className="adjustment-tips">
                <h4>💡 {__('Consejos de Ajuste', 'economilenial-budget')}</h4>
                <ul>
                    {ajustes.necesidades > 60 && (
                        <li>{__('Tus necesidades son muy altas. ¿Hay gastos que podrías reclasificar como deseos?', 'economilenial-budget')}</li>
                    )}
                    {ajustes.deseos > 40 && (
                        <li>{__('Tus deseos superan el 40%. Considera reducirlos para aumentar tu ahorro.', 'economilenial-budget')}</li>
                    )}
                    {ajustes.ahorroInversion < 15 && (
                        <li>{__('Tu ahorro está por debajo del 15%. Recuerda que es la clave de tu libertad financiera.', 'economilenial-budget')}</li>
                    )}
                    {Math.abs(ajustes.necesidades - 50) <= 5 && Math.abs(ajustes.deseos - 30) <= 5 && Math.abs(ajustes.ahorroInversion - 20) <= 5 && (
                        <li>🎉 {__('¡Excelente! Tu distribución está muy cerca del ideal 50-30-20.', 'economilenial-budget')}</li>
                    )}
                </ul>
            </div>

            {/* Navegación */}
            <div className="step-navigation-buttons">
                <button onClick={onPrev} className="btn btn-secondary">
                    ← {__('Volver al Análisis', 'economilenial-budget')}
                </button>
                <button 
                    onClick={aplicarCambios}
                    className="btn btn-primary"
                    disabled={needsBalance}
                >
                    {__('Aplicar y Exportar', 'economilenial-budget')} →
                </button>
            </div>
        </div>
    );
};

export default BudgetAdjustment;
