/**
 * Sistema de Adicción para Flappy Braves
 * Este archivo integra todos los sistemas diseñados para maximizar la adicción
 * en el juego Flappy Braves.
 */

import {
    RewardSystem,
    RetentionSystem,
    DailyRewardSystem,
    LimitedTimeSystem,
    FeedbackSystem
} from './systems/index.js';

/**
 * Inicializa y conecta todos los sistemas de adicción con el juego
 * @param {FlappyBraves} game - Instancia del juego
 */
export function initializeAddictionSystems(game) {
    console.log('Inicializando sistemas de adicción...');
    
    // Crear instancias de los sistemas
    game.rewardSystem = new RewardSystem(game);
    game.retentionSystem = new RetentionSystem(game);
    game.dailyRewardSystem = new DailyRewardSystem(game, game.retentionSystem);
    game.limitedTimeSystem = new LimitedTimeSystem(game);
    game.feedbackSystem = new FeedbackSystem(game);
    
    // Inicializar sistemas
    game.retentionSystem.initialize();
    game.dailyRewardSystem.initialize();
    game.limitedTimeSystem.initialize();
    game.feedbackSystem.initialize();
    
    // Modificar métodos existentes para integrar los sistemas
    
    // Guardar referencia al método original de updateScore
    const originalUpdateScore = game.updateScore;
    
    // Sobrescribir updateScore para añadir retroalimentación sensorial
    game.updateScore = function() {
        // Llamar al método original
        originalUpdateScore.call(this);
        
        // Añadir retroalimentación sensorial
        this.feedbackSystem.provideSensoryFeedback('point', 1);
    };
    
    // Guardar referencia al método original de gameLoop
    const originalGameLoop = game.gameLoop;
    
    // Sobrescribir gameLoop para actualizar el sistema de recompensas
    game.gameLoop = function(timestamp) {
        // Llamar al método original
        originalGameLoop.call(this, timestamp);
        
        // Actualizar sistema de recompensas si el juego está activo
        if (this.isPlaying) {
            this.rewardSystem.update(timestamp - this.lastTimestamp);
        }
    };
    
    // Guardar referencia al método original de loseLife
    const originalLoseLife = game.loseLife;
    
    // Sobrescribir loseLife para añadir retroalimentación sensorial negativa
    game.loseLife = function() {
        // Llamar al método original
        originalLoseLife.call(this);
        
        // Mostrar oferta de recuperación si es la última vida
        if (this.lives === 0) {
            setTimeout(() => {
                showContinueOffer(game);
            }, 1000);
        }
    };
    
    // Guardar referencia al método original de gameOver
    const originalGameOver = game.gameOver;
    
    // Sobrescribir gameOver para mostrar ofertas y recompensas
    game.gameOver = function() {
        // Llamar al método original
        originalGameOver.call(this);
        
        // Mostrar ofertas después de game over
        setTimeout(() => {
            showPostGameOffers(game);
        }, 1500);
    };
    
    console.log('Sistemas de adicción inicializados correctamente');
}

/**
 * Muestra una oferta para continuar después de perder la última vida
 * @param {FlappyBraves} game - Instancia del juego
 */
function showContinueOffer(game) {
    // Solo mostrar si el juego está en estado de game over
    if (game.isPlaying) return;
    
    // Crear overlay para la oferta
    const offerOverlay = document.createElement('div');
    offerOverlay.className = 'continue-offer-overlay';
    offerOverlay.style.position = 'absolute';
    offerOverlay.style.zIndex = '1000';
    offerOverlay.style.top = '0';
    offerOverlay.style.left = '0';
    offerOverlay.style.width = '100%';
    offerOverlay.style.height = '100%';
    offerOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    offerOverlay.style.display = 'flex';
    offerOverlay.style.flexDirection = 'column';
    offerOverlay.style.justifyContent = 'center';
    offerOverlay.style.alignItems = 'center';
    offerOverlay.style.color = 'white';
    offerOverlay.style.textAlign = 'center';
    
    // Contenido de la oferta con temporizador
    offerOverlay.innerHTML = `
        <div style="font-size: 32px; color: #FF0000; margin-bottom: 20px;">¡NO TE RINDAS!</div>
        <div style="font-size: 20px; margin-bottom: 30px;">¿Quieres continuar desde donde lo dejaste?</div>
        
        <div style="font-size: 18px; margin-bottom: 20px;">
            Esta oferta expira en <span id="continue-timer" style="color: #FF0000; font-weight: bold;">10</span> segundos
        </div>
        
        <button id="continue-btn" style="padding: 15px 30px; font-size: 20px; background-color: #FF0000; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 15px;">¡CONTINUAR AHORA!</button>
        <button id="no-thanks-btn" style="padding: 10px 20px; font-size: 16px; background-color: transparent; color: #999; border: 1px solid #999; border-radius: 5px; cursor: pointer;">No, gracias</button>
    `;
    
    // Añadir al DOM
    game.gameCanvas.parentElement.appendChild(offerOverlay);
    
    // Iniciar temporizador
    let timeLeft = 10;
    const timerElement = document.getElementById('continue-timer');
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (document.body.contains(offerOverlay)) {
                offerOverlay.remove();
            }
        }
    }, 1000);
    
    // Añadir eventos a los botones
    document.getElementById('continue-btn').addEventListener('click', () => {
        clearInterval(timerInterval);
        offerOverlay.remove();
        
        // Restaurar una vida y continuar
        game.lives = 1;
        game.updateLives();
        game.invulnerable = true;
        game.character.setInvulnerable(true);
        
        // Hacer al jugador invulnerable temporalmente
        setTimeout(() => {
            game.invulnerable = false;
            game.character.setInvulnerable(false);
        }, 3000);
        
        // Reanudar el juego
        game.isPlaying = true;
        
        // Mostrar mensaje de confirmación
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'continue-confirmation';
        confirmationMessage.style.position = 'absolute';
        confirmationMessage.style.zIndex = '1000';
        confirmationMessage.style.top = '50%';
        confirmationMessage.style.left = '50%';
        confirmationMessage.style.transform = 'translate(-50%, -50%)';
        confirmationMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        confirmationMessage.style.padding = '20px';
        confirmationMessage.style.borderRadius = '10px';
        confirmationMessage.style.color = 'white';
        confirmationMessage.style.textAlign = 'center';
        confirmationMessage.style.fontSize = '24px';
        confirmationMessage.innerHTML = '¡Continúa jugando!';
        
        game.gameCanvas.parentElement.appendChild(confirmationMessage);
        
        // Añadir efectos visuales
        game.feedbackSystem.createScreenFlash('rgba(0, 255, 0, 0.3)', 1000);
        
        // Eliminar mensaje después de un tiempo
        setTimeout(() => {
            confirmationMessage.remove();
        }, 2000);
    });
    
    document.getElementById('no-thanks-btn').addEventListener('click', () => {
        clearInterval(timerInterval);
        offerOverlay.remove();
    });
}

/**
 * Muestra ofertas después de terminar el juego
 * @param {FlappyBraves} game - Instancia del juego
 */
function showPostGameOffers(game) {
    // Crear overlay para las ofertas
    const offersOverlay = document.createElement('div');
    offersOverlay.className = 'post-game-offers-overlay';
    offersOverlay.style.position = 'absolute';
    offersOverlay.style.zIndex = '1000';
    offersOverlay.style.top = '0';
    offersOverlay.style.left = '0';
    offersOverlay.style.width = '100%';
    offersOverlay.style.height = '100%';
    offersOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    offersOverlay.style.display = 'flex';
    offersOverlay.style.flexDirection = 'column';
    offersOverlay.style.justifyContent = 'center';
    offersOverlay.style.alignItems = 'center';
    offersOverlay.style.color = 'white';
    offersOverlay.style.textAlign = 'center';
    
    // Contenido de las ofertas
    offersOverlay.innerHTML = `
        <div style="font-size: 32px; color: #FFD700; margin-bottom: 20px;">¡MEJORA TU PRÓXIMA PARTIDA!</div>
        
        <div style="display: flex; justify-content: space-around; width: 100%; margin-bottom: 30px;">
            <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; width: 30%;">
                <div style="font-size: 22px; color: #FFD700; margin-bottom: 10px;">Impulso de Puntos</div>
                <div style="font-size: 40px; margin: 10px 0;">🔥</div>
                <div style="font-size: 16px; margin-bottom: 15px;">Duplica tus puntos en la próxima partida</div>
                <button class="boost-btn" data-boost="points" style="padding: 10px 20px; font-size: 16px; background-color: #FF5722; color: white; border: none; border-radius: 5px; cursor: pointer;">Activar</button>
            </div>
            
            <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; width: 30%;">
                <div style="font-size: 22px; color: #FFD700; margin-bottom: 10px;">Vidas Extra</div>
                <div style="font-size: 40px; margin: 10px 0;">❤️</div>
                <div style="font-size: 16px; margin-bottom: 15px;">Comienza con 5 vidas en lugar de 3</div>
                <button class="boost-btn" data-boost="lives" style="padding: 10px 20px; font-size: 16px; background-color: #E91E63; color: white; border: none; border-radius: 5px; cursor: pointer;">Activar</button>
            </div>
            
            <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; width: 30%;">
                <div style="font-size: 22px; color: #FFD700; margin-bottom: 10px;">Escudo Protector</div>
                <div style="font-size: 40px; margin: 10px 0;">🛡️</div>
                <div style="font-size: 16px; margin-bottom: 15px;">Comienza con 30 segundos de invulnerabilidad</div>
                <button class="boost-btn" data-boost="shield" style="padding: 10px 20px; font-size: 16px; background-color: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">Activar</button>
            </div>
        </div>
        
        <button id="play-again-btn" style="padding: 15px 30px; font-size: 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">Jugar de nuevo</button>
        <button id="close-offers-btn" style="padding: 10px 20px; font-size: 16px; background-color: transparent; color: #999; border: 1px solid #999; border-radius: 5px; cursor: pointer; margin-top: 15px;">Cerrar</button>
    `;
    
    // Añadir al DOM
    game.gameCanvas.parentElement.appendChild(offersOverlay);
    
    // Añadir eventos a los botones de impulso
    const boostButtons = document.querySelectorAll('.boost-btn');
    boostButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const boostType = e.target.getAttribute('data-boost');
            
            // Guardar el impulso en localStorage
            try {
                localStorage.setItem('flappyBravesBoost', JSON.stringify({
                    type: boostType,
                    active: true
                }));
                
                // Cambiar estilo del botón para indicar que está activado
                e.target.style.backgroundColor = '#4CAF50';
                e.target.textContent = '✓ Activado';
                e.target.disabled = true;
                
                // Desactivar otros botones
                boostButtons.forEach(otherButton => {
                    if (otherButton !== e.target) {
                        otherButton.disabled = true;
                        otherButton.style.opacity = '0.5';
                    }
                });
                
                // Mostrar mensaje de confirmación
                const confirmationMessage = document.createElement('div');
                confirmationMessage.className = 'boost-confirmation';
                confirmationMessage.style.position = 'absolute';
                confirmationMessage.style.zIndex = '1001';
                confirmationMessage.style.top = '50%';
                confirmationMessage.style.left = '50%';
                confirmationMessage.style.transform = 'translate(-50%, -50%)';
                confirmationMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                confirmationMessage.style.padding = '20px';
                confirmationMessage.style.borderRadius = '10px';
                confirmationMessage.style.color = 'white';
                confirmationMessage.style.textAlign = 'center';
                
                let boostName = '';
                switch (boostType) {
                    case 'points': boostName = 'Impulso de Puntos'; break;
                    case 'lives': boostName = 'Vidas Extra'; break;
                    case 'shield': boostName = 'Escudo Protector'; break;
                }
                
                confirmationMessage.innerHTML = `
                    <div style="font-size: 24px; color: #4CAF50; margin-bottom: 10px;">¡${boostName} Activado!</div>
                    <div style="font-size: 16px; margin-bottom: 20px;">Este impulso estará disponible en tu próxima partida.</div>
                    <button id="confirm-ok-btn" style="padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">¡Genial!</button>
                `;
                
                game.gameCanvas.parentElement.appendChild(confirmationMessage);
                
                // Añadir evento al botón de confirmación
                document.getElementById('confirm-ok-btn').addEventListener('click', () => {
                    confirmationMessage.remove();
                });
                
                // Eliminar después de un tiempo si el usuario no interactúa
                setTimeout(() => {
                    if (document.body.contains(confirmationMessage)) {
                        confirmationMessage.remove();
                    }
                }, 5000);
            } catch (e) {
                console.error('Error guardando impulso:', e);
            }
        });
    });
    
    // Añadir eventos a los botones principales
    document.getElementById('play-again-btn').addEventListener('click', () => {
        offersOverlay.remove();
        
        // Reiniciar el juego
        game.score = 0;
        game.lives = 3;
        game.updateLives();
        game.updateScore();
        game.pipes = [];
        game.character.y = game.gameHeight / 2;
        game.character.velocity = 0;
        game.gameSpeed = game.initialGameSpeed;
        game.difficultyLevel = 1;
        game.lastLevelUpScore = 0;
        
        // Comprobar si hay impulsos activos
        try {
            const savedBoost = localStorage.getItem('flappyBravesBoost');
            if (savedBoost) {
                const boost = JSON.parse(savedBoost);
                if (boost.active) {
                    // Aplicar el impulso
                    switch (boost.type) {
                        case 'points':
                            // Implementar multiplicador de puntos
                            break;
                        case 'lives':
                            game.lives = 5;
                            game.updateLives();
                            break;
                        case 'shield':
                            game.invulnerable = true;
                            game.character.setInvulnerable(true);
                            setTimeout(() => {
                                game.invulnerable = false;
                                game.character.setInvulnerable(false);
                            }, 30000);
                            break;
                    }
                    
                    // Marcar como usado
                    localStorage.setItem('flappyBravesBoost', JSON.stringify({
                        type: boost.type,
                        active: false
                    }));
                }
            }
        } catch (e) {
            console.error('Error aplicando impulso:', e);
        }
        
        // Iniciar el juego
        game.startGame();
    });
    
    document.getElementById('close-offers-btn').addEventListener('click', () => {
        offersOverlay.remove();
    });
}

/**
 * Aplica los sistemas de adicción a una instancia existente del juego
 * @param {FlappyBraves} game - Instancia del juego
 */
export function applyAddictionSystems(game) {
    // Inicializar sistemas
    initializeAddictionSystems(game);
    
    console.log('Sistemas de adicción aplicados correctamente');
} 