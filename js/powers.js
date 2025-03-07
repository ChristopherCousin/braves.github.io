// Script para manejar la interactividad de la sección Poderes y Habilidades

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const powers = document.querySelectorAll('.power');
    const powerConnections = document.querySelectorAll('.power-connection');
    const powerButtons = document.querySelectorAll('.power-button');
    
    // Inicializar
    initPowers();
    
    // Función de inicialización
    function initPowers() {
        // Generar partículas para cada poder
        powers.forEach(power => {
            const particlesContainer = power.querySelector('.power-particles');
            if (particlesContainer) {
                generateParticles(particlesContainer);
            }
            
            // Efecto hover para activar conexiones en escritorio
            power.addEventListener('mouseenter', function() {
                highlightConnections(this);
            });
            
            power.addEventListener('mouseleave', function() {
                resetConnections();
            });
        });
        
        // Añadir eventos a los botones
        powerButtons.forEach(button => {
            button.addEventListener('click', function() {
                const powerType = this.getAttribute('data-power');
                handlePowerAction(powerType);
            });
        });
        
        // Observador de intersección para activar animaciones cuando la sección es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Añadir clase para activar animaciones
                    document.querySelector('.features').classList.add('in-view');
                    
                    // Animar las conexiones secuencialmente
                    animateConnections();
                    
                    // Desconectar el observador después de activar
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        // Observar la sección
        observer.observe(document.querySelector('.features'));
    }
    
    // Generar partículas para los iconos
    function generateParticles(container) {
        // Solo generar partículas en escritorio
        if (window.innerWidth <= 768) return;
        
        // Limpiar contenedor
        container.innerHTML = '';
        
        // Crear partículas
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('span');
            particle.classList.add('power-particle');
            
            // Posición inicial aleatoria
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            
            // Calcular posición final (dirección de la animación)
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            // Aplicar variables CSS personalizadas para la animación
            particle.style.setProperty('--x', `${x}px`);
            particle.style.setProperty('--y', `${y}px`);
            
            // Posición inicial en el centro
            particle.style.left = '50%';
            particle.style.top = '50%';
            
            // Retraso aleatorio para la animación
            particle.style.animationDelay = `${Math.random() * 2}s`;
            
            // Añadir al contenedor
            container.appendChild(particle);
        }
    }
    
    // Manejar acciones de los botones de poder
    function handlePowerAction(powerType) {
        // Diferentes acciones según el tipo de poder
        switch (powerType) {
            case 'challenges':
                // Scroll a la sección de desafíos
                document.getElementById('challenges').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'verification':
                // Mostrar modal o redireccionar a página de ejemplos
                alert('Próximamente: Ejemplos de verificación por video');
                break;
            case 'security':
                // Redireccionar a la página de seguridad
                window.location.href = 'security/index.html';
                break;
            case 'rewards':
                // Mostrar modal o redireccionar a página de recompensas
                alert('Próximamente: Información sobre recompensas');
                break;
            default:
                // Acción por defecto: descargar la app
                handleDownload();
        }
        
        // Registrar evento de analítica
        if (typeof gtag === 'function') {
            gtag('event', 'power_action', {
                'event_category': 'engagement',
                'event_label': powerType,
                'value': 1
            });
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
    
    // Resaltar conexiones relacionadas con un poder
    function highlightConnections(power) {
        const index = Array.from(powers).indexOf(power) + 1;
        
        powerConnections.forEach(connection => {
            const connectionId = connection.id;
            if (connectionId.includes(`-${index}-`) || connectionId.includes(`-${index}`) || connectionId.includes(`${index}-`)) {
                connection.classList.add('active');
            }
        });
    }
    
    // Resetear todas las conexiones
    function resetConnections() {
        powerConnections.forEach(connection => {
            connection.classList.remove('active');
        });
    }
    
    // Animar conexiones secuencialmente
    function animateConnections() {
        powerConnections.forEach((connection, index) => {
            setTimeout(() => {
                connection.classList.add('active');
                
                // Quitar la clase después de un tiempo
                setTimeout(() => {
                    connection.classList.remove('active');
                }, 1000);
            }, index * 500);
        });
    }
    
    // Regenerar partículas al cambiar el tamaño de la ventana
    window.addEventListener('resize', debounce(function() {
        powers.forEach(power => {
            const particlesContainer = power.querySelector('.power-particles');
            if (particlesContainer) {
                generateParticles(particlesContainer);
            }
        });
    }, 200));
    
    // Función debounce para optimizar eventos de resize
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
}); 