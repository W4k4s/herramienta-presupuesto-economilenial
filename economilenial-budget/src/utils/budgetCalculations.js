/**
 * Utilidades para cálculos de presupuesto
 * Implementa la lógica de la regla 50-30-20
 */

/**
 * Validar datos del presupuesto
 */
export const validateBudgetData = (budgetData) => {
    const errors = [];
    const warnings = [];

    // Validar que hay ingresos
    if (!budgetData.ingresos || budgetData.ingresos.length === 0) {
        errors.push('Debes agregar al menos una fuente de ingresos');
    }

    // Calcular totales
    const ingresoTotal = budgetData.ingresos.reduce((total, ingreso) => {
        return total + (parseFloat(ingreso.cantidad) || 0);
    }, 0);

    const gastoTotal = Object.values(budgetData.gastos).reduce((total, categoria) => {
        return total + categoria.reduce((catTotal, gasto) => {
            return catTotal + (parseFloat(gasto.cantidad) || 0);
        }, 0);
    }, 0);

    // Validar equilibrio
    if (gastoTotal > ingresoTotal) {
        errors.push(`Gastos (${gastoTotal.toFixed(2)}€) superan ingresos (${ingresoTotal.toFixed(2)}€)`);
    }

    // Validar regla 50-30-20
    if (ingresoTotal > 0) {
        const porcentajes = calculatePercentages(budgetData);
        
        if (Math.abs(porcentajes.necesidades - 50) > 10) {
            warnings.push('Necesidades muy alejadas del 50% recomendado');
        }
        
        if (Math.abs(porcentajes.deseos - 30) > 10) {
            warnings.push('Deseos muy alejados del 30% recomendado');
        }
        
        if (Math.abs(porcentajes.ahorroInversion - 20) > 10) {
            warnings.push('Ahorro/Inversión muy alejado del 20% recomendado');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

/**
 * Calcular porcentajes por categoría
 */
export const calculatePercentages = (budgetData) => {
    const ingresoTotal = budgetData.ingresos.reduce((total, ingreso) => {
        return total + (parseFloat(ingreso.cantidad) || 0);
    }, 0);

    if (ingresoTotal === 0) {
        return { necesidades: 0, deseos: 0, ahorroInversion: 0 };
    }

    const gastosPorCategoria = {
        necesidades: budgetData.gastos.necesidades?.reduce((total, gasto) => {
            return total + (parseFloat(gasto.cantidad) || 0);
        }, 0) || 0,
        deseos: budgetData.gastos.deseos?.reduce((total, gasto) => {
            return total + (parseFloat(gasto.cantidad) || 0);
        }, 0) || 0,
        ahorroInversion: budgetData.gastos.ahorroInversion?.reduce((total, gasto) => {
            return total + (parseFloat(gasto.cantidad) || 0);
        }, 0) || 0
    };

    return {
        necesidades: (gastosPorCategoria.necesidades / ingresoTotal) * 100,
        deseos: (gastosPorCategoria.deseos / ingresoTotal) * 100,
        ahorroInversion: (gastosPorCategoria.ahorroInversion / ingresoTotal) * 100
    };
};

/**
 * Formatear moneda
 */
export const formatCurrency = (amount, currency = '€') => {
    const numAmount = parseFloat(amount) || 0;
    return `${numAmount.toFixed(2)}${currency}`;
};

/**
 * Generar datos para gráficos
 */
export const generateChartData = (budgetData) => {
    const gastosPorCategoria = {
        necesidades: budgetData.gastos.necesidades?.reduce((total, gasto) => {
            return total + (parseFloat(gasto.cantidad) || 0);
        }, 0) || 0,
        deseos: budgetData.gastos.deseos?.reduce((total, gasto) => {
            return total + (parseFloat(gasto.cantidad) || 0);
        }, 0) || 0,
        ahorroInversion: budgetData.gastos.ahorroInversion?.reduce((total, gasto) => {
            return total + (parseFloat(gasto.cantidad) || 0);
        }, 0) || 0
    };

    return [
        {
            name: 'Necesidades',
            value: gastosPorCategoria.necesidades,
            ideal: 50,
            color: '#37B8AF'
        },
        {
            name: 'Deseos',
            value: gastosPorCategoria.deseos,
            ideal: 30,
            color: '#0F4C5C'
        },
        {
            name: 'Ahorro/Inversión',
            value: gastosPorCategoria.ahorroInversion,
            ideal: 20,
            color: '#E8F4F8'
        }
    ];
};

/**
 * Detectar errores comunes
 */
export const detectCommonErrors = (budgetData) => {
    const errors = [];
    
    // Verificar gastos variables altos
    const gastosVariables = budgetData.gastos.deseos?.filter(gasto => 
        ['entretenimiento', 'compras', 'salidas'].includes(gasto.categoria?.toLowerCase())
    ) || [];
    
    const totalVariables = gastosVariables.reduce((total, gasto) => total + gasto.cantidad, 0);
    const ingresoTotal = budgetData.ingresos.reduce((total, ingreso) => total + ingreso.cantidad, 0);
    
    if (ingresoTotal > 0 && (totalVariables / ingresoTotal) > 0.3) {
        errors.push({
            type: 'high_variables',
            message: 'Tus gastos variables superan el 30% - considera reducirlos',
            category: 'deseos'
        });
    }
    
    // Verificar si falta alguna categoría importante
    const conceptosNecesidades = budgetData.gastos.necesidades?.map(g => g.concepto.toLowerCase()) || [];
    const conceptosBasicos = ['vivienda', 'alimentacion', 'transporte', 'seguros'];
    
    conceptosBasicos.forEach(concepto => {
        const existe = conceptosNecesidades.some(c => c.includes(concepto));
        if (!existe) {
            errors.push({
                type: 'missing_basic',
                message: `Considera agregar gastos de ${concepto}`,
                category: 'necesidades'
            });
        }
    });
    
    return errors;
};
