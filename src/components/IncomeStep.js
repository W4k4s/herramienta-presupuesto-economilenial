/**
 * Paso 1: Registro de Ingresos
 * Permite al usuario agregar, editar y eliminar fuentes de ingreso
 */

import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';

const IncomeStep = ({ ingresos, onUpdate, onNext }) => {
    const [nuevoIngreso, setNuevoIngreso] = useState({ concepto: '', cantidad: '' });
    const [editando, setEditando] = useState(null);

    /**
     * Agregar nuevo ingreso
     */
    const agregarIngreso = () => {
        if (nuevoIngreso.concepto && nuevoIngreso.cantidad) {
            const ingreso = {
                id: Date.now(),
                concepto: nuevoIngreso.concepto,
                cantidad: parseFloat(nuevoIngreso.cantidad),
                tipo: 'mensual' // Por defecto mensual
            };
            
            onUpdate([...ingresos, ingreso]);
            setNuevoIngreso({ concepto: '', cantidad: '' });
        }
    };

    /**
     * Eliminar ingreso
     */
    const eliminarIngreso = (id) => {
        onUpdate(ingresos.filter(ingreso => ingreso.id !== id));
    };

    /**
     * Editar ingreso
     */
    const editarIngreso = (id, nuevosValores) => {
        onUpdate(ingresos.map(ingreso => 
            ingreso.id === id ? { ...ingreso, ...nuevosValores } : ingreso
        ));
        setEditando(null);
    };

    const ingresoTotal = ingresos.reduce((total, ingreso) => total + ingreso.cantidad, 0);

    return (
        <div className="income-step">
            <div className="step-header">
                <h3>💰 {__('Registra tus Ingresos Mensuales', 'economilenial-budget')}</h3>
                <p>{__('Incluye tu salario, freelance, rentas, y cualquier dinero que entre cada mes', 'economilenial-budget')}</p>
            </div>

            {/* Formulario para nuevo ingreso */}
            <div className="add-income-form">
                <div className="form-row">
                    <input
                        type="text"
                        placeholder={__('Concepto (ej: Salario, Freelance...)', 'economilenial-budget')}
                        value={nuevoIngreso.concepto}
                        onChange={(e) => setNuevoIngreso({...nuevoIngreso, concepto: e.target.value})}
                        className="input-field"
                    />
                    <input
                        type="number"
                        placeholder={__('Cantidad €', 'economilenial-budget')}
                        value={nuevoIngreso.cantidad}
                        onChange={(e) => setNuevoIngreso({...nuevoIngreso, cantidad: e.target.value})}
                        className="input-field"
                        min="0"
                        step="0.01"
                    />
                    <button 
                        onClick={agregarIngreso}
                        className="btn btn-primary"
                        disabled={!nuevoIngreso.concepto || !nuevoIngreso.cantidad}
                    >
                        {__('Agregar', 'economilenial-budget')}
                    </button>
                </div>
            </div>

            {/* Lista de ingresos */}
            <div className="income-list">
                {ingresos.length === 0 ? (
                    <div className="empty-state">
                        <p>{__('Aún no has agregado ingresos. ¡Empecemos!', 'economilenial-budget')}</p>
                    </div>
                ) : (
                    <div className="income-items">
                        {ingresos.map((ingreso) => (
                            <div key={ingreso.id} className="income-item">
                                {editando === ingreso.id ? (
                                    <EditIncomeForm 
                                        ingreso={ingreso}
                                        onSave={(valores) => editarIngreso(ingreso.id, valores)}
                                        onCancel={() => setEditando(null)}
                                    />
                                ) : (
                                    <>
                                        <div className="income-info">
                                            <span className="income-concept">{ingreso.concepto}</span>
                                            <span className="income-amount">{ingreso.cantidad.toFixed(2)}€</span>
                                        </div>
                                        <div className="income-actions">
                                            <button 
                                                onClick={() => setEditando(ingreso.id)}
                                                className="btn-icon"
                                                title={__('Editar', 'economilenial-budget')}
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => eliminarIngreso(ingreso.id)}
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

            {/* Resumen */}
            {ingresos.length > 0 && (
                <div className="income-summary">
                    <div className="summary-card">
                        <h4>{__('Total de Ingresos Mensuales', 'economilenial-budget')}</h4>
                        <div className="total-amount">{ingresoTotal.toFixed(2)}€</div>
                        <p className="summary-note">
                            {__('Este será la base para calcular tu regla 50-30-20', 'economilenial-budget')}
                        </p>
                    </div>
                </div>
            )}

            {/* Navegación */}
            <div className="step-navigation-buttons">
                <button 
                    onClick={onNext}
                    className="btn btn-primary btn-large"
                    disabled={ingresos.length === 0}
                >
                    {__('Continuar a Gastos', 'economilenial-budget')} →
                </button>
            </div>
        </div>
    );
};

/**
 * Componente para editar un ingreso existente
 */
const EditIncomeForm = ({ ingreso, onSave, onCancel }) => {
    const [valores, setValores] = useState({
        concepto: ingreso.concepto,
        cantidad: ingreso.cantidad.toString()
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
        <div className="edit-income-form">
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

export default IncomeStep;
