#!/bin/bash

# Script de instalación mejorado para Economilenial Budget Plugin

echo "🚀 Instalando Economilenial Budget Plugin (Optimizado)..."

# Verificar dependencias
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ Node.js y npm detectados"

# Limpiar e instalar
echo "🧹 Limpiando instalación previa..."
rm -rf node_modules package-lock.json

echo "📦 Instalando dependencias..."
npm install --legacy-peer-deps

# Corregir vulnerabilidades
echo "🔒 Corrigiendo vulnerabilidades..."
npm audit fix --force

# Compilar
echo "🔨 Compilando assets..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error compilando"
    exit 1
fi

echo ""
echo "🎉 ¡Instalación completada!"
echo "📋 Próximos pasos:"
echo "1. Subir a /wp-content/plugins/"
echo "2. Activar en WordPress Admin"
echo "3. ¡Usar el bloque Economilenial!"
echo ""
echo "🛠️ Scripts útiles:"
echo "   npm run build:analyze  - Analizar bundle"
echo "   npm run security-check - Verificar seguridad"
