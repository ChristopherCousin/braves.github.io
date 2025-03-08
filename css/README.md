# Estructura de CSS para Braves

Este directorio contiene todos los archivos CSS utilizados en el sitio web de Braves.

## Estructura de Archivos

- `main.css`: Archivo principal que importa todos los demás archivos CSS.
- `base.css`: Estilos base, variables, reset y utilidades.
- `animations.css`: Animaciones y keyframes.
- `transitions.css`: Transiciones y efectos.
- `responsive-controller.css`: Controlador para mostrar/ocultar estilos según el dispositivo.
- `optimizations.css`: Optimizaciones de rendimiento.

### Carpetas

- `desktop/`: Contiene estilos específicos para dispositivos de escritorio.
- `mobile/`: Contiene estilos específicos para dispositivos móviles.
- `assets/`: Contiene recursos utilizados por los archivos CSS.

## Organización

Los estilos están organizados por componente, con versiones específicas para escritorio y móvil. El archivo `responsive-controller.css` se encarga de mostrar u ocultar los estilos según el tamaño de la pantalla.

## Convenciones de Nomenclatura

- Los nombres de clase siguen la metodología BEM (Block, Element, Modifier).
- Los archivos CSS están nombrados según el componente que estilizan.

## Cómo Añadir Nuevos Estilos

1. Determina si los estilos son para un componente existente o uno nuevo.
2. Si es para un componente nuevo, crea archivos en las carpetas `desktop/` y `mobile/`.
3. Añade las importaciones en `main.css`.
4. Asegúrate de que los selectores en los archivos de escritorio y móvil sean idénticos para que `responsive-controller.css` funcione correctamente.

## Optimización

- Evita la duplicación de código entre los archivos de escritorio y móvil.
- Utiliza variables CSS para mantener la coherencia.
- Minimiza el uso de !important.
- Utiliza selectores específicos para evitar conflictos.

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