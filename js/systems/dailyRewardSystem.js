/**
 * Sistema de Recompensas Diarias
 * Este sistema implementa recompensas diarias que aumentan con días consecutivos
 * para fomentar el inicio de sesión diario.
 */

class DailyRewardSystem {
    constructor(game, retentionSystem) {
        this.game = game;
        this.retentionSystem = retentionSystem;
        
        // Recompensas diarias que aumentan con días consecutivos
        this.dailyRewards = [
            { day: 1, reward: 10, icon: '🪙' },
            { day: 2, reward: 20, icon: '🪙' },
            { day: 3, reward: 30, icon: '🪙' },
            { day: 4, reward: 50, icon: '💰' },
            { day: 5, reward: 75, icon: '💰' },
            { day: 6, reward: 100, icon: '💎' },
            { day: 7, reward: 200, icon: '🎁' } // Recompensa semanal grande
        ];
        
        // Recompensas reclamadas
        this.claimedDailyRewards = {};
        
        // Cargar datos guardados
        this.loadDailyRewardData();
    }
    
    /**
     * Carga los datos de recompensas diarias guardados
     */
    loadDailyRewardData() {
        try {
            const savedData = localStorage.getItem('flappyBravesDailyRewards');
            if (savedData) {
                this.claimedDailyRewards = JSON.parse(savedData);
            }
        } catch (e) {
            console.error('Error cargando datos de recompensas diarias:', e);
            this.claimedDailyRewards = {};
        }
    }
    
    /**
     * Guarda los datos de recompensas diarias
     */
    saveDailyRewardData() {
        try {
            localStorage.setItem('flappyBravesDailyRewards', JSON.stringify(this.claimedDailyRewards));
        } catch (e) {
            console.error('Error guardando datos de recompensas diarias:', e);
        }
    }
    
    /**
     * Comprueba si hay una recompensa diaria disponible
     */
    checkDailyReward() {
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        
        // Comprobar si ya se ha reclamado la recompensa hoy
        if (this.claimedDailyRewards[dateString]) {
            return;
        }
        
        // Mostrar la recompensa diaria
        this.showDailyRewardDialog();
    }
    
    /**
     * Muestra el diálogo de recompensa diaria
     */
    showDailyRewardDialog() {
        // Determinar qué día de la semana es (basado en días consecutivos)
        const dayIndex = (this.retentionSystem.consecutiveDays - 1) % 7;
        const rewardInfo = this.dailyRewards[dayIndex];
        
        // Crear overlay para el diálogo
        const rewardOverlay = document.createElement('div');
        rewardOverlay.className = 'daily-reward-overlay';
        rewardOverlay.style.position = 'absolute';
        rewardOverlay.style.zIndex = '1000';
        rewardOverlay.style.top = '0';
        rewardOverlay.style.left = '0';
        rewardOverlay.style.width = '100%';
        rewardOverlay.style.height = '100%';
        rewardOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        rewardOverlay.style.display = 'flex';
        rewardOverlay.style.justifyContent = 'center';
        rewardOverlay.style.alignItems = 'center';
        
        // Crear el contenedor del diálogo
        const rewardDialog = document.createElement('div');
        rewardDialog.className = 'daily-reward-dialog';
        rewardDialog.style.backgroundColor = 'rgba(50, 50, 50, 0.95)';
        rewardDialog.style.borderRadius = '15px';
        rewardDialog.style.padding = '30px';
        rewardDialog.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
        rewardDialog.style.textAlign = 'center';
        rewardDialog.style.maxWidth = '80%';
        rewardDialog.style.color = 'white';
        
        // Contenido del diálogo
        rewardDialog.innerHTML = `
            <div style="font-size: 28px; color: #FFD700; margin-bottom: 20px;">¡RECOMPENSA DIARIA!</div>
            <div style="font-size: 18px; margin-bottom: 10px;">Día ${this.retentionSystem.consecutiveDays} consecutivo</div>
            
            <div style="display: flex; justify-content: space-around; margin: 30px 0;">
                ${this.generateDailyRewardCalendar()}
            </div>
            
            <div style="font-size: 24px; margin: 20px 0; animation: pulse 1s infinite alternate;">
                <span style="font-size: 40px;">${rewardInfo.icon}</span>
                <span style="color: #FFD700; font-weight: bold;">+${rewardInfo.reward}</span>
            </div>
            
            <div style="font-size: 16px; margin-bottom: 20px; color: #AAA;">
                Vuelve mañana para obtener una recompensa aún mayor
            </div>
            
            <button id="claim-reward-btn" style="padding: 15px 30px; font-size: 18px; background-color: #FFD700; color: black; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">RECLAMAR</button>
        `;
        
        // Añadir el diálogo al overlay
        rewardOverlay.appendChild(rewardDialog);
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(rewardOverlay);
        
        // Añadir evento al botón
        document.getElementById('claim-reward-btn').addEventListener('click', () => {
            // Marcar como reclamada
            const today = new Date();
            const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            this.claimedDailyRewards[dateString] = true;
            this.saveDailyRewardData();
            
            // Dar la recompensa
            if (this.game.rewardSystem) {
                this.game.rewardSystem.currency += rewardInfo.reward;
                this.game.rewardSystem.updateCurrencyDisplay();
            }
            
            // Mostrar animación de recompensa
            this.showRewardClaimAnimation(rewardInfo);
            
            // Cerrar el diálogo
            rewardOverlay.remove();
        });
    }
    
    /**
     * Genera el calendario visual de recompensas diarias
     * @returns {string} HTML del calendario
     */
    generateDailyRewardCalendar() {
        let calendarHTML = '';
        
        for (let i = 0; i < 7; i++) {
            const dayNumber = i + 1;
            const isCurrent = dayNumber === (this.retentionSystem.consecutiveDays % 7 || 7);
            const isPast = dayNumber < (this.retentionSystem.consecutiveDays % 7 || 7);
            const rewardInfo = this.dailyRewards[i];
            
            let dayStyle = 'background-color: rgba(255,255,255,0.1);';
            if (isCurrent) {
                dayStyle = 'background-color: rgba(255,215,0,0.3); border: 2px solid #FFD700;';
            } else if (isPast) {
                dayStyle = 'background-color: rgba(0,255,0,0.1); opacity: 0.7;';
            }
            
            calendarHTML += `
                <div style="width: 50px; height: 70px; ${dayStyle} border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0 5px;">
                    <div style="font-size: 14px; margin-bottom: 5px;">Día ${dayNumber}</div>
                    <div style="font-size: 20px;">${rewardInfo.icon}</div>
                    <div style="font-size: 12px; color: #FFD700;">${rewardInfo.reward}</div>
                    ${isPast ? '<div style="position: absolute; font-size: 24px; color: #4CAF50;">✓</div>' : ''}
                </div>
            `;
        }
        
        return calendarHTML;
    }
    
    /**
     * Muestra una animación al reclamar la recompensa
     * @param {Object} rewardInfo - Información de la recompensa
     */
    showRewardClaimAnimation(rewardInfo) {
        // Crear contenedor para la animación
        const animationContainer = document.createElement('div');
        animationContainer.className = 'reward-claim-animation';
        animationContainer.style.position = 'absolute';
        animationContainer.style.zIndex = '1000';
        animationContainer.style.top = '50%';
        animationContainer.style.left = '50%';
        animationContainer.style.transform = 'translate(-50%, -50%)';
        animationContainer.style.pointerEvents = 'none';
        
        // Contenido de la animación
        animationContainer.innerHTML = `
            <div style="font-size: 80px; animation: scale-up 0.5s forwards, float-up 1s forwards;">${rewardInfo.icon}</div>
            <div style="font-size: 40px; color: #FFD700; font-weight: bold; animation: scale-up 0.5s forwards, float-up 1s forwards;">+${rewardInfo.reward}</div>
        `;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(animationContainer);
        
        // Crear partículas
        for (let i = 0; i < 30; i++) {
            this.createRewardParticle(
                window.innerWidth / 2 + (Math.random() * 100 - 50),
                window.innerHeight / 2 + (Math.random() * 100 - 50),
                '#FFD700'
            );
        }
        
        // Eliminar después de la animación
        setTimeout(() => {
            animationContainer.remove();
        }, 2000);
    }
    
    /**
     * Crea una partícula para el efecto de recompensa
     * @param {number} x - Posición X
     * @param {number} y - Posición Y
     * @param {string} color - Color de la partícula
     */
    createRewardParticle(x, y, color) {
        // Crear elemento de partícula
        const particle = document.createElement('div');
        particle.className = 'reward-particle';
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.zIndex = '900';
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        // Posición inicial
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Velocidad y dirección aleatorias
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(particle);
        
        // Animar la partícula
        let posX = x;
        let posY = y;
        let opacity = 1;
        let size = 10;
        
        const animate = () => {
            // Actualizar posición
            posX += vx;
            posY += vy;
            
            // Reducir tamaño y opacidad
            opacity -= 0.02;
            size -= 0.1;
            
            if (opacity > 0 && size > 0) {
                particle.style.left = `${posX}px`;
                particle.style.top = `${posY}px`;
                particle.style.opacity = opacity;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * Inicializa el sistema
     */
    initialize() {
        // Comprobar si hay recompensa diaria disponible
        this.checkDailyReward();
    }
}

// Exportar la clase
export default DailyRewardSystem; 