// Definición de traducciones
const translations = {
    es: {
        nav: {
            home: 'Inicio',
            howItWorks: 'Cómo Funciona',
            features: 'Características',
            challenges: 'Desafíos',
            testimonials: 'Testimonios',
            contact: 'Contacto'
        },
        hero: {
            title: 'Compite en Desafíos de Habilidad',
            subtitle: 'Braves es una plataforma innovadora donde puedes participar en desafíos únicos y demostrar tu destreza.',
            cta: '¡Descarga Ahora!'
        },
        howItWorks: {
            title: 'Cómo Funciona',
            step1Title: 'Elige un Desafío',
            step1Description: 'Explora una variedad de retos virtuales y reales, y selecciona el que más te interese.',
            step2Title: 'Participa',
            step2Description: 'Demuestra tus habilidades y compite contra otros jugadores.',
            step3Title: 'Gana Premios',
            step3Description: 'Obtén recompensas reales por tus logros y habilidades.'
        },
        features: {
            title: 'Características',
            security: 'Seguridad Garantizada',
            fairplay: 'Juego Limpio',
            rewards: 'Premios Reales',
            community: 'Comunidad Activa'
        },
        stats: {
            title: 'Nuestros Números',
            users: 'Jugadores Activos',
            challenges: 'Desafíos Completados',
            rankings: 'Rankings Globales'
        },
        footer: {
            rights: 'Todos los derechos reservados',
            privacy: 'Política de Privacidad',
            terms: 'Términos y Condiciones',
            contact: 'Contacto'
        },
        accessibility: {
            skipToMain: 'Saltar al contenido principal',
            menuToggle: 'Abrir menú de navegación',
            languageSelector: 'Seleccionar idioma'
        }
    },
    pt: {
        nav: {
            home: 'Início',
            howItWorks: 'Como Funciona',
            features: 'Características',
            challenges: 'Desafios',
            testimonials: 'Depoimentos',
            contact: 'Contato'
        },
        hero: {
            title: 'Compita em Desafios de Habilidade',
            subtitle: 'Braves é uma plataforma inovadora onde você pode participar de desafios únicos e demonstrar sua habilidade.',
            cta: 'Baixe Agora!'
        },
        howItWorks: {
            title: 'Como Funciona',
            step1Title: 'Escolha um Desafio',
            step1Description: 'Explore uma variedade de desafios virtuais e reais, e selecione o que mais lhe interessa.',
            step2Title: 'Participe',
            step2Description: 'Demonstre suas habilidades e compita contra outros jogadores.',
            step3Title: 'Ganhe Prêmios',
            step3Description: 'Obtenha recompensas reais por suas conquistas e habilidades.'
        },
        features: {
            title: 'Características',
            security: 'Segurança Garantida',
            fairplay: 'Jogo Justo',
            rewards: 'Prêmios Reais',
            community: 'Comunidade Ativa'
        },
        stats: {
            title: 'Nossos Números',
            users: 'Jogadores Ativos',
            challenges: 'Desafios Completados',
            rankings: 'Rankings Globais'
        },
        footer: {
            rights: 'Todos os direitos reservados',
            privacy: 'Política de Privacidade',
            terms: 'Termos e Condições',
            contact: 'Contato'
        },
        accessibility: {
            skipToMain: 'Pular para o conteúdo principal',
            menuToggle: 'Abrir menu de navegação',
            languageSelector: 'Selecionar idioma'
        }
    },
    en: {
        nav: {
            home: 'Home',
            howItWorks: 'How It Works',
            features: 'Features',
            challenges: 'Challenges',
            testimonials: 'Testimonials',
            contact: 'Contact'
        },
        hero: {
            title: 'Compete in Skill Challenges',
            subtitle: 'Braves is an innovative platform where you can participate in unique challenges and showcase your skills.',
            cta: 'Download Now!'
        },
        howItWorks: {
            title: 'How It Works',
            step1Title: 'Choose a Challenge',
            step1Description: 'Explore a variety of virtual and real challenges, and select the one that interests you most.',
            step2Title: 'Participate',
            step2Description: 'Showcase your skills and compete against other players.',
            step3Title: 'Win Prizes',
            step3Description: 'Get real rewards for your achievements and skills.'
        },
        features: {
            title: 'Features',
            security: 'Guaranteed Security',
            fairplay: 'Fair Play',
            rewards: 'Real Prizes',
            community: 'Active Community'
        },
        stats: {
            title: 'Our Numbers',
            users: 'Active Players',
            challenges: 'Completed Challenges',
            rankings: 'Global Rankings'
        },
        footer: {
            rights: 'All rights reserved',
            privacy: 'Privacy Policy',
            terms: 'Terms and Conditions',
            contact: 'Contact'
        },
        accessibility: {
            skipToMain: 'Skip to main content',
            menuToggle: 'Open navigation menu',
            languageSelector: 'Select language'
        }
    }
};

// Lista de países por idioma
const languagesByCountry = {
    // Países de habla portuguesa
    BR: 'pt', // Brasil
    PT: 'pt', // Portugal
    AO: 'pt', // Angola
    MZ: 'pt', // Mozambique
    CV: 'pt', // Cabo Verde
    GW: 'pt', // Guinea-Bissau
    ST: 'pt', // Santo Tomé y Príncipe
    TL: 'pt', // Timor Oriental
    
    // Países de habla española
    ES: 'es', // España
    MX: 'es', // México
    AR: 'es', // Argentina
    UY: 'es', // Uruguay
    CL: 'es', // Chile
    CO: 'es', // Colombia
    PE: 'es', // Perú
    VE: 'es', // Venezuela
    EC: 'es', // Ecuador
    GT: 'es', // Guatemala
    CU: 'es', // Cuba
    BO: 'es', // Bolivia
    DO: 'es', // República Dominicana
    HN: 'es', // Honduras
    PY: 'es', // Paraguay
    SV: 'es', // El Salvador
    NI: 'es', // Nicaragua
    CR: 'es', // Costa Rica
    PA: 'es', // Panamá
    GQ: 'es', // Guinea Ecuatorial
    
    // Por defecto inglés para otros países
    default: 'en'
};

// Función para obtener el idioma basado en el país
async function detectLanguage() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        return languagesByCountry[countryCode] || languagesByCountry.default;
    } catch (error) {
        console.error('Error detecting language:', error);
        return languagesByCountry.default;
    }
}

// Función para traducir la página
function translatePage(language) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = translations[language];
        
        for (const k of keys) {
            translation = translation[k];
        }
        
        if (translation) {
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Actualizar el atributo lang del HTML
    document.documentElement.lang = language;
    
    // Actualizar el selector de idioma
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = language;
    }
}

// Función para guardar el idioma preferido
function saveLanguagePreference(language) {
    localStorage.setItem('preferredLanguage', language);
}

// Función para obtener el idioma preferido
function getLanguagePreference() {
    return localStorage.getItem('preferredLanguage');
}

// Inicializar la detección de idioma y traducción
async function initializeLanguage() {
    // Primero intentar obtener el idioma preferido guardado
    const preferredLanguage = getLanguagePreference();
    
    if (preferredLanguage) {
        translatePage(preferredLanguage);
    } else {
        // Si no hay preferencia guardada, detectar por ubicación
        const language = await detectLanguage();
        translatePage(language);
        saveLanguagePreference(language);
    }
    
    // Configurar el evento change del selector de idioma
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const newLanguage = e.target.value;
            translatePage(newLanguage);
            saveLanguagePreference(newLanguage);
        });
    }
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initializeLanguage); 