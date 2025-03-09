// Implementación del personaje de la cabrita para Flappy Braves
// Este archivo contiene la lógica para dibujar y animar el personaje basado en el logo de Braves

class BravesCharacter {
    constructor(ctx, x, y, width, height) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = 0;
        this.rotation = 0; // Rotación en radianes
        this.floatOffset = 0;
        this.floatSpeed = 0.05;
        this.isJumping = false;
        this.jumpTime = 0;
        this.jumpDuration = 300; // ms
        
        // Obtener colores de las variables CSS para partículas
        const computedStyle = getComputedStyle(document.documentElement);
        this.color = computedStyle.getPropertyValue('--character-primary').trim() || '#FF3B3B';
        this.glowColor = computedStyle.getPropertyValue('--character-glow').trim() || 'rgba(255, 59, 59, 0.8)';
        
        // Sistema de partículas
        this.particlesArray = [];
        this.maxParticles = 20;
        
        // Estado de invulnerabilidad
        this.invulnerable = false;
        this.blinkCounter = 0;
        
        // Cargar la imagen del logo
        this.image = new Image();
        this.image.src = 'assets/Logo2.png';
        this.imageLoaded = false;
        
        // Evento para cuando la imagen se carga
        this.image.onload = () => {
            this.imageLoaded = true;
            console.log('Logo cargado correctamente como personaje');
        };
        
        // Evento para manejar errores de carga
        this.image.onerror = () => {
            console.error('Error al cargar el logo como personaje');
            // Fallback a dibujar el personaje con código si la imagen no carga
            this.imageLoaded = false;
        };
        
        // Animación de ojos
        this.eyeBlink = 0;
        this.eyeBlinkInterval = Math.floor(Math.random() * 100) + 50;
    }
    
    update(isPlaying, deltaTime) {
        // Actualizar posición y velocidad
        if (isPlaying) {
            // deltaTime ahora está normalizado (en segundos)
            // Para las físicas, multiplicamos por 60 para normalizar a 60 FPS
            this.y += this.velocity * deltaTime * 60;
            
            // Actualizar rotación basada en la velocidad con respuesta más rápida
            const targetRotation = this.velocity * 0.08; // Aumentado de 0.05 a 0.08 para rotación más reactiva
            this.rotation = this.rotation * 0.8 + targetRotation * 0.2; // Más peso al nuevo valor para respuesta más rápida
            
            // Limitar la rotación pero permitir un poco más de inclinación
            this.rotation = Math.max(Math.min(this.rotation, Math.PI / 4), -Math.PI / 4);
            
            // Actualizar estado de salto
            if (this.isJumping) {
                this.jumpTime += deltaTime * 1000; // Convertir de nuevo a ms para el tiempo de salto
                if (this.jumpTime >= this.jumpDuration) {
                    this.isJumping = false;
                }
            }
            
            // Actualizar partículas
            this.updateParticles(deltaTime);
            
            // Actualizar contador de parpadeo si es invulnerable
            if (this.invulnerable) {
                this.blinkCounter += 1;
            }
            
            // Actualizar animación de ojos
            this.eyeBlink++;
        } else {
            // Efecto de flotación cuando no está jugando
            this.floatOffset += this.floatSpeed;
        }
    }
    
    jump() {
        this.isJumping = true;
        this.jumpTime = 0;
        
        // Crear solo la onda de energía roja que se queda fija
        this.createEnergyWaveEffect();
    }
    
    // Nueva función simplificada para crear solo la onda de energía
    createEnergyWaveEffect() {
        // Guardar la posición actual para que la onda se quede fija
        const posX = this.x + this.width / 2 - 40;
        const posY = this.y + this.height - 10;
        
        // Crear un efecto de onda de energía
        const energyWave = document.createElement('div');
        energyWave.className = 'energy-wave';
        energyWave.style.position = 'absolute';
        energyWave.style.left = `${posX}px`;
        energyWave.style.top = `${posY}px`;
        
        // Añadir al DOM
        this.ctx.canvas.parentElement.appendChild(energyWave);
        
        // Eliminar después de la animación (menos de 1 segundo)
        setTimeout(() => {
            energyWave.remove();
        }, 500);
    }
    
    // Mantener estas funciones para compatibilidad, pero no usarlas
    createModernJumpEffect() {
        // No hacer nada, usamos solo la onda de energía
    }
    
    createJumpParticles(count = 15) {
        // No hacer nada, usamos solo la onda de energía
    }
    
    updateParticles(deltaTime) {
        // Actualizar y eliminar partículas
        for (let i = 0; i < this.particlesArray.length; i++) {
            const p = this.particlesArray[i];
            
            // Actualizar posición
            p.x += p.speedX * deltaTime * 60;
            p.y += p.speedY * deltaTime * 60;
            
            // Reducir vida y opacidad gradualmente
            p.life -= 0.025 * deltaTime * 60;
            
            // Actualizar rotación para partículas que giran
            if (p.rotationSpeed) {
                p.rotation += p.rotationSpeed * deltaTime * 60;
            }
            
            // Añadir efecto de gravedad sutil
            p.speedY += 0.05 * deltaTime * 60;
            
            // Reducir velocidad horizontal gradualmente (fricción)
            p.speedX *= 0.98;
            
            // Eliminar partículas muertas
            if (p.life <= 0) {
                this.particlesArray.splice(i, 1);
                i--;
            }
        }
        
        // Limitar el número máximo de partículas para rendimiento
        if (this.particlesArray.length > this.maxParticles) {
            this.particlesArray.splice(0, this.particlesArray.length - this.maxParticles);
        }
    }
    
    draw(isPlaying) {
        // Guardar el contexto para restaurarlo después
        this.ctx.save();
        
        // Trasladar al centro del personaje
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Aplicar rotación
        this.ctx.rotate(this.rotation);
        
        // Efecto de parpadeo si es invulnerable
        const shouldDraw = !this.invulnerable || (this.invulnerable && this.blinkCounter % 6 >= 3);
        
        if (shouldDraw) {
            // Dibujar partículas detrás del personaje
            this.drawParticles();
            
            // Dibujar el personaje
            if (this.imageLoaded) {
                // Dibujar la imagen del logo
                this.ctx.drawImage(
                    this.image,
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );
                
                // Añadir efecto de brillo cuando salta
                if (this.isJumping) {
                    this.ctx.globalAlpha = 0.3;
                    this.ctx.shadowColor = this.glowColor;
                    this.ctx.shadowBlur = 15;
                    this.ctx.drawImage(
                        this.image,
                        -this.width / 2,
                        -this.height / 2,
                        this.width,
                        this.height
                    );
                    this.ctx.globalAlpha = 1;
                    this.ctx.shadowBlur = 0;
                }
                
                // Dibujar ojos sobre el logo
                this.drawEyes(this.width, this.height);
            } else {
                // Fallback: dibujar un círculo si la imagen no está disponible
                this.ctx.fillStyle = this.color;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Dibujar ojos
                this.drawEyes(this.width, this.height);
            }
            
            // Añadir efecto de estela de movimiento cuando está jugando
            if (isPlaying && Math.abs(this.velocity) > 1) {
                // Crear un efecto de estela más elegante con degradado
                const trailCount = 5;
                for (let i = 1; i <= trailCount; i++) {
                    const opacity = 0.15 - (i * 0.03);
                    const scale = 1 - (i * 0.05);
                    const offsetY = this.velocity * i * 1.5;
                    
                    this.ctx.globalAlpha = opacity;
                    this.ctx.globalCompositeOperation = 'lighter';
                    
                    // Aplicar un efecto de escala y desplazamiento
                    this.ctx.drawImage(
                        this.image,
                        -this.width / 2 * scale,
                        -this.height / 2 - offsetY,
                        this.width * scale,
                        this.height * scale
                    );
                }
                
                // Restaurar valores por defecto
                this.ctx.globalAlpha = 1;
                this.ctx.globalCompositeOperation = 'source-over';
            }
        }
        
        // Restaurar el contexto
        this.ctx.restore();
    }
    
    drawParticles() {
        // Dibujar partículas
        for (const p of this.particlesArray) {
            this.ctx.save();
            
            // Trasladar al centro de la partícula
            this.ctx.translate(
                p.x - (this.x + this.width / 2),
                p.y - (this.y + this.height / 2)
            );
            
            // Aplicar rotación si la partícula tiene rotación
            if (p.rotation !== undefined) {
                this.ctx.rotate(p.rotation);
            }
            
            // Dibujar partícula con opacidad basada en su vida
            this.ctx.globalAlpha = p.life;
            
            // Añadir brillo a las partículas
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 5;
            
            // Dibujar formas diferentes según el tipo de partícula
            if (p.shape === 'star') {
                // Dibujar estrella
                this.drawStar(0, 0, p.size, p.size / 2, 5, p.color);
            } else if (p.shape === 'triangle') {
                // Dibujar triángulo
                this.drawTriangle(0, 0, p.size, p.color);
            } else {
                // Dibujar círculo por defecto
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Resetear sombra y opacidad
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
            
            this.ctx.restore();
        }
    }
    
    // Método para dibujar una estrella
    drawStar(cx, cy, outerRadius, innerRadius, spikes, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;
        
        this.ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    // Método para dibujar un triángulo
    drawTriangle(cx, cy, size, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        
        this.ctx.moveTo(cx, cy - size);
        this.ctx.lineTo(cx + size, cy + size);
        this.ctx.lineTo(cx - size, cy + size);
        this.ctx.closePath();
        
        this.ctx.fill();
    }
    
    drawEyes(width, height) {
        // Actualizar contador de parpadeo
        const isBlinking = this.eyeBlink > this.eyeBlinkInterval && this.eyeBlink < this.eyeBlinkInterval + 5;
        
        // Si es tiempo de reiniciar el contador de parpadeo
        if (this.eyeBlink >= this.eyeBlinkInterval + 10) {
            this.eyeBlink = 0;
            this.eyeBlinkInterval = Math.floor(Math.random() * 100) + 50;
        }
        
        // Tamaño y posición de los ojos - Posición intermedia dentro del logo
        const eyeWidth = 5; // Ancho del ojo (más pequeño)
        const eyeHeight = 3; // Alto del ojo (más pequeño y alargado horizontalmente como cabra)
        const eyeDistance = width * 0.12; // Distancia horizontal entre ojos (más juntos)
        const eyeY = height * 0.0; // Posición vertical centrada (ni muy arriba ni muy abajo)
        
        // Dibujar ojos
        this.ctx.fillStyle = '#FFFFFF';
        
        // Ojo izquierdo - forma ovalada como cabra
        this.ctx.beginPath();
        if (isBlinking) {
            // Ojo cerrado (línea)
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.moveTo(-eyeDistance - eyeWidth * 0.5, eyeY);
            this.ctx.lineTo(-eyeDistance + eyeWidth * 0.5, eyeY);
            this.ctx.stroke();
        } else {
            // Ojo abierto (óvalo horizontal como cabra)
            this.ctx.ellipse(-eyeDistance, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Pupila - alargada horizontalmente
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.ellipse(-eyeDistance, eyeY, eyeWidth * 0.4, eyeHeight * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Ojo derecho - forma ovalada como cabra
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        if (isBlinking) {
            // Ojo cerrado (línea)
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.moveTo(eyeDistance - eyeWidth * 0.5, eyeY);
            this.ctx.lineTo(eyeDistance + eyeWidth * 0.5, eyeY);
            this.ctx.stroke();
        } else {
            // Ojo abierto (óvalo horizontal como cabra)
            this.ctx.ellipse(eyeDistance, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Pupila - alargada horizontalmente
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.ellipse(eyeDistance, eyeY, eyeWidth * 0.4, eyeHeight * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    setInvulnerable(value) {
        this.invulnerable = value;
        this.blinkCounter = 0;
    }
}

// Exportar la clase para su uso en game.js
window.BravesCharacter = BravesCharacter; 