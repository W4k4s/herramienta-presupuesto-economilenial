/**
 * Hook personalizado para cálculos de presupuesto
 * Implementa la lógica de la regla 50-30-20
 * Basado en las lecciones 2-1 → 2-4 del curso Economilenial
 */

import { useMemo } from 'react';

const useBudgetCalculations = (budgetData) => {
    return useMemo(() => {
        // Calcular ingreso total
        const ingresoTotal = budgetData.ingresos.reduce((total, ingreso) => {
            return total + (parseFloat(ingreso.cantidad) || 0);
        }, 0);

        // Calcular gastos por categoría
        const gastosPorCategoria = {
            necesidades: budgetData.gastos.necesidades.reduce((total, gasto) => {
                return total + (parseFloat(gasto.cantidad) || 0);
            }, 0),
            deseos: budgetData.gastos.deseos.reduce((total, gasto) => {
                return total + (parseFloat(gasto.cantidad) || 0);
            }, 0),
            ahorroInversion: budgetData.gastos.ahorroInversion.reduce((total, gasto) => {
                return total + (parseFloat(gasto.cantidad) || 0);
            }, 0)
        };

        // Calcular gasto total
        const gastoTotal = Object.values(gastosPorCategoria).reduce((total, gasto) => total + gasto, 0);

        // Calcular porcentajes actuales
        const porcentajesActuales = {
            necesidades: ingresoTotal > 0 ? (gastosPorCategoria.necesidades / ingresoTotal) * 100 : 0,
            deseos: ingresoTotal > 0 ? (gastosPorCategoria.deseos / ingresoTotal) * 100 : 0,
            ahorroInversion: ingresoTotal > 0 ? (gastosPorCategoria.ahorroInversion / ingresoTotal) * 100 : 0
        };

        // Calcular diferencias con la regla 50-30-20
        const diferenciasRegla = {
            necesidades: porcentajesActuales.necesidades - 50,
            deseos: porcentajesActuales.deseos - 30,
            ahorroInversion: porcentajesActuales.ahorroInversion - 20
        };

        // Calcular colores del semáforo (basado en lección 2-3)
        const getSemaforoColor = (diferencia) => {
            const absDiff = Math.abs(diferencia);
            if (absDiff <= 2) return 'green';  // ±2 puntos porcentuales
            if (absDiff <= 5) return 'amber';  // 2-5 puntos porcentuales
            return 'red';  // >5 puntos porcentuales
        };

        const semaforoColors = {
            necesidades: getSemaforoColor(diferenciasRegla.necesidades),
            deseos: getSemaforoColor(diferenciasRegla.deseos),
            ahorroInversion: getSemaforoColor(diferenciasRegla.ahorroInversion)
        };

        // Calcular montos ideales según 50-30-20
        const montosIdeales = {
            necesidades: ingresoTotal * 0.50,
            deseos: ingresoTotal * 0.30,
            ahorroInversion: ingresoTotal * 0.20
        };

        // Diferencia en dinero
        const diferenciasMonetarias = {
            necesidades: gastosPorCategoria.necesidades - montosIdeales.necesidades,
            deseos: gastosPorCategoria.deseos - montosIdeales.deseos,
            ahorroInversion: gastosPorCategoria.ahorroInversion - montosIdeales.ahorroInversion
        };

        // Balance general
        const balance = ingresoTotal - gastoTotal;
        const balanceStatus = balance === 0 ? 'equilibrado' : balance > 0 ? 'superavit' : 'deficit';

        // Consejos personalizados (basado en lecciones del curso)
        const generateConsejos = () => {
            const consejos = [];

            if (semaforoColors.necesidades === 'red') {
                if (diferenciasRegla.necesidades > 0) {
                    consejos.push('🚨 Tus gastos básicos superan el 50%. Revisa si hay gastos que realmente son "deseos" disfrazados.');
                } else {
                    consejos.push('✨ ¡Genial! Tienes margen en necesidades. Considera aumentar tu ahorro.');
                }
            }

            if (semaforoColors.deseos === 'red') {
                consejos.push('🛍️ Tus gastos en deseos están altos. Recuerda: la regla 50-30-20 te ayuda a disfrutar sin comprometer tu futuro.');
            }

            if (semaforoColors.ahorroInversion === 'red') {
                consejos.push('💰 Tu ahorro está por debajo del 20%. Este es tu "yo del futuro" agradeciéndotelo por adelantado.');
            }

            return consejos;
        };

        return {
            ingresoTotal,
            gastosPorCategoria,
            gastoTotal,
            porcentajesActuales,
            diferenciasRegla,
            semaforoColors,
            montosIdeales,
            diferenciasMonetarias,
            balance,
            balanceStatus,
            consejos: generateConsejos()
        };
    }, [budgetData]);
};

export default useBudgetCalculations;
