/**
 * Sistema de Reconocimientos Mejorado para Braves
 * Incluye: navegación entre premios, animaciones y efectos visuales
 */

document.addEventListener('DOMContentLoaded', () => {
    initAwards();
});

/**
 * Inicializa la sección de Reconocimientos
 */
function initAwards() {
    // Base de datos de reconocimientos
    const awardsData = [
        {
            title: "ANDE",
            logoSrc: "assets/logo_ANDE.png",
            description: "Ganadores del Premio de Innovación otorgado por ANDE (Agencia Nacional de Desarrollo) y ANII (Agencia Nacional de Investigación e Innovación) de Uruguay por nuestro enfoque revolucionario en desafíos de habilidad y sistema de recompensas justas.",
            quote: "Braves representa un enfoque innovador en la industria de juegos, combinando tecnología avanzada con un modelo de negocio centrado en recompensas por habilidad real. Su impacto potencial en el ecosistema de entretenimiento digital es significativo.",
            quoteAuthor: "Comité de Innovación ANDE-ANII"
        },
        {
            title: "ANII",
            logoSrc: "assets/logo_ANII.png",
            description: "Reconocidos por ANII como uno de los proyectos más prometedores en tecnología emergente. Nuestra plataforma de desafíos de habilidad ha sido destacada por su potencial de escalabilidad internacional y contribución al ecosistema de innovación.",
            quote: "El equipo de Braves ha demostrado una capacidad excepcional para implementar soluciones tecnológicas avanzadas, creando una plataforma que transforma el concepto tradicional de competencias y recompensas en entornos digitales.",
            quoteAuthor: "Dirección de Proyectos Innovadores - ANII"
        }
    ];

    // Variables y elementos DOM
    let currentAwardIndex = 0;
    const awardsSection = document.querySelector('.awards');
    const awardLogos = document.querySelectorAll('.award-logo');
    const awardDescription = document.querySelector('.award-description p');
    const awardQuote = document.querySelector('.award-quote p');
    const awardQuoteAuthor = document.querySelector('.award-quote-author');
    const prevButton = document.getElementById('award-prev');
    const nextButton = document.getElementById('award-next');
    const indicators = document.querySelectorAll('.award-indicator');

    // Verificar elementos necesarios
    if (!awardsSection || !awardDescription || !awardQuote || !awardQuoteAuthor || !prevButton || !nextButton) {
        console.error('Elementos necesarios para la sección de reconocimientos no encontrados');
        return;
    }

    // Configurar observador para animaciones al entrar en viewport
    setupIntersectionObserver();
    
    // Configurar eventos para navegación
    setupNavigation();

    /**
     * Configura el Intersection Observer para activar animaciones
     * cuando la sección entre en el viewport
     */
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    awardsSection.classList.add('awards-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(awardsSection);
    }

    /**
     * Configura los eventos para la navegación entre reconocimientos
     */
    function setupNavigation() {
        // Botón anterior
        prevButton.addEventListener('click', () => {
            navigateAward(-1);
        });

        // Botón siguiente
        nextButton.addEventListener('click', () => {
            navigateAward(1);
        });

        // Indicadores de navegación
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const index = parseInt(indicator.dataset.index);
                if (index !== currentAwardIndex) {
                    showAward(index);
                }
            });
        });

        // Logos como navegación
        awardLogos.forEach(logo => {
            logo.addEventListener('click', () => {
                const index = parseInt(logo.dataset.award);
                if (index !== currentAwardIndex) {
                    showAward(index);
                }
            });
        });

        // Configurar interacción con teclado para accesibilidad
        document.addEventListener('keydown', (e) => {
            if (isElementInViewport(awardsSection)) {
                if (e.key === 'ArrowLeft') {
                    navigateAward(-1);
                } else if (e.key === 'ArrowRight') {
                    navigateAward(1);
                }
            }
        });

        // Configurar swipe en móvil
        setupTouchNavigation();
    }

    /**
     * Configura el deslizamiento táctil para navegación en dispositivos móviles
     */
    function setupTouchNavigation() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        awardsSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        awardsSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const minSwipeDistance = 50;
            if (touchEndX < touchStartX - minSwipeDistance) {
                // Swipe hacia la izquierda (siguiente)
                navigateAward(1);
            } else if (touchEndX > touchStartX + minSwipeDistance) {
                // Swipe hacia la derecha (anterior)
                navigateAward(-1);
            }
        }
    }

    /**
     * Navega entre reconocimientos
     * @param {number} direction - Dirección de navegación (1: adelante, -1: atrás)
     */
    function navigateAward(direction) {
        const newIndex = (currentAwardIndex + direction + awardsData.length) % awardsData.length;
        showAward(newIndex);
    }

    /**
     * Muestra el reconocimiento en el índice especificado
     * @param {number} index - Índice del reconocimiento a mostrar
     */
    function showAward(index) {
        // Guardar índice actual
        currentAwardIndex = index;
        
        // Animar salida
        fadeOutContent(() => {
            // Actualizar contenido
            updateAwardContent();
            
            // Animar entrada
            fadeInContent();
            
            // Actualizar indicadores
            updateIndicators();
            
            // Actualizar estado visual de los logos
            updateLogosState();
            
            // Reportar evento de análisis
            if (typeof gtag === 'function') {
                gtag('event', 'award_view', {
                    'event_category': 'engagement',
                    'event_label': awardsData[index].title
                });
            }
        });
    }

    /**
     * Actualiza el contenido del reconocimiento actual
     */
    function updateAwardContent() {
        const award = awardsData[currentAwardIndex];
        awardDescription.textContent = award.description;
        awardQuote.textContent = award.quote;
        awardQuoteAuthor.textContent = award.quoteAuthor;
    }

    /**
     * Actualiza el estado de los indicadores
     */
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentAwardIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    /**
     * Actualiza el estado visual de los logos
     */
    function updateLogosState() {
        awardLogos.forEach((logo, index) => {
            if (index === currentAwardIndex) {
                logo.style.borderColor = 'var(--neon-primary)';
                logo.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
            } else {
                logo.style.borderColor = 'rgba(0, 255, 255, 0.15)';
                logo.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.1)';
            }
        });
    }

    /**
     * Anima la salida del contenido con fade out
     * @param {Function} callback - Función a ejecutar después de la animación
     */
    function fadeOutContent(callback) {
        gsap.to(awardDescription, { 
            opacity: 0, 
            y: -20, 
            duration: 0.3,
            onComplete: callback
        });
        gsap.to(awardQuote, { 
            opacity: 0, 
            y: -20, 
            duration: 0.3
        });
        gsap.to(awardQuoteAuthor, { 
            opacity: 0, 
            y: -20, 
            duration: 0.3
        });
    }

    /**
     * Anima la entrada del contenido con fade in
     */
    function fadeInContent() {
        gsap.fromTo(awardDescription, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
        );
        gsap.fromTo(awardQuote, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }
        );
        gsap.fromTo(awardQuoteAuthor, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5, delay: 0.3 }
        );
    }

    /**
     * Verifica si un elemento está visible en el viewport
     * @param {HTMLElement} element - Elemento a verificar
     * @returns {boolean} - True si el elemento está en el viewport
     */
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Inicializar con el primer premio activo
    updateLogosState();
} 