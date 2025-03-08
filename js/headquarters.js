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
    
    // Generar partículas de fondo
    generateHeadquartersParticles();
    
    // Configurar mapa interactivo
    setupMap();
    
    // Configurar modal de éxito
    setupSuccessModal();
    
    // Configurar observador de intersección para animaciones
    setupIntersectionObserver();
}

/**
 * Configura el formulario de contacto con validación en tiempo real
 */
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const formInputs = contactForm.querySelectorAll('.form-control');
    const submitButton = contactForm.querySelector('.submit-button');
    const formStatus = document.getElementById('form-status');
    
    // Validación en tiempo real
    formInputs.forEach(input => {
        // Efecto al enfocar
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        // Efecto al perder el foco
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            validateInput(input);
        });
        
        // Validación mientras se escribe
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validar todos los campos antes de enviar
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Mostrar mensaje de error
            showFormStatus('Por favor, corrige los errores en el formulario.', 'error');
            return;
        }
        
        // Mostrar estado de carga
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simular envío (en una implementación real, esto sería una llamada AJAX)
        setTimeout(() => {
            // Ocultar estado de carga
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            // Mostrar el modal de éxito
            const successModal = document.getElementById('contact-success-modal');
            if (successModal) {
                successModal.classList.add('active');
            }
            
            // Restablecer formulario
            contactForm.reset();
            formInputs.forEach(input => {
                input.parentElement.classList.remove('has-value', 'valid', 'invalid');
            });
            
            // Limpiar cualquier mensaje de estado
            if (formStatus) {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }
        }, 1500);
    });
}

/**
 * Valida un campo de entrada individual
 * @param {HTMLElement} input - El campo de entrada a validar
 * @returns {boolean} - Verdadero si el campo es válido, falso en caso contrario
 */
function validateInput(input) {
    const formGroup = input.parentElement;
    const validationMessage = formGroup.querySelector('.validation-message');
    let isValid = true;
    let message = '';
    
    // Marcar como con valor o sin valor
    if (input.value.trim() !== '') {
        formGroup.classList.add('has-value');
    } else {
        formGroup.classList.remove('has-value');
    }
    
    // Validación específica por tipo
    switch (input.name) {
        case 'name':
            if (input.value.trim() === '') {
                isValid = false;
                message = 'Por favor, introduce tu nombre.';
            } else if (input.value.length < 2) {
                isValid = false;
                message = 'El nombre debe tener al menos 2 caracteres.';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (input.value.trim() === '') {
                isValid = false;
                message = 'Por favor, introduce tu email.';
            } else if (!emailRegex.test(input.value)) {
                isValid = false;
                message = 'Por favor, introduce un email válido.';
            }
            break;
            
        case 'subject':
            if (input.value.trim() === '') {
                isValid = false;
                message = 'Por favor, introduce un asunto.';
            } else if (input.value.length < 3) {
                isValid = false;
                message = 'El asunto debe tener al menos 3 caracteres.';
            }
            break;
            
        case 'message':
            if (input.value.trim() === '') {
                isValid = false;
                message = 'Por favor, escribe tu mensaje.';
            } else if (input.value.length < 10) {
                isValid = false;
                message = 'El mensaje debe tener al menos 10 caracteres.';
            }
            break;
    }
    
    // Actualizar estado visual
    if (isValid) {
        formGroup.classList.remove('invalid');
        if (input.value.trim() !== '') {
            formGroup.classList.add('valid');
        } else {
            formGroup.classList.remove('valid');
        }
    } else {
        formGroup.classList.remove('valid');
        formGroup.classList.add('invalid');
    }
    
    // Actualizar mensaje de validación
    if (validationMessage) {
        validationMessage.textContent = message;
    }
    
    return isValid;
}

/**
 * Muestra un mensaje de estado del formulario
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - El tipo de mensaje (success o error)
 */
function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    if (!formStatus) return;
    
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    
    // Scroll automático al mensaje
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
                icon.classList.add('active');
            }
        });
        
        method.addEventListener('mouseleave', () => {
            const icon = method.querySelector('.method-icon');
            if (icon) {
                icon.classList.remove('active');
            }
        });
    });
    
    // Efecto ripple para enlaces sociales
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const ripple = link.querySelector('.social-link-ripple');
            if (ripple) {
                ripple.style.opacity = '1';
            }
        });
    });
}

/**
 * Genera partículas flotantes en el fondo de la sección
 */
function generateHeadquartersParticles() {
    const particlesContainer = document.getElementById('headquarters-particles');
    if (!particlesContainer) return;
    
    // Limpiar partículas existentes
    particlesContainer.innerHTML = '';
    
    // Determinar número de partículas basado en el ancho de la pantalla
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 15 : 30;
    
    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('headquarters-particle');
        
        // Posición aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Tamaño aleatorio
        const size = Math.random() * 5 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Color aleatorio entre los colores de la marca
        const colors = ['var(--neon-primary)', 'var(--neon-secondary)', 'var(--neon-tertiary)'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Duración y retraso aleatorios para la animación
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Aplicar animación con keyframes usando CSS
        particle.style.animation = `floatParticle ${duration}s ${delay}s infinite linear`;
        
        // Añadir al contenedor
        particlesContainer.appendChild(particle);
    }
    
    // Agregar estilos para las animaciones si no existen
    if (!document.getElementById('headquarters-particles-styles')) {
        const style = document.createElement('style');
        style.id = 'headquarters-particles-styles';
        style.textContent = `
            .headquarters-particle {
                position: absolute;
                border-radius: 50%;
                opacity: 0.6;
                pointer-events: none;
                box-shadow: 0 0 5px currentColor;
            }
            
            @keyframes floatParticle {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(100px, 50px) rotate(90deg);
                }
                50% {
                    transform: translate(50px, 100px) rotate(180deg);
                }
                75% {
                    transform: translate(-50px, 50px) rotate(270deg);
                }
                100% {
                    transform: translate(0, 0) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Configura el observador de intersección para animar elementos cuando entran en el viewport
 */
function setupIntersectionObserver() {
    // Si el navegador no soporta IntersectionObserver, no hacer nada
    if (!('IntersectionObserver' in window)) return;
    
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ya tiene una clase de animación asignada en CSS
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Configura la interactividad del mapa
 */
function setupMap() {
    const mapContainer = document.querySelector('.headquarters-map-container');
    const map = document.getElementById('headquarters-map');
    const zoomInButton = document.getElementById('map-zoom-in');
    const zoomOutButton = document.getElementById('map-zoom-out');
    const fullscreenButton = document.getElementById('map-fullscreen');
    const zoomMapLink = document.getElementById('zoom-map');
    const mapTooltip = document.getElementById('map-tooltip');
    
    if (!mapContainer || !map) return;
    
    // Variables para el zoom
    let currentZoom = 1;
    const minZoom = 1;
    const maxZoom = 2;
    const zoomStep = 0.2;
    
    // Manejar botón de zoom in
    if (zoomInButton) {
        zoomInButton.addEventListener('click', () => {
            if (currentZoom < maxZoom) {
                currentZoom += zoomStep;
                map.style.transform = `scale(${currentZoom})`;
            }
        });
    }
    
    // Manejar botón de zoom out
    if (zoomOutButton) {
        zoomOutButton.addEventListener('click', () => {
            if (currentZoom > minZoom) {
                currentZoom -= zoomStep;
                map.style.transform = `scale(${currentZoom})`;
            }
        });
    }
    
    // Manejar botón de pantalla completa
    if (fullscreenButton && mapContainer.requestFullscreen) {
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                mapContainer.requestFullscreen().catch(err => {
                    console.log(`Error al intentar modo pantalla completa: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    } else if (fullscreenButton) {
        fullscreenButton.style.display = 'none';
    }
    
    // Manejar enlace de zoom
    if (zoomMapLink) {
        zoomMapLink.addEventListener('click', () => {
            // Hacer que el mapa sea visible
            mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Aplicar un pequeño zoom para destacar
            currentZoom = 1.3;
            map.style.transform = `scale(${currentZoom})`;
            
            // Mostrar el tooltip
            if (mapTooltip) {
                mapTooltip.style.opacity = '1';
                mapTooltip.style.bottom = '80px';
                
                // Ocultar después de un tiempo
                setTimeout(() => {
                    mapTooltip.style.opacity = '';
                    mapTooltip.style.bottom = '';
                }, 3000);
            }
        });
    }
    
    // Interacción con el marcador
    const mapMarker = mapContainer.querySelector('.map-marker');
    if (mapMarker && mapTooltip) {
        mapMarker.addEventListener('mouseenter', () => {
            mapTooltip.style.opacity = '1';
            mapTooltip.style.bottom = '80px';
        });
        
        mapMarker.addEventListener('mouseleave', () => {
            mapTooltip.style.opacity = '';
            mapTooltip.style.bottom = '';
        });
    }
}

/**
 * Configura el modal de éxito
 */
function setupSuccessModal() {
    const successModal = document.getElementById('contact-success-modal');
    const closeButton = document.getElementById('success-modal-close');
    
    if (!successModal || !closeButton) return;
    
    // Cerrar modal al hacer clic en el botón
    closeButton.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
    
    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            successModal.classList.remove('active');
        }
    });
}

// Reinicializar partículas al cambiar el tamaño de la ventana
window.addEventListener('resize', debounce(() => {
    generateHeadquartersParticles();
}, 250));

// Función debounce para optimizar eventos frecuentes
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 