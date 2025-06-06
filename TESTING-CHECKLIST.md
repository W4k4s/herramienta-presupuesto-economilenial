# ✅ Lista de Verificación - Testing del Plugin

## 🔧 Preparación
- [ ] WordPress local funcionando
- [ ] Plugin copiado a `/wp-content/plugins/economilenial-budget/`
- [ ] Build ejecutado: `npm run build`

## 🚀 Testing Básico

### 1. Activación del Plugin
- [ ] Ir a WordPress Admin → Plugins
- [ ] Verificar que aparece "Economilenial Presupuesto Mensual"
- [ ] Activar el plugin sin errores
- [ ] No debe mostrar errores PHP

### 2. Testing del Bloque Gutenberg
- [ ] Crear nueva página/entrada
- [ ] Buscar bloque "Presupuesto Economilenial"
- [ ] Insertar el bloque
- [ ] Verificar que se renderiza correctamente
- [ ] Configurar opciones en el sidebar

### 3. Testing del Shortcode
- [ ] En una página, insertar: `[economilenial_presupuesto]`
- [ ] Verificar que se muestra la interfaz
- [ ] Probar con opciones: `[economilenial_presupuesto theme="compact"]`

### 4. Testing de Funcionalidad
- [ ] Ingresar datos de ingresos
- [ ] Agregar gastos por categorías
- [ ] Verificar cálculo 50-30-20
- [ ] Probar semáforo de colores (verde/ámbar/rojo)
- [ ] Testear alertas de errores

### 5. Testing de Exportación
- [ ] Llenar datos completos
- [ ] Probar exportar a CSV
- [ ] Probar exportar a PDF (si disponible)

### 6. Testing Responsive
- [ ] Verificar en móvil (DevTools)
- [ ] Probar en tablet
- [ ] Verificar en escritorio

## 🐛 Errores Comunes a Verificar

### JavaScript
- [ ] Abrir DevTools → Console
- [ ] No debe haber errores JavaScript
- [ ] Verificar que React carga correctamente

### PHP
- [ ] Activar WP_DEBUG en wp-config.php
- [ ] Verificar logs de PHP por errores
- [ ] Comprobar que REST API funciona

### Estilos
- [ ] CSS se carga correctamente
- [ ] No hay conflictos con tema activo
- [ ] Responsive funciona bien

## 📊 Testing API REST

### Endpoints a probar (con herramienta como Postman):
- [ ] GET `/wp-json/economilenial/v1/budget`
- [ ] POST `/wp-json/economilenial/v1/budget` (con datos)
- [ ] POST `/wp-json/economilenial/v1/budget/export`

## ✅ Criterios de Éxito
- [ ] Plugin se activa sin errores
- [ ] Bloque aparece en Gutenberg
- [ ] Shortcode funciona en frontend
- [ ] JavaScript no tiene errores
- [ ] Interfaz es responsive
- [ ] Datos se guardan correctamente
- [ ] Exportación funciona
- [ ] No hay conflictos con otros plugins

## 🚨 Si algo falla:
1. Verificar logs: `/wp-content/debug.log`
2. DevTools → Console para errores JS
3. Verificar que `npm run build` funcionó
4. Comprobar permisos de archivos
5. Revisar que PHP >= 8.0

---
**Recuerda:** Siempre hacer `npm run build` después de cambios en /src/
