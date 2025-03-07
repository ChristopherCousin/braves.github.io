/**
 * Cuartel General - Interactividad
 * Maneja la funcionalidad del formulario de contacto, efectos visuales
 * y animaciones de la sección Cuartel General.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeadquarters();
});

/**
 * Inicializa la funcionalidad de la sección Cuartel General
 */
function initHeadquarters() {
    const headquartersSection = document.querySelector('.headquarters');
    if (!headquartersSection) return;

    // Configurar formulario de contacto
    setupContactForm();
    
    // Configurar efectos visuales
    setupVisualEffects();
    
    // Configurar observador de intersección para animaciones
    setupIntersectionObserver();
    
    // Configurar mapa interactivo
    setupMap();
}

/**
 * Configura el formulario de contacto
 */
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Añadir efecto de foco a los campos del formulario
    const formControls = contactForm.querySelectorAll('.form-control');
    formControls.forEach(control => {
        // Efecto al enfocar
        control.addEventListener('focus', () => {
            control.parentElement.classList.add('focused');
        });
        
        // Efecto al perder el foco
        control.addEventListener('blur', () => {
            control.parentElement.classList.remove('focused');
            
            // Añadir clase si el campo tiene valor
            if (control.value.trim() !== '') {
                control.parentElement.classList.add('has-value');
            } else {
                control.parentElement.classList.remove('has-value');
            }
        });
    });
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Mostrar estado de carga
        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        // Simular envío (en una implementación real, esto sería una llamada AJAX)
        setTimeout(() => {
            // Mostrar mensaje de éxito
            showFormMessage('¡Mensaje enviado con éxito! Te responderemos pronto.', 'success');
            
            // Restablecer formulario
            contactForm.reset();
            formControls.forEach(control => {
                control.parentElement.classList.remove('has-value');
            });
            
            // Restaurar botón
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
}

/**
 * Muestra un mensaje después del envío del formulario
 */
function showFormMessage(message, type) {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Eliminar mensaje anterior si existe
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Añadir al DOM
    contactForm.appendChild(messageElement);
    
    // Animar entrada
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 10);
    
    // Eliminar después de un tiempo
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 5000);
}

/**
 * Configura efectos visuales para la sección
 */
function setupVisualEffects() {
    // Efecto de hover para los métodos de contacto
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', () => {
            const icon = method.querySelector('.method-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.boxShadow = '0 0 15px var(--neon-pink)';
            }
        });
        
        method.addEventListener('mouseleave', () => {
            const icon = method.querySelector('.method-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.boxShadow = '0 0 10px rgba(255, 0, 160, 0.3)';
            }
        });
    });
    
    // Efecto de partículas para el título
    const title = document.querySelector('.headquarters h2');
    if (title) {
        createTitleParticles(title);
    }
}

/**
 * Crea partículas alrededor del título
 */
function createTitleParticles(title) {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'title-particles';
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '-1';
    
    title.style.position = 'relative';
    title.parentElement.insertBefore(particlesContainer, title);
    
    // Crear partículas
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'title-particle';
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.backgroundColor = 'var(--neon-pink)';
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0';
        particle.style.boxShadow = '0 0 6px var(--neon-pink)';
        
        // Posición inicial aleatoria
        const titleRect = title.getBoundingClientRect();
        const x = Math.random() * titleRect.width;
        const y = Math.random() * titleRect.height;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Añadir al DOM
        particlesContainer.appendChild(particle);
        
        // Animar
        animateParticle(particle);
    }
}

/**
 * Anima una partícula del título
 */
function animateParticle(particle) {
    // Valores aleatorios para la animación
    const duration = 2000 + Math.random() * 3000;
    const delay = Math.random() * 2000;
    const distance = 30 + Math.random() * 50;
    const direction = Math.random() * Math.PI * 2;
    
    // Posición inicial
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);
    
    // Posición final
    const endX = startX + Math.cos(direction) * distance;
    const endY = startY + Math.sin(direction) * distance;
    
    // Configurar animación
    particle.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    
    // Iniciar animación después del retraso
    setTimeout(() => {
        particle.style.opacity = '0.7';
        particle.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
        
        // Reiniciar animación cuando termine
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'translate(0, 0)';
            
            // Reiniciar después de un breve retraso
            setTimeout(() => {
                animateParticle(particle);
            }, 100);
        }, duration);
    }, delay);
}

/**
 * Configura el observador de intersección para animar elementos cuando entran en el viewport
 */
function setupIntersectionObserver() {
    const elements = [
        document.querySelector('.contact-form-container'),
        document.querySelector('.contact-info-container'),
        document.querySelector('.headquarters-map-container')
    ];
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Añadir clase con retraso para crear efecto escalonado
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Configurar estilo inicial y observar cada elemento
    elements.forEach(element => {
        if (element) {
            element.style.opacity = 0;
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(element);
        }
    });
}

/**
 * Configura el mapa interactivo
 */
function setupMap() {
    const mapContainer = document.querySelector('.headquarters-map-container');
    if (!mapContainer) return;
    
    // Añadir efecto de pulso al marcador
    const pulseElement = document.querySelector('.map-pulse');
    if (pulseElement) {
        pulseElement.style.animation = 'map-pulse 2s infinite';
    }
    
    // Añadir efecto de hover al mapa
    mapContainer.addEventListener('mouseenter', () => {
        const overlay = mapContainer.querySelector('.map-overlay');
        if (overlay) {
            overlay.style.opacity = '0.3';
        }
        
        const marker = mapContainer.querySelector('.map-marker');
        if (marker) {
            marker.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(1.2)';
            marker.style.boxShadow = '0 0 25px var(--neon-pink)';
        }
    });
    
    mapContainer.addEventListener('mouseleave', () => {
        const overlay = mapContainer.querySelector('.map-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
        
        const marker = mapContainer.querySelector('.map-marker');
        if (marker) {
            marker.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(1)';
            marker.style.boxShadow = '0 0 15px var(--neon-pink)';
        }
    });
} 