<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  
  // Props
  export let gameWidth;
  export let gameHeight;
  export let isPlaying = false;
  
  // Dispatcher para eventos
  const dispatch = createEventDispatcher();
  
  // Referencias
  let canvas;
  let ctx;
  
  // Estado del juego
  let character = {
    x: gameWidth * 0.1, // posición horizontal relativa
    y: gameHeight * 0.5, // posición vertical más baja (de 0.4 a 0.5)
    width: Math.min(gameWidth * 0.08, 50), // tamaño adaptativo con máximo
    height: Math.min(gameWidth * 0.08, 50), // tamaño adaptativo con máximo
    velocity: 0,
    invulnerable: false
  };
  
  let pipes = [];
  let lastPipeTime = 0;
  let pipeInterval = 1800; // ms
  let pipeWidth = gameWidth < 400 ? 50 : gameWidth < 600 ? 60 : 70;
  let pipeGap = gameWidth < 400 ? 180 : gameWidth < 600 ? 200 : 220;
  let gameSpeed = 2.0;
  let gravity = 0.25;
  let jumpForce = -3.5;
  let lastTimestamp = 0;
  
  // Animación de flotación
  let floatOffset = 0;
  let floatSpeed = 0.05;
  
  // Animación de rotación
  let rotation = tweened(0, {
    duration: 200,
    easing: cubicOut
  });
  
  // Inicializar el juego
  onMount(() => {
    ctx = canvas.getContext('2d');
    
    // Configurar eventos de teclado y ratón
    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch);
    
    // Iniciar bucle de animación
    requestAnimationFrame(gameLoop);
    
    // Dibujar estado inicial
    drawInitialState();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
    };
  });
  
  // Método para iniciar el juego
  export function startGame() {
    // Recalcular posiciones dinámicamente con el tamaño actual del canvas
    character.x = gameWidth * 0.1;
    character.y = gameHeight * 0.5; // posición vertical más baja (de 0.4 a 0.5)
    character.width = Math.min(gameWidth * 0.08, 50);
    character.height = Math.min(gameWidth * 0.08, 50);
    
    character.velocity = 0;
    pipes = [];
    lastPipeTime = performance.now();
    gameSpeed = 2.0;
    
    // Reiniciar animación de rotación
    $rotation = 0;
  }
  
  // Bucle principal del juego
  function gameLoop(timestamp) {
    // Calcular delta time
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    
    // Dibujar fondo
    drawBackground();
    
    // Actualizar personaje
    updateCharacter(deltaTime);
    
    if (isPlaying) {
      // Aplicar gravedad
      character.velocity += gravity * deltaTime * 60;
      
      // Generar nuevos tubos
      const currentTime = performance.now();
      if (currentTime - lastPipeTime > pipeInterval) {
        generatePipe();
        lastPipeTime = currentTime;
      }
      
      // Actualizar tubos
      updatePipes(deltaTime);
      
      // Comprobar colisiones
      checkCollisions();
      
      // Comprobar si el personaje sale de la pantalla
      if (character.y < 0) {
        character.y = 0;
        character.velocity = 0;
      } else if (character.y + character.height > gameHeight) {
        character.y = gameHeight - character.height;
        character.velocity = 0;
        
        // Perder vida si toca el suelo
        if (!character.invulnerable) {
          loseLife();
        }
      }
    } else {
      // Animación de flotación cuando no está jugando
      floatOffset += floatSpeed;
      character.y = gameHeight * 0.5 + Math.sin(floatOffset) * (gameHeight * 0.03); // Flotación proporcional al tamaño (mayor amplitud)
    }
    
    // Dibujar personaje
    drawCharacter();
    
    // Continuar el bucle
    requestAnimationFrame(gameLoop);
  }
  
  // Actualizar el personaje
  function updateCharacter(deltaTime) {
    // Actualizar posición
    character.y += character.velocity * deltaTime * 60;
    
    // Actualizar rotación basada en la velocidad
    $rotation = Math.max(-30, Math.min(90, character.velocity * 15));
  }
  
  // Dibujar el estado inicial
  function drawInitialState() {
    // Asegurarse de que el personaje esté en la posición correcta
    character.x = gameWidth * 0.1;
    character.y = gameHeight * 0.5; // posición vertical más baja (de 0.4 a 0.5)
    character.width = Math.min(gameWidth * 0.08, 50);
    character.height = Math.min(gameWidth * 0.08, 50);
    
    drawBackground();
    drawCharacter();
  }
  
  // Dibujar el fondo
  function drawBackground() {
    // Gradiente de fondo
    const gradient = ctx.createLinearGradient(0, 0, 0, gameHeight);
    gradient.addColorStop(0, '#1a2a6c');
    gradient.addColorStop(0.5, '#b21f1f');
    gradient.addColorStop(1, '#fdbb2d');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  }
  
  // Dibujar el personaje
  function drawCharacter() {
    ctx.save();
    
    // Trasladar al centro del personaje
    ctx.translate(character.x + character.width / 2, character.y + character.height / 2);
    
    // Rotar según la velocidad
    ctx.rotate($rotation * Math.PI / 180);
    
    // Efecto de invulnerabilidad
    if (character.invulnerable) {
      ctx.globalAlpha = 0.7 + Math.sin(performance.now() / 100) * 0.3;
    }
    
    // Dibujar el personaje (un círculo simple por ahora)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, character.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Dibujar detalles del personaje
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-5, -5, 5, 0, Math.PI * 2); // Ojo
    ctx.fill();
    
    ctx.restore();
  }
  
  // Generar un nuevo tubo
  function generatePipe() {
    // Altura mínima y máxima para el hueco
    const minGapY = 100;
    const maxGapY = gameHeight - 100 - pipeGap;
    
    // Calcular la posición del hueco
    const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
    
    // Crear el nuevo tubo
    pipes.push({
      x: gameWidth,
      gapStart: gapY,
      gapSize: pipeGap,
      passed: false
    });
  }
  
  // Actualizar los tubos
  function updatePipes(deltaTime) {
    for (let i = 0; i < pipes.length; i++) {
      const pipe = pipes[i];
      
      // Mover el tubo
      pipe.x -= gameSpeed * deltaTime * 60;
      
      // Comprobar si el personaje ha pasado el tubo
      if (!pipe.passed && pipe.x + pipeWidth < character.x) {
        pipe.passed = true;
        
        // Incrementar puntuación
        dispatch('score');
      }
      
      // Dibujar el tubo
      drawPipe(pipe);
      
      // Eliminar tubos que ya no son visibles
      if (pipe.x + pipeWidth < 0) {
        pipes.splice(i, 1);
        i--;
      }
    }
  }
  
  // Dibujar un tubo
  function drawPipe(pipe) {
    // Color del tubo
    ctx.fillStyle = '#4CAF50';
    
    // Tubo superior
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapStart);
    
    // Tubo inferior
    ctx.fillRect(pipe.x, pipe.gapStart + pipe.gapSize, pipeWidth, gameHeight - (pipe.gapStart + pipe.gapSize));
    
    // Borde del tubo
    ctx.fillStyle = '#388E3C';
    
    // Borde del tubo superior
    ctx.fillRect(pipe.x - 2, pipe.gapStart - 10, pipeWidth + 4, 10);
    
    // Borde del tubo inferior
    ctx.fillRect(pipe.x - 2, pipe.gapStart + pipe.gapSize, pipeWidth + 4, 10);
  }
  
  // Comprobar colisiones
  function checkCollisions() {
    if (character.invulnerable) return;
    
    // Calcular el centro del personaje
    const centerX = character.x + character.width / 2;
    const centerY = character.y + character.height / 2;
    
    // Radio efectivo
    const effectiveRadius = character.width * 0.4;
    
    for (const pipe of pipes) {
      // Calcular el punto más cercano del tubo al centro del personaje
      let closestX, closestY;
      
      // Para el tubo superior
      if (centerY < pipe.gapStart) {
        // Estamos cerca del tubo superior
        
        // Encontrar el punto X más cercano
        if (centerX < pipe.x) {
          closestX = pipe.x; // Borde izquierdo del tubo
        } else if (centerX > pipe.x + pipeWidth) {
          closestX = pipe.x + pipeWidth; // Borde derecho del tubo
        } else {
          closestX = centerX; // Dentro del ancho del tubo
        }
        
        // El punto Y más cercano es el borde inferior del tubo superior
        closestY = pipe.gapStart;
        
        // Calcular la distancia desde el centro al punto más cercano
        const distance = Math.sqrt(
          Math.pow(centerX - closestX, 2) + 
          Math.pow(centerY - closestY, 2)
        );
        
        // Si la distancia es menor que el radio efectivo, hay colisión
        if (distance < effectiveRadius) {
          loseLife();
          break;
        }
      }
      
      // Para el tubo inferior
      if (centerY > pipe.gapStart + pipe.gapSize) {
        // Estamos cerca del tubo inferior
        
        // Encontrar el punto X más cercano
        if (centerX < pipe.x) {
          closestX = pipe.x; // Borde izquierdo del tubo
        } else if (centerX > pipe.x + pipeWidth) {
          closestX = pipe.x + pipeWidth; // Borde derecho del tubo
        } else {
          closestX = centerX; // Dentro del ancho del tubo
        }
        
        // El punto Y más cercano es el borde superior del tubo inferior
        closestY = pipe.gapStart + pipe.gapSize;
        
        // Calcular la distancia desde el centro al punto más cercano
        const distance = Math.sqrt(
          Math.pow(centerX - closestX, 2) + 
          Math.pow(centerY - closestY, 2)
        );
        
        // Si la distancia es menor que el radio efectivo, hay colisión
        if (distance < effectiveRadius) {
          loseLife();
          break;
        }
      }
    }
  }
  
  // Perder una vida
  function loseLife() {
    // Hacer al personaje invulnerable temporalmente
    character.invulnerable = true;
    
    // Enviar evento de pérdida de vida
    dispatch('loseLife');
    
    // Quitar invulnerabilidad después de un tiempo
    setTimeout(() => {
      character.invulnerable = false;
    }, 1500);
  }
  
  // Manejar eventos de teclado
  function handleKeyDown(e) {
    if (!isPlaying) return;
    
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      jump();
    }
  }
  
  // Manejar eventos de clic
  function handleClick() {
    if (!isPlaying) return;
    jump();
  }
  
  // Manejar eventos táctiles
  function handleTouch(e) {
    if (!isPlaying) return;
    e.preventDefault();
    jump();
  }
  
  // Hacer saltar al personaje
  function jump() {
    character.velocity = jumpForce;
    $rotation = -30; // Rotar hacia arriba al saltar
  }
</script>

<canvas 
  bind:this={canvas} 
  width={gameWidth} 
  height={gameHeight}
  class="game-canvas"
></canvas>

<style>
  .game-canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style> 