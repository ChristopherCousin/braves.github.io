<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  
  // Props
  export let score = 0;
  export let lives = 3;
  export let isPlaying = false;
  
  // Animación para la puntuación
  let prevScore = 0;
  let showScoreAnimation = false;
  
  // Observar cambios en la puntuación
  $: if (score > prevScore && isPlaying) {
    showScoreAnimation = true;
    setTimeout(() => {
      showScoreAnimation = false;
    }, 300);
    prevScore = score;
  }

  // Referencia al elemento UI para calcular y ajustar su posición
  let gameUI;
  
  onMount(() => {
    // Asegurar que la UI sea completamente visible
    function adjustUIPosition() {
      if (!gameUI) return;
      
      // Obtener el contenedor padre (el canvas del juego)
      const container = gameUI.parentElement;
      if (!container) return;
      
      // Calcular las dimensiones
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;
      
      // Ajustar el padding superior dinámicamente (valor más conservador)
      const dynamicPadding = Math.max(containerHeight * 0.12, 30);
      gameUI.style.paddingTop = `${dynamicPadding}px`;
      
      // Ajustar los márgenes laterales para alejar del borde
      const dynamicHorizontalPadding = Math.max(containerWidth * 0.05, 20);
      gameUI.style.paddingLeft = `${dynamicHorizontalPadding}px`;
      gameUI.style.paddingRight = `${dynamicHorizontalPadding}px`;
    }
    
    // Ajustar la posición inicialmente
    adjustUIPosition();
    
    // Ajustar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', adjustUIPosition);
    
    // Repetir el ajuste después de un breve retraso para capturar cambios en el DOM
    setTimeout(adjustUIPosition, 100);
    
    // Limpiar el evento al desmontar
    return () => {
      window.removeEventListener('resize', adjustUIPosition);
    };
  });
</script>

<div bind:this={gameUI} class="game-ui">
  <div class="game-lives">
    {#each Array(3) as _, i}
      <div class="life-icon {i < lives ? 'active' : ''}"></div>
    {/each}
  </div>
  
  <div class="game-score-container">
    <div class="game-score {showScoreAnimation ? 'score-updated' : ''}">
      Puntos: <span>{score}</span>
    </div>
    
    {#if showScoreAnimation}
      <div class="score-indicator" transition:fly={{ y: -20, duration: 300 }}>
        +1
      </div>
    {/if}
  </div>
</div>

<style>
  .game-ui {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 12% 5% 15px 5%; /* Padding superior muy aumentado */
    display: flex;
    justify-content: space-between;
    z-index: 999; /* Z-index extremadamente alto para evitar solapamientos */
    pointer-events: none;
    box-sizing: border-box;
    min-height: 20%; /* Mayor espacio mínimo */
  }
  
  .game-lives {
    display: flex;
    gap: 2%; /* Gap relativo */
    margin-top: 1%;
    flex: 0 0 auto; /* No crecer ni encoger */
  }
  
  .life-icon {
    width: clamp(18px, 5%, 25px); /* Tamaño adaptativo con mínimo y máximo */
    height: clamp(18px, 5%, 25px);
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    position: relative;
  }
  
  .life-icon.active::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    background-color: #FF5555;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 5px #FF5555;
  }
  
  .game-score-container {
    position: relative;
    flex: 0 0 auto; /* No crecer ni encoger */
    margin-top: 15px; /* Margen superior adicional */
  }
  
  .game-score {
    font-size: clamp(0.9rem, 4vmin, 1.4rem); /* Tamaño de fuente aumentado */
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
    padding: clamp(6px, 3%, 18px); /* Padding adaptativo aumentado */
    border-radius: 5px;
    transition: transform 0.2s;
    white-space: nowrap;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
    font-weight: 600;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Sombra para destacar */
    border: 1px solid rgba(255, 255, 255, 0.1); /* Borde sutil */
  }
  
  .game-score.score-updated {
    transform: scale(1.2);
    color: #FFD700;
  }
  
  .score-indicator {
    position: absolute;
    top: -18px;
    right: 0;
    color: #FFD700;
    font-weight: bold;
    font-size: clamp(0.9rem, 4vmin, 1.4rem);
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.7);
  }
  
  @media (max-width: 768px) {
    .game-ui {
      padding-top: 14%; /* Mayor en tablets */
    }
    
    .game-score-container {
      margin-top: 12px;
    }
  }
  
  @media (max-width: 480px) {
    .game-ui {
      padding-top: 18%; /* Aún mayor en móviles */
    }
    
    .game-score-container {
      margin-top: 10px;
    }
  }
</style> 