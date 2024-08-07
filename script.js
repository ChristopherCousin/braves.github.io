// Inicializar GSAP
gsap.registerPlugin(ScrollTrigger);

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
            prize: "$100",
            type: "Virtual",
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
            prize: "$50",
            type: "Virtual",
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
            prize: "$25",
            type: "Físico",
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
                    <span class="prize">Premio: ${challenge.prize}</span>
                    <span class="type">Tipo: ${challenge.type}</span>
                    <button class="view-more-btn" data-challenge-index="${index}">Ver más</button>
                </div>
            `;
            challengeSlider.appendChild(challengeCard);
        });

        // Inicializar Owl Carousel para el slider de desafíos
        $('.challenge-slider').owlCarousel({
            items: 3, // Mostrar 3 desafíos a la vez
            loop: true,
            margin: 10,
            nav: true, // Mostrar flechas de navegación
            dots: false, // Ocultar los puntos de navegación
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 3
                }
            }
        });

        // Crear el popup
        const popupOverlay = document.createElement('div');
        popupOverlay.classList.add('popup-overlay');
        popupOverlay.innerHTML = `
            <div class="popup-content">
                <span class="close-popup">×</span>
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

    // Datos de testimonios
    const testimonialData = [
        { name: "María G.", quote: "Braves ha cambiado la forma en que veo los juegos móviles. ¡Es emocionante y desafiante!", image: "assets/testimonial-1.jpg" },
        { name: "Carlos R.", quote: "Me encanta cómo Braves combina habilidad y tecnología. Siempre estoy ansioso por el próximo desafío.", image: "assets/testimonial-2.jpg" },
        { name: "Laura S.", quote: "Los premios son geniales, pero lo mejor es cómo Braves me ha ayudado a mejorar mis habilidades.", image: "assets/testimonial-3.jpg" },
        { name: "Javier P.", quote: "La verificación por video es genial. Me da confianza saber que todos juegan limpio.", image: "assets/testimonial-4.jpg" },
        { name: "Ana M.", quote: "He conocido a gente increíble a través de Braves. Es más que una app, es una comunidad.", image: "assets/testimonial-5.jpg" }
    ];

    // Generar tarjetas de testimonios
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        testimonialData.forEach(testimonial => {
            const testimonialCard = document.createElement('div');
            testimonialCard.classList.add('testimonial-card');
            testimonialCard.innerHTML = `
                <div class="testimonial-image">
                    <img src="${testimonial.image}" alt="${testimonial.name}">
                </div>
                <p>"${testimonial.quote}"</p>
                <h4>${testimonial.name}</h4>
            `;
            testimonialCarousel.appendChild(testimonialCard);
        });

        // Inicializar Owl Carousel para el carrusel de testimonios
        $('.testimonial-carousel').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true
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
                    animateValue("userCount", 0, 126, 2000);
                    animateValue("challengeCount", 0, 6, 2500);
                    animateValue("prizeCount", 0, 5530, 3000);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    } else {
        console.warn('Sección de estadísticas no encontrada. Animaciones no inicializadas.');
    }

    // Animación de paralaje para la imagen del héroe
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
    });

    console.log('Página cargada. Animaciones y efectos iniciados.');
});


// Funcionalidad del menú hamburguesa
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('.nav-list');

menuToggle.addEventListener('click', () => {
    navUl.classList.toggle('show');
    menuToggle.classList.toggle('active');
});

// Cerrar el menú al hacer clic en un enlace (solo en dispositivos móviles)
const navLinks = document.querySelectorAll('.nav-list li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) { // Solo en pantallas pequeñas
            navUl.classList.remove('show');
            menuToggle.classList.remove('active');
        }
    });
});