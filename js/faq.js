/**
 * Inicialización de la sección de Preguntas Frecuentes
 */

document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
});

/**
 * Inicializa la sección de Preguntas Frecuentes
 */
function initFAQ() {
    // Datos de las preguntas frecuentes
    const faqData = [
        {
            question: "¿Qué es Braves?",
            answer: "Braves es una plataforma innovadora donde puedes participar en desafíos de habilidad, tanto virtuales como físicos, y obtener recompensas basadas en tu destreza. A diferencia de los juegos de azar, en Braves tu mérito y práctica son la clave del éxito."
        },
        {
            question: "¿Cómo funciona la verificación por video?",
            answer: "Para los desafíos físicos, utilizamos la cámara de tu móvil para grabar tu intento. El video se sube a la plataforma donde es verificado por la comunidad y nuestro equipo. Este sistema garantiza transparencia y justicia en la validación de los logros."
        },
        {
            question: "¿Qué tipos de desafíos puedo encontrar?",
            answer: "Braves ofrece una amplia variedad de desafíos, desde juegos virtuales de destreza como Flappy Braves y Super Bravey, hasta desafíos físicos como retos deportivos, de habilidad manual o de precisión. La oferta se actualiza constantemente con nuevos desafíos."
        },
        {
            question: "¿Cómo se determinan las recompensas?",
            answer: "Las recompensas se establecen antes de cada desafío y se basan en la dificultad y el número de participantes. A diferencia de los juegos de azar, en Braves las recompensas se distribuyen según el mérito y la habilidad demostrada por cada participante."
        },
        {
            question: "¿Es seguro participar en Braves?",
            answer: "Absolutamente. La seguridad es nuestra prioridad. Utilizamos tecnologías avanzadas de cifrado para proteger tus datos personales y transacciones. Además, nuestro equipo incluye expertos en ciberseguridad que garantizan la protección de la plataforma."
        },
        {
            question: "¿Cómo puedo empezar a participar?",
            answer: "Es muy sencillo. Descarga la aplicación Braves desde Google Play o App Store, crea tu cuenta, explora los desafíos disponibles y elige el que más te interese. Puedes practicar tantas veces como quieras antes de realizar tu intento oficial."
        }
    ];

    // Generar el HTML de las preguntas frecuentes
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) return;

    faqContainer.innerHTML = '';

    faqData.forEach((item, index) => {
        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-item');
        if (index === 0) faqItem.classList.add('active');

        faqItem.innerHTML = `
            <div class="faq-question">
                ${item.question}
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        `;

        faqContainer.appendChild(faqItem);
    });

    // Añadir interactividad a las preguntas
    setupFAQInteractivity();
}

/**
 * Configura la interactividad de las preguntas frecuentes
 */
function setupFAQInteractivity() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Cerrar todas las preguntas
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Si no estaba activa, abrirla
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
} 