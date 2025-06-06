/**
 * Visualización del presupuesto
 * Muestra gráfico doughnut y tabla con la regla 50-30-20
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { __ } from '@wordpress/i18n';

const BudgetVisualization = ({ budgetData, calculations, onNext, onPrev }) => {
    
    // Datos para el gráfico
    const chartData = [
        {
            name: __('Necesidades', 'economilenial-budget'),
            value: calculations.gastosPorCategoria.necesidades,
            porcentaje: calculations.porcentajesActuales.necesidades,
            ideal: 50,
            color: '#37B8AF'
        },
        {
            name: __('Deseos', 'economilenial-budget'),
            value: calculations.gastosPorCategoria.deseos,
            porcentaje: calculations.porcentajesActuales.deseos,
            ideal: 30,
            color: '#0F4C5C'
        },
        {
            name: __('Ahorro/Inversión', 'economilenial-budget'),
            value: calculations.gastosPorCategoria.ahorroInversion,
            porcentaje: calculations.porcentajesActuales.ahorroInversion,
            ideal: 20,
            color: '#E8F4F8'
        }
    ];

    // Tooltip personalizado
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="chart-tooltip">
                    <h4>{data.name}</h4>
                    <p><strong>{__('Actual:', 'economilenial-budget')}</strong> {data.value.toFixed(2)}€ ({data.porcentaje.toFixed(1)}%)</p>
                    <p><strong>{__('Ideal:', 'economilenial-budget')}</strong> {data.ideal}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="budget-visualization">
            <div className="step-header">
                <h3>📊 {__('Análisis de tu Presupuesto', 'economilenial-budget')}</h3>
                <p>{__('Aquí tienes tu distribución actual vs. la regla 50-30-20', 'economilenial-budget')}</p>
            </div>

            {/* Gráfico Doughnut */}
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Tabla comparativa */}
            <div className="comparison-table">
                <h4>{__('Comparación con la Regla 50-30-20', 'economilenial-budget')}</h4>
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>{__('Categoría', 'economilenial-budget')}</th>
                            <th>{__('Tu %', 'economilenial-budget')}</th>
                            <th>{__('Ideal', 'economilenial-budget')}</th>
                            <th>{__('Diferencia', 'economilenial-budget')}</th>
                            <th>{__('Estado', 'economilenial-budget')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.map((categoria, index) => {
                            const diferencia = categoria.porcentaje - categoria.ideal;
                            const semaforoColor = Math.abs(diferencia) <= 2 ? 'green' : 
                                                Math.abs(diferencia) <= 5 ? 'amber' : 'red';
                            
                            return (
                                <tr key={index}>
                                    <td>
                                        <span className="category-color" style={{backgroundColor: categoria.color}}></span>
                                        {categoria.name}
                                    </td>
                                    <td>{categoria.porcentaje.toFixed(1)}%</td>
                                    <td>{categoria.ideal}%</td>
                                    <td className={diferencia > 0 ? 'positive' : 'negative'}>
                                        {diferencia > 0 ? '+' : ''}{diferencia.toFixed(1)}%
                                    </td>
                                    <td>
                                        <span className={`semaforo-indicator semaforo-${semaforoColor}`}>
                                            {semaforoColor === 'green' ? '🟢' : semaforoColor === 'amber' ? '🟡' : '🔴'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Resumen financiero */}
            <div className="financial-summary">
                <div className="summary-grid">
                    <div className="summary-item">
                        <div className="summary-label">{__('Ingresos Totales', 'economilenial-budget')}</div>
                        <div className="summary-value">{calculations.ingresoTotal.toFixed(2)}€</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-label">{__('Gastos Totales', 'economilenial-budget')}</div>
                        <div className="summary-value">{calculations.gastoTotal.toFixed(2)}€</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-label">{__('Balance', 'economilenial-budget')}</div>
                        <div className={`summary-value ${calculations.balance >= 0 ? 'positive' : 'negative'}`}>
                            {calculations.balance.toFixed(2)}€
                        </div>
                    </div>
                </div>
            </div>

            {/* Consejos educativos */}
            {calculations.consejos.length > 0 && (
                <div className="educational-tips">
                    <h4>💡 {__('Consejos Personalizados', 'economilenial-budget')}</h4>
                    <ul>
                        {calculations.consejos.map((consejo, index) => (
                            <li key={index}>{consejo}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Navegación */}
            <div className="step-navigation-buttons">
                <button onClick={onPrev} className="btn btn-secondary">
                    ← {__('Volver a Gastos', 'economilenial-budget')}
                </button>
                <button onClick={onNext} className="btn btn-primary">
                    {__('Ajustar Presupuesto', 'economilenial-budget')} →
                </button>
            </div>
        </div>
    );
};

export default BudgetVisualization;
