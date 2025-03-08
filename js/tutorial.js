/**
 * Tutorial de la Arena - Funcionalidad interactiva
 * Este script maneja la navegación entre pasos, animaciones y el sistema de recompensas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar las partículas de fondo
    initParticles();
    
    // Elementos del tutorial
    const stepsContainer = document.querySelector('.steps-container');
    const steps = document.querySelectorAll('.step');
    const progressBar = document.querySelector('.progress-bar');
    const progressGlow = document.querySelector('.progress-glow');
    const progressMarkers = document.querySelectorAll('.progress-marker');
    const navDots = document.querySelectorAll('.nav-dot');
    const rewardsContainer = document.getElementById('tutorial-rewards');
    
    // Botones de navegación
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const downloadButton = document.querySelector('.download-button');
    
    // Estado actual
    let currentStep = 1;
    const totalSteps = steps.length;
    
    // Sistema de partículas
    let particleSystem = null;
    
    // Inicializar el tutorial
    initTutorial();
    
    /**
     * Inicializa el tutorial configurando el primer paso
     */
    function initTutorial() {
        // Mostrar el primer paso
        updateStep(1);
        
        // Configurar eventos para los botones de navegación
        nextButtons.forEach(button => {
            button.addEventListener('click', goToNextStep);
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', goToPrevStep);
        });
        
        // Configurar eventos para los puntos de navegación
        navDots.forEach(dot => {
            dot.addEventListener('click', function() {
                const stepNumber = parseInt(this.getAttribute('data-step'));
                updateStep(stepNumber);
            });
        });
        
        // Configurar evento para el botón de descarga
        if (downloadButton) {
            downloadButton.addEventListener('click', completeAndReward);
        }
        
        // Detectar cuando el tutorial está en el viewport para iniciar animaciones
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stepsContainer.classList.add('in-view');
                    
                    // Iniciar animación de partículas cuando está en vista
                    if (particleSystem) {
                        particleSystem.resume();
                    }
                } else {
                    // Pausar animación de partículas cuando no está en vista
                    if (particleSystem) {
                        particleSystem.pause();
                    }
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(stepsContainer);
    }
    
    /**
     * Actualiza la visualización para mostrar el paso especificado
     * @param {number} stepNumber - El número del paso a mostrar
     */
    function updateStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > totalSteps) return;
        
        // Actualizar el paso actual
        currentStep = stepNumber;
        
        // Actualizar clases para los pasos
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active');
            
            if (stepNum < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('completed');
                step.classList.remove('active');
            }
        });
        
        // Actualizar la barra de progreso
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressGlow.style.width = `${progressPercentage}%`;
        progressGlow.style.opacity = progressPercentage > 0 ? '1' : '0';
        
        // Actualizar los marcadores de progreso
        progressMarkers.forEach((marker, index) => {
            const markerStep = index + 1;
            marker.classList.remove('active', 'completed');
            
            if (markerStep < currentStep) {
                marker.classList.add('completed');
            } else if (markerStep === currentStep) {
                marker.classList.add('active');
            }
        });
        
        // Actualizar los puntos de navegación
        navDots.forEach((dot, index) => {
            const dotStep = index + 1;
            dot.classList.remove('active');
            
            if (dotStep === currentStep) {
                dot.classList.add('active');
            }
        });
        
        // Mostrar/ocultar botones según el paso actual
        updateNavigationButtons();
        
        // Aplicar animaciones para el paso actual
        triggerStepAnimations();
        
        // Emitir partículas especiales para el paso actual
        emitStepParticles(currentStep);
        
        // Registrar evento de analítica
        if (typeof gtag === 'function') {
            gtag('event', 'tutorial_step', {
                'event_category': 'engagement',
                'event_label': `Step ${currentStep}`,
                'value': currentStep
            });
        }
    }
    
    /**
     * Actualiza la visibilidad de los botones de navegación según el paso actual
     */
    function updateNavigationButtons() {
        // Mostrar/ocultar botones de anterior
        prevButtons.forEach(button => {
            if (currentStep === 1) {
                button.style.visibility = 'hidden';
                button.style.opacity = '0';
            } else {
                button.style.visibility = 'visible';
                button.style.opacity = '1';
            }
        });
        
        // Mostrar/ocultar botones de siguiente
        nextButtons.forEach(button => {
            if (currentStep === totalSteps) {
                button.style.visibility = 'hidden';
                button.style.opacity = '0';
            } else {
                button.style.visibility = 'visible';
                button.style.opacity = '1';
            }
        });
        
        // Mostrar/ocultar botón de descarga
        if (downloadButton) {
            if (currentStep === totalSteps) {
                downloadButton.style.display = 'inline-flex';
                // Añadir animación de pulso al botón de descarga
                setTimeout(() => {
                    downloadButton.classList.add('pulse-animation');
                }, 500);
            } else {
                downloadButton.style.display = 'none';
                downloadButton.classList.remove('pulse-animation');
            }
        }
    }
    
    /**
     * Navega al siguiente paso
     */
    function goToNextStep() {
        if (currentStep < totalSteps) {
            updateStep(currentStep + 1);
            
            // Efecto de transición
            const nextStep = document.querySelector(`.step[data-step="${currentStep}"]`);
            nextStep.style.animation = 'fadeInRight 0.5s forwards';
            
            // Emitir partículas de transición
            emitTransitionParticles('next');
        }
    }
    
    /**
     * Navega al paso anterior
     */
    function goToPrevStep() {
        if (currentStep > 1) {
            updateStep(currentStep - 1);
            
            // Efecto de transición
            const prevStep = document.querySelector(`.step[data-step="${currentStep}"]`);
            prevStep.style.animation = 'fadeInLeft 0.5s forwards';
            
            // Emitir partículas de transición
            emitTransitionParticles('prev');
        }
    }
    
    /**
     * Activa las animaciones específicas para el paso actual
     */
    function triggerStepAnimations() {
        // Reiniciar animaciones para que se activen nuevamente
        const currentStepElement = document.querySelector(`.step[data-step="${currentStep}"]`);
        
        if (currentStepElement) {
            // Forzar un reflow para reiniciar las animaciones
            void currentStepElement.offsetWidth;
            
            // Aplicar clase para activar animaciones
            currentStepElement.classList.add('animate');
        }
    }
    
    /**
     * Muestra el sistema de recompensas al completar el tutorial
     */
    function completeAndReward() {
        // Marcar todos los pasos como completados
        steps.forEach(step => {
            step.classList.add('completed');
        });
        
        // Actualizar la barra de progreso al 100%
        progressBar.style.width = '100%';
        progressGlow.style.width = '100%';
        progressGlow.style.opacity = '1';
        
        // Actualizar todos los marcadores como completados
        progressMarkers.forEach(marker => {
            marker.classList.add('completed');
        });
        
        // Mostrar la recompensa
        setTimeout(() => {
            rewardsContainer.classList.add('show');
            
            // Añadir efecto de confeti
            createConfetti();
            
            // Emitir partículas de celebración
            emitCelebrationParticles();
            
            // Registrar evento de analítica
            if (typeof gtag === 'function') {
                gtag('event', 'tutorial_completed', {
                    'event_category': 'conversion',
                    'event_label': 'Tutorial Completed',
                    'value': 1
                });
            }
        }, 500);
        
        // Cerrar la recompensa al hacer clic fuera
        document.addEventListener('click', function closeReward(e) {
            if (!rewardsContainer.contains(e.target) && rewardsContainer.classList.contains('show') && !e.target.closest('.download-button')) {
                rewardsContainer.classList.remove('show');
                document.removeEventListener('click', closeReward);
            }
        });
        
        // Detectar plataforma para el botón de descarga
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        // Redirigir a la tienda correspondiente
        if (isIOS) {
            window.open('https://apps.apple.com/us/app/braves/id6740215654', '_blank');
        } else {
            window.open('https://play.google.com/store/apps/details?id=io.onlybraves.braves', '_blank');
        }
    }
    
    /**
     * Inicializa las partículas de fondo
     */
    function initParticles() {
        const particlesContainer = document.getElementById('tutorial-particles');
        if (!particlesContainer || typeof ParticleSystem === 'undefined') return;
        
        // Crear un canvas para las partículas
        const canvas = document.createElement('canvas');
        canvas.width = particlesContainer.clientWidth;
        canvas.height = particlesContainer.clientHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        particlesContainer.appendChild(canvas);
        
        // Inicializar el sistema de partículas
        particleSystem = new ParticleSystem(canvas, {
            maxParticles: 100,
            gravity: 0,
            wind: 0,
            friction: 0.98,
            drawMode: 'clear'
        });
        
        // Crear emisor de partículas de fondo
        const backgroundEmitter = particleSystem.createEmitter({
            position: { x: canvas.width / 2, y: canvas.height / 2 },
            rate: 0.5,
            life: 8,
            lifeVariation: 2,
            shape: 'circle',
            size: 2,
            sizeVariation: 1,
            speed: 0.5,
            speedVariation: 0.3,
            directionVariation: Math.PI * 2,
            color: 'rgba(0, 255, 255, 0.3)',
            opacity: 0.7,
            opacityVariation: 0.3,
            gravity: 0,
            wind: 0,
            friction: 0.99,
            blendMode: 'lighter'
        });
        
        // Iniciar el sistema de partículas
        particleSystem.start();
        
        // Ajustar el tamaño del canvas cuando cambia el tamaño de la ventana
        window.addEventListener('resize', () => {
            if (particleSystem) {
                particleSystem.resize(particlesContainer.clientWidth, particlesContainer.clientHeight);
                
                // Actualizar la posición del emisor
                if (backgroundEmitter) {
                    backgroundEmitter.position.x = canvas.width / 2;
                    backgroundEmitter.position.y = canvas.height / 2;
                }
            }
        });
    }
    
    /**
     * Emite partículas específicas para cada paso
     * @param {number} step - El número del paso actual
     */
    function emitStepParticles(step) {
        if (!particleSystem) return;
        
        const currentStepElement = document.querySelector(`.step[data-step="${step}"]`);
        if (!currentStepElement) return;
        
        // Obtener la posición del paso actual
        const stepRect = currentStepElement.getBoundingClientRect();
        const containerRect = stepsContainer.getBoundingClientRect();
        
        // Calcular la posición relativa al contenedor de partículas
        const x = stepRect.left + stepRect.width / 2 - containerRect.left;
        const y = stepRect.top + stepRect.height / 2 - containerRect.top;
        
        // Colores según el paso
        let color;
        switch (step) {
            case 1:
                color = 'rgba(0, 255, 255, 0.7)';
                break;
            case 2:
                color = 'rgba(255, 0, 160, 0.7)';
                break;
            case 3:
                color = 'rgba(255, 215, 0, 0.7)';
                break;
            default:
                color = 'rgba(255, 255, 255, 0.7)';
        }
        
        // Emitir partículas
        particleSystem.emit({
            position: { x, y },
            rate: 1,
            count: 10,
            life: 2,
            shape: 'circle',
            size: 3,
            sizeVariation: 1,
            speed: 1,
            speedVariation: 0.5,
            directionVariation: Math.PI * 2,
            color: color,
            opacity: 0.8,
            opacityVariation: 0.2,
            gravity: 0,
            friction: 0.95
        });
    }
    
    /**
     * Emite partículas durante la transición entre pasos
     * @param {string} direction - Dirección de la transición ('next' o 'prev')
     */
    function emitTransitionParticles(direction) {
        if (!particleSystem) return;
        
        const progressRect = progressBar.getBoundingClientRect();
        const containerRect = stepsContainer.getBoundingClientRect();
        
        // Calcular la posición relativa al contenedor de partículas
        const x = progressRect.right - containerRect.left;
        const y = progressRect.top + progressRect.height / 2 - containerRect.top;
        
        // Dirección de las partículas
        const angle = direction === 'next' ? 0 : Math.PI;
        
        // Emitir partículas
        particleSystem.emit({
            position: { x, y },
            count: 15,
            life: 1,
            shape: 'circle',
            size: 2,
            sizeVariation: 1,
            speed: 2,
            speedVariation: 1,
            direction: angle,
            directionVariation: Math.PI / 4,
            color: 'rgba(0, 255, 255, 0.8)',
            opacity: 0.9,
            opacityVariation: 0.2,
            gravity: 0,
            friction: 0.95
        });
    }
    
    /**
     * Emite partículas de celebración al completar el tutorial
     */
    function emitCelebrationParticles() {
        if (!particleSystem) return;
        
        const rewardRect = rewardsContainer.getBoundingClientRect();
        const containerRect = stepsContainer.getBoundingClientRect();
        
        // Calcular la posición relativa al contenedor de partículas
        const x = rewardRect.left + rewardRect.width / 2 - containerRect.left;
        const y = rewardRect.top + rewardRect.height / 2 - containerRect.top;
        
        // Colores para las partículas de celebración
        const colors = [
            'rgba(255, 0, 160, 0.8)',
            'rgba(0, 255, 255, 0.8)',
            'rgba(255, 215, 0, 0.8)',
            'rgba(0, 255, 0, 0.8)',
            'rgba(255, 0, 255, 0.8)'
        ];
        
        // Emitir partículas en forma de explosión
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                particleSystem.emit({
                    position: { x, y },
                    count: 20,
                    life: 2,
                    shape: 'circle',
                    size: 3,
                    sizeVariation: 2,
                    speed: 3,
                    speedVariation: 1,
                    directionVariation: Math.PI * 2,
                    color: colors[i % colors.length],
                    opacity: 0.9,
                    opacityVariation: 0.2,
                    gravity: 0.05,
                    friction: 0.95
                });
            }, i * 200);
        }
    }
    
    /**
     * Anima una partícula con movimiento flotante
     */
    function animateParticle(particle, speedX, speedY) {
        let posX = parseFloat(particle.style.left);
        let posY = parseFloat(particle.style.top);
        
        function updatePosition() {
            // Actualizar posición
            posX += speedX;
            posY += speedY;
            
            // Rebote en los bordes
            if (posX <= 0 || posX >= 100) speedX *= -1;
            if (posY <= 0 || posY >= 100) speedY *= -1;
            
            // Aplicar nueva posición
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Continuar animación
            requestAnimationFrame(updatePosition);
        }
        
        updatePosition();
    }
    
    /**
     * Crea un efecto de confeti al mostrar la recompensa
     */
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9;
        `;
        
        document.body.appendChild(confettiContainer);
        
        // Crear piezas de confeti
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            
            // Colores aleatorios
            const colors = ['#FF00A0', '#00FFFF', '#FFFF00', '#00FF00', '#FF00FF'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Tamaño aleatorio
            const size = Math.random() * 10 + 5;
            
            // Posición inicial
            const posX = Math.random() * 100;
            
            // Velocidad de caída aleatoria
            const duration = Math.random() * 3 + 2;
            
            // Forma aleatoria
            const shapes = ['circle', 'square', 'triangle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            
            // Aplicar estilos según la forma
            confetti.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                top: -5%;
                left: ${posX}%;
                opacity: ${Math.random() * 0.5 + 0.5};
                animation: fallConfetti ${duration}s ease-in forwards;
                box-shadow: 0 0 ${size/2}px rgba(255, 255, 255, 0.3);
            `;
            
            // Aplicar forma
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.backgroundColor = 'transparent';
                confetti.style.borderLeft = `${size/2}px solid transparent`;
                confetti.style.borderRight = `${size/2}px solid transparent`;
                confetti.style.borderBottom = `${size}px solid ${color}`;
            }
            
            // Añadir rotación aleatoria
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Añadir al contenedor
            confettiContainer.appendChild(confetti);
        }
        
        // Eliminar el confeti después de la animación
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }
});

// Definir animaciones CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes floatParticle {
        0%, 100% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(10px, 10px);
        }
        50% {
            transform: translate(0, 20px);
        }
        75% {
            transform: translate(-10px, 10px);
        }
    }
    
    @keyframes fallConfetti {
        0% {
            top: -5%;
            transform: translateX(0) rotate(0deg);
        }
        100% {
            top: 105%;
            transform: translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 720 - 360}deg);
        }
    }
    
    .particle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
    }
    
    .pulse-animation {
        animation: buttonPulse 1.5s infinite alternate;
    }
    
    @keyframes buttonPulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 10px var(--neon-secondary);
        }
        100% {
            transform: scale(1.05);
            box-shadow: 0 0 20px var(--neon-secondary), 0 0 40px var(--neon-secondary);
        }
    }
`;

document.head.appendChild(styleSheet); 