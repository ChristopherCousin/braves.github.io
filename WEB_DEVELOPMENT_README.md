# Guía de Desarrollo Web - Braves

Este documento proporciona instrucciones técnicas para el desarrollo y mantenimiento del sitio web de Braves. Debe utilizarse junto con la guía de diseño (DESIGN_GUIDE.md) para asegurar la coherencia tanto visual como técnica.

## 1. Estructura del Proyecto

```
braves.github.io/
├── assets/               # Imágenes, iconos y recursos multimedia
├── css/                  # Archivos CSS
│   ├── base.css          # Estilos base y variables
│   ├── animations.css    # Animaciones y transiciones
│   ├── desktop/          # Estilos específicos para escritorio
│   ├── mobile/           # Estilos específicos para móvil
│   └── main.css          # Archivo principal que importa los demás
├── js/                   # Scripts JavaScript
│   ├── braves-character.js  # Personaje del juego demo
│   ├── game.js           # Lógica del juego demo
│   ├── background3d.js   # Efectos de fondo 3D
│   └── ...               # Otros scripts específicos
├── index.html            # Página principal
├── DESIGN_GUIDE.md       # Guía de diseño
└── WEB_DEVELOPMENT_README.md  # Este archivo
```

## 2. Convenciones de Código

### HTML
- Utilizar HTML5 semántico (`<header>`, `<section>`, `<footer>`, etc.)
- Mantener la indentación de 4 espacios
- Incluir atributos de accesibilidad (ARIA) cuando sea necesario
- Usar atributos `loading="lazy"` para imágenes fuera de la vista inicial
- Mantener el orden de los scripts: primero librerías externas, luego scripts propios

### CSS
- Seguir la metodología BEM (Block, Element, Modifier) para nombrar clases
- Mantener la estructura modular actual (desktop/mobile)
- Usar variables CSS para todos los valores recurrentes
- Comentar el inicio y fin de secciones importantes
- Evitar el uso de `!important` excepto cuando sea absolutamente necesario

### JavaScript
- Usar ES6+ con soporte para navegadores modernos
- Implementar patrones de diseño orientado a objetos
- Documentar funciones y métodos con comentarios descriptivos
- Separar la lógica en módulos independientes
- Implementar manejo de errores adecuado

## 3. Flujo de Trabajo de Desarrollo

### Proceso de Modificación
1. **Planificación**: Definir claramente los cambios a realizar
2. **Revisión de Guía**: Consultar la guía de diseño para asegurar coherencia
3. **Desarrollo**: Implementar los cambios siguiendo las convenciones
4. **Pruebas**: Verificar en múltiples dispositivos y navegadores
5. **Optimización**: Comprobar rendimiento y accesibilidad
6. **Documentación**: Actualizar documentación si es necesario

### Control de Versiones
- Usar ramas específicas para cada característica o sección
- Hacer commits pequeños y descriptivos
- Incluir prefijos en los mensajes de commit:
  - `[FEATURE]`: Nueva funcionalidad
  - `[FIX]`: Corrección de errores
  - `[STYLE]`: Cambios de estilo sin afectar funcionalidad
  - `[DOCS]`: Cambios en documentación
  - `[PERF]`: Mejoras de rendimiento

## 4. Optimización y Rendimiento

### Imágenes
- Comprimir todas las imágenes antes de subirlas
- Utilizar WebP con fallback a formatos tradicionales
- Implementar srcset para diferentes densidades de píxeles
- Dimensionar imágenes al tamaño máximo necesario

### CSS y JavaScript
- Minificar archivos en producción
- Combinar archivos cuando sea posible
- Implementar lazy loading para scripts no críticos
- Priorizar CSS crítico en línea

### Rendimiento
- Objetivo de Lighthouse: >90 en todas las categorías
- Tiempo de carga inicial: <3 segundos en 3G
- First Contentful Paint: <1.8 segundos
- Time to Interactive: <5 segundos

## 5. Integración del Juego Demo

El juego "Flappy Braves" en la sección Hero es un componente clave para demostrar la propuesta de valor de la plataforma. Sigue estas pautas al modificarlo:

### Archivos Principales
- `js/braves-character.js`: Contiene la implementación del personaje (cabrita)
- `js/game.js`: Contiene la lógica principal del juego

### Modificación del Personaje
- Mantener la coherencia visual con el logo de Braves
- Preservar las proporciones y características distintivas
- Asegurar que las animaciones sean fluidas (60fps)
- Mantener la jugabilidad accesible y divertida

### Rendimiento del Juego
- Optimizar para dispositivos móviles de gama media-baja
- Reducir complejidad visual en dispositivos con limitaciones
- Implementar detección de capacidades para ajustar calidad
- Monitorear uso de memoria y CPU

## 6. Responsividad

### Enfoque Mobile-First
- Desarrollar primero para móvil y luego expandir para escritorio
- Utilizar los breakpoints definidos en la guía de diseño
- Probar en dispositivos reales, no solo en emuladores
- Considerar diferentes densidades de píxeles y orientaciones

### Técnicas Responsivas
- Usar unidades relativas (rem, em, %) en lugar de píxeles fijos
- Implementar Flexbox y Grid para layouts adaptables
- Utilizar media queries para ajustes específicos
- Considerar la accesibilidad en todos los tamaños de pantalla

## 7. Accesibilidad

### Estándares
- Cumplir con WCAG 2.1 nivel AA
- Asegurar navegación completa por teclado
- Mantener estructura semántica adecuada
- Proporcionar alternativas textuales para contenido no textual

### Herramientas de Verificación
- Lighthouse para auditorías generales
- axe DevTools para pruebas específicas
- Lectores de pantalla para pruebas manuales
- Simuladores de daltonismo para verificar contraste

## 8. Compatibilidad con Navegadores

### Soporte Mínimo
- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)
- iOS Safari (últimas 2 versiones)
- Android Chrome (últimas 2 versiones)

### Estrategia de Fallback
- Implementar detección de características
- Proporcionar alternativas para características no soportadas
- Usar @supports en CSS para características específicas
- Mantener una experiencia básica funcional en navegadores antiguos

## 9. Seguridad

### Mejores Prácticas
- Implementar HTTPS en todo el sitio
- Configurar encabezados de seguridad adecuados
- Validar todas las entradas de usuario
- Mantener dependencias actualizadas

### Protección de Recursos
- Implementar Content Security Policy (CSP)
- Configurar CORS adecuadamente
- Proteger contra ataques XSS y CSRF
- Minimizar la exposición de información sensible

## 10. Mantenimiento

### Monitoreo
- Implementar análisis de uso (Google Analytics)
- Monitorear errores de JavaScript
- Verificar regularmente enlaces rotos
- Comprobar rendimiento periódicamente

### Actualizaciones
- Revisar y actualizar contenido regularmente
- Mantener dependencias al día
- Implementar mejoras basadas en feedback de usuarios
- Documentar todos los cambios significativos

---

Este documento debe considerarse un complemento técnico a la guía de diseño. Ambos deben consultarse antes de realizar cualquier modificación al sitio web de Braves. 