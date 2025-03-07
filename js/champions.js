/**
 * Arena de Campeones - Interactividad
 * Maneja la funcionalidad de la sección de campeones, incluyendo
 * filtrado por categorías, animaciones y efectos visuales.
 */

document.addEventListener('DOMContentLoaded', () => {
    initChampions();
});

/**
 * Inicializa la funcionalidad de la sección de campeones
 */
function initChampions() {
    const championsSection = document.querySelector('.champions');
    if (!championsSection) return;

    // Referencias a elementos
    const tabs = document.querySelectorAll('.champion-tab');
    const cards = document.querySelectorAll('.champion-card');
    const seeMoreButton = document.querySelector('.see-more-button');
    const profileButtons = document.querySelectorAll('.champion-button');

    // Configurar observador de intersección para animaciones de entrada
    setupIntersectionObserver();

    // Configurar filtrado por categorías
    setupCategoryFilters(tabs, cards);

    // Configurar botón "Ver Más"
    if (seeMoreButton) {
        seeMoreButton.addEventListener('click', () => loadMoreChampions());
    }

    // Configurar botones de perfil
    profileButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const profileId = e.currentTarget.getAttribute('data-profile');
            showChampionProfile(profileId);
        });
    });

    // Generar datos aleatorios para las estadísticas
    animateStatistics();
}

/**
 * Configura el observador de intersección para animar las tarjetas cuando entran en el viewport
 */
function setupIntersectionObserver() {
    const cards = document.querySelectorAll('.champion-card');
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Añadir clase con retraso para crear efecto escalonado
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Configurar estilo inicial y observar cada tarjeta
    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

/**
 * Configura los filtros de categoría para los campeones
 */
function setupCategoryFilters(tabs, cards) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Actualizar pestaña activa
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            
            // Filtrar tarjetas
            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = 1;
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = 0;
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Efecto visual en la pestaña seleccionada
            createTabSelectionEffect(tab);
        });
    });
}

/**
 * Crea un efecto visual cuando se selecciona una pestaña
 */
function createTabSelectionEffect(tab) {
    // Crear elemento para el efecto
    const effect = document.createElement('div');
    effect.classList.add('tab-selection-effect');
    effect.style.position = 'absolute';
    effect.style.top = '0';
    effect.style.left = '0';
    effect.style.width = '100%';
    effect.style.height = '100%';
    effect.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
    effect.style.borderRadius = '4px';
    effect.style.transform = 'scale(0)';
    effect.style.transition = 'transform 0.3s ease';
    effect.style.zIndex = '-1';
    
    // Añadir al DOM
    tab.style.position = 'relative';
    tab.appendChild(effect);
    
    // Animar
    setTimeout(() => {
        effect.style.transform = 'scale(1)';
        setTimeout(() => {
            effect.remove();
        }, 300);
    }, 10);
}

/**
 * Carga más campeones (simulado)
 */
function loadMoreChampions() {
    const seeMoreButton = document.querySelector('.see-more-button');
    const championsGrid = document.querySelector('.champions-grid');
    
    // Cambiar texto del botón y añadir clase de carga
    seeMoreButton.textContent = 'Cargando...';
    seeMoreButton.classList.add('loading');
    
    // Simular carga de datos
    setTimeout(() => {
        // Aquí se cargarían más campeones desde una API
        // Por ahora, duplicamos los existentes para demostración
        const existingCards = document.querySelectorAll('.champion-card');
        
        existingCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.style.opacity = 0;
            clone.style.transform = 'translateY(30px)';
            
            // Cambiar algunos datos para que no sean idénticos
            const nameElement = clone.querySelector('.champion-name');
            if (nameElement) {
                const names = ['Miguel Torres', 'Ana García', 'Pablo Ruiz', 'Elena Díaz', 'Javier López'];
                nameElement.textContent = names[Math.floor(Math.random() * names.length)];
            }
            
            // Añadir al grid
            championsGrid.appendChild(clone);
            
            // Animar entrada
            setTimeout(() => {
                clone.style.opacity = 1;
                clone.style.transform = 'translateY(0)';
            }, 100);
            
            // Configurar botón de perfil
            const profileButton = clone.querySelector('.champion-button');
            if (profileButton) {
                profileButton.addEventListener('click', (e) => {
                    const profileId = e.currentTarget.getAttribute('data-profile');
                    showChampionProfile(profileId);
                });
            }
        });
        
        // Restaurar botón
        seeMoreButton.textContent = 'Ver Más Campeones';
        seeMoreButton.classList.remove('loading');
        
        // Ocultar botón después de cargar más (opcional)
        // seeMoreButton.style.display = 'none';
    }, 1500);
}

/**
 * Muestra el perfil de un campeón (simulado)
 */
function showChampionProfile(profileId) {
    // En una implementación real, esto podría abrir un modal o redirigir a una página de perfil
    // Por ahora, mostramos un mensaje
    alert(`Perfil de campeón: ${profileId}\n\nEsta funcionalidad estará disponible próximamente en la app.`);
    
    // Alternativa: redirigir a la descarga de la app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (confirm('¿Deseas descargar la app para ver perfiles completos?')) {
        if (isIOS) {
            window.open('https://apps.apple.com/us/app/braves/id6740215654', '_blank');
        } else {
            window.open('https://play.google.com/store/apps/details?id=io.onlybraves.braves', '_blank');
        }
    }
}

/**
 * Anima las estadísticas con un efecto de contador
 */
function animateStatistics() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(statValue => {
        const finalValue = statValue.textContent;
        let startValue = 0;
        
        // Determinar si el valor tiene un sufijo (K, M, etc.)
        let numericValue = finalValue;
        let suffix = '';
        
        if (finalValue.includes('K')) {
            numericValue = parseFloat(finalValue.replace('K', ''));
            suffix = 'K';
            startValue = 0;
        } else if (finalValue.includes('M')) {
            numericValue = parseFloat(finalValue.replace('M', ''));
            suffix = 'M';
            startValue = 0;
        } else {
            numericValue = parseInt(finalValue);
        }
        
        // Configurar la animación
        const duration = 1500; // ms
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        // Función para animar el contador
        function updateCounter() {
            frame++;
            const progress = frame / totalFrames;
            const currentValue = Math.round(startValue + (numericValue - startValue) * progress);
            
            statValue.textContent = currentValue + suffix;
            
            if (frame < totalFrames) {
                requestAnimationFrame(updateCounter);
            } else {
                statValue.textContent = finalValue; // Asegurar valor final exacto
            }
        }
        
        // Iniciar animación cuando la estadística es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statValue);
    });
} 