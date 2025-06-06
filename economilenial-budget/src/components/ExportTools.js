/**
 * Paso 5: Herramientas de Exportación
 * Permite exportar a CSV/PDF y guardar el presupuesto
 */

import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import jsPDF from 'jspdf';

const ExportTools = ({ 
    budgetData, 
    calculations, 
    apiUrl, 
    nonce, 
    onPrev, 
    onSave, 
    showExport 
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');
    const [saveStatus, setSaveStatus] = useState('');

    /**
     * Generar datos para exportación
     */
    const generateExportData = () => {
        const fecha = new Date().toLocaleDateString('es-ES');
        
        return {
            fecha,
            ingresos: budgetData.ingresos,
            gastos: budgetData.gastos,
            resumen: {
                ingresoTotal: calculations.ingresoTotal,
                gastoTotal: calculations.gastoTotal,
                balance: calculations.balance,
                porcentajes: calculations.porcentajesActuales,
                cumpleRegla: Object.values(calculations.semaforoColors).every(color => color === 'green')
            },
            recomendaciones: calculations.consejos
        };
    };

    /**
     * Exportar como CSV
     */
    const exportToCSV = async () => {
        setIsExporting(true);
        
        try {
            const data = generateExportData();
            let csvContent = '';
            
            // Encabezado del archivo
            csvContent += `Presupuesto Economilenial - ${data.fecha}\n\n`;
            
            // Resumen general
            csvContent += 'RESUMEN GENERAL\n';
            csvContent += 'Concepto,Monto\n';
            csvContent += `Ingresos Totales,${data.resumen.ingresoTotal.toFixed(2)}\n`;
            csvContent += `Gastos Totales,${data.resumen.gastoTotal.toFixed(2)}\n`;
            csvContent += `Balance,${data.resumen.balance.toFixed(2)}\n\n`;
            
            // Distribución 50-30-20
            csvContent += 'DISTRIBUCIÓN 50-30-20\n';
            csvContent += 'Categoría,Porcentaje Actual,Porcentaje Ideal,Cumple Regla\n';
            csvContent += `Necesidades,${data.resumen.porcentajes.necesidades.toFixed(1)}%,50%,${Math.abs(data.resumen.porcentajes.necesidades - 50) <= 5 ? 'Sí' : 'No'}\n`;
            csvContent += `Deseos,${data.resumen.porcentajes.deseos.toFixed(1)}%,30%,${Math.abs(data.resumen.porcentajes.deseos - 30) <= 5 ? 'Sí' : 'No'}\n`;
            csvContent += `Ahorro/Inversión,${data.resumen.porcentajes.ahorroInversion.toFixed(1)}%,20%,${Math.abs(data.resumen.porcentajes.ahorroInversion - 20) <= 5 ? 'Sí' : 'No'}\n\n`;
            
            // Ingresos detallados
            csvContent += 'INGRESOS DETALLADOS\n';
            csvContent += 'Concepto,Monto\n';
            data.ingresos.forEach(ingreso => {
                csvContent += `${ingreso.concepto},${ingreso.cantidad.toFixed(2)}\n`;
            });
            csvContent += '\n';
            
            // Gastos por categoría
            const categorias = {
                necesidades: 'NECESIDADES (50%)',
                deseos: 'DESEOS (30%)',
                ahorroInversion: 'AHORRO E INVERSIÓN (20%)'
            };
            
            Object.entries(categorias).forEach(([key, titulo]) => {
                csvContent += `${titulo}\n`;
                csvContent += 'Concepto,Monto\n';
                
                if (data.gastos[key] && data.gastos[key].length > 0) {
                    data.gastos[key].forEach(gasto => {
                        csvContent += `${gasto.concepto},${gasto.cantidad.toFixed(2)}\n`;
                    });
                } else {
                    csvContent += 'Sin gastos registrados,-\n';
                }
                csvContent += '\n';
            });
            
            // Recomendaciones
            if (data.recomendaciones.length > 0) {
                csvContent += 'RECOMENDACIONES PERSONALIZADAS\n';
                data.recomendaciones.forEach((recomendacion, index) => {
                    csvContent += `${index + 1}. ${recomendacion}\n`;
                });
            }
            
            // Descargar archivo
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `presupuesto-economilenial-${data.fecha.replace(/\//g, '-')}.csv`;
            link.click();
            
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert(__('Error al exportar CSV', 'economilenial-budget'));
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Exportar como PDF
     */
    const exportToPDF = async () => {
        setIsExporting(true);
        
        try {
            const data = generateExportData();
            const pdf = new jsPDF();
            
            // Configuración de fuentes y colores
            const primaryColor = [55, 184, 175]; // #37B8AF
            const secondaryColor = [15, 76, 92]; // #0F4C5C
            let yPosition = 20;
            
            // Encabezado con logo (simulado)
            pdf.setFillColor(...primaryColor);
            pdf.rect(0, 0, 210, 30, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(20);
            pdf.text('📊 Presupuesto Economilenial', 20, 20);
            pdf.setFontSize(12);
            pdf.text(`Generado el ${data.fecha}`, 20, 27);
            
            yPosition = 50;
            pdf.setTextColor(0, 0, 0);
            
            // Resumen ejecutivo
            pdf.setFontSize(16);
            pdf.setTextColor(...secondaryColor);
            pdf.text('Resumen Ejecutivo', 20, yPosition);
            yPosition += 10;
            
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Ingresos totales: ${data.resumen.ingresoTotal.toFixed(2)}€`, 20, yPosition);
            yPosition += 7;
            pdf.text(`Gastos totales: ${data.resumen.gastoTotal.toFixed(2)}€`, 20, yPosition);
            yPosition += 7;
            pdf.text(`Balance: ${data.resumen.balance.toFixed(2)}€`, 20, yPosition);
            yPosition += 15;
            
            // Análisis 50-30-20
            pdf.setFontSize(16);
            pdf.setTextColor(...secondaryColor);
            pdf.text('Análisis Regla 50-30-20', 20, yPosition);
            yPosition += 15;
            
            const categorias = [
                { name: 'Necesidades', actual: data.resumen.porcentajes.necesidades, ideal: 50 },
                { name: 'Deseos', actual: data.resumen.porcentajes.deseos, ideal: 30 },
                { name: 'Ahorro/Inversión', actual: data.resumen.porcentajes.ahorroInversion, ideal: 20 }
            ];
            
            categorias.forEach(categoria => {
                const cumple = Math.abs(categoria.actual - categoria.ideal) <= 5;
                const color = cumple ? [40, 167, 69] : [220, 53, 69]; // Verde o rojo
                
                pdf.setTextColor(...color);
                pdf.text(`${cumple ? '✓' : '✗'}`, 20, yPosition);
                pdf.setTextColor(0, 0, 0);
                pdf.text(`${categoria.name}: ${categoria.actual.toFixed(1)}% (ideal: ${categoria.ideal}%)`, 30, yPosition);
                yPosition += 7;
            });
            
            yPosition += 10;
            
            // Detalles por categoría
            pdf.setFontSize(16);
            pdf.setTextColor(...secondaryColor);
            pdf.text('Detalles por Categoría', 20, yPosition);
            yPosition += 15;
            
            const categoriasDetalle = {
                necesidades: 'Necesidades (50%)',
                deseos: 'Deseos (30%)',
                ahorroInversion: 'Ahorro e Inversión (20%)'
            };
            
            Object.entries(categoriasDetalle).forEach(([key, titulo]) => {
                if (yPosition > 250) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                pdf.setFontSize(14);
                pdf.setTextColor(...primaryColor);
                pdf.text(titulo, 20, yPosition);
                yPosition += 10;
                
                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);
                
                if (data.gastos[key] && data.gastos[key].length > 0) {
                    data.gastos[key].forEach(gasto => {
                        if (yPosition > 250) {
                            pdf.addPage();
                            yPosition = 20;
                        }
                        pdf.text(`• ${gasto.concepto}: ${gasto.cantidad.toFixed(2)}€`, 25, yPosition);
                        yPosition += 5;
                    });
                } else {
                    pdf.text('• Sin gastos registrados', 25, yPosition);
                    yPosition += 5;
                }
                yPosition += 10;
            });
            
            // Recomendaciones
            if (data.recomendaciones.length > 0) {
                if (yPosition > 200) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                pdf.setFontSize(16);
                pdf.setTextColor(...secondaryColor);
                pdf.text('Recomendaciones Personalizadas', 20, yPosition);
                yPosition += 15;
                
                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);
                
                data.recomendaciones.forEach((recomendacion, index) => {
                    if (yPosition > 250) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                    // Dividir texto largo en múltiples líneas
                    const lines = pdf.splitTextToSize(`${index + 1}. ${recomendacion}`, 170);
                    lines.forEach(line => {
                        pdf.text(line, 20, yPosition);
                        yPosition += 5;
                    });
                    yPosition += 3;
                });
            }
            
            // Pie de página
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(128, 128, 128);
                pdf.text(`Generado por Economilenial - Página ${i} de ${pageCount}`, 20, 290);
                pdf.text(`economilenial.com`, 150, 290);
            }
            
            // Descargar PDF
            pdf.save(`presupuesto-economilenial-${data.fecha.replace(/\//g, '-')}.pdf`);
            
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert(__('Error al exportar PDF', 'economilenial-budget'));
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Guardar presupuesto en el servidor
     */
    const handleSave = async () => {
        if (!onSave) return;
        
        setIsSaving(true);
        setSaveStatus('');
        
        try {
            await onSave();
            setSaveStatus('success');
        } catch (error) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Manejar exportación según formato
     */
    const handleExport = () => {
        if (exportFormat === 'csv') {
            exportToCSV();
        } else if (exportFormat === 'pdf') {
            exportToPDF();
        }
    };

    return (
        <div className="export-tools">
            <div className="step-header">
                <h3>📁 {__('Guardar y Exportar', 'economilenial-budget')}</h3>
                <p>{__('¡Felicitaciones! Has completado tu presupuesto Economilenial. Ahora puedes guardarlo y exportarlo.', 'economilenial-budget')}</p>
            </div>

            {/* Resumen final */}
            <div className="final-summary">
                <div className="summary-card highlight">
                    <h4>🎯 {__('Tu Presupuesto Final', 'economilenial-budget')}</h4>
                    <div className="summary-grid">
                        <div className="summary-row">
                            <span className="label">{__('Ingresos mensuales:', 'economilenial-budget')}</span>
                            <span className="value">{calculations.ingresoTotal.toFixed(2)}€</span>
                        </div>
                        <div className="summary-row">
                            <span className="label">{__('Gastos mensuales:', 'economilenial-budget')}</span>
                            <span className="value">{calculations.gastoTotal.toFixed(2)}€</span>
                        </div>
                        <div className="summary-row">
                            <span className="label">{__('Balance:', 'economilenial-budget')}</span>
                            <span className={`value ${calculations.balance >= 0 ? 'positive' : 'negative'}`}>
                                {calculations.balance.toFixed(2)}€
                            </span>
                        </div>
                    </div>
                    
                    {/* Estado de la regla 50-30-20 */}
                    <div className="rule-status">
                        <h5>{__('Estado de la Regla 50-30-20:', 'economilenial-budget')}</h5>
                        <div className="status-grid">
                            <div className={`status-item semaforo-${calculations.semaforoColors.necesidades}`}>
                                <span className="status-icon">🏠</span>
                                <span className="status-label">{__('Necesidades', 'economilenial-budget')}</span>
                                <span className="status-value">{calculations.porcentajesActuales.necesidades.toFixed(1)}%</span>
                            </div>
                            <div className={`status-item semaforo-${calculations.semaforoColors.deseos}`}>
                                <span className="status-icon">🛍️</span>
                                <span className="status-label">{__('Deseos', 'economilenial-budget')}</span>
                                <span className="status-value">{calculations.porcentajesActuales.deseos.toFixed(1)}%</span>
                            </div>
                            <div className={`status-item semaforo-${calculations.semaforoColors.ahorroInversion}`}>
                                <span className="status-icon">💰</span>
                                <span className="status-label">{__('Ahorro/Inversión', 'economilenial-budget')}</span>
                                <span className="status-value">{calculations.porcentajesActuales.ahorroInversion.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Herramientas de guardado */}
            <div className="save-tools">
                <h4>💾 {__('Guardar Presupuesto', 'economilenial-budget')}</h4>
                <div className="save-section">
                    <button 
                        onClick={handleSave}
                        className="btn btn-primary"
                        disabled={isSaving}
                    >
                        {isSaving ? __('Guardando...', 'economilenial-budget') : __('💾 Guardar Presupuesto', 'economilenial-budget')}
                    </button>
                    
                    {saveStatus === 'success' && (
                        <div className="save-status success">
                            ✅ {__('Presupuesto guardado correctamente', 'economilenial-budget')}
                        </div>
                    )}
                    
                    {saveStatus === 'error' && (
                        <div className="save-status error">
                            ❌ {__('Error al guardar. Inténtalo de nuevo.', 'economilenial-budget')}
                        </div>
                    )}
                </div>
            </div>

            {/* Herramientas de exportación */}
            {showExport && (
                <div className="export-section">
                    <h4>📤 {__('Exportar Presupuesto', 'economilenial-budget')}</h4>
                    
                    {/* Selector de formato */}
                    <div className="format-selector">
                        <label className="format-option">
                            <input
                                type="radio"
                                name="export-format"
                                value="csv"
                                checked={exportFormat === 'csv'}
                                onChange={(e) => setExportFormat(e.target.value)}
                            />
                            <span className="format-info">
                                <strong>📊 CSV</strong>
                                <small>{__('Ideal para Excel y hojas de cálculo', 'economilenial-budget')}</small>
                            </span>
                        </label>
                        
                        <label className="format-option">
                            <input
                                type="radio"
                                name="export-format"
                                value="pdf"
                                checked={exportFormat === 'pdf'}
                                onChange={(e) => setExportFormat(e.target.value)}
                            />
                            <span className="format-info">
                                <strong>📄 PDF</strong>
                                <small>{__('Reporte completo con gráficos y consejos', 'economilenial-budget')}</small>
                            </span>
                        </label>
                    </div>
                    
                    {/* Botón de exportación */}
                    <button 
                        onClick={handleExport}
                        className="btn btn-secondary btn-large"
                        disabled={isExporting}
                    >
                        {isExporting ? 
                            __('Exportando...', 'economilenial-budget') : 
                            `📥 ${__('Descargar', 'economilenial-budget')} ${exportFormat.toUpperCase()}`
                        }
                    </button>
                </div>
            )}

            {/* Próximos pasos */}
            <div className="next-steps">
                <h4>🚀 {__('Próximos Pasos Recomendados', 'economilenial-budget')}</h4>
                <ul className="steps-list">
                    <li>📅 {__('Revisa tu presupuesto cada 15 días', 'economilenial-budget')}</li>
                    <li>📱 {__('Usa apps de seguimiento de gastos', 'economilenial-budget')}</li>
                    <li>🎯 {__('Ajusta las categorías según tu realidad', 'economilenial-budget')}</li>
                    <li>💡 {__('Automatiza tus ahorros cuando sea posible', 'economilenial-budget')}</li>
                    <li>📚 {__('Continúa aprendiendo sobre finanzas personales', 'economilenial-budget')}</li>
                </ul>
            </div>

            {/* Navegación */}
            <div className="step-navigation-buttons">
                <button onClick={onPrev} className="btn btn-secondary">
                    ← {__('Volver a Ajustes', 'economilenial-budget')}
                </button>
                <button 
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                >
                    {__('Crear Nuevo Presupuesto', 'economilenial-budget')} 🔄
                </button>
            </div>
        </div>
    );
};

export default ExportTools;
