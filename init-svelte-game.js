// Script de inicialización para el juego Svelte
document.addEventListener("DOMContentLoaded", function() {
  console.log("Inicializando juego Svelte...");
  
  // Verificar si el contenedor existe
  const container = document.getElementById('flappy-braves-game-container');
  
  if (!container) {
    console.error("No se encontró el contenedor del juego");
    return;
  }
  
  // Inicializar el juego manualmente si es necesario
  try {
    // Importar el módulo de Svelte
    import('./svelte-game/public/build/bundle.js')
      .then(module => {
        console.log("Módulo Svelte cargado correctamente:", module);
      })
      .catch(error => {
        console.error("Error al cargar el módulo Svelte:", error);
      });
  } catch (error) {
    console.error("Error al inicializar el juego Svelte:", error);
  }
}); 