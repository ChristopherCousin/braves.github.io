/**
 * Performance Optimizer para Braves
 * 
 * Este script se encarga de optimizar el rendimiento de la web,
 * implementando carga progresiva, detección de dispositivos de gama baja
 * y optimización de recursos.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPerformanceOptimizer();
});

/**
 * Inicializa el optimizador de rendimiento
 */
function initPerformanceOptimizer() {
    // Detectar capacidades del dispositivo
    const deviceCapabilities = detectDeviceCapabilities();
    
    // Aplicar optimizaciones según el dispositivo
    applyOptimizations(deviceCapabilities);
    
    // Configurar carga progresiva
    setupProgressiveLoading();
    
    // Optimizar animaciones
    optimizeAnimations(deviceCapabilities);
    
    // Monitorear rendimiento
    setupPerformanceMonitoring();
    
    console.log('Performance Optimizer inicializado', deviceCapabilities);
}

/**
 * Detecta las capacidades del dispositivo
 * @returns {Object} Objeto con información sobre las capacidades del dispositivo
 */
function detectDeviceCapabilities() {
    const capabilities = {
        isLowEndDevice: false,
        hasLimitedMemory: false,
        hasTouchScreen: 'ontouchstart' in window,
        hasReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        connectionType: 'unknown',
        browserInfo: getBrowserInfo(),
        screenSize: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    
    // Detectar dispositivos de gama baja basado en heurísticas
    const navigatorInfo = window.navigator;
    
    // Comprobar memoria del dispositivo si está disponible
    if (navigatorInfo.deviceMemory) {
        capabilities.hasLimitedMemory = navigatorInfo.deviceMemory < 4;
    }
    
    // Comprobar número de núcleos de CPU si está disponible
    if (navigatorInfo.hardwareConcurrency) {
        capabilities.isLowEndDevice = navigatorInfo.hardwareConcurrency < 4;
    }
    
    // Comprobar tipo de conexión si está disponible
    if (navigatorInfo.connection) {
        capabilities.connectionType = navigatorInfo.connection.effectiveType || 'unknown';
    }
    
    return capabilities;
}

/**
 * Obtiene información sobre el navegador
 * @returns {Object} Información del navegador
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = "Desconocido";
    let browserVersion = "";
    
    // Detectar navegador
    if (ua.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserVersion = ua.match(/Firefox\/([0-9.]+)/)[1];
    } else if (ua.indexOf("Chrome") > -1) {
        browserName = "Chrome";
        browserVersion = ua.match(/Chrome\/([0-9.]+)/)[1];
    } else if (ua.indexOf("Safari") > -1) {
        browserName = "Safari";
        browserVersion = ua.match(/Version\/([0-9.]+)/)[1];
    } else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) {
        browserName = "Internet Explorer";
        browserVersion = ua.match(/(?:MSIE |rv:)([0-9.]+)/)[1];
    } else if (ua.indexOf("Edge") > -1) {
        browserName = "Edge";
        browserVersion = ua.match(/Edge\/([0-9.]+)/)[1];
    }
    
    return {
        name: browserName,
        version: browserVersion,
        userAgent: ua
    };
}

/**
 * Aplica optimizaciones según las capacidades del dispositivo
 * @param {Object} capabilities Capacidades del dispositivo
 */
function applyOptimizations(capabilities) {
    // Aplicar clase al body para estilos CSS específicos
    const body = document.body;
    
    if (capabilities.isLowEndDevice || capabilities.hasLimitedMemory) {
        body.classList.add('low-end-device');
    }
    
    if (capabilities.hasReducedMotion) {
        body.classList.add('reduced-motion');
    }
    
    if (capabilities.hasTouchScreen) {
        body.classList.add('touch-device');
    }
    
    // Optimizar Three.js si está presente
    if (window.THREE && (capabilities.isLowEndDevice || capabilities.hasLimitedMemory)) {
        optimizeThreeJS();
    }
    
    // Reducir calidad de partículas en dispositivos de gama baja
    if (capabilities.isLowEndDevice || capabilities.hasLimitedMemory) {
        reduceParticlesQuality();
    }
}

/**
 * Optimiza la configuración de Three.js para dispositivos de gama baja
 */
function optimizeThreeJS() {
    // Buscar canvas de Three.js
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    // Intentar acceder a la instancia de Three.js
    if (window.threeJSInstance) {
        const renderer = window.threeJSInstance.renderer;
        if (renderer) {
            // Reducir la resolución del renderizado
            renderer.setPixelRatio(1);
            
            // Desactivar antialiasing
            renderer.antialias = false;
            
            // Reducir la calidad de las sombras
            if (renderer.shadowMap) {
                renderer.shadowMap.enabled = false;
            }
            
            console.log('Three.js optimizado para dispositivo de gama baja');
        }
    }
}

/**
 * Reduce la calidad de las partículas para mejorar el rendimiento
 */
function reduceParticlesQuality() {
    // Reducir el número de partículas en el fondo
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        // Reducir el número de partículas a la mitad
        const particles = particlesContainer.querySelectorAll('.particle');
        for (let i = 0; i < particles.length; i++) {
            if (i % 2 !== 0) {
                particles[i].remove();
            }
        }
    }
    
    // Reducir partículas en otras secciones
    window.PARTICLES_REDUCTION_FACTOR = 0.5;
    
    console.log('Calidad de partículas reducida para mejorar rendimiento');
}

/**
 * Configura la carga progresiva de elementos
 */
function setupProgressiveLoading() {
    // Configurar lazy loading para imágenes que no lo tengan
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Configurar lazy loading para iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        if (!iframe.hasAttribute('loading')) {
            iframe.setAttribute('loading', 'lazy');
        }
    });
    
    // Cargar scripts no críticos de forma diferida
    loadNonCriticalScripts();
    
    // Precargar recursos críticos
    preloadCriticalResources();
}

/**
 * Carga scripts no críticos de forma diferida
 */
function loadNonCriticalScripts() {
    // Lista de scripts no críticos a cargar después
    const nonCriticalScripts = [
        // Añadir aquí scripts que no sean críticos para la carga inicial
    ];
    
    // Esperar a que la página esté completamente cargada
    window.addEventListener('load', () => {
        // Esperar un poco más para asegurar que todo lo importante ya está cargado
        setTimeout(() => {
            nonCriticalScripts.forEach(scriptSrc => {
                const script = document.createElement('script');
                script.src = scriptSrc;
                script.async = true;
                document.body.appendChild(script);
            });
        }, 2000);
    });
}

/**
 * Precarga recursos críticos para mejorar la experiencia
 */
function preloadCriticalResources() {
    // Lista de recursos críticos a precargar
    const criticalResources = [
        // Añadir aquí recursos críticos que deban precargarse
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.js') ? 'script' : 
                 resource.endsWith('.css') ? 'style' : 
                 resource.match(/\.(jpg|jpeg|png|gif|webp)$/) ? 'image' : 
                 'fetch';
        document.head.appendChild(link);
    });
}

/**
 * Optimiza las animaciones según las capacidades del dispositivo
 * @param {Object} capabilities Capacidades del dispositivo
 */
function optimizeAnimations(capabilities) {
    // Si el usuario prefiere reducir el movimiento o es un dispositivo de gama baja
    if (capabilities.hasReducedMotion || capabilities.isLowEndDevice) {
        // Reducir o eliminar animaciones
        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion * {
                transition-duration: 0.1s !important;
                animation-duration: 0.1s !important;
            }
            
            .reduced-motion .particles,
            .reduced-motion .power-particles,
            .reduced-motion .map-pulse {
                display: none !important;
            }
            
            .reduced-motion .arena-connection {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Optimizar GSAP si está disponible
    if (window.gsap) {
        optimizeGSAP(capabilities);
    }
}

/**
 * Optimiza las animaciones de GSAP
 * @param {Object} capabilities Capacidades del dispositivo
 */
function optimizeGSAP(capabilities) {
    if (capabilities.isLowEndDevice || capabilities.hasLimitedMemory) {
        // Reducir la calidad de las animaciones en dispositivos de gama baja
        if (window.gsap && window.gsap.ticker) {
            // Reducir la frecuencia de actualización de GSAP
            window.gsap.ticker.fps(30);
        }
        
        // Simplificar las animaciones de ScrollTrigger si está disponible
        if (window.ScrollTrigger) {
            // Aumentar el debounce para mejorar rendimiento
            window.ScrollTrigger.config({
                limitCallbacks: true,
                ignoreMobileResize: true
            });
        }
    }
}

/**
 * Configura el monitoreo de rendimiento
 */
function setupPerformanceMonitoring() {
    // Monitorear FPS
    let lastTime = performance.now();
    let frames = 0;
    let fps = 0;
    
    // Crear elemento para mostrar FPS (solo en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const fpsCounter = document.createElement('div');
        fpsCounter.style.position = 'fixed';
        fpsCounter.style.bottom = '10px';
        fpsCounter.style.right = '10px';
        fpsCounter.style.background = 'rgba(0, 0, 0, 0.7)';
        fpsCounter.style.color = '#00ff00';
        fpsCounter.style.padding = '5px 10px';
        fpsCounter.style.borderRadius = '5px';
        fpsCounter.style.fontFamily = 'monospace';
        fpsCounter.style.zIndex = '9999';
        document.body.appendChild(fpsCounter);
        
        // Actualizar contador de FPS
        function updateFPS() {
            const now = performance.now();
            frames++;
            
            if (now - lastTime >= 1000) {
                fps = Math.round((frames * 1000) / (now - lastTime));
                fpsCounter.textContent = `FPS: ${fps}`;
                frames = 0;
                lastTime = now;
                
                // Aplicar optimizaciones adicionales si el FPS es bajo
                if (fps < 30) {
                    applyEmergencyOptimizations();
                }
            }
            
            requestAnimationFrame(updateFPS);
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    // Monitorear eventos de lag
    let longTaskThreshold = 50; // ms
    
    // Observador de rendimiento para tareas largas
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // Si una tarea toma más de 50ms, considerarla como lag
                    if (entry.duration > longTaskThreshold) {
                        console.warn('Tarea larga detectada:', entry.duration.toFixed(2) + 'ms', entry);
                        
                        // Si el lag es severo, aplicar optimizaciones de emergencia
                        if (entry.duration > 200) {
                            applyEmergencyOptimizations();
                        }
                    }
                }
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            console.error('PerformanceObserver no soportado:', e);
        }
    }
}

/**
 * Aplica optimizaciones de emergencia cuando se detecta bajo rendimiento
 */
function applyEmergencyOptimizations() {
    // Verificar si ya se aplicaron las optimizaciones de emergencia
    if (document.body.classList.contains('emergency-optimized')) {
        return;
    }
    
    console.warn('Aplicando optimizaciones de emergencia para mejorar rendimiento');
    
    // Marcar que se han aplicado optimizaciones de emergencia
    document.body.classList.add('emergency-optimized');
    
    // Desactivar todas las animaciones
    const style = document.createElement('style');
    style.textContent = `
        .emergency-optimized * {
            animation: none !important;
            transition: none !important;
        }
        
        .emergency-optimized .particles,
        .emergency-optimized .power-particles,
        .emergency-optimized .map-pulse,
        .emergency-optimized #particles {
            display: none !important;
        }
        
        .emergency-optimized #hero-canvas {
            opacity: 0.3 !important;
        }
    `;
    document.head.appendChild(style);
    
    // Detener Three.js si está presente
    if (window.threeJSInstance && window.threeJSInstance.stop) {
        window.threeJSInstance.stop();
    }
    
    // Mostrar mensaje al usuario
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.bottom = '60px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.background = 'rgba(0, 0, 0, 0.8)';
    message.style.color = '#fff';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '9999';
    message.style.maxWidth = '80%';
    message.style.textAlign = 'center';
    message.textContent = 'Modo de rendimiento optimizado activado para mejorar la experiencia';
    
    // Añadir botón para recargar la página
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Recargar página';
    reloadButton.style.marginLeft = '10px';
    reloadButton.style.padding = '5px 10px';
    reloadButton.style.background = '#FF0000';
    reloadButton.style.border = 'none';
    reloadButton.style.borderRadius = '3px';
    reloadButton.style.color = '#fff';
    reloadButton.style.cursor = 'pointer';
    reloadButton.addEventListener('click', () => {
        window.location.reload();
    });
    
    message.appendChild(document.createElement('br'));
    message.appendChild(reloadButton);
    
    document.body.appendChild(message);
    
    // Eliminar el mensaje después de 10 segundos
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 10000);
} 