#!/bin/bash

echo "🚀 Instalando Economilenial Budget Plugin..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "✅ Node.js y npm detectados"

# Limpiar instalación previa
echo "🧹 Limpiando..."
rm -rf node_modules package-lock.json build/

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "🔧 Instalación básica..."
    npm install @wordpress/scripts@latest --save-dev --legacy-peer-deps
    npm install @wordpress/block-editor@latest @wordpress/blocks@latest @wordpress/components@latest @wordpress/element@latest @wordpress/i18n@latest recharts@latest jspdf@latest --save --legacy-peer-deps
fi

# Compilar
echo "🔨 Compilando..."
npm run build || npx wp-scripts build

# Verificar
if [ -f "build/index.js" ]; then
    BUNDLE_SIZE=$(wc -c < "build/index.js")
    BUNDLE_SIZE_KB=$((BUNDLE_SIZE / 1024))
    echo "✅ Compilado! Bundle: ${BUNDLE_SIZE_KB} KB"
    echo ""
    echo "📋 Copiar a WordPress:"
    echo "cp -r economilenial-budget/ /path/to/wordpress/wp-content/plugins/"
else
    echo "❌ Error en compilación"
    exit 1
fi
