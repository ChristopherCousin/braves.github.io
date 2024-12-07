// script.js

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
                    <button class="view-more-btn" data-challenge-index="${index}">Ver más</button>
                </div>
            `;
            challengeSlider.appendChild(challengeCard);
        });

        // Crear el popup
        const popupOverlay = document.createElement('div');
        popupOverlay.classList.add('popup-overlay');
        popupOverlay.innerHTML = `
            <div class="popup-content">
                <span class="close-popup">&times;</span>
                <h3></h3>
                <p class="full-description"></p>
                <strong>Cómo Participar:</strong>
                <ul class="how-to"></ul>
                <strong>Reglas:</strong>
                <ul class="rules"></ul>
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

    const testimonialData = [
		{ name: "María G.", quote: "La verdad, al principio pensé que no iba a ganar mucho, pero en los desafíos competitivos me llevé más pesos de lo que hubiera imaginoado. Está tremendo." },
		{ name: "Carlos R.", quote: "Me enganché con los desafíos, sobre todo en los competitivos. En uno llegué a ganar 3 mil pesos, pero otros los perdí. Igual, me motiva a seguir mejorando." },
		{ name: "Laura S.", quote: "He ganado un poco de plata con los juegos, pero más que nada me divierte pasar el rato." },
		{ name: "Javier P.", quote: "Me encanta que la plata que ganás depende de lo que sabés hacer, no es al azar. En un desafío saqué 7 mil pesos, no lo podía creer." },
		{ name: "Santiago T.", quote: "Saqué un poco más de 4 mil pesos en uno de los desafíos, pero en otros no he ganado nada. Eso sí, la emoción de jugar y competir no se pierde." },
		{ name: "Lucía F.", quote: "Hay desafíos que están buenísimos y te pueden hacer ganar buena plata." }
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

    // Preguntas frecuentes
    const faqData = [
        {
            question: "¿Cómo funciona Braves?",
            answer: "Braves es una plataforma donde puedes participar en desafíos de habilidad, tanto virtuales como físicos. Eliges un desafío, pagas una entrada, demuestras tu habilidad y, si alcanzas el objetivo, ganas una parte del premio."
        },
        {
            question: "¿Es legal ganar dinero con Braves?",
            answer: "Sí, Braves opera bajo las regulaciones de juegos de habilidad. A diferencia de los juegos de azar, en Braves tu éxito depende de tu destreza y no del azar."
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
            question: "¿Cómo recibo mis premios?",
            answer: "Los premios se acreditan a tu cuenta de Braves inmediatamente después de la verificación del desafío. Puedes retirarlos a tu cuenta bancaria o usarlos para participar en más desafíos."
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
                    animateValue("userCount", 0, 426, 2000);
                    animateValue("challengeCount", 0, 14, 2500);
                    animateValue("prizeCount", 0, 15530, 3000);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    } else {
        console.warn('Sección de estadísticas no encontrada. Animaciones no inicializadas.');
    }

    window.addEventListener('scroll', debounce(() => {
        const scrollPosition = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
    }, 10));

    console.log('Página cargada. Animaciones y efectos iniciados.');

    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'assets/placeholder.png';
            console.error('Error loading image:', e.target.src);
        }
    }, true);

    function handleResourceError(error) {
        console.error('Resource loading error:', error);
    }
});

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

window.addEventListener('load', forceReload);

// Funcionalidad del menú hamburguesa
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
    navUl.classList.toggle('show');
});

const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navUl.classList.remove('show');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const appleStoreButton = document.getElementById('apple-store-button');
    const appleModal = document.getElementById('apple-modal');
    const closeButton = document.querySelector('.close-button');

    appleStoreButton.addEventListener('click', function(event) {
        event.preventDefault();
        appleModal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        appleModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == appleModal) {
            appleModal.style.display = 'none';
        }
    });
});

// AÑADIMOS AQUI LA LÓGICA DE DETECCIÓN DE PAÍS Y TRADUCCIÓN
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
            heroDesc: "Compite en desafíos emocionantes, ya sean virtuales o físicos, mejora tus habilidades y gana dinero real basándote en tu destreza. ¡La competencia del futuro está aquí!",
            appStore: "Descargar en App Store",
            googlePlay: "Disponible en Google Play",
            reconocimientos: "Reconocimientos",
            premio: "Ganadores del Premio de Innovación otorgado por ANDE (Agencia Nacional de Desarrollo) y ANII (Agencia Nacional de Investigación e Innovación) de Uruguay.",
            comoFuncionaTitle: "Cómo Funciona",
            elige: "Elige un Desafío",
            eligeDesc: "Explora retos virtuales y físicos. Selecciona el que más te interese y prepárate para la acción.",
            participa: "Participa",
            participaDesc: "Paga la entrada, entrena y realiza tu intento oficial. Demuestra de qué estás hecho.",
            ganaDinero: "Gana Dinero",
            ganaDineroDesc: "Si alcanzas la meta, compartes el premio. Tu habilidad será recompensada con dinero real.",
            caracteristicasTitle: "Características Únicas",
            desafiosCompetitivos: "Desafíos Competitivos",
            desafiosCompetitivosDesc: "Vive experiencias diversas: desde juegos virtuales de destreza hasta desafíos físicos reales.",
            verificacionVideo: "Verificación por Video",
            verificacionVideoDesc: "Graba tus intentos físicos con tu móvil y verifica tu logro ante toda la comunidad.",
            seguridad: "Seguridad y Privacidad",
            seguridadDesc: "Protegemos tu información con medidas avanzadas, respaldados por expertos en ciberseguridad.",
            recompensas: "Recompensas Justas",
            recompensasDesc: "Gana dinero basado en tu habilidad, sin azar. El mérito y la práctica son la clave.",
            numeros: "Números de Braves",
            jugadores: "Jugadores Activos",
            desafiosCompletados: "Desafíos Completados",
            partidasJugadas: "Partidas jugadas",
            desafiosActivos: "Desafíos Activos",
            verMas: "Ver más",
            testimoniosTitle: "Lo que Dicen Nuestros Usuarios",
            faqTitle: "Preguntas Frecuentes",
            tienesDudas: "¿Tienes alguna duda?",
            necesitasInfo: "Si necesitas más información, escríbenos a:",
            email: "braves.mobile.app@gmail.com",
            respuesta24h: "Te responderemos en menos de 24 horas.",
            terminos: "Términos y Condiciones",
            privacidad: "Política de Privacidad",
            eliminarCuenta: "Eliminar Cuenta",
            copyright: "© 2024 Braves. Todos los derechos reservados.",
            modalTitle: "Próximamente en App Store",
            modalDesc: "Pronto estará disponible en la App Store. Por ahora solo está disponible en Google Play."
        },
        pt: {
            inicio: "Início",
            comoFunciona: "Como Funciona",
            caracteristicas: "Características",
            desafios: "Desafios",
            testimonios: "Depoimentos",
            contacto: "Contato",
            heroTitle: "Braves: Mostre suas Habilidades",
            heroDesc: "Compita em desafios emocionantes, sejam virtuais ou físicos, melhore suas habilidades e ganhe dinheiro real baseado na sua destreza. A competição do futuro está aqui!",
            appStore: "Baixar na App Store",
            googlePlay: "Disponível no Google Play",
            reconocimientos: "Reconhecimentos",
            premio: "Vencedores do Prêmio de Inovação concedido pela ANDE (Agência Nacional de Desenvolvimento) e ANII (Agência Nacional de Pesquisa e Inovação) do Uruguai.",
            comoFuncionaTitle: "Como Funciona",
            elige: "Escolha um Desafio",
            eligeDesc: "Explore desafios virtuais e físicos. Selecione o que mais lhe interessa e prepare-se para a ação.",
            participa: "Participe",
            participaDesc: "Pague a entrada, treine e faça sua tentativa oficial. Mostre do que você é capaz.",
            ganaDinero: "Ganhe Dinheiro",
            ganaDineroDesc: "Se você atingir a meta, compartilha o prêmio. Sua habilidade será recompensada com dinheiro real.",
            caracteristicasTitle: "Características Únicas",
            desafiosCompetitivos: "Desafios Competitivos",
            desafiosCompetitivosDesc: "Viva experiências diversas: desde jogos virtuais de destreza até desafios físicos reais.",
            verificacionVideo: "Verificação por Vídeo",
            verificacionVideoDesc: "Grave suas tentativas físicas com seu celular e verifique sua conquista diante de toda a comunidade.",
            seguridad: "Segurança e Privacidade",
            seguridadDesc: "Protegemos suas informações com medidas avançadas, apoiados por especialistas em cibersegurança.",
            recompensas: "Recompensas Justas",
            recompensasDesc: "Ganhe dinheiro baseado em sua habilidade, sem sorte. O mérito e a prática são a chave.",
            numeros: "Números do Braves",
            jugadores: "Jogadores Ativos",
            desafiosCompletados: "Desafios Completos",
            partidasJugadas: "Partidas Jogadas",
            desafiosActivos: "Desafios Ativos",
            verMas: "Ver mais",
            testimoniosTitle: "O que Dizem Nossos Usuários",
            faqTitle: "Perguntas Frequentes",
            tienesDudas: "Tem alguma dúvida?",
            necesitasInfo: "Se você precisar de mais informações, escreva para:",
            email: "braves.mobile.app@gmail.com",
            respuesta24h: "Responderemos em menos de 24 horas.",
            terminos: "Termos e Condições",
            privacidad: "Política de Privacidade",
            eliminarCuenta: "Excluir Conta",
            copyright: "© 2024 Braves. Todos os direitos reservados.",
            modalTitle: "Em Breve na App Store",
            modalDesc: "Em breve estará disponível na App Store. Por enquanto, está disponível apenas no Google Play."
        },
        en: {
            inicio: "Home",
            comoFunciona: "How It Works",
            caracteristicas: "Features",
            desafios: "Challenges",
            testimonios: "Testimonials",
            contacto: "Contact",
            heroTitle: "Braves: Show Your Skills",
            heroDesc: "Compete in exciting challenges, whether virtual or physical, improve your skills and earn real money based on your prowess. The competition of the future is here!",
            appStore: "Download on the App Store",
            googlePlay: "Available on Google Play",
            reconocimientos: "Recognitions",
            premio: "Winners of the Innovation Award granted by ANDE (National Development Agency) and ANII (National Agency for Research and Innovation) of Uruguay.",
            comoFuncionaTitle: "How It Works",
            elige: "Choose a Challenge",
            eligeDesc: "Explore virtual and physical challenges. Select the one that interests you the most and get ready for action.",
            participa: "Participate",
            participaDesc: "Pay the entry fee, train, and make your official attempt. Show what you're made of.",
            ganaDinero: "Earn Money",
            ganaDineroDesc: "If you reach the goal, you share the prize. Your skill will be rewarded with real money.",
            caracteristicasTitle: "Unique Features",
            desafiosCompetitivos: "Competitive Challenges",
            desafiosCompetitivosDesc: "Experience a wide variety: from virtual skill-based games to real physical challenges.",
            verificacionVideo: "Video Verification",
            verificacionVideoDesc: "Record your physical attempts with your phone and verify your achievement before the entire community.",
            seguridad: "Security & Privacy",
            seguridadDesc: "We protect your information with advanced measures, backed by cybersecurity experts.",
            recompensas: "Fair Rewards",
            recompensasDesc: "Earn money based on your skill, without luck. Merit and practice are key.",
            numeros: "Braves Numbers",
            jugadores: "Active Players",
            desafiosCompletados: "Completed Challenges",
            partidasJugadas: "Matches Played",
            desafiosActivos: "Active Challenges",
            verMas: "See more",
            testimoniosTitle: "What Our Users Say",
            faqTitle: "Frequently Asked Questions",
            tienesDudas: "Have any questions?",
            necesitasInfo: "If you need more information, write to:",
            email: "braves.mobile.app@gmail.com",
            respuesta24h: "We'll get back to you in less than 24 hours.",
            terminos: "Terms and Conditions",
            privacidad: "Privacy Policy",
            eliminarCuenta: "Delete Account",
            copyright: "© 2024 Braves. All rights reserved.",
            modalTitle: "Coming Soon on App Store",
            modalDesc: "It will be available soon on the App Store. For now, it is only available on Google Play."
        }
    };

    function applyTranslations(lang) {
        document.querySelector('.text-inicio').textContent = texts[lang].inicio;
        document.querySelector('.text-como-funciona').textContent = texts[lang].comoFunciona;
        document.querySelector('.text-caracteristicas').textContent = texts[lang].caracteristicas;
        document.querySelector('.text-desafios').textContent = texts[lang].desafios;
        document.querySelector('.text-testimonios').textContent = texts[lang].testimonios;
        document.querySelector('.text-contacto').textContent = texts[lang].contacto;
        document.querySelector('.text-hero-title').textContent = texts[lang].heroTitle;
        document.querySelector('.text-hero-description').textContent = texts[lang].heroDesc;
        document.querySelector('.text-app-store').alt = texts[lang].appStore;
        document.querySelector('.text-google-play').alt = texts[lang].googlePlay;
        document.querySelector('.text-reconocimientos').textContent = texts[lang].reconocimientos;
        document.querySelector('.text-premio').textContent = texts[lang].premio;
        document.querySelector('.text-como-funciona-title').textContent = texts[lang].comoFuncionaTitle;
        document.querySelector('.text-elige').textContent = texts[lang].elige;
        document.querySelector('.text-elige-desc').textContent = texts[lang].eligeDesc;
        document.querySelector('.text-participa').textContent = texts[lang].participa;
        document.querySelector('.text-participa-desc').textContent = texts[lang].participaDesc;
        document.querySelector('.text-gana-dinero').textContent = texts[lang].ganaDinero;
        document.querySelector('.text-gana-dinero-desc').textContent = texts[lang].ganaDineroDesc;
        document.querySelector('.text-caracteristicas-title').textContent = texts[lang].caracteristicasTitle;
        document.querySelector('.text-desafios-competitivos').textContent = texts[lang].desafiosCompetitivos;
        document.querySelector('.text-desafios-competitivos-desc').textContent = texts[lang].desafiosCompetitivosDesc;
        document.querySelector('.text-verificacion-video').textContent = texts[lang].verificacionVideo;
        document.querySelector('.text-verificacion-video-desc').textContent = texts[lang].verificacionVideoDesc;
        document.querySelector('.text-seguridad').textContent = texts[lang].seguridad;
        document.querySelector('.text-seguridad-desc').textContent = texts[lang].seguridadDesc;
        document.querySelector('.text-recompensas').textContent = texts[lang].recompensas;
        document.querySelector('.text-recompensas-desc').textContent = texts[lang].recompensasDesc;
        document.querySelector('.text-numeros').textContent = texts[lang].numeros;
        document.querySelector('.text-jugadores').textContent = texts[lang].jugadores;
        document.querySelector('.text-desafios-completados').textContent = texts[lang].desafiosCompletados;
        document.querySelector('.text-partidas-jugadas').textContent = texts[lang].partidasJugadas;
        document.querySelector('.text-desafios-activos').textContent = texts[lang].desafiosActivos;
        // Los botones "Ver más" se generan dinámicamente, se podrían traducir en el popup.
        document.querySelector('.text-testimonios-title').textContent = texts[lang].testimoniosTitle;
        document.querySelector('.text-faq-title').textContent = texts[lang].faqTitle;
        document.querySelector('.text-tienes-dudas').textContent = texts[lang].tienesDudas;
        document.querySelector('.text-necesitas-info').textContent = texts[lang].necesitasInfo;
        document.querySelector('.text-email').textContent = texts[lang].email;
        document.querySelector('.text-respuesta-24h').textContent = texts[lang].respuesta24h;
        document.querySelector('.text-terminos').textContent = texts[lang].terminos;
        document.querySelector('.text-privacidad').textContent = texts[lang].privacidad;
        document.querySelector('.text-eliminar-cuenta').textContent = texts[lang].eliminarCuenta;
        document.querySelector('.text-copyright').textContent = texts[lang].copyright;
        document.querySelector('.text-modal-title').textContent = texts[lang].modalTitle;
        document.querySelector('.text-modal-desc').textContent = texts[lang].modalDesc;
    }

    // Detectar país del usuario
    fetch('https://ipapi.co/json/').then(response=>response.json()).then(data=>{
        const country = data.country_code;
        const ptCountries = ['BR','PT'];
        const esCountries = ['ES','UY','AR','MX','CL','CO','PE','BO','PY','VE','CR','DO','EC','GT','HN','NI','PA','PR','SV'];
        let lang = 'en'; // Por defecto inglés
        if (ptCountries.includes(country)) {
            lang = 'pt';
        } else if (esCountries.includes(country)) {
            lang = 'es';
        } else {
            lang = 'en';
        }
        applyTranslations(lang);
    }).catch(()=>{
        // Si falla la detección, inglés por defecto
        applyTranslations('en');
    });
});
