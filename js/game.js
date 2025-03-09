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
        this.gameSpeed = 2.0; // Velocidad base
        this.gravity = 0.25; // Gravedad aumentada para que el personaje caiga más rápido
        this.jumpForce = -3.5; // Aumentado para un salto mucho más potente
        this.invulnerable = false;
        this.floatOffset = 0; // Para el efecto de flotación
        this.floatSpeed = 0.05; // Velocidad del efecto de flotación
        this.lastTimestamp = 0;
        
        // Sistema de dificultad progresiva
        this.initialGameSpeed = 2.0;
        this.maxGameSpeed = 5.0; // Aumentado para mayor desafío en niveles altos
        this.speedIncreasePerPoint = 0.02; // Reducido para una progresión más suave
        this.difficultyLevel = 1;
        this.pointsForNextLevel = 15; // Aumentado para que los niveles sean menos frecuentes
        this.levelPointsIncrement = 5; // Cada nivel requiere 5 puntos más que el anterior
        this.lastLevelUpScore = 0; // Puntuación del último nivel
        this.isLevelTransitioning = false; // Control de transiciones de nivel
        
        // Sistema de bonificaciones
        this.bonuses = [
            {
                id: 'shield',
                name: 'Escudo Protector',
                description: 'Invulnerabilidad durante 10 segundos',
                icon: '��️',
                duration: 10000,
                active: false,
                apply: () => {
                    this.invulnerable = true;
                    this.character.setInvulnerable(true);
                    this.showBonusTimer('shield', 10);
                    
                    // Efecto visual específico para el escudo
                    this.createBonusEffect('shield');
                    
                    setTimeout(() => {
                        this.invulnerable = false;
                        this.character.setInvulnerable(false);
                        this.removeBonusTimer('shield');
                    }, 10000);
                }
            },
            {
                id: 'extraLife',
                name: 'Vida Extra',
                description: 'Añade una vida adicional',
                icon: '❤️',
                duration: 0, // Instantáneo
                active: false,
                apply: () => {
                    this.lives++;
                    this.updateLives();
                    
                    // Efecto visual específico para vida extra
                    this.createBonusEffect('extraLife');
                }
            },
            {
                id: 'slowMotion',
                name: 'Cámara Lenta',
                description: 'Reduce la velocidad del juego durante 15 segundos',
                icon: '⏱️',
                duration: 15000,
                active: false,
                apply: () => {
                    const originalSpeed = this.gameSpeed;
                    this.gameSpeed *= 0.6;
                    this.showBonusTimer('slowMotion', 15);
                    
                    // Efecto visual específico para cámara lenta
                    this.createBonusEffect('slowMotion');
                    
                    setTimeout(() => {
                        this.gameSpeed = originalSpeed;
                        this.removeBonusTimer('slowMotion');
                    }, 15000);
                }
            },
            {
                id: 'widerGaps',
                name: 'Huecos Amplios',
                description: 'Aumenta el tamaño de los huecos durante 20 segundos',
                icon: '↔️',
                duration: 20000,
                active: false,
                apply: () => {
                    const originalGap = this.pipeGap;
                    this.pipeGap *= 1.5;
                    this.showBonusTimer('widerGaps', 20);
                    
                    // Efecto visual específico para huecos amplios
                    this.createBonusEffect('widerGaps');
                    
                    setTimeout(() => {
                        this.pipeGap = originalGap;
                        this.removeBonusTimer('widerGaps');
                    }, 20000);
                }
            },
            {
                id: 'doublePoints',
                name: 'Puntos Dobles',
                description: 'Duplica los puntos obtenidos durante 30 segundos',
                icon: '✖️2',
                duration: 30000,
                active: false,
                apply: () => {
                    this.doublePointsActive = true;
                    this.showBonusTimer('doublePoints', 30);
                    
                    // Efecto visual específico para puntos dobles
                    this.createBonusEffect('doublePoints');
                    
                    setTimeout(() => {
                        this.doublePointsActive = false;
                        this.removeBonusTimer('doublePoints');
                    }, 30000);
                }
            }
        ];
        
        // Contenedor para los temporizadores de bonificaciones activas
        this.activeBonus = {};
        
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
        this.pipeGap = 200; // Espacio entre tubos superior e inferior
        this.pipeInterval = 2000; // Reducido de 2500 a 2000 ms para más acción
        this.lastPipeTime = 0;
        
        // Nuevos tipos de obstáculos
        this.obstacleTypes = ['normal', 'moving', 'narrow', 'wide'];
        this.currentObstacleType = 'normal';
        this.obstacleVariationInterval = 10; // Cambiar tipo de obstáculo cada 10 puntos
        
        // Sistema de puntuación y récords
        this.highScore = this.loadHighScore();
        
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
        // Dibujar el estado inicial del juego (personaje flotando)
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        this.drawBackground();
        
        // Valores iniciales para la animación
        let lastTime = 0;
        
        const animate = (timestamp) => {
            if (this.isPlaying) return; // Detener la animación cuando comience el juego
            
            // Calcular delta time
            const deltaTime = lastTime ? timestamp - lastTime : 0;
            lastTime = timestamp;
            
            // Normalizar deltaTime (convertir a segundos)
            const normalizedDelta = deltaTime / 1000;
            
            this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
            this.drawBackground();
            
            // Actualizar la posición de flotación del personaje
            this.floatOffset += this.floatSpeed * normalizedDelta * 60;
            const floatY = Math.sin(this.floatOffset) * 15;
            this.character.y = this.gameHeight / 2 - this.character.height / 2 + floatY;
            
            // Dibujar el personaje
            this.character.draw(false);
            
            requestAnimationFrame(animate);
        };
        
        // Iniciar la animación
        requestAnimationFrame(animate);
    }
    
    startGame() {
        // Ocultar overlay
        this.gameOverlay.classList.remove('animate-in');
        this.gameOverlay.classList.add('hidden');
        
        // Reiniciar estado del juego
        this.score = 0;
        this.lastLevelUpScore = 0;
        this.lives = 3;
        this.updateLives();
        this.updateScore();
        
        // Reiniciar velocidad y dificultad
        this.gameSpeed = this.initialGameSpeed;
        this.difficultyLevel = 1;
        this.isLevelTransitioning = false;
        
        // Reiniciar posición del personaje
        this.character.y = this.gameHeight / 2;
        this.character.velocity = 0;
        
        // Limpiar tubos
        this.pipes = [];
        
        // Reiniciar tiempo de último tubo
        this.lastPipeTime = performance.now();
        
        // Reiniciar bonificaciones activas
        this.doublePointsActive = false;
        this.activeBonus = {};
        
        // Eliminar cualquier temporizador de bonificación que pueda estar en pantalla
        const activeBonusContainer = document.querySelector('.active-bonuses');
        if (activeBonusContainer) {
            activeBonusContainer.remove();
        }
        
        // Marcar todas las bonificaciones como inactivas
        this.bonuses.forEach(bonus => {
            bonus.active = false;
        });
        
        // Iniciar el juego
        this.isPlaying = true;
        
        // Iniciar el bucle del juego
        if (!this.animationFrameId) {
            this.lastTimestamp = performance.now();
            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        }
        
        console.log('Juego iniciado. Nivel 1.');
    }
    
    gameLoop(timestamp) {
        // Calcular delta time
        const deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;
        
        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Dibujar fondo
        this.drawBackground();
        
        // Actualizar personaje
        this.character.update(this.isPlaying, deltaTime);
        
        if (this.isPlaying) {
            // Aplicar gravedad
            this.character.velocity += this.gravity * deltaTime * 60;
            
            // Generar nuevos tubos
            const currentTime = performance.now();
            if (currentTime - this.lastPipeTime > this.pipeInterval) {
                this.generatePipe();
                this.lastPipeTime = currentTime;
            }
            
            // Actualizar tubos
            this.updatePipes(deltaTime);
            
            // Comprobar colisiones
            this.checkCollisions();
            
            // Comprobar si el personaje sale de la pantalla
            if (this.character.y < 0) {
                this.character.y = 0;
                this.character.velocity = 0;
            } else if (this.character.y + this.character.height > this.gameHeight) {
                this.character.y = this.gameHeight - this.character.height;
                this.character.velocity = 0;
                
                // Perder vida si toca el suelo
                if (!this.invulnerable) {
                    this.loseLife();
                }
            }
        }
        
        // Dibujar personaje
        this.character.draw(this.isPlaying);
        
        // Mostrar hitbox si está activado
        if (this.showHitbox) {
            this.drawHitbox();
        }
        
        // Continuar el bucle si el juego está activo
        if (this.isPlaying) {
            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        } else {
            this.animationFrameId = null;
        }
    }
    
    jump() {
        if (!this.isPlaying) return;
        
        // Aplicar fuerza de salto con un pequeño impulso adicional si está cayendo rápido
        // Esto hace que el control sea más satisfactorio incluso cuando cae rápido
        const fallBoost = Math.min(Math.abs(this.character.velocity) * 0.2, 0.5);
        this.character.velocity = this.jumpForce - fallBoost;
        this.character.isJumping = true;
        this.character.jump();
        
        // Añadir un pequeño efecto de cámara al saltar
        this.addCameraShake(2, 100); // Sacudida sutil
    }
    
    generatePipe() {
        // Determinar el tipo de obstáculo basado en la puntuación
        if (this.score > 0 && this.score % this.obstacleVariationInterval === 0) {
            // Cambiar aleatoriamente el tipo de obstáculo
            const randomIndex = Math.floor(Math.random() * this.obstacleTypes.length);
            this.currentObstacleType = this.obstacleTypes[randomIndex];
        }
        
        // Altura mínima y máxima para el hueco
        const minGapY = 100;
        const maxGapY = this.gameHeight - 100 - this.pipeGap;
        
        // Calcular la posición del hueco
        let gapY;
        
        // Ajustar la posición del hueco según el tipo de obstáculo
        switch (this.currentObstacleType) {
            case 'moving':
                // Hueco que se mueve verticalmente
                gapY = Math.random() * (maxGapY - minGapY) + minGapY;
                break;
            case 'narrow':
                // Hueco más estrecho
                gapY = Math.random() * (maxGapY - minGapY) + minGapY;
                break;
            case 'wide':
                // Hueco más ancho pero con posición más impredecible
                gapY = Math.random() * (maxGapY - minGapY) + minGapY;
                break;
            default:
                // Obstáculo normal
                gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        }
        
        // Ajustar el tamaño del hueco según el tipo de obstáculo
        let actualGapSize = this.pipeGap;
        if (this.currentObstacleType === 'narrow') {
            actualGapSize = this.pipeGap * 0.8; // 20% más estrecho
        } else if (this.currentObstacleType === 'wide') {
            actualGapSize = this.pipeGap * 1.2; // 20% más ancho
        }
        
        // Crear el nuevo tubo
        const newPipe = {
            x: this.gameWidth,
            gapStart: gapY,
            gapSize: actualGapSize,
            passed: false,
            type: this.currentObstacleType,
            // Para obstáculos móviles
            movingUp: Math.random() > 0.5,
            movingSpeed: 1 + Math.random() * 2,
            movingRange: 100
        };
        
        this.pipes.push(newPipe);
    }
    
    updatePipes(deltaTime) {
        for (let i = 0; i < this.pipes.length; i++) {
            const pipe = this.pipes[i];
            
            // Mover el tubo con velocidad normalizada por deltaTime
            pipe.x -= this.gameSpeed * 2 * deltaTime * 60; // Multiplicar por 60 para normalizar a 60 FPS
            
            // Actualizar comportamiento especial según el tipo de obstáculo
            if (pipe.type === 'moving') {
                // Mover el hueco verticalmente
                if (pipe.movingUp) {
                    pipe.gapStart -= pipe.movingSpeed * deltaTime * 30;
                    if (pipe.gapStart < 50) {
                        pipe.movingUp = false;
                    }
                } else {
                    pipe.gapStart += pipe.movingSpeed * deltaTime * 30;
                    if (pipe.gapStart > this.gameHeight - pipe.gapSize - 50) {
                        pipe.movingUp = true;
                    }
                }
            }
            
            // Dibujar el tubo
            this.drawPipe(pipe);
            
            // Comprobar si el personaje ha pasado el tubo
            if (!pipe.passed && pipe.x + this.pipeWidth < this.character.x) {
                pipe.passed = true;
                
                // Aplicar puntos dobles si está activa la bonificación
                if (this.doublePointsActive) {
                    this.score += 2;
                    // Mostrar indicador visual de puntos dobles
                    this.showDoublePointsIndicator();
                } else {
                    this.score++;
                }
                
                this.updateScore();
                
                // Aumentar velocidad gradualmente
                this.gameSpeed += this.speedIncreasePerPoint;
                this.gameSpeed = Math.min(this.gameSpeed, this.maxGameSpeed); // Limitar velocidad máxima
                
                // Comprobar si se debe aumentar la dificultad
                if (this.score % this.pointsForNextLevel === 0) {
                    this.increaseDifficulty();
                }
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
            if (centerY > pipe.gapStart + pipe.gapSize) {
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
                closestY = pipe.gapStart + pipe.gapSize;
                
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
        
        // Mejorar el efecto visual de daño
        // 1. Efecto de sacudida en la pantalla más intenso
        const gameContainer = this.gameCanvas.parentElement;
        gameContainer.classList.add('damage', 'screen-shake-intense');
        
        // 2. Efecto de flash rojo más intenso
        this.gameCanvas.style.filter = 'saturate(2) contrast(1.5) brightness(1.2)';
        
        // 3. Crear partículas de impacto
        this.createCollisionParticles();
        
        // 4. Ralentizar brevemente el juego para dar sensación de impacto
        const originalSpeed = this.gameSpeed;
        this.gameSpeed *= 0.5;
        
        // Eliminar los efectos después de un tiempo
        setTimeout(() => {
            gameContainer.classList.remove('damage', 'screen-shake-intense');
            this.gameCanvas.style.filter = '';
            this.gameSpeed = originalSpeed;
        }, 300);
        
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
    
    // Nueva función para crear partículas de colisión
    createCollisionParticles() {
        const centerX = this.character.x + this.character.width / 2;
        const centerY = this.character.y + this.character.height / 2;
        
        // Colores para las partículas de colisión
        const colors = ['#FF5252', '#FF9800', '#FFEB3B', '#FFFFFF'];
        
        // Crear 20 partículas en todas direcciones
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const size = 3 + Math.random() * 5;
            const life = 0.8 + Math.random() * 0.4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Añadir partícula al sistema de partículas del personaje
            this.character.particlesArray.push({
                x: centerX,
                y: centerY,
                size: size,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                color: color,
                life: life,
                gravity: 0.05,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                shape: Math.random() > 0.7 ? 'star' : 'circle'
            });
        }
    }
    
    gameOver() {
        this.isPlaying = false;
        
        // Efecto de cámara intenso
        this.addCameraShake(10, 500);
        
        // Comprobar si es una nueva puntuación máxima
        const isNewHighScore = this.saveHighScore(this.score);
        
        // Mostrar overlay con puntuación
        setTimeout(() => {
            this.gameOverlay.classList.remove('hidden');
            const gameTitle = this.gameOverlay.querySelector('.game-title');
            
            if (isNewHighScore) {
                // Mostrar mensaje de nueva puntuación máxima
                gameTitle.innerHTML = `
                    <div class="new-record">¡NUEVO RÉCORD!</div>
                    <div class="final-score">Puntuación: ${this.score}</div>
                `;
                
                // Añadir efecto de celebración
                this.createCelebrationEffect();
            } else {
                // Mostrar mensaje normal
                gameTitle.innerHTML = `
                    <div class="final-score">Juego terminado</div>
                    <div class="score-details">
                        Puntuación: ${this.score}<br>
                        Récord: ${this.highScore}
                    </div>
                `;
            }
            
            // Cambiar texto del botón
            this.playButton.textContent = 'Jugar de nuevo';
            
            // Animar entrada del overlay
            this.gameOverlay.classList.add('animate-in');
        }, 500);
    }
    
    updateScore() {
        // Actualizar el elemento de puntuación
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            // Actualizar el valor
            scoreElement.textContent = this.score;
            
            // Asegurar que el contenedor sea visible
            const scoreContainer = document.querySelector('.game-score');
            if (scoreContainer) {
                scoreContainer.style.display = 'block';
                scoreContainer.style.visibility = 'visible';
                scoreContainer.style.opacity = '1';
                
                // Mostrar un indicador de puntos flotante
                this.showScoreIndicator();
            }
        }
        
        // Aumentar la velocidad del juego de forma progresiva
        // Pero con un límite más alto en niveles avanzados
        const maxSpeedForLevel = Math.min(this.initialGameSpeed + (this.difficultyLevel * 0.5), this.maxGameSpeed);
        this.gameSpeed = Math.min(
            this.initialGameSpeed + (this.score * this.speedIncreasePerPoint),
            maxSpeedForLevel
        );
        
        // Calcular puntos necesarios para el siguiente nivel
        // La fórmula hace que se necesiten más puntos en niveles más altos
        const pointsNeeded = this.pointsForNextLevel + ((this.difficultyLevel - 1) * this.levelPointsIncrement);
        
        // Comprobar si es hora de subir de nivel
        const pointsSinceLastLevel = this.score - this.lastLevelUpScore;
        if (!this.isLevelTransitioning && pointsSinceLastLevel >= pointsNeeded) {
            this.increaseDifficulty();
        }
        
        // Comprobar si se ha superado la puntuación máxima
        if (this.score > this.highScore && (this.score % 50 === 0 || this.score === this.highScore + 1)) {
            // Mostrar un indicador de nuevo récord solo en hitos importantes
            this.showNewHighScoreIndicator();
            
            // Añadir un efecto de celebración más notorio en hitos importantes
            if (this.score % 50 === 0) {
                this.createCelebrationEffect();
                // Pequeña recompensa: invulnerabilidad temporal
                this.invulnerable = true;
                this.character.setInvulnerable(true);
                setTimeout(() => {
                    this.invulnerable = false;
                    this.character.setInvulnerable(false);
                }, 3000);
            }
        }
    }
    
    // Restaurar la función para mostrar un indicador flotante de puntos
    showScoreIndicator(points = 1, isBonus = false) {
        // Crear elemento para mostrar el indicador
        const indicator = document.createElement('div');
        indicator.className = 'score-indicator';
        
        // Texto según si hay puntos dobles activos o es una bonificación
        if (isBonus) {
            indicator.textContent = `+${points}`;
            indicator.classList.add('bonus');
        } else if (this.doublePointsActive) {
            indicator.textContent = '+2';
            indicator.classList.add('double');
        } else {
            indicator.textContent = '+1';
        }
        
        // Calcular posición para que esté siempre visible dentro de la pantalla
        // Posición base cerca del personaje
        let posX = this.character.x + this.character.width;
        let posY = this.character.y - 20;
        
        // Asegurar que no se salga de los límites de la pantalla
        const indicatorWidth = 40; // Ancho aproximado del indicador
        const indicatorHeight = 30; // Alto aproximado del indicador
        
        // Ajustar posición X si se sale por la derecha
        if (posX + indicatorWidth > this.gameWidth) {
            posX = this.gameWidth - indicatorWidth;
        }
        
        // Ajustar posición Y si se sale por arriba
        if (posY < 0) {
            posY = 0;
        }
        
        // Posicionar el indicador
        indicator.style.position = 'absolute';
        indicator.style.left = `${posX}px`;
        indicator.style.top = `${posY}px`;
        
        // Añadir al contenedor del juego
        this.gameCanvas.parentElement.appendChild(indicator);
        
        // Animar y eliminar
        setTimeout(() => {
            indicator.classList.add('animate');
            setTimeout(() => {
                indicator.remove();
            }, 1000);
        }, 10);
    }
    
    // Nueva función para mostrar un indicador de nuevo récord
    showNewHighScoreIndicator() {
        // Crear elemento para mostrar el indicador
        const indicator = document.createElement('div');
        indicator.className = 'highscore-indicator';
        indicator.textContent = '¡NUEVO RÉCORD!';
        
        // Añadir al contenedor del juego
        this.gameCanvas.parentElement.appendChild(indicator);
        
        // Animar y eliminar
        setTimeout(() => {
            indicator.classList.add('show');
            setTimeout(() => {
                indicator.classList.remove('show');
                setTimeout(() => {
                    indicator.remove();
                }, 500);
            }, 2000);
        }, 10);
    }
    
    // Nueva función para aumentar la dificultad
    increaseDifficulty() {
        // Evitar múltiples llamadas si ya estamos en una transición
        if (this.isLevelTransitioning) return;
        
        // Marcar que estamos en una transición de nivel
        this.isLevelTransitioning = true;
        
        // Guardar la puntuación actual como la puntuación del último nivel
        this.lastLevelUpScore = this.score;
        
        // Aumentar el nivel
        this.difficultyLevel++;
        
        console.log(`Subiendo al nivel ${this.difficultyLevel}. Puntuación actual: ${this.score}`);
        
        // Pausar el juego
        this.isPlaying = false;
        
        // Añadir un efecto de cámara más intenso al subir de nivel
        this.addCameraShake(5, 300);
        
        // Mostrar mensaje de nivel
        this.showLevelMessage();
        
        // Ajustar parámetros según el nivel de dificultad
        switch (this.difficultyLevel) {
            case 2:
                // Nivel 2: Introducir obstáculos móviles
                this.pipeInterval = 1800;
                this.obstacleTypes = ['normal', 'moving', 'normal', 'narrow'];
                break;
            case 3:
                // Nivel 3: Más variedad y velocidad
                this.pipeInterval = 1700;
                this.obstacleTypes = ['normal', 'moving', 'narrow', 'wide'];
                this.speedIncreasePerPoint = 0.025;
                break;
            case 4:
                // Nivel 4: Desafío mayor
                this.pipeInterval = 1600;
                this.obstacleTypes = ['moving', 'narrow', 'wide', 'moving'];
                this.pipeGap = 190;
                break;
            case 5:
                // Nivel 5: Desafío extremo
                this.pipeInterval = 1500;
                this.obstacleTypes = ['moving', 'narrow', 'wide', 'moving'];
                this.pipeGap = 180;
                this.speedIncreasePerPoint = 0.03;
                break;
            default:
                // Niveles superiores: Aumentar velocidad y reducir intervalo gradualmente
                if (this.difficultyLevel > 5) {
                    // Hacer que la dificultad aumente de forma más gradual en niveles altos
                    this.pipeInterval = Math.max(1300, 1800 - (this.difficultyLevel - 5) * 50);
                    this.pipeGap = Math.max(160, 180 - (this.difficultyLevel - 5) * 2);
                    // Dar una vida extra cada 3 niveles después del nivel 5
                    if ((this.difficultyLevel - 5) % 3 === 0) {
                        this.lives++;
                        this.updateLives();
                        // Mostrar mensaje de vida extra
                        this.showExtraLifeMessage();
                    }
                }
        }
    }
    
    // Nueva función para mostrar mensaje de vida extra
    showExtraLifeMessage() {
        const message = document.createElement('div');
        message.className = 'extra-life-message';
        message.innerHTML = `
            <div class="extra-life-icon">❤️</div>
            <div class="extra-life-text">¡VIDA EXTRA!</div>
        `;
        
        // Añadir al DOM
        this.gameCanvas.parentElement.appendChild(message);
        
        // Animar entrada
        setTimeout(() => {
            message.classList.add('show');
            
            // Eliminar después de mostrar
            setTimeout(() => {
                message.classList.remove('show');
                setTimeout(() => {
                    message.remove();
                }, 500);
            }, 2000);
        }, 100);
    }
    
    // Nueva función para mostrar el selector de bonificaciones
    showBonusSelector() {
        // Crear el overlay para el selector de bonificaciones
        const bonusOverlay = document.createElement('div');
        bonusOverlay.className = 'bonus-selector-overlay';
        
        // Crear el contenedor del selector
        const bonusSelector = document.createElement('div');
        bonusSelector.className = 'bonus-selector';
        
        // Añadir título
        const title = document.createElement('h2');
        title.textContent = `¡Nivel ${this.difficultyLevel}! Elige una bonificación:`;
        bonusSelector.appendChild(title);
        
        // Seleccionar 5 bonificaciones aleatorias (o todas si hay menos de 5)
        const availableBonuses = [...this.bonuses];
        const selectedBonuses = [];
        
        for (let i = 0; i < Math.min(5, availableBonuses.length); i++) {
            const randomIndex = Math.floor(Math.random() * availableBonuses.length);
            selectedBonuses.push(availableBonuses.splice(randomIndex, 1)[0]);
        }
        
        // Crear los botones de bonificación
        const bonusOptions = document.createElement('div');
        bonusOptions.className = 'bonus-options';
        
        selectedBonuses.forEach(bonus => {
            const bonusButton = document.createElement('div');
            bonusButton.className = 'bonus-option';
            bonusButton.innerHTML = `
                <div class="bonus-icon">${bonus.icon}</div>
                <div class="bonus-info">
                    <h3>${bonus.name}</h3>
                    <p>${bonus.description}</p>
                </div>
            `;
            
            // Añadir evento de clic
            bonusButton.addEventListener('click', () => {
                // Aplicar la bonificación
                bonus.apply();
                
                // Mostrar mensaje de confirmación
                this.showBonusConfirmation(bonus);
                
                // Eliminar el overlay
                bonusOverlay.remove();
                
                // Reanudar el juego inmediatamente
                this.isPlaying = true;
                
                // Reiniciar el bucle del juego si es necesario
                if (!this.animationFrameId) {
                    this.lastTimestamp = performance.now();
                    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
                }
                
                // Finalizar la transición de nivel
                console.log(`Nivel ${this.difficultyLevel} iniciado. Necesitas ${this.pointsForNextLevel} puntos más para el siguiente nivel.`);
                this.isLevelTransitioning = false;
            });
            
            bonusOptions.appendChild(bonusButton);
        });
        
        bonusSelector.appendChild(bonusOptions);
        bonusOverlay.appendChild(bonusSelector);
        
        // Añadir al DOM
        document.body.appendChild(bonusOverlay);
    }
    
    // Nueva función para mostrar confirmación de bonificación seleccionada
    showBonusConfirmation(bonus) {
        const confirmation = document.createElement('div');
        confirmation.className = 'bonus-confirmation';
        confirmation.innerHTML = `
            <div class="bonus-icon large">${bonus.icon}</div>
            <h3>${bonus.name} activado</h3>
        `;
        
        // Añadir al DOM
        document.body.appendChild(confirmation);
        
        // Animar entrada
        setTimeout(() => {
            confirmation.classList.add('show');
        }, 100);
        
        // Eliminar después de mostrar
        setTimeout(() => {
            confirmation.classList.remove('show');
            setTimeout(() => {
                confirmation.remove();
            }, 500);
        }, 2000);
    }
    
    showLevelMessage() {
        // Crear elemento para mostrar el mensaje de nivel
        const levelOverlay = document.createElement('div');
        levelOverlay.className = 'level-overlay';
        
        // Crear el contenido del mensaje
        const levelMessage = document.createElement('div');
        levelMessage.className = 'level-message';
        levelMessage.innerHTML = `
            <div class="level-number">${this.difficultyLevel}</div>
            <div class="level-text">
                <h3>¡NIVEL ${this.difficultyLevel}!</h3>
                <p>${this.getLevelDescription()}</p>
            </div>
        `;
        
        // Añadir al overlay
        levelOverlay.appendChild(levelMessage);
        
        // Añadir al contenedor del juego
        this.gameCanvas.parentElement.appendChild(levelOverlay);
        
        // Animar entrada
        setTimeout(() => {
            levelOverlay.classList.add('show');
            
            // Crear efecto de partículas para el cambio de nivel
            this.createLevelUpParticles();
        }, 100);
        
        // Eliminar después de mostrar y mostrar selector de bonificaciones
        setTimeout(() => {
            levelOverlay.classList.remove('show');
            setTimeout(() => {
                levelOverlay.remove();
                
                // Mostrar selector de bonificaciones después de la animación
                this.showBonusSelector();
            }, 500);
        }, 2000);
    }
    
    getLevelDescription() {
        switch (this.difficultyLevel) {
            case 2:
                return "¡Cuidado! Algunos obstáculos ahora se mueven.";
            case 3:
                return "Mayor velocidad y obstáculos más desafiantes.";
            case 4:
                return "¡Desafío extremo! Espacios más estrechos.";
            case 5:
                return "¡Desafío extremo! Espacios más estrechos.";
            default:
                return `La dificultad aumenta. ¡Buena suerte!`;
        }
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
        // Color base para los tubos
        let pipeColor = '#4CAF50';
        let pipeBorderColor = '#388E3C';
        
        // Cambiar color según el tipo de obstáculo para dar pistas visuales
        switch (pipe.type) {
            case 'moving':
                pipeColor = '#FF9800';
                pipeBorderColor = '#F57C00';
                break;
            case 'narrow':
                pipeColor = '#F44336';
                pipeBorderColor = '#D32F2F';
                break;
            case 'wide':
                pipeColor = '#2196F3';
                pipeBorderColor = '#1976D2';
                break;
        }
        
        // Dibujar tubo superior
        this.ctx.fillStyle = pipeColor;
        this.ctx.strokeStyle = pipeBorderColor;
        this.ctx.lineWidth = 2;
        
        // Tubo superior
        this.ctx.beginPath();
        this.ctx.rect(pipe.x, 0, this.pipeWidth, pipe.gapStart);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Borde inferior del tubo superior
        this.ctx.fillStyle = pipeBorderColor;
        this.ctx.beginPath();
        this.ctx.rect(pipe.x - 5, pipe.gapStart - 10, this.pipeWidth + 10, 10);
        this.ctx.fill();
        
        // Tubo inferior
        this.ctx.fillStyle = pipeColor;
        this.ctx.beginPath();
        this.ctx.rect(pipe.x, pipe.gapStart + pipe.gapSize, this.pipeWidth, this.gameHeight - (pipe.gapStart + pipe.gapSize));
        this.ctx.fill();
        this.ctx.stroke();
        
        // Borde superior del tubo inferior
        this.ctx.fillStyle = pipeBorderColor;
        this.ctx.beginPath();
        this.ctx.rect(pipe.x - 5, pipe.gapStart + pipe.gapSize, this.pipeWidth + 10, 10);
        this.ctx.fill();
        
        // Añadir efectos visuales según el tipo
        if (pipe.type === 'moving') {
            // Indicador de movimiento
            this.ctx.fillStyle = '#FFF';
            this.ctx.beginPath();
            this.ctx.arc(pipe.x + this.pipeWidth / 2, pipe.gapStart + pipe.gapSize / 2, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
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
    
    // Nueva función para mostrar indicador de puntos dobles
    showDoublePointsIndicator() {
        // Crear elemento para mostrar el indicador
        const indicator = document.createElement('div');
        indicator.className = 'double-points-indicator';
        indicator.textContent = '+2';
        
        // Posicionar cerca del personaje
        indicator.style.position = 'absolute';
        indicator.style.left = `${this.character.x + this.character.width}px`;
        indicator.style.top = `${this.character.y}px`;
        
        // Añadir al contenedor del juego
        this.gameCanvas.parentElement.appendChild(indicator);
        
        // Animar y eliminar
        setTimeout(() => {
            indicator.classList.add('animate');
            setTimeout(() => {
                indicator.remove();
            }, 1000);
        }, 10);
    }
    
    // Nueva función para mostrar el temporizador de bonificación
    showBonusTimer(bonusId, seconds) {
        // Marcar la bonificación como activa
        const bonus = this.bonuses.find(b => b.id === bonusId);
        if (bonus) {
            bonus.active = true;
        }
        
        // Crear o actualizar el contenedor de bonificaciones activas si no existe
        let activeBonusContainer = document.querySelector('.active-bonuses');
        if (!activeBonusContainer) {
            activeBonusContainer = document.createElement('div');
            activeBonusContainer.className = 'active-bonuses';
            this.gameCanvas.parentElement.appendChild(activeBonusContainer);
        }
        
        // Crear el elemento del temporizador
        const timerElement = document.createElement('div');
        timerElement.className = 'bonus-timer';
        timerElement.dataset.bonusId = bonusId;
        
        // Obtener información de la bonificación
        const bonusInfo = this.bonuses.find(b => b.id === bonusId);
        
        timerElement.innerHTML = `
            <div class="bonus-timer-icon">${bonusInfo.icon}</div>
            <div class="bonus-timer-bar">
                <div class="bonus-timer-progress"></div>
            </div>
            <div class="bonus-timer-text">${seconds}s</div>
        `;
        
        // Añadir al contenedor
        activeBonusContainer.appendChild(timerElement);
        
        // Iniciar la animación de la barra de progreso
        const progressBar = timerElement.querySelector('.bonus-timer-progress');
        progressBar.style.transition = `width ${seconds}s linear`;
        
        // Forzar un reflow para que la transición funcione
        void progressBar.offsetWidth;
        
        // Iniciar la animación
        progressBar.style.width = '0%';
        
        // Actualizar el texto del temporizador cada segundo
        let timeLeft = seconds;
        this.activeBonus[bonusId] = setInterval(() => {
            timeLeft--;
            const textElement = timerElement.querySelector('.bonus-timer-text');
            if (textElement) {
                textElement.textContent = `${timeLeft}s`;
            }
            
            // Añadir clase de urgencia cuando queda poco tiempo
            if (timeLeft <= 5) {
                timerElement.classList.add('urgent');
            }
            
            if (timeLeft <= 0) {
                clearInterval(this.activeBonus[bonusId]);
            }
        }, 1000);
    }
    
    // Nueva función para eliminar el temporizador de bonificación
    removeBonusTimer(bonusId) {
        // Marcar la bonificación como inactiva
        const bonus = this.bonuses.find(b => b.id === bonusId);
        if (bonus) {
            bonus.active = false;
        }
        
        // Limpiar el intervalo
        if (this.activeBonus[bonusId]) {
            clearInterval(this.activeBonus[bonusId]);
            delete this.activeBonus[bonusId];
        }
        
        // Eliminar el elemento del temporizador
        const timerElement = document.querySelector(`.bonus-timer[data-bonus-id="${bonusId}"]`);
        if (timerElement) {
            timerElement.classList.add('fade-out');
            setTimeout(() => {
                timerElement.remove();
                
                // Eliminar el contenedor si no hay más bonificaciones activas
                const activeBonusContainer = document.querySelector('.active-bonuses');
                if (activeBonusContainer && activeBonusContainer.children.length === 0) {
                    activeBonusContainer.remove();
                }
            }, 500);
        }
    }
    
    // Nueva función para crear efectos visuales específicos para cada bonificación
    createBonusEffect(bonusId) {
        const centerX = this.character.x + this.character.width / 2;
        const centerY = this.character.y + this.character.height / 2;
        
        switch (bonusId) {
            case 'shield':
                // Crear efecto de escudo
                const shieldEffect = document.createElement('div');
                shieldEffect.className = 'shield-effect';
                shieldEffect.style.left = `${centerX - 50}px`;
                shieldEffect.style.top = `${centerY - 50}px`;
                this.gameCanvas.parentElement.appendChild(shieldEffect);
                
                // Eliminar después de la animación
                setTimeout(() => {
                    shieldEffect.remove();
                }, 1000);
                break;
                
            case 'extraLife':
                // Crear efecto de corazón flotante
                for (let i = 0; i < 5; i++) {
                    const heart = document.createElement('div');
                    heart.className = 'heart-particle';
                    heart.innerHTML = '❤️';
                    heart.style.left = `${centerX + (Math.random() * 40 - 20)}px`;
                    heart.style.top = `${centerY + (Math.random() * 40 - 20)}px`;
                    heart.style.animationDelay = `${Math.random() * 0.5}s`;
                    this.gameCanvas.parentElement.appendChild(heart);
                    
                    // Eliminar después de la animación
                    setTimeout(() => {
                        heart.remove();
                    }, 2000);
                }
                break;
                
            case 'slowMotion':
                // Crear efecto de ondas de tiempo
                const timeEffect = document.createElement('div');
                timeEffect.className = 'time-effect';
                timeEffect.style.left = `${centerX - 60}px`;
                timeEffect.style.top = `${centerY - 60}px`;
                this.gameCanvas.parentElement.appendChild(timeEffect);
                
                // Añadir clase para iniciar animación
                setTimeout(() => {
                    timeEffect.classList.add('active');
                }, 10);
                
                // Eliminar después de la animación
                setTimeout(() => {
                    timeEffect.remove();
                }, 2000);
                break;
                
            case 'widerGaps':
                // Crear efecto de expansión
                const expandEffect = document.createElement('div');
                expandEffect.className = 'expand-effect';
                expandEffect.style.left = `${centerX - 50}px`;
                expandEffect.style.top = `${centerY - 50}px`;
                this.gameCanvas.parentElement.appendChild(expandEffect);
                
                // Eliminar después de la animación
                setTimeout(() => {
                    expandEffect.remove();
                }, 1500);
                break;
                
            case 'doublePoints':
                // Crear efecto de multiplicador
                const multiplierEffect = document.createElement('div');
                multiplierEffect.className = 'multiplier-effect';
                multiplierEffect.innerHTML = '×2';
                multiplierEffect.style.left = `${centerX - 25}px`;
                multiplierEffect.style.top = `${centerY - 25}px`;
                this.gameCanvas.parentElement.appendChild(multiplierEffect);
                
                // Eliminar después de la animación
                setTimeout(() => {
                    multiplierEffect.remove();
                }, 2000);
                break;
        }
    }
    
    // Cargar puntuación máxima desde localStorage
    loadHighScore() {
        const savedScore = localStorage.getItem('flappyBraves:highScore');
        return savedScore ? parseInt(savedScore) : 0;
    }
    
    // Guardar puntuación máxima en localStorage
    saveHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem('flappyBraves:highScore', score.toString());
            return true; // Indica que se ha establecido un nuevo récord
        }
        return false;
    }
    
    // Nueva función para crear efecto de celebración
    createCelebrationEffect() {
        // Crear partículas de celebración
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'celebration-particle';
                
                // Colores aleatorios para las partículas
                const colors = ['#FF5252', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Formas aleatorias
                const shapes = ['circle', 'square', 'triangle', 'star'];
                const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
                
                particle.classList.add(randomShape);
                particle.style.backgroundColor = randomColor;
                
                // Posición aleatoria
                const x = Math.random() * this.gameWidth;
                const y = Math.random() * this.gameHeight;
                
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                
                // Añadir al DOM
                this.gameCanvas.parentElement.appendChild(particle);
                
                // Eliminar después de la animación
                setTimeout(() => {
                    particle.remove();
                }, 3000);
            }, Math.random() * 1500); // Distribuir la creación de partículas en el tiempo
        }
    }
    
    // Nueva función para crear partículas de subida de nivel
    createLevelUpParticles() {
        // Obtener el centro de la pantalla
        const centerX = this.gameWidth / 2;
        const centerY = this.gameHeight / 2;
        
        // Crear partículas en forma de explosión
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'level-particle';
            
            // Ángulo aleatorio
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            
            // Calcular posición basada en el ángulo
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Establecer posición y retardo
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            
            // Añadir al DOM
            this.gameCanvas.parentElement.appendChild(particle);
            
            // Eliminar después de la animación
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }
    
    // Nueva función para añadir efecto de sacudida de cámara
    addCameraShake(intensity, duration) {
        const gameContainer = this.gameCanvas.parentElement;
        gameContainer.classList.add('camera-shake');
        gameContainer.style.setProperty('--shake-intensity', `${intensity}px`);
        
        setTimeout(() => {
            gameContainer.classList.remove('camera-shake');
        }, duration);
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