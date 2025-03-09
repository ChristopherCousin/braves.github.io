/**
 * Sistema de Retención y FOMO (Fear Of Missing Out)
 * Este sistema implementa mecanismos para generar miedo a perderse contenido
 * y penalizar la ausencia del jugador.
 */

class RetentionSystem {
    constructor(game) {
        this.game = game;
        
        // Seguimiento de sesiones
        this.lastPlayDate = null;
        this.consecutiveDays = 0;
        this.maxConsecutiveDays = 0;
        
        // Multiplicador de progreso que disminuye si no juega
        this.progressMultiplier = 1.0;
        
        // Cargar datos guardados si existen
        this.loadRetentionData();
    }
    
    /**
     * Carga los datos de retención guardados
     */
    loadRetentionData() {
        try {
            const savedData = localStorage.getItem('flappyBravesRetention');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.lastPlayDate = data.lastPlayDate ? new Date(data.lastPlayDate) : null;
                this.consecutiveDays = data.consecutiveDays || 0;
                this.maxConsecutiveDays = data.maxConsecutiveDays || 0;
                this.progressMultiplier = data.progressMultiplier || 1.0;
            }
        } catch (e) {
            console.error('Error cargando datos de retención:', e);
            // Reiniciar datos si hay error
            this.lastPlayDate = null;
            this.consecutiveDays = 0;
            this.maxConsecutiveDays = 0;
            this.progressMultiplier = 1.0;
        }
    }
    
    /**
     * Guarda los datos de retención
     */
    saveRetentionData() {
        try {
            const dataToSave = {
                lastPlayDate: this.lastPlayDate,
                consecutiveDays: this.consecutiveDays,
                maxConsecutiveDays: this.maxConsecutiveDays,
                progressMultiplier: this.progressMultiplier
            };
            
            localStorage.setItem('flappyBravesRetention', JSON.stringify(dataToSave));
        } catch (e) {
            console.error('Error guardando datos de retención:', e);
        }
    }
    
    /**
     * Actualiza el estado de retención al iniciar el juego
     */
    updateRetentionStatus() {
        const currentDate = new Date();
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        
        // Comprobar si es la primera vez que juega
        if (!this.lastPlayDate) {
            this.lastPlayDate = today;
            this.consecutiveDays = 1;
            this.maxConsecutiveDays = 1;
            this.saveRetentionData();
            return;
        }
        
        // Convertir lastPlayDate de string a Date si es necesario
        const lastPlayDate = typeof this.lastPlayDate === 'string' ? 
            new Date(this.lastPlayDate) : 
            this.lastPlayDate;
        
        // Calcular diferencia en días
        const timeDiff = today.getTime() - lastPlayDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff === 0) {
            // Ya jugó hoy, no hacer nada
            return;
        } else if (daysDiff === 1) {
            // Jugó ayer, incrementar días consecutivos
            this.consecutiveDays++;
            if (this.consecutiveDays > this.maxConsecutiveDays) {
                this.maxConsecutiveDays = this.consecutiveDays;
            }
        } else {
            // No jugó ayer, reiniciar contador y aplicar penalización
            const previousConsecutiveDays = this.consecutiveDays;
            this.consecutiveDays = 1;
            
            // Penalización al multiplicador de progreso
            this.progressMultiplier = Math.max(0.5, this.progressMultiplier - (daysDiff * 0.1));
            
            // Mostrar mensaje de penalización
            this.showProgressLossMessage(previousConsecutiveDays, daysDiff);
        }
        
        // Actualizar fecha de último juego
        this.lastPlayDate = today;
        
        // Guardar datos
        this.saveRetentionData();
        
        // Comprobar recompensa diaria disponible
        this.checkDailyReward();
    }
    
    /**
     * Muestra un mensaje de pérdida de progreso
     * @param {number} previousStreak - Racha anterior de días consecutivos
     * @param {number} daysMissed - Días sin jugar
     */
    showProgressLossMessage(previousStreak, daysMissed) {
        // Crear overlay para el mensaje
        const lossOverlay = document.createElement('div');
        lossOverlay.className = 'progress-loss-overlay';
        lossOverlay.style.position = 'absolute';
        lossOverlay.style.zIndex = '1000';
        lossOverlay.style.top = '0';
        lossOverlay.style.left = '0';
        lossOverlay.style.width = '100%';
        lossOverlay.style.height = '100%';
        lossOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        lossOverlay.style.display = 'flex';
        lossOverlay.style.flexDirection = 'column';
        lossOverlay.style.justifyContent = 'center';
        lossOverlay.style.alignItems = 'center';
        lossOverlay.style.color = '#FF0000';
        lossOverlay.style.textAlign = 'center';
        
        // Calcular pérdidas
        const streakLost = previousStreak;
        const multiplierLoss = Math.min(0.5, daysMissed * 0.1).toFixed(2);
        
        // Contenido del mensaje (diseñado para maximizar el sentimiento de pérdida)
        lossOverlay.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 20px; animation: shake 0.5s infinite;">⚠️ ¡PROGRESO PERDIDO! ⚠️</div>
            <div style="font-size: 24px; margin-bottom: 10px;">Has estado ausente durante <span style="color: #FF5555; font-weight: bold;">${daysMissed} días</span></div>
            <div style="font-size: 20px; margin-bottom: 20px;">Tu racha de <span style="color: #FF5555; font-weight: bold;">${streakLost} días</span> se ha perdido</div>
            <div style="font-size: 18px; margin-bottom: 30px;">Tu multiplicador de progreso ha disminuido en <span style="color: #FF5555; font-weight: bold;">${multiplierLoss}x</span></div>
            <div style="font-size: 16px; margin-bottom: 20px;">Juega diariamente para recuperar tu progreso</div>
            <button id="loss-continue-btn" style="padding: 15px 30px; font-size: 20px; background-color: #FF3333; color: white; border: none; border-radius: 5px; cursor: pointer;">Continuar</button>
        `;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(lossOverlay);
        
        // Añadir evento al botón
        document.getElementById('loss-continue-btn').addEventListener('click', () => {
            lossOverlay.remove();
            
            // Mostrar ofertas de "recuperación" después
            setTimeout(() => {
                this.showRecoveryOffers(previousStreak);
            }, 500);
        });
    }
    
    /**
     * Muestra ofertas de recuperación después de perder progreso
     * @param {number} lostStreak - Racha perdida
     */
    showRecoveryOffers(lostStreak) {
        // Crear overlay para ofertas
        const offerOverlay = document.createElement('div');
        offerOverlay.className = 'recovery-offer-overlay';
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
        
        // Contenido de ofertas (con tiempo limitado para aumentar FOMO)
        offerOverlay.innerHTML = `
            <div style="font-size: 28px; margin-bottom: 20px; color: #FFD700;">¡OFERTA ESPECIAL DE RECUPERACIÓN!</div>
            <div style="font-size: 18px; margin-bottom: 30px;">Disponible solo durante las próximas <span style="color: #FF5555; font-weight: bold;" id="offer-timer">15:00</span></div>
            
            <div style="display: flex; justify-content: space-around; width: 100%; margin-bottom: 30px;">
                <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; width: 40%;">
                    <div style="font-size: 22px; color: #FFD700; margin-bottom: 10px;">Recupera tu racha</div>
                    <div style="font-size: 16px; margin-bottom: 15px;">Restaura tu racha de ${lostStreak} días y continúa acumulando recompensas</div>
                    <button id="recover-streak-btn" style="padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Recuperar ahora</button>
                </div>
                
                <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; width: 40%;">
                    <div style="font-size: 22px; color: #FFD700; margin-bottom: 10px;">Paquete de impulso</div>
                    <div style="font-size: 16px; margin-bottom: 15px;">Obtén un multiplicador x2 durante tu próxima partida</div>
                    <button id="boost-pack-btn" style="padding: 10px 20px; font-size: 16px; background-color: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">Obtener impulso</button>
                </div>
            </div>
            
            <button id="offer-skip-btn" style="padding: 10px 20px; font-size: 14px; background-color: transparent; color: #999; border: 1px solid #999; border-radius: 5px; cursor: pointer; margin-top: 20px;">No, gracias</button>
        `;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(offerOverlay);
        
        // Iniciar temporizador de cuenta atrás (15 minutos)
        let timeLeft = 15 * 60; // 15 minutos en segundos
        const timerElement = document.getElementById('offer-timer');
        
        const timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                offerOverlay.remove();
            }
        }, 1000);
        
        // Añadir eventos a los botones
        document.getElementById('recover-streak-btn').addEventListener('click', () => {
            clearInterval(timerInterval);
            offerOverlay.remove();
            
            // Restaurar racha
            this.consecutiveDays = lostStreak + 1;
            this.progressMultiplier = 1.0;
            this.saveRetentionData();
            
            // Mostrar mensaje de confirmación
            this.showConfirmationMessage('¡Racha recuperada!', '¡Has recuperado tu racha de días consecutivos!');
        });
        
        document.getElementById('boost-pack-btn').addEventListener('click', () => {
            clearInterval(timerInterval);
            offerOverlay.remove();
            
            // Aplicar impulso
            this.applyBoost(2, 1); // Multiplicador x2 para 1 partida
            
            // Mostrar mensaje de confirmación
            this.showConfirmationMessage('¡Impulso activado!', '¡Tu próxima partida tendrá un multiplicador x2!');
        });
        
        document.getElementById('offer-skip-btn').addEventListener('click', () => {
            clearInterval(timerInterval);
            offerOverlay.remove();
        });
    }
    
    /**
     * Muestra un mensaje de confirmación
     * @param {string} title - Título del mensaje
     * @param {string} message - Contenido del mensaje
     */
    showConfirmationMessage(title, message) {
        // Crear elemento para el mensaje
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'confirmation-message';
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
        confirmationMessage.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
        
        // Contenido del mensaje
        confirmationMessage.innerHTML = `
            <div style="font-size: 24px; color: #4CAF50; margin-bottom: 10px;">${title}</div>
            <div style="font-size: 16px; margin-bottom: 20px;">${message}</div>
            <button id="confirm-ok-btn" style="padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">¡Genial!</button>
        `;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(confirmationMessage);
        
        // Añadir evento al botón
        document.getElementById('confirm-ok-btn').addEventListener('click', () => {
            confirmationMessage.remove();
        });
        
        // Eliminar después de un tiempo si el usuario no interactúa
        setTimeout(() => {
            if (document.body.contains(confirmationMessage)) {
                confirmationMessage.remove();
            }
        }, 5000);
    }
    
    /**
     * Aplica un impulso al jugador
     * @param {number} multiplier - Multiplicador a aplicar
     * @param {number} duration - Duración en partidas
     */
    applyBoost(multiplier, duration) {
        // Guardar el impulso en localStorage para aplicarlo en la próxima partida
        try {
            localStorage.setItem('flappyBravesBoost', JSON.stringify({
                multiplier: multiplier,
                remainingGames: duration
            }));
        } catch (e) {
            console.error('Error guardando impulso:', e);
        }
    }
    
    /**
     * Inicializa el sistema al cargar el juego
     */
    initialize() {
        // Actualizar estado de retención
        this.updateRetentionStatus();
        
        // Inicializar eventos y elementos de tiempo limitado
        this.initializeLimitedTimeEvents();
        this.initializeLimitedTimeItems();
    }
}

// Exportar la clase
export default RetentionSystem; 