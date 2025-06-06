#!/bin/bash
# Script de instalación de emergencia simplificado

echo "🆘 Instalación de emergencia - Economilenial Budget"

# Limpiar todo
rm -rf node_modules package-lock.json build/ .npmrc

# Instalación más básica posible
echo "📦 Instalando @wordpress/scripts..."
npm install @wordpress/scripts@26.19.0 --save-dev

echo "📦 Instalando dependencias básicas..."
npm install @wordpress/block-editor@12.26.0 --save
npm install @wordpress/blocks@12.26.0 --save
npm install @wordpress/components@25.16.0 --save
npm install @wordpress/element@5.26.0 --save
npm install @wordpress/i18n@4.59.0 --save
npm install recharts@2.8.0 --save
npm install jspdf@2.5.1 --save

echo "🔨 Compilando..."
./node_modules/.bin/wp-scripts build

if [ -f "build/index.js" ]; then
    echo "✅ ¡Éxito!"
    ls -la build/
else
    echo "❌ Falló"
fi
