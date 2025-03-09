import App from './App.svelte';

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si el contenedor existe
  const container = document.getElementById('flappy-braves-game-container');
  
  if (!container) {
    console.error('No se encontró el contenedor del juego #flappy-braves-game-container');
    return;
  }
  
  console.log('Inicializando juego Svelte en el contenedor:', container);
  
  // Calcular dimensiones responsivas
  const calculateDimensions = () => {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Asegurar que el juego se ajuste al contenedor
    const gameWidth = containerWidth;
    const gameHeight = containerHeight;
    
    console.log(`Dimensiones del juego: ${gameWidth}x${gameHeight}`);
    
    return { gameWidth, gameHeight };
  };
  
  // Obtener dimensiones iniciales
  const { gameWidth, gameHeight } = calculateDimensions();
  
  // Inicializar la aplicación Svelte
  const app = new App({
    target: container,
    props: {
      gameWidth,
      gameHeight
    }
  });
  
  // Actualizar dimensiones cuando cambie el tamaño de la ventana
  window.addEventListener('resize', () => {
    const { gameWidth, gameHeight } = calculateDimensions();
    
    // Actualizar las propiedades de la aplicación
    if (app && app.$set) {
      app.$set({ gameWidth, gameHeight });
    }
  });
  
  console.log('Juego Svelte inicializado correctamente');
});

export default {}; 