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
        
        // Obtener colores de las variables CSS
        const computedStyle = getComputedStyle(document.documentElement);
        this.color = computedStyle.getPropertyValue('--character-primary').trim() || '#FF0000';
        this.secondaryColor = computedStyle.getPropertyValue('--character-secondary').trim() || '#FF3333';
        this.outlineColor = computedStyle.getPropertyValue('--character-outline').trim() || '#FF6666';
        this.glowColor = computedStyle.getPropertyValue('--character-glow').trim() || 'rgba(255, 0, 0, 0.8)';
        
        // Sistema de partículas
        this.particlesArray = [];
        this.maxParticles = 20; // Aumentado para más efecto visual
        
        // Frames de animación
        this.frameCount = 0;
        this.frameDelay = 4; // Actualizar cada 4 frames (más rápido)
        this.currentFrame = 0;
        this.totalFrames = 4; // 4 frames de animación
        
        // Estado de invulnerabilidad
        this.invulnerable = false;
        this.blinkCounter = 0;
        
        // Efectos visuales adicionales
        this.eyeBlink = 0; // Contador para parpadeo de ojos
        this.eyeBlinkInterval = Math.floor(Math.random() * 100) + 50; // Intervalo aleatorio para parpadeo
    }
    
    update(isPlaying, deltaTime) {
        // Actualizar posición y velocidad
        if (isPlaying) {
            this.y += this.velocity;
            
            // Actualizar rotación basada en la velocidad
            const targetRotation = this.velocity * 0.05;
            this.rotation = this.rotation * 0.9 + targetRotation * 0.1; // Suavizar la rotación
            
            // Limitar la rotación
            this.rotation = Math.max(Math.min(this.rotation, Math.PI / 6), -Math.PI / 6);
            
            // Actualizar estado de salto
            if (this.isJumping) {
                this.jumpTime += deltaTime;
                if (this.jumpTime >= this.jumpDuration) {
                    this.isJumping = false;
                }
            }
            
            // Actualizar partículas
            this.updateParticles();
            
            // Actualizar contador de parpadeo si es invulnerable
            if (this.invulnerable) {
                this.blinkCounter += 1;
            }
            
            // Actualizar frames de animación
            this.frameCount++;
            if (this.frameCount >= this.frameDelay) {
                this.frameCount = 0;
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            }
        } else {
            // Efecto de flotación cuando no está jugando
            this.floatOffset += this.floatSpeed;
        }
    }
    
    jump() {
        this.isJumping = true;
        this.jumpTime = 0;
        
        // Crear partículas de impulso
        this.createJumpParticles();
    }
    
    createJumpParticles() {
        // Añadir partículas de impulso
        const particleCount = 10; // Más partículas para un efecto más vistoso
        
        // Obtener el color de partículas de las variables CSS
        const computedStyle = getComputedStyle(document.documentElement);
        const particleColor = computedStyle.getPropertyValue('--particle-color').trim() || 'rgba(255, 50, 0, 0.7)';
        
        for (let i = 0; i < particleCount; i++) {
            // Calcular posición aleatoria alrededor del personaje
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (this.width / 3);
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance + this.height / 2;
            
            // Crear partícula con propiedades mejoradas
            this.particlesArray.push({
                x: this.x + this.width / 2 + offsetX,
                y: this.y + this.height / 2 + offsetY,
                size: Math.random() * 4 + 2, // Tamaño ligeramente mayor
                speedX: (Math.random() - 0.5) * 3, // Velocidad horizontal mayor
                speedY: Math.random() * 3 + 1, // Velocidad vertical mayor
                color: particleColor,
                life: Math.floor(Math.random() * 15) + 10, // Vida variable
                opacity: 1,
                rotation: Math.random() * Math.PI * 2 // Rotación aleatoria para partículas no circulares
            });
        }
    }
    
    updateParticles() {
        // Actualizar y eliminar partículas
        for (let i = 0; i < this.particlesArray.length; i++) {
            const p = this.particlesArray[i];
            
            // Actualizar posición
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Reducir vida y opacidad gradualmente
            p.life--;
            p.opacity = p.life / 20; // Desvanecer gradualmente
            
            // Reducir tamaño gradualmente
            p.size = Math.max(0.5, p.size * 0.95);
            
            // Añadir efecto de gravedad sutil
            p.speedY += 0.05;
            
            // Reducir velocidad horizontal gradualmente (fricción)
            p.speedX *= 0.98;
            
            // Eliminar partículas muertas o fuera de pantalla
            if (p.life <= 0 || p.opacity <= 0.1 || p.size <= 0.5) {
                this.particlesArray.splice(i, 1);
                i--;
            }
        }
        
        // Limitar el número máximo de partículas
        if (this.particlesArray.length > this.maxParticles) {
            this.particlesArray.splice(0, this.particlesArray.length - this.maxParticles);
        }
    }
    
    draw(isPlaying) {
        // Calcular efecto de flotación
        let floatY = 0;
        if (!isPlaying) {
            floatY = Math.sin(this.floatOffset) * 5;
        }
        
        // Si es invulnerable, hacer parpadear
        if (this.invulnerable && this.blinkCounter % 10 < 5) {
            return; // No dibujar en algunos frames para crear efecto de parpadeo
        }
        
        // Guardar el contexto para aplicar transformaciones
        this.ctx.save();
        
        // Trasladar al centro del personaje
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2 + floatY);
        
        // Aplicar rotación
        this.ctx.rotate(this.rotation);
        
        // Dibujar partículas
        this.drawParticles();
        
        // Dibujar la cabrita (forma básica)
        this.drawGoatBody();
        
        // Dibujar cuernos
        this.drawHorns();
        
        // Dibujar cara
        this.drawFace();
        
        // Restaurar el contexto
        this.ctx.restore();
    }
    
    drawParticles() {
        // Dibujar partículas con efectos mejorados
        for (const p of this.particlesArray) {
            // Guardar contexto para aplicar transformaciones
            this.ctx.save();
            
            // Trasladar al centro de la partícula
            this.ctx.translate(
                p.x - (this.x + this.width / 2),
                p.y - (this.y + this.height / 2)
            );
            
            // Aplicar rotación si existe
            if (p.rotation !== undefined) {
                this.ctx.rotate(p.rotation);
            }
            
            // Aplicar opacidad
            const opacity = p.opacity !== undefined ? p.opacity : 1;
            
            // Crear color con opacidad
            let color = p.color;
            if (color.startsWith('rgba')) {
                // Si ya es rgba, modificar la opacidad
                color = color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, 
                                     `rgba($1, $2, $3, ${opacity})`);
            } else if (color.startsWith('rgb')) {
                // Si es rgb, convertir a rgba
                color = color.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, 
                                     `rgba($1, $2, $3, ${opacity})`);
            } else {
                // Para otros formatos, usar globalAlpha
                this.ctx.globalAlpha = opacity;
            }
            
            // Establecer color y efecto de brillo
            this.ctx.fillStyle = color;
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = 5;
            
            // Dibujar partícula (forma variable según el tipo)
            if (Math.random() < 0.3) { // 30% de probabilidad de partículas cuadradas
                this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            } else { // 70% de probabilidad de partículas circulares
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Restaurar contexto
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
            this.ctx.restore();
        }
    }
    
    drawGoatBody() {
        // Cuerpo principal de la cabrita
        this.ctx.fillStyle = this.color;
        
        // Efecto de brillo neón
        this.ctx.shadowColor = this.color;
        this.ctx.shadowBlur = 15;
        
        // Dibujar forma de cabeza de cabra más parecida al logo
        this.ctx.beginPath();
        
        // Forma más redondeada y estilizada como el logo
        this.ctx.moveTo(0, -this.height * 0.4); // Parte superior
        
        // Lado izquierdo
        this.ctx.bezierCurveTo(
            -this.width * 0.4, -this.height * 0.4, // Control 1
            -this.width * 0.5, -this.height * 0.1, // Control 2
            -this.width * 0.4, this.height * 0.2  // Punto final
        );
        
        // Parte inferior
        this.ctx.bezierCurveTo(
            -this.width * 0.3, this.height * 0.4, // Control 1
            this.width * 0.3, this.height * 0.4,  // Control 2
            this.width * 0.4, this.height * 0.2   // Punto final
        );
        
        // Lado derecho
        this.ctx.bezierCurveTo(
            this.width * 0.5, -this.height * 0.1, // Control 1
            this.width * 0.4, -this.height * 0.4, // Control 2
            0, -this.height * 0.4                // Punto final (volver al inicio)
        );
        
        this.ctx.fill();
        
        // Contorno neón
        this.ctx.strokeStyle = '#FF6666';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Resetear sombra
        this.ctx.shadowBlur = 0;
    }
    
    drawHorns() {
        // Dibujar cuernos curvados característicos del logo
        this.ctx.fillStyle = this.color;
        this.ctx.shadowColor = this.color;
        this.ctx.shadowBlur = 12;
        
        // Cuerno izquierdo - más curvo como en el logo
        this.ctx.beginPath();
        this.ctx.moveTo(-this.width * 0.2, -this.height * 0.35);
        this.ctx.bezierCurveTo(
            -this.width * 0.4, -this.height * 0.6,  // Control 1
            -this.width * 0.6, -this.height * 0.5,  // Control 2
            -this.width * 0.5, -this.height * 0.3   // Punto final
        );
        this.ctx.bezierCurveTo(
            -this.width * 0.45, -this.height * 0.2, // Control 1
            -this.width * 0.3, -this.height * 0.25, // Control 2
            -this.width * 0.2, -this.height * 0.35  // Punto final (volver al inicio)
        );
        this.ctx.fill();
        
        // Cuerno derecho - más curvo como en el logo
        this.ctx.beginPath();
        this.ctx.moveTo(this.width * 0.2, -this.height * 0.35);
        this.ctx.bezierCurveTo(
            this.width * 0.4, -this.height * 0.6,  // Control 1
            this.width * 0.6, -this.height * 0.5,  // Control 2
            this.width * 0.5, -this.height * 0.3   // Punto final
        );
        this.ctx.bezierCurveTo(
            this.width * 0.45, -this.height * 0.2, // Control 1
            this.width * 0.3, -this.height * 0.25, // Control 2
            this.width * 0.2, -this.height * 0.35  // Punto final (volver al inicio)
        );
        this.ctx.fill();
        
        // Contorno de los cuernos
        this.ctx.strokeStyle = '#FF6666';
        this.ctx.lineWidth = 1.5;
        
        // Contorno cuerno izquierdo
        this.ctx.beginPath();
        this.ctx.moveTo(-this.width * 0.2, -this.height * 0.35);
        this.ctx.bezierCurveTo(
            -this.width * 0.4, -this.height * 0.6,  // Control 1
            -this.width * 0.6, -this.height * 0.5,  // Control 2
            -this.width * 0.5, -this.height * 0.3   // Punto final
        );
        this.ctx.bezierCurveTo(
            -this.width * 0.45, -this.height * 0.2, // Control 1
            -this.width * 0.3, -this.height * 0.25, // Control 2
            -this.width * 0.2, -this.height * 0.35  // Punto final (volver al inicio)
        );
        this.ctx.stroke();
        
        // Contorno cuerno derecho
        this.ctx.beginPath();
        this.ctx.moveTo(this.width * 0.2, -this.height * 0.35);
        this.ctx.bezierCurveTo(
            this.width * 0.4, -this.height * 0.6,  // Control 1
            this.width * 0.6, -this.height * 0.5,  // Control 2
            this.width * 0.5, -this.height * 0.3   // Punto final
        );
        this.ctx.bezierCurveTo(
            this.width * 0.45, -this.height * 0.2, // Control 1
            this.width * 0.3, -this.height * 0.25, // Control 2
            this.width * 0.2, -this.height * 0.35  // Punto final (volver al inicio)
        );
        this.ctx.stroke();
        
        // Resetear sombra
        this.ctx.shadowBlur = 0;
    }
    
    drawFace() {
        // Actualizar contador de parpadeo
        this.eyeBlink++;
        const isBlinking = this.eyeBlink > this.eyeBlinkInterval && this.eyeBlink < this.eyeBlinkInterval + 5;
        
        // Si es tiempo de reiniciar el contador de parpadeo
        if (this.eyeBlink >= this.eyeBlinkInterval + 10) {
            this.eyeBlink = 0;
            this.eyeBlinkInterval = Math.floor(Math.random() * 100) + 50; // Nuevo intervalo aleatorio
        }
        
        // Dibujar ojos - más grandes y expresivos como en el logo
        this.ctx.fillStyle = '#FFFFFF';
        
        // Ojo izquierdo
        this.ctx.beginPath();
        if (isBlinking) {
            // Ojo cerrado (línea)
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.moveTo(-this.width * 0.22, -this.height * 0.1);
            this.ctx.lineTo(-this.width * 0.08, -this.height * 0.1);
            this.ctx.stroke();
        } else {
            // Ojo abierto (círculo)
            this.ctx.arc(-this.width * 0.15, -this.height * 0.1, this.width * 0.12, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Ojo derecho
        this.ctx.beginPath();
        if (isBlinking) {
            // Ojo cerrado (línea)
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.moveTo(this.width * 0.08, -this.height * 0.1);
            this.ctx.lineTo(this.width * 0.22, -this.height * 0.1);
            this.ctx.stroke();
        } else {
            // Ojo abierto (círculo)
            this.ctx.arc(this.width * 0.15, -this.height * 0.1, this.width * 0.12, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Pupilas - solo si los ojos están abiertos
        if (!isBlinking) {
            this.ctx.fillStyle = '#000000';
            
            // Calcular dirección de la mirada basada en la velocidad
            const eyeOffsetX = this.velocity * 0.5; // Mirar hacia arriba/abajo según velocidad
            
            // Pupila izquierda
            this.ctx.beginPath();
            this.ctx.arc(-this.width * 0.15, -this.height * 0.1 + eyeOffsetX, this.width * 0.06, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Pupila derecha
            this.ctx.beginPath();
            this.ctx.arc(this.width * 0.15, -this.height * 0.1 + eyeOffsetX, this.width * 0.06, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Brillo en los ojos
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(-this.width * 0.18, -this.height * 0.13, this.width * 0.03, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.width * 0.18, -this.height * 0.13, this.width * 0.03, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Boca/sonrisa sutil como en el logo
        this.ctx.strokeStyle = this.secondaryColor;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        // Expresión basada en la velocidad (sonrisa cuando sube, neutral/preocupado cuando cae)
        if (this.velocity < 0) {
            // Sonrisa cuando sube
            this.ctx.beginPath();
            this.ctx.moveTo(-this.width * 0.15, this.height * 0.15);
            this.ctx.quadraticCurveTo(
                0, this.height * 0.25,
                this.width * 0.15, this.height * 0.15
            );
        } else if (this.velocity > 2) {
            // Preocupado cuando cae rápido
            this.ctx.beginPath();
            this.ctx.moveTo(-this.width * 0.15, this.height * 0.2);
            this.ctx.quadraticCurveTo(
                0, this.height * 0.1,
                this.width * 0.15, this.height * 0.2
            );
        } else {
            // Neutral/ligera sonrisa en otros casos
            this.ctx.beginPath();
            this.ctx.moveTo(-this.width * 0.15, this.height * 0.18);
            this.ctx.quadraticCurveTo(
                0, this.height * 0.22,
                this.width * 0.15, this.height * 0.18
            );
        }
        
        this.ctx.stroke();
    }
    
    setInvulnerable(value) {
        this.invulnerable = value;
        this.blinkCounter = 0;
    }
}

// Exportar la clase para su uso en game.js
window.BravesCharacter = BravesCharacter; 