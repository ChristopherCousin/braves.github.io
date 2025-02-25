# Guía de Transiciones y Animaciones

Este documento describe las transiciones y animaciones disponibles en el sitio web de Braves, cómo utilizarlas y las mejores prácticas para implementarlas.

## Índice

1. [Introducción](#introducción)
2. [Clases de Animación](#clases-de-animación)
3. [Clases de Transición](#clases-de-transición)
4. [Efectos Interactivos](#efectos-interactivos)
5. [Consideraciones de Rendimiento](#consideraciones-de-rendimiento)
6. [Accesibilidad](#accesibilidad)

## Introducción

El sistema de transiciones y animaciones de Braves está diseñado para mejorar la experiencia del usuario proporcionando retroalimentación visual, guiando la atención y creando una interfaz más dinámica y atractiva.

Los archivos principales son:
- `animations.css`: Contiene animaciones básicas y keyframes
- `transitions.css`: Contiene efectos de transición avanzados
- `transitions.js`: Implementa la lógica para los efectos interactivos

## Clases de Animación

### Animaciones Básicas
- `.fade-in`: Desvanecimiento suave
- `.slide-in-left`: Deslizamiento desde la izquierda
- `.slide-in-right`: Deslizamiento desde la derecha
- `.slide-in-bottom`: Deslizamiento desde abajo
- `.slide-in-top`: Deslizamiento desde arriba

### Animaciones Continuas
- `.float`: Efecto flotante vertical (6s)
- `.float-slow`: Efecto flotante vertical más lento (8s)
- `.pulse`: Efecto de pulsación suave
- `.rotate`: Rotación continua

### Modificadores
- `.delay-100` a `.delay-500`: Retrasos de animación (0.1s a 0.5s)
- `.duration-500` a `.duration-2000`: Duración de animación (0.5s a 2s)

## Clases de Transición

### Efectos de Revelación
- `.reveal-on-scroll`: Elementos que aparecen al hacer scroll
- `.text-reveal`: Texto que se revela carácter por carácter

### Efectos de Imagen
- `.image-fade`: Desvanecimiento gradual de imágenes
- `.zoom-effect`: Efecto de zoom suave al pasar el cursor
- `.parallax-bg`: Efecto parallax para fondos

### Efectos de Hover
- `.blur-on-hover`: Desenfoque al pasar el cursor
- `.glow-on-hover`: Brillo radial al pasar el cursor
- `.color-shift`: Cambio de color al pasar el cursor
- `.text-shadow-dynamic`: Sombra de texto dinámica
- `.glowing-border`: Borde brillante pulsante

### Efectos de Interacción
- `.ripple-effect`: Efecto de ondulación al hacer clic
- `.gradient-shift`: Desplazamiento de gradiente
- `.rotate-3d`: Rotación 3D al pasar el cursor

## Efectos Interactivos

Estos efectos requieren JavaScript para funcionar:

### Revelación al Scroll
```html
<div class="reveal-on-scroll">
    Contenido que se revelará al hacer scroll
</div>
```

### Efecto de Ondulación
```html
<button class="ripple-effect">
    Haz clic para ver el efecto
</button>
```

### Revelación de Texto
```html
<h2 class="text-reveal">
    Este texto se revelará carácter por carácter
</h2>
```

### Efecto Parallax
```html
<div class="parallax-bg" data-speed="0.5" style="background-image: url('imagen.jpg')">
    Contenido con fondo parallax
</div>
```

## Consideraciones de Rendimiento

Para mantener un rendimiento óptimo:

1. Limita las animaciones a propiedades que no causan reflow (transform, opacity)
2. Evita animar muchos elementos simultáneamente
3. Utiliza `will-change` solo cuando sea necesario
4. Considera desactivar animaciones en dispositivos de bajo rendimiento

## Accesibilidad

El sistema respeta las preferencias de reducción de movimiento:

```css
@media (prefers-reduced-motion: reduce) {
    /* Desactiva o simplifica animaciones */
}
```

Para usuarios que prefieren menos movimiento, las animaciones se desactivan automáticamente cuando tienen habilitada esta preferencia en su sistema operativo. 