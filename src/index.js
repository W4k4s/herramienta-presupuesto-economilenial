/**
 * Plugin principal simplificado - Economilenial Budget
 */

import './style.scss';

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { createElement } from '@wordpress/element';
import BudgetDemo from './components/BudgetAppSimple';

// Icono simple
const budgetIcon = createElement('svg', {
    width: 24, height: 24, viewBox: '0 0 24 24'
}, 
    createElement('circle', { cx: 12, cy: 12, r: 10, fill: '#37B8AF' }),
    createElement('text', { x: 12, y: 16, textAnchor: 'middle', fill: 'white', fontSize: 12 }, '€')
);

/**
 * Registrar bloque Gutenberg
 */
registerBlockType('economilenial/budget', {
    title: __('Presupuesto Economilenial', 'economilenial-budget'),
    description: __('Demo de presupuesto con regla 50-30-20', 'economilenial-budget'),
    category: 'widgets',
    icon: budgetIcon,
    keywords: [__('presupuesto', 'economilenial-budget'), __('finanzas', 'economilenial-budget')],
    
    edit: function() {
        return createElement('div', 
            { 
                style: { 
                    padding: '20px', border: '2px dashed #37B8AF', 
                    borderRadius: '8px', textAlign: 'center' 
                } 
            },
            createElement('h3', {}, __('Vista previa: Presupuesto Economilenial', 'economilenial-budget')),
            createElement('p', {}, __('Este bloque se mostrará aquí en el frontend', 'economilenial-budget'))
        );
    },
    
    save: function() {
        return null; // Renderizado dinámico en PHP
    }
});

/**
 * Renderizar en frontend
 */
document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.economilenial-budget-container');
    
    containers.forEach(container => {
        if (window.wp && window.wp.element) {
            const { render } = window.wp.element;
            render(createElement(BudgetDemo), container);
        }
    });
});
