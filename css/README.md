# Estructura CSS Modular para Braves

Este directorio contiene la estructura CSS modular para el sitio web de Braves. La organización modular facilita el mantenimiento y la escalabilidad del código.

## Estructura de Archivos

- **main.css**: Archivo principal que importa todos los demás archivos CSS.
- **base.css**: Estilos base, variables, reset y elementos generales.
- **header.css**: Estilos del encabezado y navegación.
- **hero.css**: Estilos de la sección hero.
- **awards.css**: Estilos de la sección de reconocimientos.
- **how-it-works.css**: Estilos de la sección de cómo funciona.
- **features.css**: Estilos de la sección de características.
- **statistics.css**: Estilos de la sección de estadísticas.
- **challenges.css**: Estilos de la sección de desafíos.
- **testimonials.css**: Estilos de la sección de testimonios.
- **faq.css**: Estilos de la sección de preguntas frecuentes.
- **team.css**: Estilos de la sección del equipo.
- **contact.css**: Estilos de la sección de contacto.
- **footer.css**: Estilos del pie de página.
- **modal.css**: Estilos para modales y popups.
- **animations.css**: Animaciones básicas y keyframes.
- **transitions.css**: Efectos de transición avanzados.
- **responsive.css**: Media queries y ajustes responsivos.

## Convenciones de Nomenclatura

- Se utiliza kebab-case para los nombres de clases (ej. `.feature-grid`).
- Se utilizan nombres descriptivos que indican la función del elemento.
- Se evitan selectores demasiado específicos para mantener la especificidad baja.

## Variables CSS

Las variables CSS están definidas en `base.css` y se utilizan en todo el proyecto para mantener la consistencia:

```css
:root {
    --primary-color: #FF6B6B;
    --secondary-color: #FF8E8E;
    --accent-color: #FF4444;
    --background-color: #1E1E1E;
    --text-color: #FFFFFF;
    --button-color: #007AFF;
    --card-background: #2A2A2A;
    --gradient-primary: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    --gradient-dark: linear-gradient(145deg, #1E1E1E, #2A2A2A);
    --gradient-section: linear-gradient(145deg, #1E1E1E, #232323);
    --gradient-footer: linear-gradient(180deg, #2A2A2A, #1E1E1E);
    --box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}
```

## Responsive Design

Los ajustes responsivos se manejan principalmente en `responsive.css`, pero cada componente también tiene sus propios ajustes específicos para diferentes tamaños de pantalla.

## Animaciones y Transiciones

El sistema de animaciones y transiciones se divide en dos partes:

1. **animations.css**: Contiene animaciones básicas y keyframes para efectos comunes.
2. **transitions.css**: Proporciona efectos de transición avanzados y clases utilitarias para interacciones.

Además, se ha añadido un archivo JavaScript (`transitions.js`) que implementa efectos interactivos como:
- Revelación de elementos al hacer scroll
- Efectos de ondulación al hacer clic
- Revelación de texto carácter por carácter
- Efectos parallax para fondos

Para más detalles sobre cómo utilizar estas características, consulta el archivo `README-TRANSITIONS.md`.

## Cómo Modificar

1. Para cambios globales (colores, tipografía, etc.), modifica `base.css`.
2. Para cambios en componentes específicos, modifica el archivo correspondiente.
3. Para añadir nuevos componentes, crea un nuevo archivo y añade su importación en `main.css`.
4. Para añadir nuevas animaciones o transiciones, utiliza los archivos correspondientes.

## Optimización

Esta estructura modular facilita la optimización para producción mediante herramientas como:
- Concatenación de archivos
- Minificación
- Eliminación de CSS no utilizado 