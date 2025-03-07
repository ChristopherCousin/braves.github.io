// Script para manejar el menú móvil

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    // Crear overlay para el menú móvil
    const menuOverlay = document.createElement('div');
    menuOverlay.classList.add('menu-overlay');
    document.body.appendChild(menuOverlay);
    
    // Función para alternar el menú
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        // Bloquear/desbloquear scroll del body
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Evento para el botón de menú
    menuToggle.addEventListener('click', toggleMenu);
    
    // Evento para el overlay
    menuOverlay.addEventListener('click', toggleMenu);
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Marcar enlace activo según la sección visible
    function setActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100; // Offset para mejor detección
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remover clase active de todos los enlaces
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Añadir clase active al enlace correspondiente
                const activeLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Evento para detectar scroll y actualizar enlace activo
    window.addEventListener('scroll', setActiveLink);
    
    // Inicializar enlace activo
    setActiveLink();
}); 