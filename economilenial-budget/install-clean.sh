#!/bin/bash

echo "🚀 Instalación ULTRA-SIMPLE - Economilenial Budget"

# Limpiar todo
echo "🧹 Limpiando..."
rm -rf node_modules package-lock.json build/ .npmrc

# Instalar SOLO lo esencial
echo "📦 Instalando solo dependencias esenciales..."
npm install @wordpress/scripts@26.19.0 --save-dev --no-audit
npm install @wordpress/blocks@12.26.0 --save --no-audit
npm install @wordpress/block-editor@12.26.0 --save --no-audit
npm install @wordpress/components@25.16.0 --save --no-audit
npm install @wordpress/element@5.26.0 --save --no-audit
npm install @wordpress/i18n@4.57.0 --save --no-audit

# Compilar
echo "🔨 Compilando versión simplificada..."
npx wp-scripts build

# Verificar
if [ -f "build/index.js" ]; then
    SIZE=$(wc -c < "build/index.js")
    SIZE_KB=$((SIZE / 1024))
    echo "✅ ¡Éxito! Bundle: ${SIZE_KB} KB"
    echo ""
    echo "📁 Archivos generados:"
    ls -la build/
    echo ""
    echo "🎯 Plugin listo para WordPress!"
    echo "   Copiar toda la carpeta a /wp-content/plugins/"
else
    echo "❌ Error en compilación"
    exit 1
fi
