// Script para depurar la carga del juego Svelte
console.log("Iniciando depuración del juego Svelte...");

// Verificar si el contenedor existe
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById('flappy-braves-game-container');
  
  if (container) {
    console.log("Contenedor del juego encontrado:", container);
  } else {
    console.error("ERROR: No se encontró el contenedor del juego #flappy-braves-game-container");
  }
  
  // Verificar si el script de Svelte se cargó
  const scriptLoaded = Array.from(document.scripts).some(script => 
    script.src.includes('svelte-game/public/build/bundle.js')
  );
  
  if (scriptLoaded) {
    console.log("Script de Svelte cargado correctamente");
  } else {
    console.error("ERROR: El script de Svelte no se cargó correctamente");
  }
  
  // Verificar si hay errores de carga
  window.addEventListener('error', function(e) {
    console.error("Error de carga detectado:", e.message, e.filename);
  });
}); 