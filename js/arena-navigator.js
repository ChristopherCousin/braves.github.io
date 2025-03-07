/**
 * Navegador Gamificado de la Arena - Interactividad
 * Maneja la funcionalidad del mapa de la arena, sistema de progreso,
 * logros y estadísticas del usuario.
 */

document.addEventListener('DOMContentLoaded', () => {
    initArenaNavigator();
});

/**
 * Inicializa la funcionalidad del navegador gamificado
 */
function initArenaNavigator() {
    // Referencias a elementos
    const navigatorToggle = document.getElementById('arena-navigator-toggle');
    const navigator = document.getElementById('arena-navigator');
    const sections = document.querySelectorAll('.arena-section');
    const connections = document.querySelectorAll('.arena-connection');
    
    // Estado del usuario (en una implementación real, esto se guardaría en localStorage o en una base de datos)
    const userState = {
        visitedSections: ['hero'],
        sectionProgress: {
            hero: 100,
            tutorial: 0,
            challenges: 0,
            powers: 0,
            champions: 0,
            headquarters: 0
        },
        achievements: {
            firstContact: true,
            apprentice: false,
            explorer: false,
            novicePlayer: false,
            arenaMaster: false
        },
        stats: {
            sectionsVisited: 1,
            maxScore: 0,
            explorationPoints: 10
        },
        level: 1,
        experience: 10,
        experienceToNextLevel: 100
    };
    
    // Configurar toggle del navegador
    setupNavigatorToggle(navigatorToggle, navigator);
    
    // Configurar secciones interactivas
    setupSections(sections, connections, userState);
    
    // Actualizar UI con el estado actual
    updateUI(userState);
    
    // Configurar detección de scroll para actualizar secciones visitadas
    setupScrollDetection(userState);
    
    // Configurar integración con el mini-juego
    setupGameIntegration(userState);
}

/**
 * Configura el botón de toggle del navegador
 */
function setupNavigatorToggle(toggle, navigator) {
    if (!toggle || !navigator) return;
    
    toggle.addEventListener('click', () => {
        // Alternar visibilidad del navegador
        navigator.classList.toggle('active');
        toggle.classList.toggle('active');
        
        // Efecto de sonido (opcional)
        playSound('toggle');
    });
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (navigator.classList.contains('active') && 
            !navigator.contains(e.target) && 
            e.target !== toggle) {
            navigator.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
    
    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navigator.classList.contains('active')) {
            navigator.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
}

/**
 * Configura las secciones interactivas del mapa
 */
function setupSections(sections, connections, userState) {
    sections.forEach(section => {
        // Marcar secciones ya visitadas
        const sectionId = section.getAttribute('data-section');
        if (userState.visitedSections.includes(sectionId)) {
            section.classList.add('visited');
            updateSectionProgress(section, userState.sectionProgress[sectionId]);
        }
        
        // Configurar hover para resaltar conexiones
        section.addEventListener('mouseenter', () => {
            highlightConnections(section, connections);
        });
        
        section.addEventListener('mouseleave', () => {
            resetConnections(connections);
        });
        
        // Configurar clic para navegar a la sección
        section.addEventListener('click', (e) => {
            // No prevenir la navegación, pero actualizar el estado
            setTimeout(() => {
                const sectionId = section.getAttribute('data-section');
                visitSection(sectionId, userState);
                updateUI(userState);
            }, 100);
        });
    });
}

/**
 * Resalta las conexiones relacionadas con una sección
 */
function highlightConnections(section, connections) {
    const sectionId = section.getAttribute('data-section');
    
    connections.forEach(connection => {
        const connectionId = connection.getAttribute('id');
        if (connectionId.includes(sectionId)) {
            connection.classList.add('active');
        }
    });
}

/**
 * Restablece todas las conexiones a su estado normal
 */
function resetConnections(connections) {
    connections.forEach(connection => {
        connection.classList.remove('active');
    });
}

/**
 * Registra una visita a una sección y actualiza el progreso
 */
function visitSection(sectionId, userState) {
    // Si es la primera vez que se visita, añadir a las secciones visitadas
    if (!userState.visitedSections.includes(sectionId)) {
        userState.visitedSections.push(sectionId);
        userState.stats.sectionsVisited = userState.visitedSections.length;
        
        // Otorgar puntos de exploración
        userState.stats.explorationPoints += 20;
        userState.experience += 20;
        
        // Comprobar logros
        checkAchievements(userState);
        
        // Comprobar nivel
        checkLevel(userState);
    }
    
    // Actualizar progreso de la sección (simulado)
    // En una implementación real, esto dependería de la interacción con cada sección
    if (userState.sectionProgress[sectionId] < 100) {
        userState.sectionProgress[sectionId] += 25;
        if (userState.sectionProgress[sectionId] > 100) {
            userState.sectionProgress[sectionId] = 100;
        }
    }
}

/**
 * Comprueba y actualiza los logros del usuario
 */
function checkAchievements(userState) {
    // Logro: Primer Contacto (ya otorgado al inicio)
    
    // Logro: Aprendiz (completar el tutorial)
    if (userState.sectionProgress.tutorial >= 100 && !userState.achievements.apprentice) {
        userState.achievements.apprentice = true;
        userState.stats.explorationPoints += 50;
        userState.experience += 50;
        showAchievementNotification('Aprendiz');
    }
    
    // Logro: Explorador (visitar todas las secciones)
    const allSections = ['hero', 'tutorial', 'challenges', 'powers', 'champions', 'headquarters'];
    const allVisited = allSections.every(section => userState.visitedSections.includes(section));
    
    if (allVisited && !userState.achievements.explorer) {
        userState.achievements.explorer = true;
        userState.stats.explorationPoints += 100;
        userState.experience += 100;
        showAchievementNotification('Explorador');
    }
    
    // Logro: Maestro de la Arena (desbloquear todos los demás logros)
    const allAchievements = userState.achievements.firstContact && 
                           userState.achievements.apprentice && 
                           userState.achievements.explorer && 
                           userState.achievements.novicePlayer;
    
    if (allAchievements && !userState.achievements.arenaMaster) {
        userState.achievements.arenaMaster = true;
        userState.stats.explorationPoints += 200;
        userState.experience += 200;
        showAchievementNotification('Maestro de la Arena');
    }
}

/**
 * Comprueba y actualiza el nivel del usuario
 */
function checkLevel(userState) {
    if (userState.experience >= userState.experienceToNextLevel) {
        userState.level++;
        userState.experience -= userState.experienceToNextLevel;
        userState.experienceToNextLevel = Math.floor(userState.experienceToNextLevel * 1.5);
        showLevelUpNotification(userState.level);
    }
}

/**
 * Actualiza la interfaz de usuario con el estado actual
 */
function updateUI(userState) {
    // Actualizar secciones visitadas
    document.querySelectorAll('.arena-section').forEach(section => {
        const sectionId = section.getAttribute('data-section');
        if (userState.visitedSections.includes(sectionId)) {
            section.classList.add('visited');
            updateSectionProgress(section, userState.sectionProgress[sectionId]);
        }
    });
    
    // Actualizar estadísticas
    const statValues = document.querySelectorAll('.arena-stats .stat-item .stat-details .stat-value');
    if (statValues && statValues.length >= 3) {
        statValues[0].textContent = `${userState.stats.sectionsVisited}/6`;
        statValues[1].textContent = userState.stats.maxScore;
        statValues[2].textContent = userState.stats.explorationPoints;
    }
    
    // Actualizar logros
    updateAchievements(userState);
    
    // Actualizar progreso y nivel
    const progressBar = document.querySelector('.progress-bar');
    const progressPercentage = document.querySelector('.progress-percentage');
    const levelText = document.querySelector('.progress-text span:first-child');
    
    // Asegurarse de que userState.progress existe
    if (!userState.progress) {
        userState.progress = {
            percentage: 10,
            level: 1,
            levelTitle: 'Visitante',
            levelDescription: 'Has comenzado tu viaje en la Arena de Braves'
        };
    }
    
    if (progressBar) {
        progressBar.style.width = `${userState.progress.percentage}%`;
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${userState.progress.percentage}%`;
    }
    
    if (levelText) {
        levelText.textContent = `Nivel ${userState.progress.level}`;
    }
    
    // Actualizar nivel
    const levelIcon = document.querySelector('.level-icon');
    const levelTitle = document.querySelector('.level-title');
    const levelDescription = document.querySelector('.level-description');
    
    if (levelIcon) {
        levelIcon.textContent = userState.progress.level;
    }
    
    if (levelTitle) {
        levelTitle.textContent = userState.progress.levelTitle;
    }
    
    if (levelDescription) {
        levelDescription.textContent = userState.progress.levelDescription;
    }
}

/**
 * Actualiza la barra de progreso de una sección
 */
function updateSectionProgress(section, progress) {
    const progressBar = section.querySelector('.section-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * Actualiza la visualización de los logros
 */
function updateAchievements(userState) {
    const achievementItems = document.querySelectorAll('.achievement-item');
    
    // Primer logro: Primer Contacto
    if (userState.achievements.firstContact) {
        achievementItems[0].classList.remove('locked');
    }
    
    // Segundo logro: Aprendiz
    if (userState.achievements.apprentice) {
        achievementItems[1].classList.remove('locked');
    }
    
    // Tercer logro: Explorador
    if (userState.achievements.explorer) {
        achievementItems[2].classList.remove('locked');
    }
    
    // Cuarto logro: Jugador Novato
    if (userState.achievements.novicePlayer) {
        achievementItems[3].classList.remove('locked');
    }
    
    // Quinto logro: Maestro de la Arena
    if (userState.achievements.arenaMaster) {
        achievementItems[4].classList.remove('locked');
    }
}

/**
 * Configura la detección de scroll para actualizar secciones visitadas
 */
function setupScrollDetection(userState) {
    const sections = [
        { id: 'hero', element: document.getElementById('hero') },
        { id: 'tutorial', element: document.getElementById('how-it-works') },
        { id: 'challenges', element: document.getElementById('challenges') },
        { id: 'powers', element: document.getElementById('features') },
        { id: 'champions', element: document.getElementById('testimonials') },
        { id: 'headquarters', element: document.getElementById('contact') }
    ];
    
    // Función para comprobar qué sección está visible
    function checkVisibleSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(section => {
            if (section.element) {
                const sectionTop = section.element.offsetTop;
                const sectionBottom = sectionTop + section.element.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    visitSection(section.id, userState);
                    updateUI(userState);
                    
                    // Actualizar sección activa en el mapa
                    document.querySelectorAll('.arena-section').forEach(s => {
                        s.classList.remove('active');
                    });
                    
                    const activeSection = document.querySelector(`.arena-section[data-section="${section.id}"]`);
                    if (activeSection) {
                        activeSection.classList.add('active');
                    }
                }
            }
        });
    }
    
    // Comprobar al cargar y al hacer scroll
    checkVisibleSection();
    window.addEventListener('scroll', debounce(checkVisibleSection, 100));
}

/**
 * Configura la integración con el mini-juego
 */
function setupGameIntegration(userState) {
    // Escuchar eventos del juego (si existe)
    const gameScore = document.getElementById('score');
    if (gameScore) {
        // Observar cambios en la puntuación
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const score = parseInt(gameScore.textContent);
                    if (!isNaN(score) && score > userState.stats.maxScore) {
                        userState.stats.maxScore = score;
                        
                        // Actualizar estadísticas
                        document.querySelector('.stat-value:nth-child(2)').textContent = score;
                        
                        // Comprobar logro de jugador novato
                        if (score >= 10 && !userState.achievements.novicePlayer) {
                            userState.achievements.novicePlayer = true;
                            userState.stats.explorationPoints += 50;
                            userState.experience += 50;
                            showAchievementNotification('Jugador Novato');
                            checkAchievements(userState);
                            updateUI(userState);
                        }
                    }
                }
            });
        });
        
        observer.observe(gameScore, { childList: true, characterData: true, subtree: true });
    }
}

/**
 * Muestra una notificación de logro desbloqueado
 */
function showAchievementNotification(achievementName) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-icon">
            <i class="fas fa-trophy"></i>
        </div>
        <div class="achievement-notification-content">
            <div class="achievement-notification-title">¡Logro Desbloqueado!</div>
            <div class="achievement-notification-name">${achievementName}</div>
        </div>
    `;
    
    // Estilos inline para la notificación
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '20px';
    notification.style.backgroundColor = 'rgba(10, 10, 20, 0.9)';
    notification.style.border = '1px solid var(--neon-cyan)';
    notification.style.borderRadius = '8px';
    notification.style.padding = '15px';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.boxShadow = '0 0 15px var(--neon-cyan)';
    notification.style.zIndex = '1001';
    notification.style.transform = 'translateY(100px)';
    notification.style.opacity = '0';
    notification.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    
    // Estilos para el icono
    const iconDiv = notification.querySelector('.achievement-notification-icon');
    iconDiv.style.width = '40px';
    iconDiv.style.height = '40px';
    iconDiv.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
    iconDiv.style.borderRadius = '50%';
    iconDiv.style.display = 'flex';
    iconDiv.style.alignItems = 'center';
    iconDiv.style.justifyContent = 'center';
    iconDiv.style.marginRight = '15px';
    
    const icon = iconDiv.querySelector('i');
    icon.style.color = 'var(--neon-cyan)';
    icon.style.fontSize = '1.2rem';
    
    // Estilos para el contenido
    const title = notification.querySelector('.achievement-notification-title');
    title.style.fontFamily = 'Orbitron, sans-serif';
    title.style.fontSize = '1rem';
    title.style.color = '#fff';
    title.style.marginBottom = '5px';
    
    const name = notification.querySelector('.achievement-notification-name');
    name.style.color = 'var(--neon-cyan)';
    name.style.fontSize = '1.2rem';
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
        
        // Reproducir sonido
        playSound('achievement');
    }, 100);
    
    // Eliminar después de un tiempo
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

/**
 * Muestra una notificación de subida de nivel
 */
function showLevelUpNotification(level) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="level-up-notification-icon">
            <i class="fas fa-level-up-alt"></i>
        </div>
        <div class="level-up-notification-content">
            <div class="level-up-notification-title">¡Subida de Nivel!</div>
            <div class="level-up-notification-level">Nivel ${level}</div>
        </div>
    `;
    
    // Estilos inline para la notificación
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
    notification.style.backgroundColor = 'rgba(10, 10, 20, 0.9)';
    notification.style.border = '2px solid var(--neon-cyan)';
    notification.style.borderRadius = '12px';
    notification.style.padding = '20px';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.boxShadow = '0 0 30px var(--neon-cyan)';
    notification.style.zIndex = '1002';
    notification.style.opacity = '0';
    notification.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    
    // Estilos para el icono
    const iconDiv = notification.querySelector('.level-up-notification-icon');
    iconDiv.style.width = '50px';
    iconDiv.style.height = '50px';
    iconDiv.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
    iconDiv.style.borderRadius = '50%';
    iconDiv.style.display = 'flex';
    iconDiv.style.alignItems = 'center';
    iconDiv.style.justifyContent = 'center';
    iconDiv.style.marginRight = '20px';
    
    const icon = iconDiv.querySelector('i');
    icon.style.color = 'var(--neon-cyan)';
    icon.style.fontSize = '1.5rem';
    
    // Estilos para el contenido
    const title = notification.querySelector('.level-up-notification-title');
    title.style.fontFamily = 'Orbitron, sans-serif';
    title.style.fontSize = '1.2rem';
    title.style.color = '#fff';
    title.style.marginBottom = '5px';
    
    const levelText = notification.querySelector('.level-up-notification-level');
    levelText.style.color = 'var(--neon-cyan)';
    levelText.style.fontSize = '1.5rem';
    levelText.style.fontFamily = 'Orbitron, sans-serif';
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translate(-50%, -50%) scale(1)';
        notification.style.opacity = '1';
        
        // Reproducir sonido
        playSound('levelUp');
    }, 100);
    
    // Eliminar después de un tiempo
    setTimeout(() => {
        notification.style.transform = 'translate(-50%, -50%) scale(1.2)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

/**
 * Reproduce un efecto de sonido
 */
function playSound(type) {
    // En una implementación real, aquí se reproducirían sonidos
    // Por ahora, solo lo simulamos con console.log
    console.log(`Reproduciendo sonido: ${type}`);
}

/**
 * Función de debounce para optimizar eventos frecuentes
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
} 