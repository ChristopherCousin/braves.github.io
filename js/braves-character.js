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
        
        // Crear partículas de impulso
        this.createJumpParticles();
    }
    
    createJumpParticles() {
        // Añadir partículas de impulso
        const particleCount = 10;
        
        // Obtener el color de partículas de las variables CSS
        const computedStyle = getComputedStyle(document.documentElement);
        const particleColor = computedStyle.getPropertyValue('--particle-color').trim() || 'rgba(255, 59, 59, 0.7)';
        
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
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 3,
                speedY: Math.random() * 3 + 1,
                color: particleColor,
                life: Math.floor(Math.random() * 15) + 10,
                opacity: 1,
                rotation: Math.random() * Math.PI * 2
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
            p.opacity = p.life / 20;
            
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
        
        // Dibujar el logo como personaje
        if (this.imageLoaded) {
            // Calcular dimensiones para mantener la proporción de la imagen
            const aspectRatio = this.image.width / this.image.height;
            let drawWidth = this.width;
            let drawHeight = this.width / aspectRatio;
            
            // Si la altura calculada es mayor que la altura deseada, ajustar
            if (drawHeight > this.height * 0.8) { // Usar más espacio para el logo
                drawHeight = this.height * 0.8;
                drawWidth = drawHeight * aspectRatio;
            }
            
            // Efecto de brillo neón mejorado para el logo más grande
            this.ctx.shadowColor = this.glowColor;
            this.ctx.shadowBlur = 20;
            
            // Dibujar la imagen centrada (sin desplazamiento hacia arriba)
            this.ctx.drawImage(
                this.image,
                -drawWidth / 2,
                -drawHeight / 2, // Centrado sin desplazamiento
                drawWidth,
                drawHeight
            );
            
            // Resetear sombra
            this.ctx.shadowBlur = 0;
            
            // Dibujar ojos dentro del logo
            this.drawEyes(drawWidth, drawHeight);
        } else {
            // Intentar cargar la imagen de nuevo si no está cargada
            if (!this.retryLoading) {
                this.retryLoading = true;
                this.image = new Image();
                this.image.src = 'assets/Logo2.png';
                this.image.onload = () => {
                    this.imageLoaded = true;
                    console.log('Logo cargado correctamente en segundo intento');
                };
            }
            
            // Mientras tanto, dibujar un logo más estilizado en lugar de un círculo simple
            this.ctx.fillStyle = this.color;
            this.ctx.shadowColor = this.glowColor;
            this.ctx.shadowBlur = 20;
            
            // Dibujar un logo simplificado (forma de B estilizada)
            this.ctx.beginPath();
            const size = this.width / 2;
            this.ctx.moveTo(-size/2, -size);
            this.ctx.lineTo(size/2, -size);
            this.ctx.quadraticCurveTo(size, -size, size, -size/2);
            this.ctx.quadraticCurveTo(size, 0, size/2, 0);
            this.ctx.quadraticCurveTo(size, 0, size, size/2);
            this.ctx.quadraticCurveTo(size, size, size/2, size);
            this.ctx.lineTo(-size/2, size);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
            
            // Dibujar ojos simples
            this.drawEyes(this.width, this.height);
        }
        
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