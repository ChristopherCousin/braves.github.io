<script>
  import { onMount, onDestroy } from 'svelte';
  import FlappyGame from './components/FlappyGame.svelte';
  import GameOverlay from './components/GameOverlay.svelte';
  import GameUI from './components/GameUI.svelte';
  
  // Props
  export let gameWidth;
  export let gameHeight;
  
  // Estado del juego
  let isPlaying = false;
  let score = 0;
  let lives = 3;
  let highScore = 0;
  
  // Referencia al componente del juego
  let gameComponent;
  
  // Cargar puntuación máxima
  onMount(() => {
    try {
      const savedHighScore = localStorage.getItem('flappyBravesHighScore');
      if (savedHighScore) {
        highScore = parseInt(savedHighScore, 10);
      }
    } catch (e) {
      console.error('Error cargando puntuación máxima:', e);
    }
    
    // Ajustar tamaño del juego en respuesta a cambios de tamaño de ventana
    const handleResize = () => {
      gameWidth = window.innerWidth > 768 ? 500 : window.innerWidth - 40;
      gameHeight = window.innerWidth > 768 ? 400 : 350;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  
  // Iniciar el juego
  function startGame() {
    isPlaying = true;
    score = 0;
    lives = 3;
    
    if (gameComponent) {
      gameComponent.startGame();
    }
  }
  
  // Actualizar puntuación
  function updateScore() {
    score++;
    
    // Actualizar puntuación máxima si es necesario
    if (score > highScore) {
      highScore = score;
      saveHighScore();
    }
  }
  
  // Guardar puntuación máxima
  function saveHighScore() {
    try {
      localStorage.setItem('flappyBravesHighScore', highScore.toString());
    } catch (e) {
      console.error('Error guardando puntuación máxima:', e);
    }
  }
  
  // Perder una vida
  function loseLife() {
    lives--;
    
    if (lives <= 0) {
      gameOver();
    }
  }
  
  // Game over
  function gameOver() {
    isPlaying = false;
  }
</script>

<div class="game-container">
  {#if !isPlaying}
    <GameOverlay 
      {startGame} 
      {score} 
      {highScore} 
    />
  {/if}
  
  <GameUI 
    {score} 
    {lives} 
    {isPlaying} 
  />
  
  <FlappyGame
    bind:this={gameComponent}
    {gameWidth}
    {gameHeight}
    {isPlaying}
    on:score={updateScore}
    on:loseLife={loseLife}
    on:gameOver={gameOver}
  />
</div>

<style>
  .game-container {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    background-color: #1a1a1a;
    margin: 0 auto;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  @media (max-width: 768px) {
    .game-container {
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    }
  }
  
  @media (max-width: 480px) {
    .game-container {
      border-radius: 6px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
  }
</style> 