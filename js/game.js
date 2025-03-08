// Mini-juego Flappy Braves para la sección hero

class FlappyBraves {
    constructor() {
        // Elementos del DOM
        this.gameCanvas = document.getElementById('game-canvas');
        this.ctx = this.gameCanvas.getContext('2d');
        this.playButton = document.getElementById('play-button');
        this.gameOverlay = document.querySelector('.game-overlay');
        this.scoreElement = document.getElementById('score');
        this.livesContainer = document.getElementById('lives');
        
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
        this.gravity = 0.15;
        this.jumpForce = -4;
        this.invulnerable = false;
        this.floatOffset = 0; // Para el efecto de flotación
        this.floatSpeed = 0.05; // Velocidad del efecto de flotación
        this.lastTimestamp = 0;
        
        // Crear el personaje de Braves (cabrita)
        this.character = new BravesCharacter(
            this.ctx,
            this.gameWidth / 4,
            this.gameHeight / 2,
            40, // ancho
            40  // alto
        );
        
        this.pipes = [];
        this.pipeWidth = 60;
        this.pipeGap = 200;
        this.pipeInterval = 2500;
        this.lastPipeTime = 0;
        
        // Eventos
        this.playButton.addEventListener('click', () => this.startGame());
        this.gameCanvas.addEventListener('click', (e) => {
            e.preventDefault();
            this.jump();
        });
        this.gameCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.jump();
        });
        window.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') && this.isPlaying) {
                e.preventDefault();
                this.jump();
            }
        });
        
        // Ajustar tamaño del canvas cuando cambia el tamaño de la ventana
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Inicializar
        this.drawInitialState();
        
        // Debug info
        console.log('FlappyBraves inicializado con el nuevo personaje');
    }
    
    resizeCanvas() {
        this.gameWidth = this.gameCanvas.parentElement.clientWidth;
        this.gameHeight = this.gameCanvas.parentElement.clientHeight;
        this.gameCanvas.width = this.gameWidth;
        this.gameCanvas.height = this.gameHeight;
        
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
        // Ocultar overlay
        this.gameOverlay.classList.add('hidden');
        
        // Reiniciar estado del juego
        this.isPlaying = true;
        this.score = 0;
        this.lives = 3;
        this.pipes = [];
        this.lastPipeTime = 0;
        this.character.velocity = 0;
        this.character.y = this.gameHeight / 2;
        this.character.setInvulnerable(false);
        
        // Actualizar UI
        this.updateScore();
        this.updateLives();
        
        // Iniciar loop del juego
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
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
        
        // Continuar el loop
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    jump() {
        if (!this.isPlaying) return;
        
        this.character.velocity = this.jumpForce;
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
                this.gameSpeed += 0.01;
                this.gameSpeed = Math.min(this.gameSpeed, 2.5); // Limitar velocidad máxima
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
        
        for (const pipe of this.pipes) {
            // Comprobar colisión con el tubo superior
            if (
                this.character.x + this.character.width > pipe.x &&
                this.character.x < pipe.x + this.pipeWidth &&
                this.character.y < pipe.gapStart
            ) {
                this.loseLife();
                break;
            }
            
            // Comprobar colisión con el tubo inferior
            if (
                this.character.x + this.character.width > pipe.x &&
                this.character.x < pipe.x + this.pipeWidth &&
                this.character.y + this.character.height > pipe.gapEnd
            ) {
                this.loseLife();
                break;
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
        this.scoreElement.textContent = this.score;
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