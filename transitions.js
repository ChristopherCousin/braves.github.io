// Funciones para efectos de transición avanzados

// Función para inicializar todos los efectos
function initTransitionEffects() {
    initRevealOnScroll();
    initRippleEffect();
    initTextReveal();
    initParallaxEffect();
}

// Efecto de revelación al hacer scroll
function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            } else {
                // Opcional: desactivar el elemento cuando sale de la vista
                // element.classList.remove('active');
            }
        });
    };
    
    // Ejecutar al cargar la página
    revealOnScroll();
    
    // Ejecutar al hacer scroll
    window.addEventListener('scroll', revealOnScroll);
}

// Efecto de ondulación al hacer clic
function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.ripple-effect');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            element.appendChild(ripple);
            
            // Eliminar el elemento después de la animación
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Efecto de revelación de texto
function initTextReveal() {
    const textElements = document.querySelectorAll('.text-reveal');
    
    // Preparar los elementos de texto
    textElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        // Crear spans para cada carácter
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.transitionDelay = `${i * 0.03}s`;
            element.appendChild(span);
        }
    });
    
    const revealText = () => {
        const windowHeight = window.innerHeight;
        
        textElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('active');
            }
        });
    };
    
    // Ejecutar al cargar la página
    revealText();
    
    // Ejecutar al hacer scroll
    window.addEventListener('scroll', revealText);
}

// Efecto de parallax
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    // Verificar si el dispositivo soporta parallax
    const supportsParallax = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!supportsParallax) return;
    
    const parallaxScroll = () => {
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            
            // Solo aplicar el efecto cuando el elemento está en la vista
            if (scrollPosition > elementTop - window.innerHeight && 
                scrollPosition < elementTop + elementHeight) {
                
                const speed = element.dataset.speed || 0.5;
                const yPos = (scrollPosition - elementTop) * speed;
                
                element.style.backgroundPositionY = `${yPos}px`;
            }
        });
    };
    
    // Ejecutar al hacer scroll
    window.addEventListener('scroll', parallaxScroll);
}

// Inicializar todos los efectos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initTransitionEffects);

// Reinicializar los efectos cuando cambie el tamaño de la ventana
window.addEventListener('resize', debounce(initTransitionEffects, 200));

// Nota: La función debounce se utiliza desde script.js 