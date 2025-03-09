/**
 * Sistema de Recompensa Variable Impredecible
 * Este sistema implementa mecanismos de recompensa variable para maximizar la adicción
 * mediante patrones de refuerzo impredecibles.
 */

class RewardSystem {
    constructor(game) {
        this.game = game;
        
        // Tipos de recompensas con diferentes niveles de rareza
        this.rewardTypes = [
            { id: 'commonCoin', probability: 0.15, value: 1, icon: '🪙', color: '#FFD700' },
            { id: 'rareCoin', probability: 0.05, value: 5, icon: '💰', color: '#FFA500' },
            { id: 'epicGem', probability: 0.01, value: 20, icon: '💎', color: '#00FFFF' },
            { id: 'legendaryChest', probability: 0.002, value: 100, icon: '🎁', color: '#FF00FF' },
            { id: 'mythicJackpot', probability: 0.0005, value: 500, icon: '👑', color: '#FF0000' }
        ];
        
        // Multiplicadores secretos que se aplican aleatoriamente
        this.hiddenMultipliers = [1, 1, 1, 1, 2, 2, 3, 5, 10, 50];
        
        // Contador de intentos para el sistema de "pity"
        this.attemptsSinceLastRare = 0;
        this.attemptsSinceLastEpic = 0;
        this.attemptsSinceLastLegendary = 0;
        
        // Umbrales para el sistema de "pity" (garantiza eventualmente una recompensa rara)
        this.pityThresholds = {
            rareCoin: 30,
            epicGem: 100,
            legendaryChest: 300,
            mythicJackpot: 1000
        };
        
        // Historial de recompensas para ajustar dinámicamente las probabilidades
        this.recentRewards = [];
        
        // Estadísticas ocultas al jugador
        this.stats = {
            totalRewardsGiven: 0,
            totalValueGiven: 0,
            playerBehaviorScore: 0 // Aumenta con la frecuencia de juego
        };
        
        // Moneda del jugador
        this.currency = 0;
    }
    
    /**
     * Genera una recompensa aleatoria basada en probabilidades y comportamiento del jugador
     * @param {string} forcedType - Tipo de recompensa forzada (opcional)
     * @returns {Object} Objeto con información de la recompensa
     */
    generateRandomReward(forcedType = null) {
        // Incrementar contadores de "pity"
        this.attemptsSinceLastRare++;
        this.attemptsSinceLastEpic++;
        this.attemptsSinceLastLegendary++;
        
        // Ajustar probabilidades basadas en el comportamiento del jugador
        let adjustedRewardTypes = this.rewardTypes.map(reward => {
            let adjustedProbability = reward.probability;
            
            // Aumentar probabilidad basado en sistema de "pity"
            if (reward.id === 'rareCoin' && this.attemptsSinceLastRare > this.pityThresholds.rareCoin) {
                adjustedProbability *= 5;
            } else if (reward.id === 'epicGem' && this.attemptsSinceLastEpic > this.pityThresholds.epicGem) {
                adjustedProbability *= 3;
            } else if (reward.id === 'legendaryChest' && this.attemptsSinceLastLegendary > this.pityThresholds.legendaryChest) {
                adjustedProbability *= 2;
            }
            
            // Ajustar basado en comportamiento del jugador (más recompensas al principio)
            if (this.stats.totalRewardsGiven < 10) {
                adjustedProbability *= 1.5; // Más generoso al principio
            }
            
            // Ajustar basado en tiempo de juego (recompensar sesiones largas)
            if (this.game.gameTime > 300) { // Si ha jugado más de 5 minutos
                adjustedProbability *= 1.2;
            }
            
            return {
                ...reward,
                adjustedProbability
            };
        });
        
        // Seleccionar recompensa basada en probabilidades ajustadas
        let selectedReward;
        
        if (forcedType) {
            selectedReward = adjustedRewardTypes.find(r => r.id === forcedType);
        } else {
            const totalProbability = adjustedRewardTypes.reduce((sum, reward) => sum + reward.adjustedProbability, 0);
            let randomValue = Math.random() * totalProbability;
            
            for (const reward of adjustedRewardTypes) {
                randomValue -= reward.adjustedProbability;
                if (randomValue <= 0) {
                    selectedReward = reward;
                    break;
                }
            }
        }
        
        // Aplicar multiplicador secreto (el jugador no sabe que existe)
        const multiplierIndex = Math.floor(Math.random() * this.hiddenMultipliers.length);
        const multiplier = this.hiddenMultipliers[multiplierIndex];
        
        // Resetear contadores de "pity" si corresponde
        if (selectedReward.id === 'rareCoin' || selectedReward.id === 'epicGem' || selectedReward.id === 'legendaryChest') {
            this.attemptsSinceLastRare = 0;
        }
        if (selectedReward.id === 'epicGem' || selectedReward.id === 'legendaryChest') {
            this.attemptsSinceLastEpic = 0;
        }
        if (selectedReward.id === 'legendaryChest') {
            this.attemptsSinceLastLegendary = 0;
        }
        
        // Actualizar estadísticas
        this.stats.totalRewardsGiven++;
        this.stats.totalValueGiven += selectedReward.value * multiplier;
        
        // Guardar en historial reciente
        this.recentRewards.push({
            type: selectedReward.id,
            value: selectedReward.value * multiplier,
            timestamp: Date.now()
        });
        
        // Limitar historial a últimas 20 recompensas
        if (this.recentRewards.length > 20) {
            this.recentRewards.shift();
        }
        
        return {
            type: selectedReward.id,
            baseValue: selectedReward.value,
            multiplier: multiplier,
            finalValue: selectedReward.value * multiplier,
            icon: selectedReward.icon,
            color: selectedReward.color
        };
    }
    
    /**
     * Muestra una animación de recompensa con efectos visuales exagerados
     * @param {Object} reward - Objeto de recompensa generado
     */
    showRewardAnimation(reward) {
        // Crear contenedor para la animación
        const rewardContainer = document.createElement('div');
        rewardContainer.className = 'reward-animation';
        rewardContainer.style.position = 'absolute';
        rewardContainer.style.zIndex = '1000';
        
        // Posición aleatoria en el área de juego
        const randomX = Math.random() * (this.game.gameWidth - 100) + 50;
        const randomY = Math.random() * (this.game.gameHeight - 100) + 50;
        
        rewardContainer.style.left = `${randomX}px`;
        rewardContainer.style.top = `${randomY}px`;
        
        // Crear el contenido con animaciones exageradas
        rewardContainer.innerHTML = `
            <div class="reward-icon" style="font-size: ${40 + (reward.finalValue / 10)}px; color: ${reward.color}; animation: pulse 0.5s infinite alternate;">
                ${reward.icon}
            </div>
            <div class="reward-value" style="font-size: ${20 + (reward.finalValue / 20)}px; color: ${reward.color}; text-shadow: 0 0 10px ${reward.color};">
                +${reward.finalValue}
            </div>
            ${reward.multiplier > 1 ? `<div class="reward-multiplier" style="font-size: 18px; color: #FF0000;">x${reward.multiplier}!</div>` : ''}
        `;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(rewardContainer);
        
        // Añadir efectos de partículas basados en el valor
        const particleCount = Math.min(100, 20 + reward.finalValue / 2);
        for (let i = 0; i < particleCount; i++) {
            this.createRewardParticle(randomX, randomY, reward.color);
        }
        
        // Añadir sonido (más intenso para recompensas mayores)
        this.playRewardSound(reward.finalValue);
        
        // Añadir efecto de cámara para recompensas grandes
        if (reward.finalValue >= 20) {
            this.game.addCameraShake(Math.min(10, reward.finalValue / 20), 300);
        }
        
        // Eliminar después de la animación
        setTimeout(() => {
            rewardContainer.classList.add('reward-collect');
            setTimeout(() => {
                rewardContainer.remove();
            }, 500);
        }, 2000);
        
        // Actualizar monedas/gemas del jugador
        this.currency += reward.finalValue;
        this.updateCurrencyDisplay();
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
        particle.style.backgroundColor = color || this.getRandomColor();
        particle.style.borderRadius = '50%';
        particle.style.zIndex = '900';
        particle.style.boxShadow = `0 0 10px ${color || this.getRandomColor()}`;
        
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
     * Reproduce un sonido de recompensa
     * @param {number} value - Valor de la recompensa
     */
    playRewardSound(value) {
        // Implementar reproducción de sonido
        // Nota: Esta es una implementación básica, se puede mejorar con Web Audio API
        const audio = new Audio();
        audio.src = 'sounds/reward.mp3'; // Asegúrate de tener este archivo
        audio.volume = Math.min(1.0, 0.5 + (value / 100));
        audio.play().catch(e => console.log('Error reproduciendo sonido:', e));
    }
    
    /**
     * Actualiza la visualización de la moneda del jugador
     */
    updateCurrencyDisplay() {
        // Buscar o crear el elemento de moneda
        let currencyElement = document.getElementById('player-currency');
        
        if (!currencyElement) {
            currencyElement = document.createElement('div');
            currencyElement.id = 'player-currency';
            currencyElement.className = 'player-currency';
            currencyElement.style.position = 'absolute';
            currencyElement.style.top = '10px';
            currencyElement.style.left = '10px';
            currencyElement.style.fontSize = '20px';
            currencyElement.style.color = '#FFD700';
            currencyElement.style.textShadow = '0 0 5px #FFD700';
            currencyElement.style.zIndex = '1000';
            
            this.game.gameCanvas.parentElement.appendChild(currencyElement);
        }
        
        // Actualizar el contenido
        currencyElement.innerHTML = `🪙 ${this.currency}`;
        
        // Añadir efecto de actualización
        currencyElement.classList.add('currency-update');
        setTimeout(() => {
            currencyElement.classList.remove('currency-update');
        }, 500);
    }
    
    /**
     * Obtiene un color aleatorio de la lista de colores
     * @returns {string} Color aleatorio
     */
    getRandomColor() {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * Actualiza el sistema de recompensas en cada frame
     * @param {number} deltaTime - Tiempo transcurrido desde el último frame
     */
    update(deltaTime) {
        // Probabilidad base de generar una recompensa en cada frame
        const baseRewardProbability = 0.001; // 0.1% por frame
        
        // Ajustar probabilidad basada en comportamiento del jugador
        let adjustedProbability = baseRewardProbability;
        
        // Aumentar probabilidad si el jugador lleva mucho tiempo sin recompensas
        const timeSinceLastReward = this.recentRewards.length > 0 ? 
            Date.now() - this.recentRewards[this.recentRewards.length - 1].timestamp : 
            60000; // Asumir 1 minuto si no hay recompensas previas
        
        if (timeSinceLastReward > 30000) { // 30 segundos
            adjustedProbability *= 1.5;
        }
        if (timeSinceLastReward > 60000) { // 1 minuto
            adjustedProbability *= 2;
        }
        
        // Aumentar probabilidad si el jugador está teniendo una buena racha
        if (this.game.score > this.game.highScore * 0.8) {
            adjustedProbability *= 1.2;
        }
        
        // Generar recompensa si se cumple la probabilidad
        if (Math.random() < adjustedProbability * deltaTime * 60) {
            const reward = this.generateRandomReward();
            this.showRewardAnimation(reward);
        }
    }
}

// Exportar la clase
export default RewardSystem; 