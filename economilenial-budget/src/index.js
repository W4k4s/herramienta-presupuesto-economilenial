/**
 * Archivo principal del bloque Economilenial Budget
 * Registra el bloque Gutenberg y exporta el componente frontend
 */

import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

// Componentes
import BudgetApp from './components/BudgetApp';
import BudgetIcon from './components/BudgetIcon';

// Estilos
import './style.scss';

/**
 * Registrar el bloque Gutenberg
 */
registerBlockType('economilenial/budget', {
    title: __('Presupuesto Economilenial', 'economilenial-budget'),
    description: __('Herramienta interactiva para gestionar presupuestos mensuales con la regla 50-30-20', 'economilenial-budget'),
    category: 'widgets',
    icon: BudgetIcon,
    keywords: [
        __('presupuesto', 'economilenial-budget'),
        __('finanzas', 'economilenial-budget'),
        __('economilenial', 'economilenial-budget'),
        __('50-30-20', 'economilenial-budget')
    ],
    supports: {
        html: false,
        align: ['wide', 'full'],
        spacing: {
            margin: true,
            padding: true
        }
    },
    attributes: {
        theme: {
            type: 'string',
            default: 'default'
        },
        showExport: {
            type: 'boolean',
            default: true
        },
        showTips: {
            type: 'boolean',
            default: true
        }
    },
    
    /**
     * Editor del bloque (Gutenberg)
     */
    edit: function(props) {
        const { attributes, setAttributes } = props;
        
        return (
            <div className="economilenial-budget-editor">
                <div className="economilenial-budget-preview">
                    <h3>{__('Vista previa del Presupuesto Economilenial', 'economilenial-budget')}</h3>
                    <p>{__('Esta herramienta aparecerá aquí en el frontend', 'economilenial-budget')}</p>
                    
                    {/* Controles del bloque */}
                    <div className="economilenial-budget-controls">
                        <label>
                            <input
                                type="checkbox"
                                checked={attributes.showExport}
                                onChange={(e) => setAttributes({ showExport: e.target.checked })}
                            />
                            {__('Mostrar opciones de exportación', 'economilenial-budget')}
                        </label>
                        
                        <label>
                            <input
                                type="checkbox"
                                checked={attributes.showTips}
                                onChange={(e) => setAttributes({ showTips: e.target.checked })}
                            />
                            {__('Mostrar consejos educativos', 'economilenial-budget')}
                        </label>
                    </div>
                </div>
            </div>
        );
    },
    
    /**
     * Frontend del bloque (se renderiza en PHP)
     */
    save: function() {
        return null; // Se renderiza dinámicamente en PHP
    }
});

/**
 * Inicializar aplicación React en frontend
 */
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Buscar todos los contenedores del presupuesto
        const containers = document.querySelectorAll('.economilenial-budget-container');
        
        containers.forEach(container => {
            const containerId = container.id;
            const budgetData = window.economileniaBudgetData?.[containerId];
            
            if (budgetData && window.wp?.element) {
                const { render } = window.wp.element;
                
                // Renderizar la aplicación React
                render(
                    <BudgetApp 
                        {...budgetData}
                        containerId={containerId}
                    />, 
                    container
                );
            }
        });
    });
}
