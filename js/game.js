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
        
        // Objetos del juego
        this.bird = {
            x: this.gameWidth / 4,
            y: this.gameHeight / 2,
            width: 30,
            height: 30,
            velocity: 0,
            color: '#FF00A0' // Color rosa neón
        };
        
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
        console.log('FlappyBraves inicializado');
    }
    
    resizeCanvas() {
        this.gameWidth = this.gameCanvas.parentElement.clientWidth;
        this.gameHeight = this.gameCanvas.parentElement.clientHeight;
        this.gameCanvas.width = this.gameWidth;
        this.gameCanvas.height = this.gameHeight;
        
        // Reposicionar el pájaro
        this.bird.x = this.gameWidth / 4;
        
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
                    if (this.floatOffset > Math.PI * 2) {
                        this.floatOffset = 0;
                    }
                    this.drawBird();
                    requestAnimationFrame(animate);
                }
            };
            animate();
        } else {
            // Dibujar el pájaro en posición inicial
            this.drawBird();
        }
    }
    
    startGame() {
        console.log('Juego iniciado');
        // Ocultar overlay
        this.gameOverlay.classList.add('hidden');
        
        // Reiniciar estado del juego
        this.isPlaying = true;
        this.score = 0;
        this.lives = 3;
        this.updateScore();
        this.updateLives();
        this.pipes = [];
        this.bird.y = this.gameHeight / 2;
        this.bird.velocity = 0;
        
        // Iniciar bucle del juego
        this.lastPipeTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    gameLoop(timestamp) {
        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Dibujar fondo
        this.drawBackground();
        
        // Actualizar efecto de flotación
        this.floatOffset += this.floatSpeed;
        if (this.floatOffset > Math.PI * 2) {
            this.floatOffset = 0;
        }
        
        // Actualizar posición del pájaro
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;
        
        // Generar nuevos tubos
        if (timestamp - this.lastPipeTime > this.pipeInterval) {
            this.generatePipe();
            this.lastPipeTime = timestamp;
            console.log('Nuevo tubo generado');
        }
        
        // Actualizar y dibujar tubos
        this.updatePipes();
        
        // Dibujar el pájaro
        this.drawBird();
        
        // Comprobar colisiones
        this.checkCollisions();
        
        // Comprobar si el pájaro sale de la pantalla
        if (this.bird.y > this.gameHeight || this.bird.y < 0) {
            this.loseLife();
        }
        
        // Continuar el bucle si el juego sigue activo
        if (this.isPlaying) {
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
    }
    
    jump() {
        if (this.isPlaying) {
            this.bird.velocity = this.jumpForce;
            console.log('Salto: velocidad = ' + this.bird.velocity);
        }
    }
    
    generatePipe() {
        // Asegurar que el hueco no esté demasiado arriba o abajo
        const minGapPosition = 100; // Aumentado de 80 a 100 para evitar tubos muy arriba
        const maxGapPosition = this.gameHeight - this.pipeGap - 100; // Aumentado de 80 a 100 para evitar tubos muy abajo
        
        // Calcular posición del hueco
        const gapPosition = Math.random() * (maxGapPosition - minGapPosition) + minGapPosition;
        
        this.pipes.push({
            x: this.gameWidth,
            topHeight: gapPosition,
            bottomY: gapPosition + this.pipeGap,
            width: this.pipeWidth,
            passed: false,
            color: '#00FFFF' // Color cian neón
        });
        
        console.log('Tubo generado en posición Y: ' + gapPosition);
    }
    
    updatePipes() {
        // Si no hay tubos y estamos jugando, generar uno inmediatamente
        if (this.pipes.length === 0 && this.isPlaying) {
            this.generatePipe();
        }
        
        for (let i = 0; i < this.pipes.length; i++) {
            const pipe = this.pipes[i];
            
            // Mover el tubo
            pipe.x -= this.gameSpeed;
            
            // Dibujar el tubo
            this.drawPipe(pipe);
            
            // Comprobar si el pájaro ha pasado el tubo
            if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
                pipe.passed = true;
                this.score++;
                this.updateScore();
                console.log('Punto conseguido: ' + this.score);
                
                // Aumentar velocidad gradualmente, pero no demasiado y con menos frecuencia
                if (this.score % 10 === 0 && this.gameSpeed < 2.5) {
                    this.gameSpeed += 0.1; // Reducido de 0.2 a 0.1
                    console.log('Velocidad aumentada a: ' + this.gameSpeed);
                }
            }
            
            // Eliminar tubos que salen de la pantalla
            if (pipe.x + pipe.width < 0) {
                this.pipes.splice(i, 1);
                i--;
            }
        }
    }
    
    checkCollisions() {
        if (this.invulnerable) return;
        
        for (const pipe of this.pipes) {
            const hitboxMargin = 5;
            
            if (
                this.bird.x + this.bird.width - hitboxMargin > pipe.x &&
                this.bird.x + hitboxMargin < pipe.x + pipe.width &&
                this.bird.y + hitboxMargin < pipe.topHeight
            ) {
                console.log('Colisión con tubo superior');
                this.loseLife();
                break;
            }
            
            if (
                this.bird.x + this.bird.width - hitboxMargin > pipe.x &&
                this.bird.x + hitboxMargin < pipe.x + pipe.width &&
                this.bird.y + this.bird.height - hitboxMargin > pipe.bottomY
            ) {
                console.log('Colisión con tubo inferior');
                this.loseLife();
                break;
            }
        }
    }
    
    loseLife() {
        if (this.invulnerable) return;
        
        this.lives--;
        this.updateLives();
        console.log('Vida perdida. Vidas restantes: ' + this.lives);
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.bird.y = this.gameHeight / 2;
            this.bird.velocity = 0;
            
            const currentPipes = [...this.pipes];
            this.pipes = [];
            this.invulnerable = true;
            
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                if (this.isPlaying) {
                    this.bird.color = blinkCount % 2 === 0 ? '#FF00A0' : '#FFFFFF';
                    blinkCount++;
                    
                    if (blinkCount >= 6) {
                        clearInterval(blinkInterval);
                        this.bird.color = '#FF00A0';
                        this.invulnerable = false;
                    }
                } else {
                    clearInterval(blinkInterval);
                }
            }, 200);
            
            setTimeout(() => {
                if (this.isPlaying) {
                    this.pipes = currentPipes.filter(pipe => pipe.x > this.gameWidth / 2);
                }
            }, 1000);
        }
    }
    
    gameOver() {
        this.isPlaying = false;
        console.log('Juego terminado. Puntuación final: ' + this.score);
        
        this.gameOverlay.querySelector('.game-title').textContent = '¡Juego Terminado!';
        this.gameOverlay.querySelector('.game-description').textContent = `Has conseguido ${this.score} puntos. ¡Descarga la app para desbloquear más desafíos y obtener recompensas!`;
        this.gameOverlay.querySelector('.play-button').textContent = 'Jugar de nuevo';
        this.gameOverlay.classList.remove('hidden');
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateLives() {
        const lifeIcons = this.livesContainer.querySelectorAll('.life-icon');
        
        for (let i = 0; i < lifeIcons.length; i++) {
            if (i < this.lives) {
                lifeIcons[i].style.opacity = '1';
            } else {
                lifeIcons[i].style.opacity = '0.3';
            }
        }
    }
    
    drawBackground() {
        this.ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let y = 0; y < this.gameHeight; y += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.gameWidth, y);
            this.ctx.stroke();
        }
        
        for (let x = 0; x < this.gameWidth; x += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.gameHeight);
            this.ctx.stroke();
        }
    }
    
    drawBird() {
        // Calcular efecto de flotación (solo cuando no está jugando)
        let floatY = 0;
        if (!this.isPlaying) {
            floatY = Math.sin(this.floatOffset) * 5; // Movimiento suave arriba y abajo
        }
        
        // Dibujar trayectoria predictiva (solo cuando está cayendo)
        if (this.isPlaying && this.bird.velocity > 0) {
            this.ctx.strokeStyle = 'rgba(255, 0, 160, 0.2)';
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
            
            // Calcular posición futura aproximada
            const futureY = this.bird.y + this.bird.velocity * 10;
            this.ctx.lineTo(this.bird.x + this.bird.width / 2 + 50, futureY);
            
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        // Dibujar el pájaro con efecto neón
        this.ctx.fillStyle = this.bird.color;
        this.ctx.beginPath();
        this.ctx.arc(
            this.bird.x + this.bird.width / 2,
            this.bird.y + this.bird.height / 2 + floatY,
            this.bird.width / 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Efecto de brillo neón
        this.ctx.strokeStyle = this.bird.color;
        this.ctx.shadowColor = this.bird.color;
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(
            this.bird.x + this.bird.width / 2,
            this.bird.y + this.bird.height / 2 + floatY,
            this.bird.width / 2,
            0,
            Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        
        // Dibujar ojo
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(
            this.bird.x + this.bird.width * 0.7,
            this.bird.y + this.bird.height * 0.4 + floatY,
            this.bird.width * 0.15,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Pupila
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(
            this.bird.x + this.bird.width * 0.75,
            this.bird.y + this.bird.height * 0.4 + floatY,
            this.bird.width * 0.05,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Añadir una pequeña estela cuando el pájaro está en movimiento
        if (this.isPlaying && Math.abs(this.bird.velocity) > 1) {
            const trailLength = Math.min(Math.abs(this.bird.velocity) * 2, 20);
            const trailDirection = this.bird.velocity > 0 ? -1 : 1;
            
            this.ctx.fillStyle = 'rgba(255, 0, 160, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(
                this.bird.x + this.bird.width / 2,
                this.bird.y + this.bird.height / 2 + (trailDirection * trailLength) + floatY,
                this.bird.width / 3,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
    }
    
    drawPipe(pipe) {
        // Dibujar tubo superior
        this.ctx.fillStyle = pipe.color;
        this.ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        
        // Dibujar tubo inferior
        this.ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, this.gameHeight - pipe.bottomY);
        
        // Efecto de brillo neón
        this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = pipe.color;
        this.ctx.shadowBlur = 10;
        
        // Contorno tubo superior
        this.ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
        
        // Contorno tubo inferior
        this.ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, this.gameHeight - pipe.bottomY);
        
        // Añadir borde inferior al tubo superior para mejor visibilidad
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(pipe.x, pipe.topHeight);
        this.ctx.lineTo(pipe.x + pipe.width, pipe.topHeight);
        this.ctx.stroke();
        
        // Añadir borde superior al tubo inferior para mejor visibilidad
        this.ctx.beginPath();
        this.ctx.moveTo(pipe.x, pipe.bottomY);
        this.ctx.lineTo(pipe.x + pipe.width, pipe.bottomY);
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('game-canvas')) {
        console.log('Inicializando FlappyBraves...');
        const game = new FlappyBraves();
    } else {
        console.error('No se encontró el elemento game-canvas');
    }
}); 