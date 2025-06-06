# 🎯 Economilenial Presupuesto Mensual

Plugin de WordPress para gestión de presupuestos mensuales usando la regla 50-30-20. Incluye bloque Gutenberg, shortcode, alertas inteligentes y exportación.

## 🚀 Características

- ✅ **Bloque Gutenberg** interactivo
- ✅ **Shortcode** `[economilenial_presupuesto]` para cualquier página
- ✅ **Regla 50-30-20** con semáforo visual
- ✅ **Alertas inteligentes** para errores comunes
- ✅ **Exportación** CSV y PDF
- ✅ **Responsive** mobile-first
- ✅ **Persistencia** localStorage + base de datos
- ✅ **Internacionalización** lista

## 📋 Requisitos

- WordPress 6.0+
- PHP 8.0+
- Node.js 16+ (para desarrollo)

## 🛠️ Instalación

### Desarrollo

1. **Clonar en tu directorio de plugins:**
```bash
cd wp-content/plugins/
git clone [tu-repo] economilenial-budget
cd economilenial-budget
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Compilar assets:**
```bash
npm run build
```

4. **Activar el plugin** en WordPress Admin

### Producción

1. Subir la carpeta `economilenial-budget` a `/wp-content/plugins/`
2. Activar en WordPress Admin → Plugins

## 🎨 Personalización

### Colores de Marca

Edita `/src/style.scss` líneas 8-16:

```scss
// 🎨 PERSONALIZA AQUÍ TUS COLORES DE MARCA
$primary-color: #37B8AF;      // Tu color principal
$secondary-color: #0F4C5C;    // Tu color secundario
$background-color: #FFFFFF;   // Fondo
```

### Textos y Traducciones

Busca en los componentes las funciones:
```javascript
__('Texto a personalizar', 'economilenial-budget')
```

## 📖 Uso

### Como Bloque Gutenberg

1. Crear/editar página o entrada
2. Agregar bloque "Presupuesto Economilenial"
3. Configurar opciones en sidebar
4. Publicar

### Como Shortcode

```php
// Básico
[economilenial_presupuesto]

// Con opciones
[economilenial_presupuesto theme="compact" show_export="false"]
```

### Programáticamente

```php
// Renderizar en template
echo do_shortcode('[economilenial_presupuesto]');
```

## 🏗️ Arquitectura

```
economilenial-budget/
├── economilenial-budget.php    # Plugin principal
├── includes/
│   └── class-rest-api.php      # REST API endpoints
├── src/
│   ├── components/             # Componentes React
│   ├── hooks/                  # Hooks personalizados
│   ├── utils/                  # Utilidades
│   └── style.scss             # Estilos principales
├── build/                      # Assets compilados
└── languages/                  # Traducciones
```

## 🔌 API REST

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/wp-json/economilenial/v1/budget` | Obtener presupuesto |
| `POST` | `/wp-json/economilenial/v1/budget` | Guardar presupuesto |
| `POST` | `/wp-json/economilenial/v1/budget/export` | Exportar CSV/PDF |

### Ejemplo de uso

```javascript
// Obtener presupuesto del usuario actual
fetch('/wp-json/economilenial/v1/budget', {
    headers: {
        'X-WP-Nonce': wpApiSettings.nonce
    }
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🎛️ Hooks de Extensión

### PHP

```php
// Modificar datos antes de guardar
add_filter('economilenial_budget_before_save', function($budget_data) {
    // Tu lógica personalizada
    return $budget_data;
});

// Agregar campos personalizados
add_action('economilenial_budget_form_fields', function() {
    echo '<div>Campo personalizado</div>';
});
```

### JavaScript

```javascript
// Modificar cálculos
wp.hooks.addFilter(
    'economilenial.budget.calculations',
    'mi-plugin',
    function(calculations, budgetData) {
        // Tu lógica personalizada
        return calculations;
    }
);
```

## 📊 Base de Datos

### Tabla: wp_economilenial_budget

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | mediumint(9) | ID único |
| `user_id` | bigint(20) | ID del usuario |
| `budget_data` | longtext | Datos JSON del presupuesto |
| `created_at` | datetime | Fecha de creación |
| `updated_at` | datetime | Última actualización |

## 🎯 Regla 50-30-20

### Implementación

El plugin implementa la regla financiera 50-30-20:

- **50% Necesidades:** Vivienda, alimentación, transporte, seguros
- **30% Deseos:** Entretenimiento, hobbies, compras no esenciales  
- **20% Ahorro/Inversión:** Ahorro, inversiones, deudas

### Semáforo Visual

- 🟢 **Verde:** ±2 puntos porcentuales del ideal
- 🟡 **Ámbar:** 2-5 puntos porcentuales de diferencia
- 🔴 **Rojo:** >5 puntos porcentuales de diferencia

## ⚡ Performance

- **Carga inicial:** < 150 KB gzip
- **Lighthouse Performance:** > 90
- **Core Web Vitals:** Optimizado
- **Lazy loading:** Componentes bajo demanda

## 🔧 Desarrollo

### Scripts disponibles

```bash
npm run dev          # Desarrollo con watch
npm run build        # Build producción
npm run lint:js      # Linter JavaScript
npm run lint:css     # Linter CSS
npm run format       # Formatear código
npm run test         # Tests unitarios
```

### Estructura de componentes

```
src/components/
├── BudgetApp.js           # Componente principal
├── StepNavigation.js      # Navegación pasos
├── IncomeStep.js          # Paso 1: Ingresos
├── ExpenseStep.js         # Paso 2: Gastos
├── BudgetVisualization.js # Paso 3: Análisis
├── BudgetAdjustment.js    # Paso 4: Ajustes
├── ExportTools.js         # Paso 5: Exportar
└── AlertSystem.js         # Sistema de alertas
```

## 🌐 Internacionalización

### Agregar traducciones

1. Generar archivo .pot:
```bash
wp i18n make-pot . languages/economilenial-budget.pot
```

2. Crear archivo de idioma (ej: `es_ES.po`)
3. Compilar: `msgfmt es_ES.po -o es_ES.mo`

### Strings importantes

- `economilenial-budget` - Text domain
- Todos los textos usan `__('texto', 'economilenial-budget')`

## 🐛 Debug

### Logs

```php
// Habilitar debug en wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

// Ver logs del plugin
error_log('Economilenial Budget: ' . print_r($data, true));
```

### Herramientas

- **React DevTools** para componentes
- **Redux DevTools** para estado (si usas Redux)
- **Network tab** para peticiones API

## 📝 Changelog

### v1.0.0
- Lanzamiento inicial
- Bloque Gutenberg
- Shortcode
- REST API
- Exportación CSV/PDF
- Sistema de alertas

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

GPL v2 or later - igual que WordPress

## 🙋‍♀️ Soporte

- **Documentación:** Este README
- **Issues:** GitHub Issues
- **Email:** soporte@economilenial.com

---

**Desarrollado con ❤️ para la comunidad Economilenial**
