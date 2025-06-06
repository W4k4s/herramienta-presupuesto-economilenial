#!/bin/bash

# Script de instalación para Economilenial Budget Plugin
# Ejecutar desde el directorio del plugin

echo "🚀 Instalando Economilenial Budget Plugin..."

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    echo "👉 Visita: https://nodejs.org/"
    exit 1
fi

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "✅ Node.js y npm detectados"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas correctamente"

# Compilar assets
echo "🔨 Compilando assets..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error compilando assets"
    exit 1
fi

echo "✅ Assets compilados correctamente"

# Crear directorio build si no existe
mkdir -p build

echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Subir la carpeta completa a /wp-content/plugins/"
echo "2. Activar el plugin en WordPress Admin → Plugins"
echo "3. Usar el bloque 'Presupuesto Economilenial' en Gutenberg"
echo "4. O usar el shortcode [economilenial_presupuesto]"
echo ""
echo "📚 Documentación completa en README.md"
echo "🎨 Personalizar colores en src/style.scss"
echo "🌐 Traducir textos en languages/"
echo ""
echo "¡Feliz presupuesteo! 💰"
