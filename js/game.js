// Mini-juego Flappy Braves para la sección hero

class FlappyBraves {
    constructor() {
        // Elementos del DOM
        this.gameCanvas = document.getElementById('game-canvas');
        this.ctx = this.gameCanvas.getContext('2d');
        this.playButton = document.getElementById('play-button');
        this.gameOverlay = document.querySelector('.game-overlay');
        this.livesContainer = document.getElementById('lives');
        
        // Inicializar el marcador de puntos
        this.initializeScoreDisplay();
        
        // Detectar tipo de dispositivo y mostrar instrucciones adecuadas
        this.detectDeviceAndUpdateInstructions();
        
        // Configuración del juego
        this.gameWidth = this.gameCanvas.parentElement.clientWidth;
        this.gameHeight = this.gameCanvas.parentElement.clientHeight;
        this.gameCanvas.width = this.gameWidth;
        this.gameCanvas.height = this.gameHeight;
        
        // Estado del juego
        this.isPlaying = false;
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 1.2;
        this.gravity = 0.25;
        this.jumpForce = -3.5;
        this.invulnerable = false;
        this.floatOffset = 0; // Para el efecto de flotación
        this.floatSpeed = 0.05; // Velocidad del efecto de flotación
        this.lastTimestamp = 0;
        
        // Sistema de dificultad progresiva
        this.initialGameSpeed = 1.2;
        this.maxGameSpeed = 3.0;
        this.speedIncreasePerPoint = 0.05;
        this.difficultyLevel = 1;
        this.pointsForNextLevel = 3;
        
        // Opciones de desarrollo
        this.showHitbox = false; // Opción para mostrar la hitbox (activar para depuración)
        this.hitboxReduction = 0.3; // Reducción del 30% para la hitbox
        
        // Crear el personaje de Braves (cabrita)
        this.character = new BravesCharacter(
            this.ctx,
            this.gameWidth / 4,
            this.gameHeight / 2,
            85, // ancho
            85  // alto (proporcional ya que los ojos estarán dentro del logo)
        );
        
        this.pipes = [];
        this.pipeWidth = 60;
        this.pipeGap = 200;
        this.pipeInterval = 2500;
        this.lastPipeTime = 0;
        
        // Eventos
        this.playButton.addEventListener('click', () => this.startGame());
        
        // Mejorar controles táctiles para móviles
        const handleTouch = (e) => {
            e.preventDefault();
            // En dispositivos móviles, permitir tocar en cualquier parte de la pantalla
            if (this.isPlaying) {
                this.jump();
            } else if (e.target.id !== 'play-button') {
                // Si no está jugando y no se tocó el botón de jugar, iniciar el juego
                this.startGame();
            }
        };
        
        // Usar touchstart para mejor respuesta en móviles
        this.gameCanvas.addEventListener('touchstart', handleTouch, { passive: false });
        
        // Mantener el clic para escritorio
        this.gameCanvas.addEventListener('click', (e) => {
            e.preventDefault();
            this.jump();
        });
        
        window.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') && this.isPlaying) {
                e.preventDefault();
                this.jump();
            }
            
            // Tecla H para activar/desactivar la visualización de la hitbox (solo para desarrollo)
            if (e.key === 'h' || e.key === 'H') {
                this.showHitbox = !this.showHitbox;
                console.log(`Hitbox ${this.showHitbox ? 'visible' : 'oculta'}`);
            }
        });
        
        // Ajustar tamaño del canvas cuando cambia el tamaño de la ventana
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Inicializar
        this.drawInitialState();
        
        // Debug info
        console.log('FlappyBraves inicializado con el nuevo personaje de cabrita');
    }
    
    // Inicializar el marcador de puntos
    initializeScoreDisplay() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = '0';
            
            // Asegurar que el contenedor sea visible
            const scoreContainer = document.querySelector('.game-score');
            if (scoreContainer) {
                scoreContainer.style.display = 'block';
                scoreContainer.style.visibility = 'visible';
                scoreContainer.style.opacity = '1';
            }
        }
    }
    
    // Detectar tipo de dispositivo y mostrar solo las instrucciones relevantes
    detectDeviceAndUpdateInstructions() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                        (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
        
        const pcInstructions = document.getElementById('pc-instructions');
        const mobileInstructions = document.getElementById('mobile-instructions');
        
        if (pcInstructions && mobileInstructions) {
            if (isMobile) {
                pcInstructions.style.display = 'none';
                mobileInstructions.style.display = 'block';
            } else {
                pcInstructions.style.display = 'block';
                mobileInstructions.style.display = 'none';
            }
        }
    }
    
    resizeCanvas() {
        // Obtener el tamaño actual del contenedor
        this.gameWidth = this.gameCanvas.parentElement.clientWidth;
        this.gameHeight = this.gameCanvas.parentElement.clientHeight;
        
        // Ajustar el tamaño del canvas
        this.gameCanvas.width = this.gameWidth;
        this.gameCanvas.height = this.gameHeight;
        
        // Detectar si es un dispositivo móvil
        const isMobile = window.innerWidth <= 768;
        
        // Ajustar el tamaño del personaje según el dispositivo
        if (isMobile) {
            // Tamaño más pequeño para móviles
            this.character.width = 60;
            this.character.height = 60;
            
            // Ajustar parámetros del juego para móviles
            this.pipeWidth = 50; // Tubos más estrechos
            this.pipeGap = Math.max(this.pipeGap, 150); // Asegurar un espacio mínimo entre tubos
        } else {
            // Tamaño normal para escritorio
            this.character.width = 85;
            this.character.height = 85;
            
            // Parámetros normales
            this.pipeWidth = 60;
        }
        
        // Reposicionar el personaje
        this.character.x = this.gameWidth / 4;
        
        // Si no está jugando, redibujar el estado inicial
        if (!this.isPlaying) {
            this.drawInitialState();
        }
    }
    
    drawInitialState() {
        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Dibujar fondo con efecto de grid
        this.drawBackground();
        
        // Iniciar animación de flotación
        if (!this.floatAnimationStarted) {
            this.floatAnimationStarted = true;
            const animate = () => {
                if (!this.isPlaying) {
                    this.floatOffset += this.floatSpeed;
                    this.character.floatOffset = this.floatOffset;
                    this.character.draw(false);
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }
        
        // Dibujar el personaje en estado inicial
        this.character.draw(false);
    }
    
    startGame() {
        if (this.isPlaying) return;
        
        // Ocultar overlay
        this.gameOverlay.classList.add('hidden');
        
        // Reiniciar estado del juego
        this.isPlaying = true;
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = this.initialGameSpeed;
        this.difficultyLevel = 1;
        this.pipeGap = 200;
        this.pipeInterval = 2500;
        
        // Reiniciar personaje
        this.character.y = this.gameHeight / 2;
        this.character.velocity = 0;
        this.character.rotation = 0;
        
        // Limpiar tubos
        this.pipes = [];
        
        // Actualizar vidas
        this.updateLives();
        
        // Actualizar puntuación
        this.updateScore();
        
        // Iniciar bucle del juego
        this.lastTimestamp = 0;
        this.lastPipeTime = 0;
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        
        console.log('Juego iniciado');
    }
    
    gameLoop(timestamp) {
        if (!this.isPlaying) return;
        
        // Calcular delta time
        const deltaTime = this.lastTimestamp ? timestamp - this.lastTimestamp : 0;
        this.lastTimestamp = timestamp;
        
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Dibujar fondo
        this.drawBackground();
        
        // Actualizar personaje
        this.character.velocity += this.gravity;
        this.character.update(true, deltaTime);
        
        // Comprobar colisiones con los bordes
        if (this.character.y <= 0) {
            this.character.y = 0;
            this.character.velocity = 0;
        }
        
        if (this.character.y + this.character.height >= this.gameHeight) {
            this.character.y = this.gameHeight - this.character.height;
            this.character.velocity = 0;
            this.loseLife();
        }
        
        // Generar nuevos tubos
        if (timestamp - this.lastPipeTime > this.pipeInterval) {
            this.generatePipe();
            this.lastPipeTime = timestamp;
        }
        
        // Actualizar y dibujar tubos
        this.updatePipes();
        
        // Comprobar colisiones con tubos
        this.checkCollisions();
        
        // Dibujar personaje
        this.character.draw(true);
        
        // Dibujar hitbox si está activada la opción
        if (this.showHitbox) {
            this.drawHitbox();
        }
        
        // Continuar el loop
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    jump() {
        if (!this.isPlaying) return;
        
        // Detectar si es un dispositivo móvil
        const isMobile = window.innerWidth <= 768;
        
        // Ajustar la fuerza del salto según el dispositivo
        const jumpForce = isMobile ? this.jumpForce * 0.9 : this.jumpForce;
        
        // Aplicar la fuerza del salto
        this.character.velocity = jumpForce;
        this.character.jump();
    }
    
    generatePipe() {
        const gapPosition = Math.random() * (this.gameHeight - this.pipeGap - 100) + 50;
        
        this.pipes.push({
            x: this.gameWidth,
            gapStart: gapPosition,
            gapEnd: gapPosition + this.pipeGap,
            passed: false
        });
    }
    
    updatePipes() {
        for (let i = 0; i < this.pipes.length; i++) {
            const pipe = this.pipes[i];
            
            // Mover el tubo
            pipe.x -= this.gameSpeed * 2;
            
            // Dibujar el tubo
            this.drawPipe(pipe);
            
            // Comprobar si el personaje ha pasado el tubo
            if (!pipe.passed && pipe.x + this.pipeWidth < this.character.x) {
                pipe.passed = true;
                this.score++;
                this.updateScore();
                
                // Aumentar velocidad gradualmente
                this.gameSpeed += this.speedIncreasePerPoint;
                this.gameSpeed = Math.min(this.gameSpeed, this.maxGameSpeed); // Limitar velocidad máxima
            }
            
            // Eliminar tubos que ya no son visibles
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
                i--;
            }
        }
    }
    
    checkCollisions() {
        if (this.invulnerable) return;
        
        // Implementar una detección de colisiones más precisa basada en la forma del logo
        
        // Calcular el centro del personaje
        const centerX = this.character.x + this.character.width / 2;
        const centerY = this.character.y + this.character.height / 2;
        
        // Radio efectivo (más pequeño que el ancho/2 para ajustarse mejor a la forma del logo)
        const effectiveRadius = this.character.width * 0.3; // 30% del ancho
        
        for (const pipe of this.pipes) {
            // Calcular el punto más cercano del tubo al centro del personaje
            let closestX, closestY;
            
            // Para el tubo superior
            if (centerY < pipe.gapStart) {
                // Estamos cerca del tubo superior
                
                // Encontrar el punto X más cercano
                if (centerX < pipe.x) {
                    closestX = pipe.x; // Borde izquierdo del tubo
                } else if (centerX > pipe.x + this.pipeWidth) {
                    closestX = pipe.x + this.pipeWidth; // Borde derecho del tubo
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
                    this.loseLife();
                    break;
                }
            }
            
            // Para el tubo inferior
            if (centerY > pipe.gapEnd) {
                // Estamos cerca del tubo inferior
                
                // Encontrar el punto X más cercano
                if (centerX < pipe.x) {
                    closestX = pipe.x; // Borde izquierdo del tubo
                } else if (centerX > pipe.x + this.pipeWidth) {
                    closestX = pipe.x + this.pipeWidth; // Borde derecho del tubo
                } else {
                    closestX = centerX; // Dentro del ancho del tubo
                }
                
                // El punto Y más cercano es el borde superior del tubo inferior
                closestY = pipe.gapEnd;
                
                // Calcular la distancia desde el centro al punto más cercano
                const distance = Math.sqrt(
                    Math.pow(centerX - closestX, 2) + 
                    Math.pow(centerY - closestY, 2)
                );
                
                // Si la distancia es menor que el radio efectivo, hay colisión
                if (distance < effectiveRadius) {
                    this.loseLife();
                    break;
                }
            }
        }
    }
    
    loseLife() {
        if (this.invulnerable) return;
        
        this.lives--;
        this.updateLives();
        
        // Hacer al personaje invulnerable temporalmente
        this.invulnerable = true;
        this.character.setInvulnerable(true);
        
        // Efecto visual de daño
        this.gameCanvas.parentElement.classList.add('damage');
        setTimeout(() => {
            this.gameCanvas.parentElement.classList.remove('damage');
        }, 200);
        
        // Si no quedan vidas, game over
        if (this.lives <= 0) {
            this.gameOver();
            return;
        }
        
        // Quitar invulnerabilidad después de un tiempo
        setTimeout(() => {
            this.invulnerable = false;
            this.character.setInvulnerable(false);
        }, 1500);
    }
    
    gameOver() {
        this.isPlaying = false;
        
        // Mostrar overlay con puntuación
        this.gameOverlay.classList.remove('hidden');
        const gameTitle = this.gameOverlay.querySelector('.game-title');
        gameTitle.textContent = `¡Juego terminado! Puntuación: ${this.score}`;
        
        // Cambiar texto del botón
        this.playButton.textContent = 'Jugar de nuevo';
    }
    
    updateScore() {
        // Actualizar el elemento de puntuación de forma simple
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
            
            // Asegurar que el contenedor sea visible
            const scoreContainer = document.querySelector('.game-score');
            if (scoreContainer) {
                scoreContainer.style.display = 'block';
                scoreContainer.style.visibility = 'visible';
                scoreContainer.style.opacity = '1';
                
                // Añadir un efecto visual simple al actualizar el puntaje
                scoreContainer.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    scoreContainer.style.transform = 'scale(1)';
                }, 200);
            }
        }
        
        // Comprobar si es hora de subir de nivel
        if (this.score >= this.difficultyLevel * this.pointsForNextLevel) {
            this.increaseDifficulty();
        }
    }
    
    // Nueva función para aumentar la dificultad
    increaseDifficulty() {
        this.difficultyLevel++;
        
        // Aumentar la velocidad base del juego
        this.gameSpeed = this.initialGameSpeed + (this.difficultyLevel - 1) * 0.3;
        
        // Reducir el intervalo entre tubos
        this.pipeInterval = Math.max(1200, 2500 - (this.difficultyLevel - 1) * 300);
        
        // Reducir el espacio entre tubos (aumentar dificultad)
        this.pipeGap = Math.max(100, 200 - (this.difficultyLevel - 1) * 15);
        
        // Mostrar mensaje de nivel
        this.showLevelMessage();
        
        console.log(`¡Nivel ${this.difficultyLevel}! Velocidad: ${this.gameSpeed.toFixed(1)}, Intervalo: ${this.pipeInterval}ms, Espacio: ${this.pipeGap}px`);
    }
    
    // Mostrar mensaje de nivel
    showLevelMessage() {
        // Crear elemento para el mensaje de nivel
        const levelMsg = document.createElement('div');
        levelMsg.className = 'level-message';
        levelMsg.textContent = `¡Nivel ${this.difficultyLevel}!`;
        document.querySelector('.game-ui').appendChild(levelMsg);
        
        // Animar el mensaje
        setTimeout(() => {
            levelMsg.classList.add('show');
            
            // Eliminar el mensaje después de la animación - reducido de 2000ms a 1000ms
            setTimeout(() => {
                levelMsg.classList.remove('show');
                setTimeout(() => levelMsg.remove(), 300); // Reducido de 500ms a 300ms
            }, 1000);
        }, 10);
    }
    
    updateLives() {
        // Actualizar indicador de vidas
        this.livesContainer.innerHTML = '';
        
        for (let i = 0; i < this.lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.className = 'life-icon';
            this.livesContainer.appendChild(lifeIcon);
        }
    }
    
    drawBackground() {
        // Fondo oscuro
        this.ctx.fillStyle = 'rgba(10, 10, 20, 1)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Efecto de grid con líneas neón
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Líneas horizontales
        const gridSize = 30;
        for (let y = 0; y < this.gameHeight; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.gameWidth, y);
            this.ctx.stroke();
        }
        
        // Líneas verticales
        for (let x = 0; x < this.gameWidth; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.gameHeight);
            this.ctx.stroke();
        }
    }
    
    drawPipe(pipe) {
        // Estilo de los tubos con efecto neón
        const gradient = this.ctx.createLinearGradient(
            pipe.x, 0,
            pipe.x + this.pipeWidth, 0
        );
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0.8)');
        
        this.ctx.fillStyle = 'rgba(10, 10, 30, 0.9)';
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
        this.ctx.shadowBlur = 10;
        
        // Tubo superior
        this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.gapStart);
        this.ctx.strokeRect(pipe.x, 0, this.pipeWidth, pipe.gapStart);
        
        // Tubo inferior
        this.ctx.fillRect(pipe.x, pipe.gapEnd, this.pipeWidth, this.gameHeight - pipe.gapEnd);
        this.ctx.strokeRect(pipe.x, pipe.gapEnd, this.pipeWidth, this.gameHeight - pipe.gapEnd);
        
        // Resetear sombra
        this.ctx.shadowBlur = 0;
        
        // Añadir detalles a los tubos
        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        
        // Detalles tubo superior
        this.ctx.fillRect(pipe.x + 10, 0, this.pipeWidth - 20, pipe.gapStart);
        
        // Detalles tubo inferior
        this.ctx.fillRect(pipe.x + 10, pipe.gapEnd, this.pipeWidth - 20, this.gameHeight - pipe.gapEnd);
        
        // Borde inferior del tubo superior
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(pipe.x - 5, pipe.gapStart - 10, this.pipeWidth + 10, 10);
        
        // Borde superior del tubo inferior
        this.ctx.fillRect(pipe.x - 5, pipe.gapEnd, this.pipeWidth + 10, 10);
    }
    
    // Función para dibujar la hitbox
    drawHitbox() {
        // Calcular el centro del personaje
        const centerX = this.character.x + this.character.width / 2;
        const centerY = this.character.y + this.character.height / 2;
        
        // Radio efectivo (más pequeño que el ancho/2 para ajustarse mejor a la forma del logo)
        const effectiveRadius = this.character.width * 0.3; // 30% del ancho
        
        // Dibujar la hitbox circular con borde rojo (la que se usa para colisiones)
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, effectiveRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Dibujar una hitbox ovalada con borde amarillo (representación visual más precisa)
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        // Dibujar un óvalo que se ajuste mejor a la forma del logo
        this.ctx.ellipse(
            centerX, 
            centerY, 
            this.character.width * 0.4, // Radio horizontal (40% del ancho)
            this.character.height * 0.4, // Radio vertical (40% del alto)
            0, 0, Math.PI * 2
        );
        this.ctx.stroke();
        
        // Dibujar el centro del personaje para referencia
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Inicializar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Comprobar si el script de BravesCharacter está cargado
    if (typeof BravesCharacter !== 'undefined') {
        new FlappyBraves();
    } else {
        console.error('Error: BravesCharacter no está definido. Asegúrate de cargar braves-character.js antes que game.js');
    }
}); 