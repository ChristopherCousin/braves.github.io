// Inicializar GSAP
gsap.registerPlugin(ScrollTrigger);

// Añadir al inicio del archivo después de la línea 2
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Función para asegurarse de que el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Animación del encabezado al desplazarse
    gsap.to("header", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom top",
            toggleActions: "play none none reverse"
        },
        backgroundColor: "rgba(30, 30, 30, 0.98)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        duration: 0.3
    });

    // Animación de la sección hero
    gsap.from(".hero-content", {
        opacity: 0,
        y: 5,
        duration: 1,
        delay: 0.5
    });

    gsap.from(".hero-image", {
        opacity: 0,
        x: 10,
        duration: 1,
        delay: 1
    });

    // Animación de secciones al desplazarse
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%"
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    });

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
            title: "Hit the Ball", 
            description: "Pon a prueba tu precisión y reflejos rebotando una pelota de papel en este desafiante juego de habilidad.", 
            image: "assets/ball.png",
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

    // Generar tarjetas de desafíos
    const challengeSlider = document.querySelector('.challenge-slider');
    if (challengeSlider) {
        challengeData.forEach((challenge, index) => {
            const challengeCard = document.createElement('div');
            challengeCard.classList.add('challenge-card');
            challengeCard.innerHTML = `
                <div class="challenge-card-image">
                    <img src="${challenge.image}" alt="${challenge.title}">
                </div>
                <div class="challenge-card-content">
                    <h3>${challenge.title}</h3>
                    <p>${challenge.description}</p>
                    <button class="view-more-btn" data-challenge-index="${index}"><span>Ver más</span></button>
                </div>
            `;
            challengeSlider.appendChild(challengeCard);
        });

        // Crear el popup
        const popupOverlay = document.createElement('div');
        popupOverlay.classList.add('popup-overlay');
        popupOverlay.innerHTML = `
            <div class="popup-content">
                <button class="close-popup" aria-label="Cerrar detalles del desafío">&times;</button>
                <h3></h3>
                <p class="full-description"></p>
                <div class="popup-sections">
                    <div class="popup-section">
                        <strong>Cómo Participar</strong>
                        <ul class="how-to"></ul>
                    </div>
                    <div class="popup-section">
                        <strong>Reglas del Desafío</strong>
                        <ul class="rules"></ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popupOverlay);

        // Funcionalidad para abrir y cerrar el popup
        const viewMoreButtons = document.querySelectorAll('.view-more-btn');
        const closePopup = popupOverlay.querySelector('.close-popup');

        viewMoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                const challengeIndex = button.getAttribute('data-challenge-index');
                const challenge = challengeData[challengeIndex];

                popupOverlay.querySelector('h3').textContent = challenge.title;
                popupOverlay.querySelector('.full-description').textContent = challenge.fullDescription;

                const howToList = popupOverlay.querySelector('.how-to');
                howToList.innerHTML = '';
                challenge.howTo.forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    howToList.appendChild(li);
                });

                const rulesList = popupOverlay.querySelector('.rules');
                rulesList.innerHTML = '';
                challenge.rules.forEach(rule => {
                    const li = document.createElement('li');
                    li.textContent = rule;
                    rulesList.appendChild(li);
                });

                popupOverlay.classList.add('active');
            });
        });

        closePopup.addEventListener('click', () => {
            popupOverlay.classList.remove('active');
        });

        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('active');
            }
        });
    } else {
        console.warn('Elemento challenge-slider no encontrado.');
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
	
    // Generar tarjetas de testimonios
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        testimonialData.forEach(testimonial => {
            const testimonialCard = document.createElement('div');
            testimonialCard.classList.add('testimonial-card');
            testimonialCard.innerHTML = `
                <p>"${testimonial.quote}"</p>
                <h4>${testimonial.name}</h4>
            `;
            testimonialCarousel.appendChild(testimonialCard);
        });
    } else {
        console.warn('Elemento testimonial-carousel no encontrado.');
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
            const targetElement = document.querySelector(this.getAttribute('href'));
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
    } else {
        console.warn('Formulario de contacto no encontrado.');
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
                    animateValue("userCount", 0, 5652, 2000);
                    animateValue("challengeCount", 0, 46, 2500);
                    animateValue("gamesPlayed", 0, 76530, 3000);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    } else {
        console.warn('Sección de estadísticas no encontrada. Animaciones no inicializadas.');
    }

    // Animación de paralaje para la imagen del héroe
    window.addEventListener('scroll', debounce(() => {
        const scrollPosition = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
    }, 10));

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
        console.error('Resource loading error:', error);
    }
});

// Forzar recarga de recursos
function forceReload() {
    const links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute('rel') === 'stylesheet') {
            links[i].href = links[i].href.split('?')[0] + '?id=' + new Date().getMilliseconds();
        }
    }
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && !scripts[i].src.includes('livereload.js')) {
            scripts[i].src = scripts[i].src.split('?')[0] + '?id=' + new Date().getMilliseconds();
        }
    }
}

// Llamar a la función cuando la página se carga
window.addEventListener('load', forceReload);

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

document.addEventListener('DOMContentLoaded', function() {
    // Show the modal when the App Store button is clicked
    const appleStoreButton = document.getElementById('apple-store-button');
    const appleModal = document.getElementById('apple-modal');
    const closeButton = document.querySelector('.close-button');

    appleStoreButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        appleModal.style.display = 'block'; // Show the modal
    });

    // Close the modal when the close button is clicked
    closeButton.addEventListener('click', function() {
        appleModal.style.display = 'none'; // Hide the modal
    });

    // Close the modal cuando el usuario hace clic fuera del contenido del modal
    window.addEventListener('click', function(event) {
        if (event.target == appleModal) {
            appleModal.style.display = 'none'; // Hide the modal
        }
    });
});

// Lógica de detección de país y traducción (no alteramos esta sección, solo textos ya ajustados en index)
document.addEventListener('DOMContentLoaded', function() {
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
            santiagoDesc: "Ingeniero (École Polytechnique & Télécom Paris), con experiencia en Orange como Mobile Product Manager. Especialista en productos móviles y tecnologías emergentes (5G). Su visión estratégica e innovadora impulsa el desarrollo y crecimiento de Braves.",
            terminosTitle: "Términos y Condiciones para Usuarios en Uruguay",
            terminosIntro: "Bienvenido(a) a Braves, una aplicación móvil diseñada para ofrecerte desafíos virtuales y reales (basados en habilidad) y la oportunidad de competir con otros usuarios.",
            terminosSeccion10: "Proceso de Pagos y Reembolsos",
            terminosSeccion11: "Cancelación y Suspensión",
            terminosSeccion12: "Modificaciones del Servicio",
            terminosSeccion13: "Limitación de Responsabilidad",
            terminosSeccion14: "Actualizaciones de los Términos",
            terminosSeccion15: "Ley Aplicable y Jurisdicción"
        },
        pt: {
            // No se cambia el contenido, se mantiene igual
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
            santiagoDesc: "Engenheiro (École Polytechnique & Télécom Paris), com experiência na Orange como Mobile Product Manager. Especialista em produtos móveis e tecnologias emergentes (5G). Sua visão estratégica e inovadora impulsiona o desenvolvimento e crescimento do Braves.",
            terminosTitle: "Termos e Condições para Usuários no Uruguai",
            terminosIntro: "Bem-vindo(a) ao Braves, um aplicativo móvel projetado para oferecer desafios virtuais e reais (baseados em habilidade) e a oportunidade de competir com outros usuários.",
            terminosSeccion10: "Processo de Pagamentos e Reembolsos",
            terminosSeccion11: "Cancelamento e Suspensão",
            terminosSeccion12: "Modificações do Serviço",
            terminosSeccion13: "Limitação de Responsabilidade",
            terminosSeccion14: "Atualizações dos Termos",
            terminosSeccion15: "Lei Aplicável e Jurisdição"
        },
        en: {
            // No se cambia el contenido, se mantiene igual adaptado anteriormente
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
            email: "info@bravesapp.com.com",
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
            santiagoDesc: "Engineer (École Polytechnique & Télécom Paris), with experience at Orange as Mobile Product Manager. Specialist in mobile products and emerging technologies (5G). His strategic and innovative vision drives Braves' development and growth.",
            terminosTitle: "Terms and Conditions for Users in Uruguay",
            terminosIntro: "Welcome to Braves, a mobile application designed to offer you virtual and real challenges (skill-based) and the opportunity to compete with other users.",
            terminosSeccion10: "Payment and Refund Process",
            terminosSeccion11: "Cancellation and Suspension",
            terminosSeccion12: "Service Modifications",
            terminosSeccion13: "Limitation of Liability",
            terminosSeccion14: "Terms Updates",
            terminosSeccion15: "Applicable Law and Jurisdiction"
        }
    };

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
        safeSetText('.text-eliminar-cuenta-desc', texts[lang].eliminarCuentaDesc);
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
        safeSetText('.text-terminos-title', texts[lang].terminosTitle);
        safeSetText('.text-terminos-intro', texts[lang].terminosIntro);
        safeSetText('.text-terminos-seccion-10', texts[lang].terminosSeccion10);
        safeSetText('.text-terminos-seccion-11', texts[lang].terminosSeccion11);
        safeSetText('.text-terminos-seccion-12', texts[lang].terminosSeccion12);
        safeSetText('.text-terminos-seccion-13', texts[lang].terminosSeccion13);
        safeSetText('.text-terminos-seccion-14', texts[lang].terminosSeccion14);
        safeSetText('.text-terminos-seccion-15', texts[lang].terminosSeccion15);
    }

    // Detectar país del usuario
    fetch('https://ipapi.co/json/').then(response=>response.json()).then(data=>{
        const country = data.country_code;
        console.log('País detectado:', country);
        const ptCountries = ['BR','PT'];
        const esCountries = ['ES','UY','AR','MX','CL','CO','PE','BO','PY','VE','CR','DO','EC','GT','HN','NI','PA','PR','SV'];
        let lang = 'en'; // Por defecto inglés
        if (ptCountries.includes(country)) {
            lang = 'pt';
            console.log('Idioma seleccionado: Portugués');
        } else if (esCountries.includes(country)) {
            lang = 'es';
            console.log('Idioma seleccionado: Español');
        } else {
            lang = 'en';
            console.log('Idioma seleccionado: Inglés');
        }
        applyTranslations(lang);
    }).catch((error)=>{
        // Si falla la detección, inglés por defecto
        console.error('Error al detectar el país:', error);
        applyTranslations('en');
    });
});

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
