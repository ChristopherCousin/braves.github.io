/**
 * Sistema de Retroalimentación Sensorial Excesiva
 * Este sistema implementa efectos visuales y sonoros extremadamente gratificantes
 * para estimular la liberación de dopamina y crear adicción.
 */

class FeedbackSystem {
    constructor(game) {
        this.game = game;
        
        // Configuración de efectos visuales
        this.visualEffects = {
            particleColors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'],
            glowColors: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
            screenFlashColors: ['rgba(255,255,255,0.2)', 'rgba(255,215,0,0.2)', 'rgba(0,191,255,0.2)'],
            
            // Intensidad de efectos basada en el valor de la acción
            baseParticleCount: 5,
            particleCountMultiplier: 2,
            
            baseFlashDuration: 100, // ms
            flashDurationMultiplier: 10,
            
            baseShakeIntensity: 2,
            shakeIntensityMultiplier: 0.5
        };
        
        // Configuración de efectos de sonido
        this.soundEffects = {
            // Diferentes sonidos para diferentes acciones
            sounds: {
                point: ['point1.mp3', 'point2.mp3', 'point3.mp3'],
                milestone: ['milestone1.mp3', 'milestone2.mp3'],
                powerup: ['powerup1.mp3', 'powerup2.mp3'],
                reward: ['reward1.mp3', 'reward2.mp3', 'reward3.mp3']
            },
            
            // Volumen base y multiplicadores
            baseVolume: 0.5,
            volumeMultiplier: 0.1
        };
        
        // Historial de retroalimentación para ajuste dinámico
        this.feedbackHistory = [];
        
        // Contador de combos para efectos acumulativos
        this.comboCounter = 0;
        this.comboTimer = null;
        this.maxCombo = 0;
        
        // Inicializar estilos CSS para animaciones
        this.initializeStyles();
    }
    
    /**
     * Inicializa estilos CSS para animaciones
     */
    initializeStyles() {
        // Crear elemento de estilo
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes float-up {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-50px); opacity: 0; }
            }
            
            @keyframes scale-up {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .camera-shake {
                animation: camera-shake 0.5s ease-in-out;
            }
            
            @keyframes camera-shake {
                0%, 100% { transform: translate(0, 0); }
                10%, 30%, 50%, 70%, 90% { transform: translate(-var(--shake-intensity, 5px), var(--shake-intensity, 5px)); }
                20%, 40%, 60%, 80% { transform: translate(var(--shake-intensity, 5px), -var(--shake-intensity, 5px)); }
            }
            
            .currency-update {
                animation: currency-update 0.5s ease-in-out;
            }
            
            @keyframes currency-update {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.3); color: #FFFFFF; }
            }
            
            .notification-fade-out {
                animation: fade-out 0.5s forwards;
            }
            
            @keyframes fade-out {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        
        // Añadir al DOM
        document.head.appendChild(styleElement);
    }
    
    /**
     * Proporciona retroalimentación sensorial para una acción
     * @param {string} action - Tipo de acción (point, milestone, powerup, reward)
     * @param {number} value - Valor de la acción
     */
    provideSensoryFeedback(action, value) {
        // Incrementar contador de combo
        this.comboCounter++;
        
        // Reiniciar el temporizador de combo
        clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => {
            this.comboCounter = 0;
        }, 2000); // Reiniciar combo después de 2 segundos sin puntuar
        
        // Actualizar máximo combo
        if (this.comboCounter > this.maxCombo) {
            this.maxCombo = this.comboCounter;
            
            // Recompensa especial por nuevo récord de combo
            if (this.maxCombo >= 5 && this.maxCombo % 5 === 0) {
                this.showComboMilestone(this.maxCombo);
            }
        }
        
        // Calcular intensidad base según el valor de la acción
        let intensity = value || 1;
        
        // Aumentar intensidad basada en combo
        intensity *= (1 + (this.comboCounter * 0.1));
        
        // Crear partículas basadas en intensidad
        const particleCount = this.visualEffects.baseParticleCount + 
                             (intensity * this.visualEffects.particleCountMultiplier);
        
        // Posición para efectos (usar posición del personaje para la mayoría de acciones)
        const posX = this.game.character.x + (this.game.character.width / 2);
        const posY = this.game.character.y + (this.game.character.height / 2);
        
        // Crear partículas
        for (let i = 0; i < particleCount; i++) {
            this.createFeedbackParticle(posX, posY);
        }
        
        // Crear flash de pantalla para acciones importantes
        if (intensity > 3 || this.comboCounter >= 3) {
            const flashColor = this.getRandomItem(this.visualEffects.screenFlashColors);
            const flashDuration = this.visualEffects.baseFlashDuration + 
                                 (intensity * this.visualEffects.flashDurationMultiplier);
            this.createScreenFlash(flashColor, flashDuration);
        }
        
        // Añadir sacudida de cámara para acciones importantes
        if (intensity > 2 || this.comboCounter >= 5) {
            const shakeIntensity = this.visualEffects.baseShakeIntensity + 
                                  (intensity * this.visualEffects.shakeIntensityMultiplier);
            this.game.addCameraShake(shakeIntensity, 300);
        }
        
        // Reproducir sonido
        let soundType = 'point';
        if (action === 'milestone' || intensity >= 10) {
            soundType = 'milestone';
        } else if (action === 'powerup') {
            soundType = 'powerup';
        } else if (action === 'reward') {
            soundType = 'reward';
        }
        
        this.playFeedbackSound(soundType, intensity);
        
        // Registrar en historial para ajuste dinámico
        this.feedbackHistory.push({
            action,
            value,
            intensity,
            timestamp: Date.now()
        });
        
        // Limitar historial a últimas 50 acciones
        if (this.feedbackHistory.length > 50) {
            this.feedbackHistory.shift();
        }
    }
    
    /**
     * Crea una partícula para efectos visuales
     * @param {number} x - Posición X
     * @param {number} y - Posición Y
     * @param {string} color - Color de la partícula (opcional)
     */
    createFeedbackParticle(x, y, color) {
        // Crear elemento de partícula
        const particle = document.createElement('div');
        particle.className = 'feedback-particle';
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
     * Crea un efecto de flash en pantalla
     * @param {string} color - Color del flash
     * @param {number} duration - Duración en milisegundos
     */
    createScreenFlash(color, duration) {
        // Crear elemento de flash
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = color || 'rgba(255,255,255,0.3)';
        flash.style.zIndex = '800';
        flash.style.pointerEvents = 'none';
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(flash);
        
        // Animar el flash
        flash.animate(
            [
                { opacity: 0.7 },
                { opacity: 0 }
            ],
            {
                duration: duration || 300,
                easing: 'ease-out'
            }
        );
        
        // Eliminar después de la animación
        setTimeout(() => {
            flash.remove();
        }, duration || 300);
    }
    
    /**
     * Reproduce un efecto de sonido
     * @param {string} type - Tipo de sonido
     * @param {number} intensity - Intensidad del sonido
     */
    playFeedbackSound(type, intensity) {
        // Seleccionar categoría de sonido
        const soundCategory = this.soundEffects.sounds[type] || this.soundEffects.sounds.point;
        
        // Seleccionar sonido aleatorio de la categoría
        const randomIndex = Math.floor(Math.random() * soundCategory.length);
        const soundFile = soundCategory[randomIndex];
        
        // Calcular volumen basado en intensidad
        const volume = Math.min(
            1.0, 
            this.soundEffects.baseVolume + 
            (intensity * this.soundEffects.volumeMultiplier)
        );
        
        // Crear y reproducir el sonido
        const audio = new Audio(`sounds/${soundFile}`);
        audio.volume = volume;
        
        // Añadir efectos de audio (distorsión, reverb, etc.) para recompensas grandes
        if (intensity > 5) {
            // Aquí se podría añadir procesamiento de audio con Web Audio API
            // para efectos más intensos en recompensas grandes
        }
        
        audio.play().catch(e => console.log('Error reproduciendo sonido:', e));
    }
    
    /**
     * Muestra un hito de combo
     * @param {number} comboCount - Contador de combo
     */
    showComboMilestone(comboCount) {
        // Crear elemento para el hito de combo
        const comboMilestone = document.createElement('div');
        comboMilestone.className = 'combo-milestone';
        comboMilestone.style.position = 'absolute';
        comboMilestone.style.top = '50%';
        comboMilestone.style.left = '50%';
        comboMilestone.style.transform = 'translate(-50%, -50%) scale(0)';
        comboMilestone.style.zIndex = '1000';
        comboMilestone.style.textAlign = 'center';
        comboMilestone.style.transition = 'transform 0.3s ease-out';
        
        // Contenido del hito
        comboMilestone.innerHTML = `
            <div style="font-size: 60px; color: #FFD700; text-shadow: 0 0 20px #FFD700; margin-bottom: 10px;">
                ${comboCount}X COMBO!
            </div>
            <div style="font-size: 24px; color: #FFFFFF; text-shadow: 0 0 10px #FFFFFF;">
                ¡BONIFICACIÓN DE PUNTOS!
            </div>
        `;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(comboMilestone);
        
        // Animar entrada
        setTimeout(() => {
            comboMilestone.style.transform = 'translate(-50%, -50%) scale(1.2)';
            
            // Añadir efectos visuales intensos
            this.createScreenFlash('rgba(255,215,0,0.3)', 500);
            
            // Añadir partículas especiales
            const centerX = this.game.gameWidth / 2;
            const centerY = this.game.gameHeight / 2;
            for (let i = 0; i < 50; i++) {
                this.createFeedbackParticle(centerX, centerY, '#FFD700');
            }
            
            // Añadir sacudida de cámara
            this.game.addCameraShake(5, 500);
            
            // Reproducir sonido de hito
            this.playFeedbackSound('milestone', 10);
            
            // Animar salida
            setTimeout(() => {
                comboMilestone.style.transform = 'translate(-50%, -50%) scale(0)';
                setTimeout(() => {
                    comboMilestone.remove();
                }, 300);
            }, 2000);
        }, 100);
        
        // Dar bonificación de puntos basada en el combo
        const bonusPoints = comboCount * 2;
        this.game.score += bonusPoints;
        this.game.updateScore();
        
        // Mostrar indicador de puntos bonus
        if (typeof this.game.showScoreIndicator === 'function') {
            this.game.showScoreIndicator(bonusPoints, true);
        }
    }
    
    /**
     * Obtiene un color aleatorio de la lista de colores
     * @returns {string} Color aleatorio
     */
    getRandomColor() {
        return this.getRandomItem(this.visualEffects.particleColors);
    }
    
    /**
     * Obtiene un elemento aleatorio de un array
     * @param {Array} array - Array de elementos
     * @returns {*} Elemento aleatorio
     */
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    /**
     * Inicializa el sistema
     */
    initialize() {
        // No se requiere inicialización adicional
    }
}

// Exportar la clase
export default FeedbackSystem; 