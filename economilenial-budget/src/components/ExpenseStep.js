/**
 * Paso 2: Registro de Gastos por Categorías
 * Implementa las categorías de la regla 50-30-20
 */

import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';

const ExpenseStep = ({ gastos, ingresoTotal, onUpdate, onNext, onPrev }) => {
    const [categoriaActiva, setCategoriaActiva] = useState('necesidades');
    const [nuevoGasto, setNuevoGasto] = useState({ concepto: '', cantidad: '' });
    const [editando, setEditando] = useState(null);

    // Definir categorías según la regla 50-30-20 (basado en lecciones 2-2 y 2-3)
    const categorias = {
        necesidades: {
            nombre: __('Necesidades (50%)', 'economilenial-budget'),
            descripcion: __('Gastos básicos para vivir: vivienda, alimentación, transporte, seguros', 'economilenial-budget'),
            color: '#37B8AF',
            icon: '🏠',
            ejemplos: [
                __('Alquiler o hipoteca', 'economilenial-budget'),
                __('Supermercado', 'economilenial-budget'), 
                __('Transporte público', 'economilenial-budget'),
                __('Seguro médico', 'economilenial-budget'),
                __('Servicios básicos (luz, agua, gas)', 'economilenial-budget')
            ]
        },
        deseos: {
            nombre: __('Deseos (30%)', 'economilenial-budget'),
            descripcion: __('Gastos que mejoran tu calidad de vida pero no son esenciales', 'economilenial-budget'),
            color: '#0F4C5C',
            icon: '🛍️',
            ejemplos: [
                __('Entretenimiento', 'economilenial-budget'),
                __('Cenas fuera', 'economilenial-budget'),
                __('Hobbies', 'economilenial-budget'),
                __('Compras no esenciales', 'economilenial-budget'),
                __('Suscripciones premium', 'economilenial-budget')
            ]
        },
        ahorroInversion: {
            nombre: __('Ahorro e Inversión (20%)', 'economilenial-budget'),
            descripcion: __('Tu futuro financiero: ahorro, inversiones y pago extra de deudas', 'economilenial-budget'),
            color: '#E8F4F8',
            icon: '💰',
            ejemplos: [
                __('Fondo de emergencia', 'economilenial-budget'),
                __('Inversiones', 'economilenial-budget'),
                __('Ahorro para objetivos', 'economilenial-budget'),
                __('Pago extra de deudas', 'economilenial-budget'),
                __('Plan de pensiones', 'economilenial-budget')
            ]
        }
    };

    /**
     * Agregar nuevo gasto a la categoría activa
     */
    const agregarGasto = () => {
        if (nuevoGasto.concepto && nuevoGasto.cantidad) {
            const gasto = {
                id: Date.now(),
                concepto: nuevoGasto.concepto,
                cantidad: parseFloat(nuevoGasto.cantidad),
                categoria: categoriaActiva
            };
            
            const gastosActualizados = {
                ...gastos,
                [categoriaActiva]: [...(gastos[categoriaActiva] || []), gasto]
            };
            
            onUpdate(categoriaActiva, gastosActualizados[categoriaActiva]);
            setNuevoGasto({ concepto: '', cantidad: '' });
        }
    };

    /**
     * Eliminar gasto
     */
    const eliminarGasto = (categoriaKey, gastoId) => {
        const gastosActualizados = gastos[categoriaKey].filter(gasto => gasto.id !== gastoId);
        onUpdate(categoriaKey, gastosActualizados);
    };

    /**
     * Editar gasto
     */
    const editarGasto = (categoriaKey, gastoId, nuevosValores) => {
        const gastosActualizados = gastos[categoriaKey].map(gasto => 
            gasto.id === gastoId ? { ...gasto, ...nuevosValores } : gasto
        );
        onUpdate(categoriaKey, gastosActualizados);
        setEditando(null);
    };

    /**
     * Calcular total de una categoría
     */
    const calcularTotalCategoria = (categoriaKey) => {
        return (gastos[categoriaKey] || []).reduce((total, gasto) => total + gasto.cantidad, 0);
    };

    /**
     * Calcular porcentaje de una categoría
     */
    const calcularPorcentajeCategoria = (categoriaKey) => {
        if (ingresoTotal === 0) return 0;
        return (calcularTotalCategoria(categoriaKey) / ingresoTotal) * 100;
    };

    /**
     * Obtener color del semáforo según diferencia con ideal
     */
    const getSemaforoColor = (categoriaKey) => {
        const porcentajeActual = calcularPorcentajeCategoria(categoriaKey);
        const ideal = categoriaKey === 'necesidades' ? 50 : categoriaKey === 'deseos' ? 30 : 20;
        const diferencia = Math.abs(porcentajeActual - ideal);
        
        if (diferencia <= 2) return 'green';
        if (diferencia <= 5) return 'amber';
        return 'red';
    };

    return (
        <div className="expense-step">
            <div className="step-header">
                <h3>🛒 {__('Registra tus Gastos por Categorías', 'economilenial-budget')}</h3>
                <p>{__('Clasifica tus gastos según la regla 50-30-20 para obtener un presupuesto equilibrado', 'economilenial-budget')}</p>
            </div>

            {/* Pestañas de categorías */}
            <div className="category-tabs">
                {Object.entries(categorias).map(([key, categoria]) => {
                    const total = calcularTotalCategoria(key);
                    const porcentaje = calcularPorcentajeCategoria(key);
                    const semaforoColor = getSemaforoColor(key);
                    
                    return (
                        <button
                            key={key}
                            className={`category-tab ${categoriaActiva === key ? 'active' : ''}`}
                            onClick={() => setCategoriaActiva(key)}
                            style={{ borderBottomColor: categoria.color }}
                        >
                            <div className="tab-header">
                                <span className="tab-icon">{categoria.icon}</span>
                                <span className="tab-name">{categoria.nombre}</span>
                                <span className={`semaforo-indicator semaforo-${semaforoColor}`}>
                                    {semaforoColor === 'green' ? '🟢' : semaforoColor === 'amber' ? '🟡' : '🔴'}
                                </span>
                            </div>
                            <div className="tab-summary">
                                <span className="tab-total">{total.toFixed(2)}€</span>
                                <span className="tab-percentage">({porcentaje.toFixed(1)}%)</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Contenido de la categoría activa */}
            <div className="category-content">
                <div className="category-info">
                    <h4>
                        {categorias[categoriaActiva].icon} {categorias[categoriaActiva].nombre}
                    </h4>
                    <p className="category-description">
                        {categorias[categoriaActiva].descripcion}
                    </p>
                    
                    {/* Ejemplos de gastos */}
                    <div className="category-examples">
                        <strong>{__('Ejemplos:', 'economilenial-budget')}</strong>
                        <div className="examples-list">
                            {categorias[categoriaActiva].ejemplos.map((ejemplo, index) => (
                                <span key={index} className="example-tag">{ejemplo}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Formulario para agregar gasto */}
                <div className="add-expense-form">
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder={__('Concepto del gasto', 'economilenial-budget')}
                            value={nuevoGasto.concepto}
                            onChange={(e) => setNuevoGasto({...nuevoGasto, concepto: e.target.value})}
                            className="input-field"
                        />
                        <input
                            type="number"
                            placeholder={__('Cantidad €', 'economilenial-budget')}
                            value={nuevoGasto.cantidad}
                            onChange={(e) => setNuevoGasto({...nuevoGasto, cantidad: e.target.value})}
                            className="input-field"
                            min="0"
                            step="0.01"
                        />
                        <button 
                            onClick={agregarGasto}
                            className="btn btn-primary"
                            disabled={!nuevoGasto.concepto || !nuevoGasto.cantidad}
                        >
                            {__('Agregar', 'economilenial-budget')}
                        </button>
                    </div>
                </div>

                {/* Lista de gastos de la categoría */}
                <div className="expense-list">
                    {!gastos[categoriaActiva] || gastos[categoriaActiva].length === 0 ? (
                        <div className="empty-state">
                            <p>{__('Aún no has agregado gastos en esta categoría', 'economilenial-budget')}</p>
                        </div>
                    ) : (
                        <div className="expense-items">
                            {gastos[categoriaActiva].map((gasto) => (
                                <div key={gasto.id} className="expense-item">
                                    {editando === gasto.id ? (
                                        <EditExpenseForm 
                                            gasto={gasto}
                                            onSave={(valores) => editarGasto(categoriaActiva, gasto.id, valores)}
                                            onCancel={() => setEditando(null)}
                                        />
                                    ) : (
                                        <>
                                            <div className="expense-info">
                                                <span className="expense-concept">{gasto.concepto}</span>
                                                <span className="expense-amount">{gasto.cantidad.toFixed(2)}€</span>
                                            </div>
                                            <div className="expense-actions">
                                                <button 
                                                    onClick={() => setEditando(gasto.id)}
                                                    className="btn-icon"
                                                    title={__('Editar', 'economilenial-budget')}
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    onClick={() => eliminarGasto(categoriaActiva, gasto.id)}
                                                    className="btn-icon btn-danger"
                                                    title={__('Eliminar', 'economilenial-budget')}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Resumen total */}
            <div className="expenses-summary">
                <div className="summary-grid">
                    {Object.entries(categorias).map(([key, categoria]) => {
                        const total = calcularTotalCategoria(key);
                        const porcentaje = calcularPorcentajeCategoria(key);
                        const ideal = key === 'necesidades' ? 50 : key === 'deseos' ? 30 : 20;
                        const diferencia = porcentaje - ideal;
                        
                        return (
                            <div key={key} className="summary-category">
                                <div className="summary-header">
                                    <span>{categoria.icon}</span>
                                    <span>{categoria.nombre}</span>
                                </div>
                                <div className="summary-amounts">
                                    <div className="actual-amount">{total.toFixed(2)}€</div>
                                    <div className="percentage-info">
                                        <span className="actual-percentage">{porcentaje.toFixed(1)}%</span>
                                        <span className="ideal-percentage">({ideal}% ideal)</span>
                                        <span className={`difference ${diferencia >= 0 ? 'positive' : 'negative'}`}>
                                            {diferencia >= 0 ? '+' : ''}{diferencia.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navegación */}
            <div className="step-navigation-buttons">
                <button onClick={onPrev} className="btn btn-secondary">
                    ← {__('Volver a Ingresos', 'economilenial-budget')}
                </button>
                <button 
                    onClick={onNext}
                    className="btn btn-primary"
                    disabled={Object.values(gastos).every(categoria => categoria.length === 0)}
                >
                    {__('Ver Análisis', 'economilenial-budget')} →
                </button>
            </div>
        </div>
    );
};

/**
 * Componente para editar un gasto existente
 */
const EditExpenseForm = ({ gasto, onSave, onCancel }) => {
    const [valores, setValores] = useState({
        concepto: gasto.concepto,
        cantidad: gasto.cantidad.toString()
    });

    const handleSave = () => {
        if (valores.concepto && valores.cantidad) {
            onSave({
                concepto: valores.concepto,
                cantidad: parseFloat(valores.cantidad)
            });
        }
    };

    return (
        <div className="edit-expense-form">
            <input
                type="text"
                value={valores.concepto}
                onChange={(e) => setValores({...valores, concepto: e.target.value})}
                className="input-field"
            />
            <input
                type="number"
                value={valores.cantidad}
                onChange={(e) => setValores({...valores, cantidad: e.target.value})}
                className="input-field"
                min="0"
                step="0.01"
            />
            <div className="edit-actions">
                <button onClick={handleSave} className="btn btn-primary">✓</button>
                <button onClick={onCancel} className="btn btn-secondary">✗</button>
            </div>
        </div>
    );
};

export default ExpenseStep;
