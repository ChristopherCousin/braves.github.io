// Inicializar GSAP
gsap.registerPlugin(ScrollTrigger);

// Comentamos la función debounce ya que está definida en otros archivos
// const debounce = (func, wait) => {
//     let timeout;
//     return function executedFunction(...args) {
//         const later = () => {
//             clearTimeout(timeout);
//             func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//     };
// };

// Función para generar partículas flotantes
function generateParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Limpiar partículas existentes
    particlesContainer.innerHTML = '';
    
    // Determinar número de partículas basado en el ancho de la pantalla
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 15 : 30;
    
    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posición aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Tamaño aleatorio
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Duración y retraso aleatorios para la animación
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Añadir al contenedor
        particlesContainer.appendChild(particle);
    }
}

// Función para asegurarse de que el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es un dispositivo móvil
    const isMobile = window.innerWidth <= 768;
    
    // Generar partículas flotantes
    generateParticles();
    
    // Regenerar partículas al cambiar el tamaño de la ventana
    window.addEventListener('resize', debounce(generateParticles, 200));
    
    // Añadir atributo data-text al título para el efecto glitch
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !heroTitle.hasAttribute('data-text')) {
        heroTitle.setAttribute('data-text', heroTitle.textContent);
    }
    
    // Track store button clicks
    const appleStoreButton = document.getElementById('apple2-store-button');
    if (appleStoreButton) {
        appleStoreButton.addEventListener('click', function() {
            gtag('event', 'click', {
                'event_category': 'store_button',
                'event_label': 'App Store'
            });
        });
    }

    const googlePlayButton = document.querySelector('a[href*="play.google.com"]');
    if (googlePlayButton) {
        googlePlayButton.addEventListener('click', function() {
            gtag('event', 'click', {
                'event_category': 'store_button',
                'event_label': 'Google Play'
            });
        });
    }

    // Animación del encabezado al desplazarse
    gsap.to("header", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom top",
            toggleActions: "play none none reverse"
        },
        backgroundColor: "rgba(10, 10, 20, 0.95)",
        boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
        duration: 0.3
    });

    // Animación de la sección hero
    gsap.from(".hero-content", {
        opacity: 0,
        y: 5,
        duration: isMobile ? 0.7 : 1, // Animación más rápida en móviles
        delay: isMobile ? 0.3 : 0.5
    });

    gsap.from(".game-container", {
        opacity: 0,
        y: 10,
        duration: isMobile ? 0.7 : 1, // Animación más rápida en móviles
        delay: isMobile ? 0.5 : 0.8
    });

    // Animación del contenido de cada sección sin afectar el fondo
    // En móviles, reducimos la cantidad de animaciones para mejorar el rendimiento
    if (!isMobile) {
        const sections = document.querySelectorAll("section");
        sections.forEach(section => {
            // Seleccionamos únicamente los elementos hijos de la sección
            const children = section.children;
            gsap.from(children, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%"
                },
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.1
            });
        });
    } else {
        // En móviles, solo animamos los títulos de las secciones para mejor rendimiento
        const sectionTitles = document.querySelectorAll("section > h2");
        sectionTitles.forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 90%"
                },
                opacity: 0,
                y: 20,
                duration: 0.5
            });
        });
    }

    // Datos de los desafíos
    const challengeData = [
        { 
            title: "Super Bravey", 
            description: "Salta, corre y esquiva enemigos en este trepidante desafío de plataformas lleno de acción y aventura.", 
            image: "assets/dash.png",
            fullDescription: "¡Participa en Super Bravey y demuestra tu habilidad! Navega a través de obstáculos y llega al objetivo para ser uno de los ganadores. Practica tantas veces como necesites antes de tu intento oficial.",
            howTo: [
                "Registro: Ingresa al desafío en Braves.",
                "Práctica: Practica sin límites para mejorar tus habilidades.",
                "Competencia: Realiza tu intento oficial para clasificar."
            ],
            rules: [
                "Práctica ilimitada antes del intento oficial.",
                "Gana el que llegue al objetivo con el mejor tiempo y menos intentos oficiales."
            ]
        },
        { 
            title: "Flappy Braves", 
            description: "Esquiva obstáculos y vuela lo más lejos posible en este emocionante juego inspirado en el clásico Flappy Bird.", 
            image: "assets/bird.png",
            fullDescription: "¡Participa en Flappy Braves y demuestra tu habilidad! Navega a través de obstáculos y llega al objetivo para ser uno de los ganadores. Practica tantas veces como necesites antes de tu intento oficial.",
            howTo: [
                "Registro: Ingresa al desafío en Braves.",
                "Práctica: Practica sin límites para mejorar tus habilidades.",
                "Competencia: Realiza tu intento oficial para clasificar."
            ],
            rules: [
                "Práctica ilimitada antes del intento oficial.",
                "Gana el que llegue al objetivo con el mejor tiempo y menos intentos oficiales."
            ]
        },
        { 
            title: "Speed Rush", 
            description: "Pon a prueba tu precisión y reflejos rebotando una pelota de papel en este desafiante juego de habilidad.", 
            image: "assets/rush.png",
            fullDescription: "¡Participa en Hit the Ball Challenge y muestra tu destreza! Usa la cámara de tu móvil para grabarte mientras realizas el desafío.",
            howTo: [
                "Registro: Ingresa al desafío en Braves.",
                "Preparación: Agarra una hoja de papel A4 y arrúgala en forma de pelota frente a la cámara.",
                "Desafío: Graba un video donde te pegues la pelota de papel 20 veces sin que se caiga."
            ],
            rules: [
                "La pelota debe ser arrugada frente a la cámara.",
                "Debes pegarte la pelota 20 veces consecutivas sin que se caiga."
            ]
        }
    ];

    // Inicializar el slider de desafíos
    const challengeSlider = document.querySelector('.challenge-slider');
    if (challengeSlider) {
        // Código para inicializar el slider de desafíos
        console.log('Inicializando slider de desafíos');
        // Este código se ha reemplazado por el nuevo mapa de la arena
    } else {
        console.log('Elemento challenge-slider no encontrado - Esto es normal en la nueva versión');
    }

    // Datos de testimonios (ajustados para no mencionar dinero sino recompensas)
    const testimonialData = [
        { name: "María G.", quote: "Al principio dudaba, pero los desafíos competitivos me dieron recompensas inesperadas. Está genial." },
        { name: "Carlos R.", quote: "Me enganché con los desafíos de habilidad. En uno obtuve una muy buena recompensa, en otros no tanto, pero me motiva a seguir mejorando." },
        { name: "Laura S.", quote: "He obtenido algunas recompensas, pero más que nada me divierte pasar el rato." },
        { name: "Javier P.", quote: "Me encanta que las recompensas dependan de lo que sabes hacer, no es al azar. Logré una gran recompensa en un desafío, fue increíble." },
        { name: "Santiago T.", quote: "En un desafío obtuve recompensas valiosas, en otros no, pero la emoción de jugar y competir no se pierde." },
        { name: "Lucía F.", quote: "Hay desafíos que están muy buenos y te pueden dar recompensas realmente interesantes." }
    ];
	
    // Inicializar el carrusel de testimonios
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        // Código para inicializar el carrusel de testimonios
        console.log('Inicializando carrusel de testimonios');
        // Este código se ha reemplazado por la nueva sección de campeones
    } else {
        console.log('Elemento testimonial-carousel no encontrado - Esto es normal en la nueva versión');
    }

    // Preguntas frecuentes (ajustadas para no mencionar ganar dinero, sino obtener recompensas)
    const faqData = [
        {
            question: "¿Cómo funciona Braves?",
            answer: "Braves es una plataforma donde puedes participar en desafíos de habilidad, tanto virtuales como físicos. Eliges un desafío, pagas una entrada, demuestras tu destreza y, si cumples el objetivo, obtienes una recompensa justa."
        },
        {
            question: "¿Es legal obtener recompensas en Braves?",
            answer: "Sí, Braves se basa en la habilidad del jugador, no en el azar. Esto la diferencia de los juegos de apuestas. Cumplimos con las regulaciones aplicables a juegos de habilidad."
        },
        {
            question: "¿Cómo se garantiza la seguridad y justicia en los desafíos?",
            answer: "Utilizamos tecnología de verificación por video para los desafíos físicos y sistemas de detección de trampas para los juegos virtuales. Además, nuestro equipo de seguridad, liderado por expertos en ciberseguridad, monitorea constantemente la plataforma."
        },
        {
            question: "¿Puedo practicar antes de participar en un desafío oficial?",
            answer: "¡Absolutamente! Fomentamos la práctica. Puedes entrenar en los desafíos tantas veces como quieras antes de hacer tu intento oficial."
        },
        {
            question: "¿Cómo recibo mis recompensas?",
            answer: "Las recompensas se acreditan a tu cuenta de Braves inmediatamente después de la verificación del desafío. Puedes retirarlas a tu cuenta bancaria o usarlas para participar en más desafíos."
        }
    ];

    // Generar preguntas frecuentes
    const faqContainer = document.querySelector('.faq-container');
    if (faqContainer) {
        faqData.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.classList.add('faq-item');
            faqItem.innerHTML = `
                <div class="faq-question">${faq.question}</div>
                <div class="faq-answer">${faq.answer}</div>
            `;
            faqContainer.appendChild(faqItem);

            const question = faqItem.querySelector('.faq-question');
            question.addEventListener('click', () => {
                faqItem.classList.toggle('active');
            });
        });
    } else {
        console.warn('Elemento faq-container no encontrado.');
    }

    // Desplazamiento suave para la navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Si el href es solo "#", no hacemos nada más que prevenir el comportamiento predeterminado
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Manejo del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí normalmente enviarías los datos del formulario a un servidor
            console.log('Formulario enviado');
            contactForm.reset();
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        });
    }

    // Función para animar valor con comprobación de existencia del elemento
    function animateValue(elementId, start, end, duration) {
        const obj = document.getElementById(elementId);
        if (!obj) {
            console.warn(`Elemento con id "${elementId}" no encontrado. Animación omitida.`);
            return;
        }

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Iniciar animaciones cuando la sección de estadísticas entre en vista
    const statsSection = document.getElementById('statistics');
    if (statsSection) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue("userCount", 0, 14452, 2000);
                    animateValue("challengeCount", 0, 127, 2500);
                    animateValue("gamesPlayed", 0, 196530, 3000);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    } else {
        console.warn('Sección de estadísticas no encontrada. Animaciones no inicializadas.');
    }

    console.log('Página cargada. Animaciones y efectos iniciados.');

    // Manejo de errores de imágenes
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.error('Error loading image:', e.target.src);
            // Removemos la imagen en lugar de intentar cargar un placeholder
            e.target.style.display = 'none';
        }
    }, true);

    function handleResourceError(error) {
        // Ignorar errores para imágenes SVG en línea (data:image/svg+xml)
        if (error && error.target && error.target.src && error.target.src.startsWith('data:image/svg+xml')) {
            return; // No mostrar error para SVG en línea
        }
        
        // Ignorar errores para imágenes que ya no existen en el proyecto
        if (error && error.target && error.target.src && 
            (error.target.src.includes('grid-pattern.png') || 
             error.target.src.includes('braves-app-mockup.png'))) {
            return; // No mostrar error para imágenes que ya no existen
        }
        
        console.log('Error loading image:', error.target.src);
    }

    // [Efecto 3D (tilt) avanzado para el HERO]
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Se deshabilita el efecto tilt del HERO manteniendo el estado inicial
        heroSection.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }

    // Nueva integración de Three.js para fondo 3D en el HERO
    function initHeroBackground() {
        // Verificar si THREE está definido
        if (typeof THREE === 'undefined') {
            console.warn('THREE no está definido. El fondo 3D no se inicializará.');
            return;
        }
        
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        
        try {
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            // Usamos el tamaño actual del canvas (tomando su bounding box)
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
            camera.position.z = 50;
            
            // Detectar si es un dispositivo móvil
            const isMobile = window.innerWidth <= 768;
            
            // Crear un sistema de partículas para un fondo futurista
            // Reducir la cantidad de partículas en dispositivos móviles
            const particleCount = isMobile ? 500 : 1000;
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            for (let i = 0; i < particleCount; i++) {
                positions.push((Math.random() - 0.5) * 200);
                positions.push((Math.random() - 0.5) * 200);
                positions.push((Math.random() - 0.5) * 200);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            const material = new THREE.PointsMaterial({ 
                color: 0xff6b6b, 
                size: isMobile ? 1.5 : 1, // Aumentar tamaño en móviles para mejor visibilidad
                transparent: true,
                opacity: 0.8
            });
            const particles = new THREE.Points(geometry, material);
            scene.add(particles);
        
            function animate() {
                requestAnimationFrame(animate);
                // Rotación más lenta en dispositivos móviles para mejorar rendimiento
                particles.rotation.x += isMobile ? 0.0002 : 0.0005;
                particles.rotation.y += isMobile ? 0.0005 : 0.001;
                renderer.render(scene, camera);
            }
            animate();
        
            window.addEventListener('resize', () => {
                const rect = canvas.getBoundingClientRect();
                renderer.setSize(rect.width, rect.height);
                camera.aspect = rect.width / rect.height;
                camera.updateProjectionMatrix();
                
                // Actualizar la detección de dispositivo móvil en caso de cambio de orientación
                const newIsMobile = window.innerWidth <= 768;
                if (newIsMobile !== isMobile) {
                    // Ajustar el tamaño de las partículas si cambia el tipo de dispositivo
                    material.size = newIsMobile ? 1.5 : 1;
                }
            });
        } catch (error) {
            console.error('Error al inicializar el fondo 3D:', error);
        }
    }

    // Inicializar el fondo 3D solo cuando THREE esté cargado
    window.addEventListener('load', function() {
        if (typeof THREE !== 'undefined') {
            initHeroBackground();
        } else {
            // console.warn('THREE no está disponible. El fondo 3D no se inicializará.');
        }
    });

    // Ya no necesitamos mostrar el modal para el botón de Apple Store
    // ya que ahora redirecciona directamente a la App Store
    const appleModal = document.getElementById('apple-modal');
    const closeButton = document.querySelector('.close-button');

    // Solo configuramos el comportamiento del modal para cerrar
    if (appleModal && closeButton) {
        // Close the modal when the close button is clicked
        closeButton.addEventListener('click', function() {
            appleModal.style.display = 'none'; // Hide the modal
        });

        // Close the modal when the user clicks outside the modal content
        window.addEventListener('click', function(event) {
            if (event.target == appleModal) {
                appleModal.style.display = 'none'; // Hide the modal
            }
        });
    } else {
        console.warn('Algunos elementos necesarios para el modal no están disponibles.');
    }
});

// En su lugar, agregamos una transición para evitar el flash
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Funcionalidad del menú hamburguesa
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
    navUl.classList.toggle('show');
});

// Cerrar el menú al hacer clic en un enlace
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navUl.classList.remove('show');
    });
});

// Textos en los tres idiomas
const texts = {
    es: {
        inicio: "Inicio",
        comoFunciona: "Cómo Funciona",
        caracteristicas: "Características",
        desafios: "Desafíos",
        testimonios: "Testimonios",
        contacto: "Contacto",
        heroTitle: "Braves: Demuestra tus Habilidades",
        heroDesc: "Compite en desafíos emocionantes, ya sean virtuales o físicos, mejora tus habilidades y obtén recompensas basadas en tu destreza. ¡La competencia del futuro está aquí!",
        appStore: "Descargar en App Store",
        googlePlay: "Disponible en Google Play",
        reconocimientos: "Reconocimientos",
        premio: "Ganadores del Premio de Innovación otorgado por ANDE (Agencia Nacional de Desarrollo) y ANII (Agencia Nacional de Investigación e Innovación) de Uruguay.",
        comoFuncionaTitle: "Cómo Funciona",
        elige: "Elige un Desafío",
        eligeDesc: "Explora retos virtuales y físicos. Selecciona el que más te interese y prepárate para la acción.",
        participa: "Participa",
        participaDesc: "Paga la entrada, entrena y realiza tu intento oficial. Demuestra de qué estás hecho.",
        ganaDinero: "Obtén Recompensas",
        ganaDineroDesc: "Si cumples el desafío, recibirás recompensas basadas en tu habilidad. Tu mérito será reconocido sin depender del azar.",
        caracteristicasTitle: "Características Únicas",
        desafiosCompetitivos: "Desafíos Competitivos",
        desafiosCompetitivosDesc: "Vive experiencias diversas: desde juegos virtuales de destreza hasta desafíos físicos reales.",
        verificacionVideo: "Verificación por Video",
        verificacionVideoDesc: "Graba tus intentos físicos con tu móvil y verifica tu logro ante toda la comunidad.",
        seguridad: "Seguridad y Privacidad",
        seguridadDesc: "Protegemos tu información con medidas avanzadas, respaldados por expertos en ciberseguridad.",
        recompensas: "Recompensas Justas",
        recompensasDesc: "Recibe recompensas basadas en tu habilidad, sin azar. El mérito y la práctica son la clave.",
        numeros: "Números de Braves",
        jugadores: "Jugadores",
        desafiosCompletados: "Desafíos Completados",
        partidasJugadas: "Partidas jugadas",
        desafiosActivos: "Desafíos Activos",
        verMas: "Ver más",
        testimoniosTitle: "Lo que Dicen Nuestros Usuarios",
        faqTitle: "Preguntas Frecuentes",
        tienesDudas: "¿Tienes alguna duda?",
        necesitasInfo: "Si necesitas más información, escríbenos a:",
        email: "info@bravesapp.com",
        respuesta24h: "Te responderemos en menos de 24 horas.",
        terminos: "Términos y Condiciones",
        privacidad: "Política de Privacidad",
        eliminarCuenta: "Eliminar Cuenta",
        eliminarCuentaDesc: "Para eliminar tu cuenta, por favor envía un correo a info@bravesapp.com.com o accede a la aplicación y sigue los pasos en tu perfil para eliminar tu cuenta.",
        copyright: "© 2024 Braves. Todos los derechos reservados.",
        modalTitle: "Próximamente en App Store",
        modalDesc: "Pronto estará disponible en la App Store. Por ahora solo está disponible en Google Play.",
        christopherDesc: "Emprendedor tecnológico con una sólida trayectoria en el desarrollo de productos digitales. Fundador de múltiples startups exitosas, incluyendo Virai. Su experiencia en Banco Santander y su dominio en ciberseguridad garantizan soluciones seguras y escalables.",
        equipo: "Nuestro Equipo",
        teamIntro: "Detrás de Braves hay un equipo que combina experiencia emprendedora con excelencia técnica. Unimos conocimiento en desarrollo de productos móviles, seguridad y tecnologías emergentes para crear una plataforma innovadora y confiable.",
        cofundador: "Co-Fundador",
        santiagoDesc: "Ingeniero (École Polytechnique & Télécom Paris), con experiencia en Orange como Mobile Product Manager. Especialista en productos móviles y tecnologías emergentes (5G). Su visión estratégica e innovadora impulsa el desarrollo y crecimiento de Braves."
    },
    pt: {
        inicio: "Início",
        comoFunciona: "Como Funciona",
        caracteristicas: "Características",
        desafios: "Desafios",
        testimonios: "Depoimentos",
        contacto: "Contato",
        heroTitle: "Braves: Mostre suas Habilidades",
        heroDesc: "Compita em desafios emocionantes, sejam virtuais ou físicos, melhore suas habilidades e ganhe recompensas baseadas na sua destreza. A competição do futuro está aqui!",
        appStore: "Baixar na App Store",
        googlePlay: "Disponível no Google Play",
        reconocimientos: "Reconhecimentos",
        premio: "Vencedores do Prêmio de Inovação concedido pela ANDE (Agência Nacional de Desenvolvimento) e ANII (Agência Nacional de Pesquisa e Inovação) do Uruguai.",
        comoFuncionaTitle: "Como Funciona",
        elige: "Escolha um Desafio",
        eligeDesc: "Explore desafios virtuais e físicos. Selecione o que mais lhe interessa e prepare-se para a ação.",
        participa: "Participe",
        participaDesc: "Pague a entrada, treine e faça sua tentativa oficial. Mostre do que você é capaz.",
        ganaDinero: "Obtenha Recompensas",
        ganaDineroDesc: "Se você atingir a meta, receberá recompensas baseadas na sua habilidade. Seu mérito será reconhecido, sem depender da sorte.",
        caracteristicasTitle: "Características Únicas",
        desafiosCompetitivos: "Desafios Competitivos",
        desafiosCompetitivosDesc: "Viva experiências diversas: desde jogos virtuais de destreza até desafios físicos reais.",
        verificacionVideo: "Verificação por Vídeo",
        verificacionVideoDesc: "Grave suas tentativas físicas com seu celular e verifique sua conquista diante de toda a comunidade.",
        seguridad: "Segurança e Privacidade",
        seguridadDesc: "Protegemos suas informações com medidas avançadas, apoiados por especialistas em cibersegurança.",
        recompensas: "Recompensas Justas",
        recompensasDesc: "Receba recompensas baseadas em sua habilidade, sem sorte. O mérito e a prática são a chave.",
        numeros: "Números do Braves",
        jugadores: "Jogadores",
        desafiosCompletados: "Desafios Completos",
        partidasJugadas: "Partidas Jogadas",
        desafiosActivos: "Desafios Ativos",
        verMas: "Ver mais",
        testimoniosTitle: "O que Dizem Nossos Usuários",
        faqTitle: "Perguntas Frequentes",
        tienesDudas: "Tem alguma dúvida?",
        necesitasInfo: "Se você precisar de mais informações, escreva para:",
        email: "info@bravesapp.com",
        respuesta24h: "Responderemos em menos de 24 horas.",
        terminos: "Termos e Condições",
        privacidad: "Política de Privacidade",
        eliminarCuenta: "Excluir Conta",
        eliminarCuentaDesc: "Para excluir sua conta, envie um e-mail para info@bravesapp.com.com ou acesse o aplicativo e siga as etapas em seu perfil para excluir sua conta.",
        copyright: "© 2024 Braves. Todos os direitos reservados.",
        modalTitle: "Em Breve na App Store",
        modalDesc: "Em breve estará disponível na App Store. Por enquanto, está disponível apenas no Google Play.",
        christopherDesc: "Empreendedor tecnológico com sólida experiência no desenvolvimento de produtos digitais. Fundador de várias startups bem-sucedidas, incluindo Virai. Sua experiência no Banco Santander e seu domínio em cibersegurança garantem soluções seguras e escaláveis.",
        equipo: "Nossa Equipe",
        teamIntro: "Por trás do Braves há uma equipe que combina experiência empreendedora com excelência técnica. Unimos conhecimento em desenvolvimento de produtos móveis, segurança e tecnologias emergentes para criar uma plataforma inovadora e confiável.",
        cofundador: "Co-Fundador",
        santiagoDesc: "Engenheiro (École Polytechnique & Télécom Paris), com experiência na Orange como Mobile Product Manager. Especialista em produtos móveis e tecnologias emergentes (5G). Sua visão estratégica e inovadora impulsiona o desenvolvimento e crescimento do Braves."
    },
    en: {
        inicio: "Home",
        comoFunciona: "How It Works",
        caracteristicas: "Features",
        desafios: "Challenges",
        testimonios: "Testimonials",
        contacto: "Contact",
        heroTitle: "Braves: Show Your Skills",
        heroDesc: "Compete in exciting challenges, whether virtual or physical, improve your skills and earn rewards based on your prowess. The competition of the future is here!",
        appStore: "Download on the App Store",
        googlePlay: "Available on Google Play",
        reconocimientos: "Recognitions",
        premio: "Winners of the Innovation Award granted by ANDE (National Development Agency) and ANII (National Agency for Research and Innovation) of Uruguay.",
        comoFuncionaTitle: "How It Works",
        elige: "Choose a Challenge",
        eligeDesc: "Explore virtual and physical challenges. Select the one that interests you the most and get ready for action.",
        participa: "Participate",
        participaDesc: "Pay the entry fee, train, and make your official attempt. Show what you're made of.",
        ganaDinero: "Earn Rewards",
        ganaDineroDesc: "If you reach the goal, you'll receive skill-based rewards. Your merit is recognized without relying on chance.",
        caracteristicasTitle: "Unique Features",
        desafiosCompetitivos: "Competitive Challenges",
        desafiosCompetitivosDesc: "Experience a wide variety: from virtual skill-based games to real physical challenges.",
        verificacionVideo: "Video Verification",
        verificacionVideoDesc: "Record your physical attempts with your phone and verify your achievement before the entire community.",
        seguridad: "Security & Privacy",
        seguridadDesc: "We protect your information with advanced measures, backed by cybersecurity experts.",
        recompensas: "Fair Rewards",
        recompensasDesc: "Earn rewards based on your skill, without luck. Merit and practice are key.",
        numeros: "Braves Numbers",
        jugadores: "Players",
        desafiosCompletados: "Completed Challenges",
        partidasJugadas: "Matches Played",
        desafiosActivos: "Active Challenges",
        verMas: "See more",
        testimoniosTitle: "What Our Users Say",
        faqTitle: "Frequently Asked Questions",
        tienesDudas: "Have any questions?",
        necesitasInfo: "If you need more information, write to:",
        email: "info@bravesapp.com",
        respuesta24h: "We'll get back to you in less than 24 hours.",
        terminos: "Terms and Conditions",
        privacidad: "Privacy Policy",
        eliminarCuenta: "Delete Account",
        eliminarCuentaDesc: "To delete your account, please send an email to info@bravesapp.com.com or access the app and follow the steps in your profile to delete your account.",
        copyright: "© 2024 Braves. All rights reserved.",
        modalTitle: "Coming Soon on App Store",
        modalDesc: "It will be available soon on the App Store. For now, it is only available on Google Play.",
        christopherDesc: "Tech entrepreneur with a solid track record in digital product development. Founder of multiple successful startups, including Virai. His experience at Banco Santander and expertise in cybersecurity ensure secure and scalable solutions.",
        equipo: "Our Team",
        teamIntro: "Behind Braves there's a team that combines entrepreneurial experience with technical excellence. We unite knowledge in mobile product development, security, and emerging technologies to create an innovative and reliable platform.",
        cofundador: "Co-Founder",
        santiagoDesc: "Engineer (École Polytechnique & Télécom Paris), with experience at Orange as Mobile Product Manager. Specialist in mobile products and emerging technologies (5G). His strategic and innovative vision drives Braves' development and growth."
    }
};

// Función para aplicar traducciones
function applyTranslations(lang) {
    // Función auxiliar para actualizar el texto de manera segura
    const safeSetText = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    };

    // Función auxiliar para actualizar el alt de manera segura
    const safeSetAlt = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) {
            element.alt = text;
        }
    };

    // Aplicar traducciones de manera segura
    safeSetText('.text-inicio', texts[lang].inicio);
    safeSetText('.text-como-funciona', texts[lang].comoFunciona);
    safeSetText('.text-caracteristicas', texts[lang].caracteristicas);
    safeSetText('.text-desafios', texts[lang].desafios);
    safeSetText('.text-testimonios', texts[lang].testimonios);
    safeSetText('.text-contacto', texts[lang].contacto);
    safeSetText('.text-hero-title', texts[lang].heroTitle);
    safeSetText('.text-hero-description', texts[lang].heroDesc);
    safeSetAlt('.text-app-store', texts[lang].appStore);
    safeSetAlt('.text-google-play', texts[lang].googlePlay);
    safeSetText('.text-reconocimientos', texts[lang].reconocimientos);
    safeSetText('.text-premio', texts[lang].premio);
    safeSetText('.text-como-funciona-title', texts[lang].comoFuncionaTitle);
    safeSetText('.text-elige', texts[lang].elige);
    safeSetText('.text-elige-desc', texts[lang].eligeDesc);
    safeSetText('.text-participa', texts[lang].participa);
    safeSetText('.text-participa-desc', texts[lang].participaDesc);
    safeSetText('.text-gana-dinero', texts[lang].ganaDinero);
    safeSetText('.text-gana-dinero-desc', texts[lang].ganaDineroDesc);
    safeSetText('.text-caracteristicas-title', texts[lang].caracteristicasTitle);
    safeSetText('.text-desafios-competitivos', texts[lang].desafiosCompetitivos);
    safeSetText('.text-desafios-competitivos-desc', texts[lang].desafiosCompetitivosDesc);
    safeSetText('.text-verificacion-video', texts[lang].verificacionVideo);
    safeSetText('.text-verificacion-video-desc', texts[lang].verificacionVideoDesc);
    safeSetText('.text-seguridad', texts[lang].seguridad);
    safeSetText('.text-seguridad-desc', texts[lang].seguridadDesc);
    safeSetText('.text-recompensas', texts[lang].recompensas);
    safeSetText('.text-recompensas-desc', texts[lang].recompensasDesc);
    safeSetText('.text-numeros', texts[lang].numeros);
    safeSetText('.text-jugadores', texts[lang].jugadores);
    safeSetText('.text-desafios-completados', texts[lang].desafiosCompletados);
    safeSetText('.text-partidas-jugadas', texts[lang].partidasJugadas);
    safeSetText('.text-desafios-activos', texts[lang].desafiosActivos);
    safeSetText('.text-testimonios-title', texts[lang].testimoniosTitle);
    safeSetText('.text-faq-title', texts[lang].faqTitle);
    safeSetText('.text-tienes-dudas', texts[lang].tienesDudas);
    safeSetText('.text-necesitas-info', texts[lang].necesitasInfo);
    safeSetText('.text-email', texts[lang].email);
    safeSetText('.text-respuesta-24h', texts[lang].respuesta24h);
    safeSetText('.text-terminos', texts[lang].terminos);
    safeSetText('.text-privacidad', texts[lang].privacidad);
    safeSetText('.text-eliminar-cuenta', texts[lang].eliminarCuenta);
    safeSetText('.text-copyright', texts[lang].copyright);
    safeSetText('.text-modal-title', texts[lang].modalTitle);
    safeSetText('.text-modal-desc', texts[lang].modalDesc);
    safeSetText('.text-christopher-desc', texts[lang].christopherDesc);
    safeSetText('.text-equipo', texts[lang].equipo);
    safeSetText('.text-team-intro', texts[lang].teamIntro);
    document.querySelectorAll('.text-cofundador').forEach(el => {
        if (el) el.textContent = texts[lang].cofundador;
    });
    safeSetText('.text-santiago-desc', texts[lang].santiagoDesc);
}

// Detectar idioma del usuario
function detectUserLanguage() {
    // Usar el idioma del navegador como alternativa a la detección por IP
    const browserLang = navigator.language || navigator.userLanguage;
    console.log('Idioma del navegador:', browserLang);
    
    // Idioma por defecto
    let lang = 'en';
    
    // Comprobar si el idioma del navegador coincide con nuestros idiomas soportados
    if (browserLang.startsWith('pt')) {
        lang = 'pt';
        console.log('Idioma seleccionado: Portugués');
    } else if (browserLang.startsWith('es')) {
        lang = 'es';
        console.log('Idioma seleccionado: Español');
    } else {
        console.log('Idioma seleccionado: Inglés');
    }
    
    return lang;
}

// Aplicar traducciones basadas en el idioma detectado
const userLang = detectUserLanguage();
applyTranslations(userLang);

// Animaciones para la página de términos y condiciones
if (document.querySelector('.content')) {
    // Animación inicial del título
    gsap.from('.content h1', {
        duration: 1.2,
        opacity: 0,
        y: -50,
        ease: 'power3.out'
    });

    // Animación de las secciones
    gsap.utils.toArray('.subsection').forEach((section, i) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            opacity: 0,
            y: 30,
            delay: i * 0.1,
            ease: 'power2.out'
        });

        // Animación de los números de sección
        gsap.from(section.querySelector('.section-number'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%'
            },
            duration: 0.5,
            scale: 0,
            rotation: -180,
            delay: i * 0.1 + 0.2,
            ease: 'back.out(1.7)'
        });
    });

    // Efecto hover mejorado para las subsecciones
    gsap.utils.toArray('.subsection').forEach(section => {
        section.addEventListener('mouseenter', () => {
            gsap.to(section, {
                duration: 0.3,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 107, 107, 0.3)',
                y: -5,
                ease: 'power2.out'
            });
        });

        section.addEventListener('mouseleave', () => {
            gsap.to(section, {
                duration: 0.3,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                y: 0,
                ease: 'power2.out'
            });
        });
    });
}
