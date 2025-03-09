#!/bin/bash

# Script para compilar el juego Svelte

echo "Compilando el juego Svelte..."

# Entrar al directorio del juego Svelte
cd svelte-game

# Instalar dependencias si no están instaladas
if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias..."
  npm install
fi

# Compilar el juego
echo "Compilando..."
npm run build

echo "¡Compilación completada!"
echo "El juego Svelte está listo para ser usado en la web." 