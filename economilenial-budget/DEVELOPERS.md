# 🛠️ Guía para Desarrolladores

## Arquitectura del Plugin

### Estructura de Archivos

```
economilenial-budget/
├── economilenial-budget.php          # Plugin principal
├── block.json                        # Metadatos del bloque
├── includes/
│   └── class-rest-api.php            # API REST
├── src/
│   ├── index.js                      # Entry point
│   ├── style.scss                    # Estilos principales
│   ├── components/                   # Componentes React
│   │   ├── BudgetApp.js             # App principal
│   │   ├── StepNavigation.js        # Navegación
│   │   ├── IncomeStep.js            # Paso 1: Ingresos
│   │   ├── ExpenseStep.js           # Paso 2: Gastos
│   │   ├── BudgetVisualization.js   # Paso 3: Análisis
│   │   ├── BudgetAdjustment.js      # Paso 4: Ajustes
│   │   ├── ExportTools.js           # Paso 5: Exportar
│   │   └── AlertSystem.js           # Sistema alertas
│   ├── hooks/                       # Hooks personalizados
│   │   ├── useLocalStorage.js       # Persistencia local
│   │   └── useBudgetCalculations.js # Cálculos 50-30-20
│   └── utils/                       # Utilidades
│       └── budgetCalculations.js    # Funciones auxiliares
└── languages/                       # Traducciones
```

## 🎯 Puntos de Personalización

### 1. Colores de Marca

**Archivo:** `src/style.scss` (líneas 8-16)

```scss
// 🎨 PERSONALIZA AQUÍ TUS COLORES DE MARCA
$primary-color: #37B8AF;      // Color principal
$secondary-color: #0F4C5C;    // Color secundario
$success-color: #28A745;      // Verde semáforo
$warning-color: #FFC107;      // Ámbar semáforo
$danger-color: #DC3545;       // Rojo semáforo
```

### 2. Textos y Microcopy

**Buscar en componentes:** Funciones `__('texto', 'economilenial-budget')`

Ejemplos principales:
- `src/components/BudgetApp.js:95` - Título principal
- `src/components/IncomeStep.js:52` - Subtítulos de pasos
- `src/components/ExpenseStep.js:34-56` - Descripciones de categorías

### 3. Lógica de Cálculos

**Archivo:** `src/hooks/useBudgetCalculations.js`

```javascript
// Basado en las lecciones 2-1 → 2-4 del curso Economilenial
const montosIdeales = {
    necesidades: ingresoTotal * 0.50,     // 50%
    deseos: ingresoTotal * 0.30,          // 30%
    ahorroInversion: ingresoTotal * 0.20  // 20%
};
```

### 4. Tolerancias del Semáforo

**Archivo:** `src/hooks/useBudgetCalculations.js:48-53`

```javascript
const getSemaforoColor = (diferencia) => {
    const absDiff = Math.abs(diferencia);
    if (absDiff <= 2) return 'green';  // ±2 p.p.
    if (absDiff <= 5) return 'amber';  // 2-5 p.p.
    return 'red';  // >5 p.p.
};
```

## 🔌 Hooks de Extensión

### PHP Hooks

```php
// Modificar datos antes de guardar
add_filter('economilenial_budget_before_save', function($budget_data, $user_id) {
    // Tu lógica personalizada
    $budget_data['custom_field'] = 'valor';
    return $budget_data;
}, 10, 2);

// Agregar validaciones personalizadas
add_filter('economilenial_budget_validate', function($is_valid, $budget_data) {
    // Tu validación personalizada
    if ($budget_data['custom_condition']) {
        $is_valid = false;
    }
    return $is_valid;
}, 10, 2);

// Modificar respuesta de API
add_filter('economilenial_budget_api_response', function($response, $request) {
    $response['custom_data'] = get_user_meta($request['user_id'], 'custom', true);
    return $response;
}, 10, 2);
```

### JavaScript Hooks

```javascript
// Modificar cálculos
wp.hooks.addFilter(
    'economilenial.budget.calculations',
    'mi-plugin',
    function(calculations, budgetData) {
        // Agregar cálculo personalizado
        calculations.customMetric = budgetData.ingresos.length * 100;
        return calculations;
    }
);

// Agregar validaciones frontend
wp.hooks.addFilter(
    'economilenial.budget.validation',
    'mi-plugin',
    function(errors, budgetData) {
        if (budgetData.custom_condition) {
            errors.push('Error personalizado');
        }
        return errors;
    }
);
```

## 📊 Extender Categorías

### Agregar Nueva Categoría

1. **Modificar estructura de datos** en `src/components/BudgetApp.js:32-40`:

```javascript
const [budgetData, setBudgetData] = useLocalStorage('economilenial-budget', {
    ingresos: [],
    gastos: {
        necesidades: [],
        deseos: [],
        ahorroInversion: [],
        nuevaCategoria: []  // ← Agregar aquí
    },
    distribucion: {
        necesidades: 50,
        deseos: 30,
        ahorroInversion: 20,
        nuevaCategoria: 0   // ← Agregar aquí
    }
});
```

2. **Actualizar cálculos** en `src/hooks/useBudgetCalculations.js`:

```javascript
const gastosPorCategoria = {
    // ... categorías existentes
    nuevaCategoria: budgetData.gastos.nuevaCategoria.reduce((total, gasto) => {
        return total + (parseFloat(gasto.cantidad) || 0);
    }, 0)
};
```

3. **Agregar a interfaz** en `src/components/ExpenseStep.js:34-56`:

```javascript
nuevaCategoria: {
    nombre: __('Nueva Categoría (X%)', 'economilenial-budget'),
    descripcion: __('Descripción de la nueva categoría', 'economilenial-budget'),
    color: '#COLOR_HEX',
    icon: '🎯',
    ejemplos: ['Ejemplo 1', 'Ejemplo 2']
}
```

## 🎨 Personalizar Exportaciones

### Modificar Template PDF

**Archivo:** `src/components/ExportTools.js:118-200`

```javascript
// Personalizar encabezado
pdf.setFillColor(...primaryColor);
pdf.rect(0, 0, 210, 30, 'F');
pdf.text('🏢 Mi Empresa - Presupuesto', 20, 20);

// Agregar logo
const logoBase64 = 'data:image/png;base64,...';
pdf.addImage(logoBase64, 'PNG', 160, 5, 20, 20);
```

### Modificar Campos CSV

**Archivo:** `src/components/ExportTools.js:72-110`

```javascript
// Agregar campos personalizados
csvContent += 'DATOS PERSONALIZADOS\n';
csvContent += 'Campo,Valor\n';
csvContent += `Mi Campo,${data.custom_field}\n\n`;
```

## 🔍 Debugging

### Logs PHP

```php
// En wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

// En el código
error_log('Economilenial Budget: ' . print_r($data, true));
```

### Logs JavaScript

```javascript
// Usar console.log con prefijo
console.log('Economilenial Budget:', data);

// Debugging React con DevTools
if (process.env.NODE_ENV === 'development') {
    window.economileniaBudgetDebug = {
        budgetData,
        calculations,
        errors
    };
}
```

## 🧪 Testing

### Casos de Prueba Recomendados

1. **Flujo completo:** Ingresos → Gastos → Análisis → Ajustes → Exportar
2. **Validaciones:** Montos negativos, texto en campos numéricos
3. **Límites:** 0 ingresos, gastos > ingresos, categorías vacías
4. **Persistencia:** localStorage vs base de datos
5. **Responsive:** Mobile, tablet, desktop
6. **Accesibilidad:** Navegación por teclado, screen readers

### Test Unitarios

```javascript
// Ejemplo test para cálculos
import { calculatePercentages } from '../utils/budgetCalculations';

test('calculates percentages correctly', () => {
    const budgetData = {
        ingresos: [{ cantidad: 1000 }],
        gastos: {
            necesidades: [{ cantidad: 500 }],
            deseos: [{ cantidad: 300 }],
            ahorroInversion: [{ cantidad: 200 }]
        }
    };
    
    const result = calculatePercentages(budgetData);
    expect(result.necesidades).toBe(50);
    expect(result.deseos).toBe(30);
    expect(result.ahorroInversion).toBe(20);
});
```

## 🚀 Performance

### Optimizaciones Aplicadas

1. **Lazy loading:** Componentes bajo demanda
2. **Memoización:** useMemo para cálculos complejos
3. **Debouncing:** Inputs con retraso
4. **Code splitting:** Webpack chunks automáticos

### Métricas Target

- **Bundle size:** < 150 KB gzip
- **First Paint:** < 1.5s
- **Interactive:** < 2.5s
- **Lighthouse Performance:** > 90

## 📱 PWA (Futuro)

### Roadmap PWA

1. Service Worker para cache offline
2. Web App Manifest
3. Push notifications para recordatorios
4. Sincronización en background

```javascript
// Service Worker ejemplo
self.addEventListener('sync', event => {
    if (event.tag === 'budget-sync') {
        event.waitUntil(syncBudgetData());
    }
});
```

## 🔐 Seguridad

### Validaciones Implementadas

1. **Sanitización:** `wp_unslash()`, `sanitize_text_field()`
2. **Nonces:** Verificación en todas las requests
3. **Permisos:** `is_user_logged_in()` para guardado
4. **Escape:** `esc_html()`, `esc_url()` en output

### Checklist Seguridad

- [ ] Validar todos los inputs
- [ ] Escapar todos los outputs
- [ ] Verificar nonces en AJAX
- [ ] Limitar tamaño de datos
- [ ] Rate limiting en API

---

**¿Necesitas ayuda?** Contacta: dev@economilenial.com
