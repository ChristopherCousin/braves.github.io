// Script para manejar la interactividad del Mapa de la Arena

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const arenaZones = document.querySelectorAll('.arena-zone');
    const challengePreview = document.getElementById('challenge-preview');
    const closePreview = document.getElementById('close-preview');
    const previewImage = document.getElementById('preview-image');
    const previewTitle = document.getElementById('preview-title');
    const previewDescription = document.getElementById('preview-description');
    const previewHowTo = document.getElementById('preview-how-to');
    const previewRules = document.getElementById('preview-rules');
    const previewDifficulty = document.getElementById('preview-difficulty');
    const previewButton = document.getElementById('preview-button');
    const connections = document.querySelectorAll('.connection');
    
    // Datos de los desafíos
    const challengeData = {
        'super-bravey': { 
            title: "Super Bravey", 
            description: "¡Participa en Super Bravey y demuestra tu habilidad! Navega a través de obstáculos y llega al objetivo para ser uno de los ganadores. Practica tantas veces como necesites antes de tu intento oficial.",
            image: "https://via.placeholder.com/150x150/1a1a2e/FF00A0?text=Super+Bravey",
            difficulty: 2,
            howTo: [
                "Registro: Ingresa al desafío en Braves.",
                "Práctica: Practica sin límites para mejorar tus habilidades.",
                "Competencia: Realiza tu intento oficial para clasificar."
            ],
            rules: [
                "Práctica ilimitada antes del intento oficial.",
                "Gana el que llegue al objetivo con el mejor tiempo y menos intentos oficiales."
            ],
            color: "primary"
        },
        'flappy-braves': { 
            title: "Flappy Braves", 
            description: "¡Participa en Flappy Braves y demuestra tu habilidad! Navega a través de obstáculos y llega al objetivo para ser uno de los ganadores. Practica tantas veces como necesites antes de tu intento oficial.",
            image: "assets/bird.png",
            difficulty: 3,
            howTo: [
                "Registro: Ingresa al desafío en Braves.",
                "Práctica: Practica sin límites para mejorar tus habilidades.",
                "Competencia: Realiza tu intento oficial para clasificar."
            ],
            rules: [
                "Práctica ilimitada antes del intento oficial.",
                "Gana el que llegue al objetivo con el mejor tiempo y menos intentos oficiales."
            ],
            color: "secondary"
        },
        'speed-rush': { 
            title: "Speed Rush", 
            description: "¡Participa en Speed Rush y muestra tu destreza! Usa la cámara de tu móvil para grabarte mientras realizas el desafío.",
            image: "https://via.placeholder.com/150x150/1a1a2e/00FFFF?text=Speed+Rush",
            difficulty: 4,
            howTo: [
                "Registro: Ingresa al desafío en Braves.",
                "Preparación: Agarra una hoja de papel A4 y arrúgala en forma de pelota frente a la cámara.",
                "Desafío: Graba un video donde te pegues la pelota de papel 20 veces sin que se caiga."
            ],
            rules: [
                "La pelota debe ser arrugada frente a la cámara.",
                "Debes pegarte la pelota 20 veces consecutivas sin que se caiga."
            ],
            color: "tertiary"
        }
    };
    
    // Inicializar
    initArenaMap();
    
    // Función de inicialización
    function initArenaMap() {
        // Verificar que los elementos existan antes de añadir eventos
        if (!arenaZones.length || !challengePreview) {
            console.warn('Elementos del mapa de la arena no encontrados');
            return;
        }

        // Actualizar las imágenes en el HTML
        updateZoneImages();

        // Añadir eventos a las zonas
        arenaZones.forEach(zone => {
            zone.addEventListener('click', function() {
                const challengeId = this.getAttribute('data-challenge');
                showChallengePreview(challengeId);
            });
            
            // Efecto hover para activar conexiones en escritorio
            zone.addEventListener('mouseenter', function() {
                highlightConnections(this);
            });
            
            zone.addEventListener('mouseleave', function() {
                resetConnections();
            });
        });
        
        // Evento para cerrar la vista previa
        if (closePreview) {
            closePreview.addEventListener('click', function() {
                challengePreview.classList.remove('active');
            });
        }
        
        // Evento para el botón de descarga
        if (previewButton) {
            previewButton.addEventListener('click', handleDownload);
        }
        
        // Cerrar modal al hacer clic fuera del contenido
        challengePreview.addEventListener('click', function(e) {
            if (e.target === challengePreview) {
                challengePreview.classList.remove('active');
            }
        });
        
        // Observador de intersección para activar animaciones cuando la sección es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Añadir clase para activar animaciones
                    document.querySelector('.challenges').classList.add('in-view');
                    
                    // Animar las conexiones secuencialmente
                    animateConnections();
                    
                    // Desconectar el observador después de activar
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        // Observar la sección
        const challengesSection = document.querySelector('.challenges');
        if (challengesSection) {
            observer.observe(challengesSection);
        }
    }
    
    // Actualizar las imágenes en el HTML
    function updateZoneImages() {
        arenaZones.forEach(zone => {
            const challengeId = zone.getAttribute('data-challenge');
            const challenge = challengeData[challengeId];
            if (challenge) {
                const img = zone.querySelector('.zone-image');
                if (img) {
                    img.src = challenge.image;
                    img.alt = challenge.title;
                }
            }
        });
    }
    
    // Mostrar la vista previa de un desafío
    function showChallengePreview(challengeId) {
        const challenge = challengeData[challengeId];
        if (!challenge) return;
        
        // Actualizar contenido del modal
        previewImage.src = challenge.image;
        previewImage.alt = challenge.title;
        previewTitle.textContent = challenge.title;
        previewDescription.textContent = challenge.description;
        
        // Generar indicador de dificultad
        previewDifficulty.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const dot = document.createElement('span');
            dot.classList.add('difficulty-dot');
            if (i <= challenge.difficulty) {
                dot.classList.add('active');
            }
            previewDifficulty.appendChild(dot);
        }
        
        // Generar pasos de cómo participar
        previewHowTo.innerHTML = '';
        challenge.howTo.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            previewHowTo.appendChild(li);
        });
        
        // Generar reglas
        previewRules.innerHTML = '';
        challenge.rules.forEach(rule => {
            const li = document.createElement('li');
            li.textContent = rule;
            previewRules.appendChild(li);
        });
        
        // Aplicar color específico del desafío
        const colorClass = challenge.color || 'primary';
        let colorVar = '--neon-primary';
        
        if (colorClass === 'secondary') {
            colorVar = '--neon-secondary';
        } else if (colorClass === 'tertiary') {
            colorVar = '--neon-tertiary';
        } else if (colorClass === 'quaternary') {
            colorVar = '--neon-quaternary';
        }
        
        // Aplicar estilos con las nuevas variables
        previewImage.style.borderColor = `var(${colorVar})`;
        previewImage.style.boxShadow = `0 0 10px var(${colorVar})`;
        previewTitle.style.color = `var(${colorVar})`;
        previewTitle.style.textShadow = `0 0 5px var(${colorVar})`;
        
        // Mostrar el modal
        challengePreview.classList.add('active');
        
        // Registrar evento de analítica
        if (typeof gtag === 'function') {
            gtag('event', 'view_challenge', {
                'event_category': 'engagement',
                'event_label': challenge.title,
                'challenge_id': challengeId
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
    
    // Resaltar conexiones relacionadas con una zona
    function highlightConnections(zone) {
        const index = Array.from(arenaZones).indexOf(zone) + 1;
        
        connections.forEach(connection => {
            const connectionId = connection.id;
            if (connectionId.includes(`-${index}-`) || connectionId.includes(`-${index}`) || connectionId.includes(`${index}-`)) {
                connection.classList.add('active');
            }
        });
    }
    
    // Resetear todas las conexiones
    function resetConnections() {
        connections.forEach(connection => {
            connection.classList.remove('active');
        });
    }
    
    // Animar conexiones secuencialmente
    function animateConnections() {
        connections.forEach((connection, index) => {
            setTimeout(() => {
                connection.classList.add('active');
                
                // Quitar la clase después de un tiempo
                setTimeout(() => {
                    connection.classList.remove('active');
                }, 1000);
            }, index * 500);
        });
    }
}); 