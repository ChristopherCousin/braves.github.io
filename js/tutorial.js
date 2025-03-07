// Script para manejar la interactividad del Tutorial de la Arena

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const steps = document.querySelectorAll('.step');
    const progressBar = document.getElementById('tutorial-progress');
    const nextButtons = document.querySelectorAll('[data-action="next-step"]');
    const downloadButton = document.querySelector('[data-action="download-app"]');
    
    // Variables de estado
    let currentStep = 1;
    let totalSteps = steps.length;
    
    // Inicializar
    initTutorial();
    
    // Función de inicialización
    function initTutorial() {
        // Marcar el primer paso como activo
        updateActiveStep();
        
        // Añadir eventos a los botones
        nextButtons.forEach(button => {
            button.addEventListener('click', handleNextStep);
        });
        
        // Evento para el botón de descarga
        if (downloadButton) {
            downloadButton.addEventListener('click', handleDownload);
        }
        
        // Añadir eventos de clic a los pasos para activarlos directamente
        steps.forEach(step => {
            step.addEventListener('click', function() {
                const stepNumber = parseInt(step.getAttribute('data-step'));
                if (stepNumber <= currentStep) {
                    // Solo permitir activar pasos que ya se han desbloqueado
                    activateStep(stepNumber);
                }
            });
        });
        
        // Observador de intersección para activar animaciones cuando la sección es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Añadir clase para activar animaciones
                    document.querySelector('.how-it-works').classList.add('in-view');
                    
                    // Desconectar el observador después de activar
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        // Observar la sección
        observer.observe(document.querySelector('.how-it-works'));
    }
    
    // Manejar el clic en el botón "Siguiente"
    function handleNextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateActiveStep();
            
            // Registrar evento de analítica
            if (typeof gtag === 'function') {
                gtag('event', 'tutorial_progress', {
                    'event_category': 'engagement',
                    'event_label': 'Step ' + currentStep,
                    'value': currentStep
                });
            }
        }
    }
    
    // Manejar el clic en el botón "Descargar App"
    function handleDownload() {
        // Detectar plataforma
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        // Redirigir a la tienda correspondiente
        if (isIOS) {
            window.open('https://apps.apple.com/us/app/braves/id6740215654', '_blank');
        } else {
            window.open('https://play.google.com/store/apps/details?id=io.onlybraves.braves', '_blank');
        }
        
        // Registrar evento de analítica
        if (typeof gtag === 'function') {
            gtag('event', 'app_download_click', {
                'event_category': 'conversion',
                'event_label': isIOS ? 'iOS' : 'Android',
                'value': 1
            });
        }
    }
    
    // Activar un paso específico
    function activateStep(stepNumber) {
        currentStep = stepNumber;
        updateActiveStep();
    }
    
    // Actualizar la visualización de los pasos activos y completados
    function updateActiveStep() {
        steps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            
            // Eliminar todas las clases de estado
            step.classList.remove('active', 'completed');
            
            if (stepNumber === currentStep) {
                // Paso actual
                step.classList.add('active');
            } else if (stepNumber < currentStep) {
                // Pasos completados
                step.classList.add('completed');
            }
        });
        
        // Actualizar la barra de progreso
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        
        // Detectar si es móvil para ajustar la barra de progreso
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // En móvil la barra es vertical
            progressBar.style.height = `${progressPercentage}%`;
        } else {
            // En escritorio la barra es horizontal
            progressBar.style.width = `${progressPercentage}%`;
        }
        
        // Añadir efecto de brillo a la barra de progreso
        progressBar.style.boxShadow = `0 0 10px var(--primary-color), 0 0 20px var(--primary-color)`;
        setTimeout(() => {
            progressBar.style.boxShadow = '';
        }, 500);
    }
    
    // Actualizar la barra de progreso cuando cambia el tamaño de la ventana
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 768;
        
        // Resetear ambas propiedades
        progressBar.style.width = '';
        progressBar.style.height = '';
        
        // Aplicar la correcta según el dispositivo
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if (isMobile) {
            progressBar.style.height = `${progressPercentage}%`;
        } else {
            progressBar.style.width = `${progressPercentage}%`;
        }
    });
}); 