/**
 * Funcionalidades interactivas para la sección del Equipo
 * Braves - La Arena de Desafíos
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades cuando el DOM esté listo
    initTeamSection();
});

/**
 * Inicializa todas las funcionalidades de la sección de equipo
 */
function initTeamSection() {
    // Generar partículas en el fondo
    generateTeamParticles();
    
    // Inicializar botones de expandir/colapsar
    initExpandButtons();
    
    // Animar barras de habilidades cuando son visibles
    initSkillsAnimation();
    
    // Detectar scroll para animar elementos
    setupScrollAnimations();
}

/**
 * Genera partículas en el fondo de la sección del equipo
 */
function generateTeamParticles() {
    const particlesContainer = document.getElementById('team-particles');
    if (!particlesContainer) return;
    
    // Limpiar partículas existentes
    particlesContainer.innerHTML = '';
    
    // Determinar número de partículas basado en el ancho de la pantalla
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 10 : 20;
    
    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('team-particle');
        
        // Posición aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Tamaño aleatorio
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Color aleatorio entre los colores de la marca
        const colors = ['var(--neon-primary)', 'var(--neon-secondary)', 'var(--neon-tertiary)'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Duración y retraso aleatorios para la animación
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Añadir al contenedor
        particlesContainer.appendChild(particle);
    }
}

/**
 * Inicializa los botones de expandir/colapsar
 */
function initExpandButtons() {
    const expandButtons = document.querySelectorAll('.member-expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Obtener el estado actual (expandido o colapsado)
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Cambiar el estado
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Obtener el contenido expandible
            const targetId = this.getAttribute('aria-controls');
            const expandedContent = document.getElementById(targetId);
            
            if (expandedContent) {
                // Aplicar la clase active para mostrar/ocultar
                expandedContent.classList.toggle('active');
                
                // Si el contenido se expande, animar las barras de habilidades
                if (!isExpanded) {
                    setTimeout(() => {
                        const skillBars = expandedContent.querySelectorAll('.skill-level');
                        animateSkillBars(skillBars);
                    }, 300);
                }
            }
        });
    });
}

/**
 * Configura la animación de las barras de habilidades al hacer scroll
 */
function initSkillsAnimation() {
    // Usar Intersection Observer para detectar cuando las habilidades entran en vista
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-level');
                animateSkillBars(skillBars);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observar cada conjunto de habilidades
    document.querySelectorAll('.member-skills').forEach(skillsContainer => {
        observer.observe(skillsContainer);
    });
}

/**
 * Anima las barras de habilidades
 * @param {NodeList} skillBars - Colección de barras de habilidades
 */
function animateSkillBars(skillBars) {
    skillBars.forEach((bar, index) => {
        // Aplicar un retraso progresivo para una animación escalonada
        setTimeout(() => {
            // Obtener el ancho definido en el estilo y aplicarlo
            const width = bar.style.width;
            bar.style.width = '0';
            
            // Forzar un reflow para reiniciar la animación
            bar.offsetWidth;
            
            // Aplicar el ancho final
            bar.style.width = width;
        }, index * 150);
    });
}

/**
 * Configura animaciones adicionales basadas en scroll
 */
function setupScrollAnimations() {
    // Si GSAP está disponible, usarlo para animaciones avanzadas
    if (typeof gsap !== 'undefined' && gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animar la conexión entre miembros del equipo
        gsap.to('.connection-line', {
            scrollTrigger: {
                trigger: '.team-connections',
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            width: '50%',
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out'
        });
        
        // Animar nodos de conexión
        gsap.to('.connection-node', {
            scrollTrigger: {
                trigger: '.team-connections',
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            scale: 1,
            stagger: 0.3,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
    }
}

// Reconectar las animaciones en caso de cambios de tamaño de ventana
window.addEventListener('resize', debounce(function() {
    generateTeamParticles();
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

// Estilos CSS adicionales para las partículas
document.addEventListener('DOMContentLoaded', function() {
    // Añadir estilos para las partículas si no existen
    if (!document.getElementById('team-particles-styles')) {
        const style = document.createElement('style');
        style.id = 'team-particles-styles';
        style.textContent = `
            .team-particle {
                position: absolute;
                border-radius: 50%;
                opacity: 0.6;
                pointer-events: none;
                animation: floatParticle 20s infinite linear;
            }
            
            @keyframes floatParticle {
                0% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(100px, 50px);
                }
                50% {
                    transform: translate(50px, 100px);
                }
                75% {
                    transform: translate(-50px, 50px);
                }
                100% {
                    transform: translate(0, 0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}); 