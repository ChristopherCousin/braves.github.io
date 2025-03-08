/**
 * Sistema de Preguntas Frecuentes Mejorado para Braves
 * Incluye: categorización, búsqueda, animaciones y mejor interactividad
 */

document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
});

/**
 * Inicializa la sección de Preguntas Frecuentes
 */
function initFAQ() {
    // Base de datos de preguntas frecuentes con categorías
    const faqData = [
        {
            question: "¿Qué es Braves?",
            answer: "Braves es una plataforma innovadora donde puedes participar en desafíos de habilidad, tanto virtuales como físicos, y obtener recompensas basadas en tu destreza. A diferencia de los juegos de azar, en Braves tu mérito y práctica son la clave del éxito.",
            category: "general"
        },
        {
            question: "¿Cómo funciona la verificación por video?",
            answer: "Para los desafíos físicos, utilizamos la cámara de tu móvil para grabar tu intento. El video se sube a la plataforma donde es verificado por la comunidad y nuestro equipo. Este sistema garantiza transparencia y justicia en la validación de los logros.",
            category: "gameplay"
        },
        {
            question: "¿Qué tipos de desafíos puedo encontrar?",
            answer: "Braves ofrece una amplia variedad de desafíos, desde juegos virtuales de destreza como Flappy Braves y Super Bravey, hasta desafíos físicos como retos deportivos, de habilidad manual o de precisión. La oferta se actualiza constantemente con nuevos desafíos.",
            category: "gameplay"
        },
        {
            question: "¿Cómo se determinan las recompensas?",
            answer: "Las recompensas se establecen antes de cada desafío y se basan en la dificultad y el número de participantes. A diferencia de los juegos de azar, en Braves las recompensas se distribuyen según el mérito y la habilidad demostrada por cada participante.",
            category: "rewards"
        },
        {
            question: "¿Es seguro participar en Braves?",
            answer: "Absolutamente. La seguridad es nuestra prioridad. Utilizamos tecnologías avanzadas de cifrado para proteger tus datos personales y transacciones. Además, nuestro equipo incluye expertos en ciberseguridad que garantizan la protección de la plataforma.",
            category: "security"
        },
        {
            question: "¿Cómo puedo empezar a participar?",
            answer: "Es muy sencillo. Descarga la aplicación Braves desde Google Play o App Store, crea tu cuenta, explora los desafíos disponibles y elige el que más te interese. Puedes practicar tantas veces como quieras antes de realizar tu intento oficial.",
            category: "general"
        },
        {
            question: "¿Qué medidas de seguridad tiene Braves para proteger mi información?",
            answer: "Implementamos cifrado de extremo a extremo, autenticación de dos factores, y seguimos los estándares más rigurosos de la industria. Realizamos auditorías de seguridad periódicas y trabajamos con expertos en ciberseguridad para garantizar la protección de todos tus datos.",
            category: "security"
        },
        {
            question: "¿Cuándo recibo mis recompensas si gano un desafío?",
            answer: "Las recompensas se acreditan en tu cuenta Braves inmediatamente después de que se valide tu logro. Para los desafíos virtuales, esto ocurre instantáneamente. Para los desafíos físicos, el proceso de verificación puede tomar hasta 24 horas dependiendo del volumen de participación.",
            category: "rewards"
        },
        {
            question: "¿Puedo retirar mis recompensas a mi cuenta bancaria?",
            answer: "Sí, puedes transferir tus recompensas a tu cuenta bancaria o utilizar diversos métodos de pago electrónico. El proceso es sencillo y seguro, y las transferencias suelen completarse en un plazo de 1 a 3 días hábiles según tu ubicación y entidad bancaria.",
            category: "rewards"
        },
        {
            question: "¿Existen límites de edad para participar en Braves?",
            answer: "Sí, debes ser mayor de 18 años para participar en los desafíos con recompensas monetarias. Sin embargo, ofrecemos una modalidad junior sin transacciones económicas para usuarios entre 13 y 18 años, con autorización de sus tutores legales.",
            category: "general"
        },
        // Preguntas adicionales trasladadas desde script.js
        {
            question: "¿Cómo funciona Braves?",
            answer: "Braves es una plataforma donde puedes participar en desafíos de habilidad, tanto virtuales como físicos. Eliges un desafío, pagas una entrada, demuestras tu destreza y, si cumples el objetivo, obtienes una recompensa justa.",
            category: "general"
        },
        {
            question: "¿Es legal obtener recompensas en Braves?",
            answer: "Sí, Braves se basa en la habilidad del jugador, no en el azar. Esto la diferencia de los juegos de apuestas. Cumplimos con las regulaciones aplicables a juegos de habilidad.",
            category: "general"
        },
        {
            question: "¿Cómo se garantiza la seguridad y justicia en los desafíos?",
            answer: "Utilizamos tecnología de verificación por video para los desafíos físicos y sistemas de detección de trampas para los juegos virtuales. Además, nuestro equipo de seguridad, liderado por expertos en ciberseguridad, monitorea constantemente la plataforma.",
            category: "security"
        },
        {
            question: "¿Puedo practicar antes de participar en un desafío oficial?",
            answer: "¡Absolutamente! Fomentamos la práctica. Puedes entrenar en los desafíos tantas veces como quieras antes de hacer tu intento oficial.",
            category: "gameplay"
        },
        {
            question: "¿Cómo recibo mis recompensas?",
            answer: "Las recompensas se acreditan a tu cuenta de Braves inmediatamente después de la verificación del desafío. Puedes retirarlas a tu cuenta bancaria o usarlas para participar en más desafíos.",
            category: "rewards"
        }
    ];

    // Elementos del DOM
    const faqContainer = document.querySelector('.faq-container');
    const faqNoResults = document.getElementById('faq-no-results');
    const faqSearch = document.getElementById('faq-search');
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqMoreButton = document.getElementById('faq-more-button');
    
    if (!faqContainer) {
        console.error('Elemento faq-container no encontrado');
        return;
    }
    
    // Variables de estado
    let visibleItems = 5; // Número inicial de preguntas visibles
    let currentCategory = 'all';
    let searchQuery = '';
    
    // Generar el HTML de las preguntas frecuentes con el límite inicial
    generateFAQItems();
    
    // Configurar eventos de interacción
    setupFAQInteractivity();
    setupSearch();
    setupCategoryFilters();
    setupMoreButton();
    
    /**
     * Genera los elementos HTML de las preguntas frecuentes
     * @param {boolean} clearContainer - Si se debe limpiar el contenedor antes de generar los elementos
     */
    function generateFAQItems(clearContainer = true) {
        if (clearContainer) {
            faqContainer.innerHTML = '';
        }
        
        let filteredData = faqData;
        
        // Filtrar por categoría si no es "all"
        if (currentCategory !== 'all') {
            filteredData = filteredData.filter(item => item.category === currentCategory);
        }
        
        // Filtrar por búsqueda si hay query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(item => 
                item.question.toLowerCase().includes(query) || 
                item.answer.toLowerCase().includes(query)
            );
        }
        
        // Mostrar mensaje de no resultados si es necesario
        if (filteredData.length === 0) {
            faqNoResults.style.display = 'block';
            faqMoreButton.style.display = 'none';
            return;
        } else {
            faqNoResults.style.display = 'none';
        }
        
        // Limitar el número de elementos a mostrar
        const itemsToShow = Math.min(visibleItems, filteredData.length);
        
        // Mostrar u ocultar el botón "Ver más" según corresponda
        faqMoreButton.style.display = itemsToShow < filteredData.length ? 'inline-flex' : 'none';
        
        // Generar los elementos HTML
        for (let i = 0; i < itemsToShow; i++) {
            const item = filteredData[i];
            const faqItem = document.createElement('div');
            faqItem.classList.add('faq-item');
            faqItem.classList.add(`faq-category-${item.category}`);
            faqItem.style.setProperty('--item-index', i);
            
            // Resaltar términos de búsqueda si hay query
            let questionText = item.question;
            let answerText = item.answer;
            
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const highlightClass = 'faq-highlight';
                
                // Función para resaltar términos
                const highlightText = (text, query) => {
                    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
                };
                
                questionText = highlightText(questionText, query);
                answerText = highlightText(answerText, query);
            }
            
            faqItem.innerHTML = `
                <div class="faq-question">
                    ${questionText}
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${answerText}</p>
                </div>
            `;
            
            faqContainer.appendChild(faqItem);
        }
    }
    
    /**
     * Configura la interactividad de las preguntas frecuentes
     */
    function setupFAQInteractivity() {
        // Delegación de eventos para manejar clics en las preguntas
        faqContainer.addEventListener('click', (e) => {
            const questionElement = e.target.closest('.faq-question');
            if (!questionElement) return;
            
            const faqItem = questionElement.parentElement;
            const wasActive = faqItem.classList.contains('active');
            
            // Cerrar todas las preguntas
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Si no estaba activa, abrirla
            if (!wasActive) {
                faqItem.classList.add('active');
                
                // Reportar evento de análisis
                if (typeof gtag === 'function') {
                    gtag('event', 'faq_open', {
                        'event_category': 'engagement',
                        'event_label': questionElement.textContent.trim()
                    });
                }
                
                // Hacer scroll suave hasta la pregunta si es necesario
                ensureElementIsVisible(faqItem);
            }
        });
    }
    
    /**
     * Configura la funcionalidad de búsqueda
     */
    function setupSearch() {
        if (!faqSearch) return;
        
        // Implementar debounce para la búsqueda
        const debounce = (func, delay) => {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        };
        
        // Función de búsqueda con debounce
        const performSearch = debounce((e) => {
            searchQuery = e.target.value.trim();
            visibleItems = 5; // Resetear a mostrar solo los primeros 5 items
            generateFAQItems();
            
            // Reportar evento de búsqueda si hay texto
            if (searchQuery && typeof gtag === 'function') {
                gtag('event', 'faq_search', {
                    'event_category': 'engagement',
                    'event_label': searchQuery
                });
            }
        }, 300);
        
        faqSearch.addEventListener('input', performSearch);
    }
    
    /**
     * Configura los filtros de categorías
     */
    function setupCategoryFilters() {
        if (!faqCategories.length) return;
        
        faqCategories.forEach(categoryBtn => {
            categoryBtn.addEventListener('click', () => {
                // Actualizar estado visual de los botones
                faqCategories.forEach(btn => btn.classList.remove('active'));
                categoryBtn.classList.add('active');
                
                // Actualizar categoría actual
                currentCategory = categoryBtn.dataset.category;
                visibleItems = 5; // Resetear a mostrar solo los primeros 5 items
                generateFAQItems();
                
                // Reportar evento de análisis
                if (typeof gtag === 'function') {
                    gtag('event', 'faq_filter', {
                        'event_category': 'engagement',
                        'event_label': currentCategory
                    });
                }
            });
        });
    }
    
    /**
     * Configura el botón "Ver más"
     */
    function setupMoreButton() {
        if (!faqMoreButton) return;
        
        faqMoreButton.addEventListener('click', () => {
            visibleItems += 5; // Mostrar 5 más cada vez
            generateFAQItems();
            
            // Reportar evento de análisis
            if (typeof gtag === 'function') {
                gtag('event', 'faq_load_more', {
                    'event_category': 'engagement',
                    'event_value': visibleItems
                });
            }
        });
    }
    
    /**
     * Asegura que un elemento sea visible haciendo scroll si es necesario
     * @param {HTMLElement} element - El elemento que debe ser visible
     */
    function ensureElementIsVisible(element) {
        const rect = element.getBoundingClientRect();
        const isVisible = 
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
        
        if (!isVisible) {
            const scrollOptions = {
                behavior: 'smooth',
                block: 'center'
            };
            
            // Usar scrollIntoView con polyfill para navegadores antiguos
            if (element.scrollIntoView) {
                element.scrollIntoView(scrollOptions);
            }
        }
    }
}

/**
 * Agrega una clase CSS a la sección FAQ cuando sea visible en el viewport
 * para activar animaciones de entrada
 */
const observeFAQSection = () => {
    const faqSection = document.querySelector('.faq');
    if (!faqSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                faqSection.classList.add('faq-visible');
                observer.unobserve(faqSection);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(faqSection);
};

// Inicializar observer para animaciones
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    observeFAQSection();
} else {
    document.addEventListener('DOMContentLoaded', observeFAQSection);
} 