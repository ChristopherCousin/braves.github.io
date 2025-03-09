<script>
  import { fade } from 'svelte/transition';
  
  // Props
  export let startGame;
  export let score = 0;
  export let highScore = 0;
  
  // Detectar si es dispositivo móvil
  let isMobile = false;
  
  // Detectar tipo de dispositivo al montar el componente
  import { onMount } from 'svelte';
  
  onMount(() => {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });
</script>

<div class="game-overlay" transition:fade={{ duration: 300 }}>
  <h2 class="game-title">Flappy Braves</h2>
  
  {#if score > 0}
    <div class="score-display">
      <p class="final-score">Puntuación: {score}</p>
      <p class="high-score">Mejor puntuación: {highScore}</p>
    </div>
  {:else}
    <p class="game-description">¡Prueba ahora mismo uno de nuestros desafíos! Toca o haz clic para mantener a la cabrita volando y evita los obstáculos. Cada tubo que pases te dará un punto.</p>
  {/if}
  
  <div class="game-instructions">
    {#if isMobile}
      <p><i class="fas fa-mobile-alt"></i> <strong>Móvil:</strong> Toca la pantalla para saltar</p>
    {:else}
      <p><i class="fas fa-mouse-pointer"></i> <strong>PC:</strong> Haz clic o pulsa Espacio/Flecha Arriba</p>
    {/if}
  </div>
  
  <button class="play-button" on:click={startGame}>
    {score > 0 ? 'Jugar de nuevo' : 'Jugar'}
  </button>
</div>

<style>
  .game-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100;
    padding: 20px;
    box-sizing: border-box;
    color: white;
    text-align: center;
  }
  
  .game-title {
    font-size: min(3rem, 12vw);
    margin-bottom: 20px;
    color: #FFD700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
  }
  
  .game-description {
    font-size: min(1.2rem, 5vw);
    margin-bottom: 20px;
    max-width: 90%;
    line-height: 1.5;
  }
  
  .game-instructions {
    margin-bottom: 25px;
    font-size: min(1.1rem, 4.5vw);
    background-color: rgba(255, 255, 255, 0.1);
    padding: 10px 15px;
    border-radius: 5px;
    width: 90%;
    max-width: 350px;
  }
  
  .play-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px 30px;
    font-size: min(1.4rem, 6vw);
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }
  
  .play-button:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
  
  .play-button:active {
    transform: scale(0.95);
  }
  
  .score-display {
    margin-bottom: 20px;
    width: 90%;
    max-width: 350px;
  }
  
  .final-score {
    font-size: min(1.8rem, 7vw);
    margin-bottom: 10px;
    color: #FFD700;
  }
  
  .high-score {
    font-size: min(1.4rem, 6vw);
    color: #CCCCCC;
  }
  
  @media (max-width: 768px) {
    .game-title {
      font-size: min(2.5rem, 10vw);
      margin-bottom: 15px;
    }
    
    .game-description {
      font-size: min(1.1rem, 4.5vw);
      max-width: 95%;
      margin-bottom: 15px;
    }
    
    .game-instructions {
      margin-bottom: 20px;
      font-size: min(1rem, 4vw);
      padding: 8px 12px;
    }
    
    .play-button {
      padding: 10px 25px;
      font-size: min(1.3rem, 5.5vw);
    }
    
    .final-score {
      font-size: min(1.6rem, 6.5vw);
      margin-bottom: 8px;
    }
    
    .high-score {
      font-size: min(1.2rem, 5vw);
    }
  }
  
  @media (max-width: 480px) {
    .game-title {
      font-size: min(2.2rem, 9vw);
      margin-bottom: 12px;
    }
    
    .game-description {
      font-size: min(1rem, 4vw);
      line-height: 1.4;
      margin-bottom: 12px;
    }
    
    .game-instructions {
      margin-bottom: 15px;
      font-size: min(0.9rem, 3.8vw);
      padding: 6px 10px;
    }
    
    .play-button {
      padding: 8px 20px;
      font-size: min(1.2rem, 5vw);
    }
  }
</style> 