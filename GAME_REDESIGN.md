# Rediseño del Juego Demo "Flappy Braves"

Este documento detalla las especificaciones para rediseñar el juego demo en la sección Hero, con especial énfasis en transformar el personaje principal para que se asemeje al logo de Braves (la cabrita).

## 1. Personaje Principal: La Cabrita Braves

### Diseño Visual
- **Silueta**: Adaptar la forma para que refleje claramente la cabrita del logo
- **Cuernos**: Incorporar los cuernos curvados característicos del logo
- **Colores**: Utilizar el rojo Braves (#FF0000) como color principal
- **Contorno**: Añadir un efecto de neón sutil alrededor del personaje
- **Proporciones**: Mantener un tamaño adecuado para la jugabilidad (aproximadamente 40x40px)

### Animación
- **Movimiento principal**: Sustituir el aleteo por un movimiento de "salto" o "flotación" que se adapte a la forma de la cabrita
- **Rotación**: Ligera inclinación hacia arriba al "saltar" y hacia abajo al caer
- **Efectos**: Pequeña estela de partículas neón al moverse
- **Frames**: 4-6 frames de animación para un movimiento fluido
- **Transiciones**: Suavizar las transiciones entre estados (normal, salto, colisión)

### Estados del Personaje
- **Normal**: Cabrita flotando con ligero movimiento de "respiración"
- **Salto**: Impulso hacia arriba con efecto de energía
- **Colisión**: Efecto de destello rojo y ligera deformación
- **Victoria**: Animación especial al superar récord o completar nivel

## 2. Mecánicas de Juego

### Controles
- Mantener la simplicidad actual: clic/toque para saltar
- Añadir feedback visual y sonoro al activar el salto
- Considerar añadir un doble salto como mecánica adicional

### Dificultad
- Curva de dificultad progresiva
- Velocidad inicial accesible para nuevos jugadores
- Incremento gradual de velocidad y complejidad
- Sistema de niveles o fases con diferentes obstáculos

### Sistema de Puntuación
- Contador visible con tipografía Orbitron
- Efecto visual al conseguir puntos
- Récord personal guardado en localStorage
- Posible tabla de clasificación global (implementación futura)

## 3. Entorno y Obstáculos

### Fondo
- Estética cyberpunk coherente con el resto del sitio
- Gradientes en tonos oscuros con acentos neón
- Efecto parallax con 2-3 capas de profundidad
- Rejilla de líneas neón sutiles en perspectiva

### Obstáculos
- **Diseño**: Tubos o barreras con estética futurista/neón
- **Variaciones**: Diferentes tipos de obstáculos a medida que avanza el juego
- **Efectos**: Bordes con glow neón en colores de la paleta secundaria
- **Animación**: Ligero pulso o movimiento en los obstáculos

### Elementos Decorativos
- Partículas flotantes en el fondo
- Destellos ocasionales de luz
- Elementos de la marca Braves integrados sutilmente
- Posibles power-ups o coleccionables

## 4. Interfaz del Juego

### Pantalla de Inicio
- Logo de Braves prominente
- Instrucciones claras y concisas
- Botón de inicio con efecto neón
- Opción para ver récords o tutorial

### HUD Durante el Juego
- Contador de puntos en la esquina superior
- Indicador de vidas/intentos
- Diseño minimalista que no distraiga del juego
- Feedback visual para eventos importantes

### Pantalla de Game Over
- Animación de transición suave
- Puntuación final destacada
- Récord personal (si aplica)
- Botones para reintentar y compartir resultado
- Llamada a la acción para descargar la app

## 5. Efectos Audiovisuales

### Efectos Visuales
- Destellos al conseguir puntos
- Ondas de impacto en colisiones
- Partículas al superar obstáculos
- Transiciones fluidas entre estados del juego

### Efectos Sonoros (Opcional)
- Sonido de salto/impulso
- Feedback al conseguir puntos
- Alerta de colisión
- Música de fondo minimalista con opción de silenciar

## 6. Optimización

### Rendimiento
- Optimizar para dispositivos móviles de gama media-baja
- Mantener 60fps constantes
- Reducir complejidad visual en dispositivos con limitaciones
- Precarga de assets para evitar interrupciones

### Compatibilidad
- Funcionamiento correcto en todos los navegadores modernos
- Adaptación a diferentes tamaños de pantalla
- Controles adaptados para touch y mouse/teclado
- Fallbacks para características no soportadas

## 7. Integración con el Sitio

### Transiciones
- Integración fluida con el resto de la sección Hero
- Transición suave al iniciar/finalizar el juego
- Coherencia visual con los elementos circundantes

### Llamadas a la Acción
- Vincular la experiencia del juego con la descarga de la app
- Mensaje post-juego que invite a probar la app completa
- Posibilidad de compartir resultado en redes sociales

## 8. Implementación Técnica

### Canvas vs DOM
- Utilizar Canvas para mejor rendimiento y flexibilidad
- Mantener la estructura actual del código optimizando el rendimiento
- Separar lógica de juego, renderizado y entrada de usuario

### Assets
- Sprites optimizados para web (SVG o PNG con transparencia)
- Hojas de sprites para animaciones
- Precarga de recursos críticos
- Versiones adaptadas para diferentes densidades de pantalla

### Código
- Estructura modular y mantenible
- Comentarios claros en secciones críticas
- Variables para facilitar ajustes de dificultad y comportamiento
- Gestión eficiente de memoria y recursos

## 9. Plan de Implementación

### Fases de Desarrollo
1. **Diseño de assets**: Crear el nuevo personaje y obstáculos
2. **Prototipo básico**: Implementar mecánicas core con gráficos temporales
3. **Integración visual**: Aplicar el diseño final y efectos visuales
4. **Pulido**: Ajustar dificultad, añadir efectos y mejorar UX
5. **Testing**: Probar en diferentes dispositivos y navegadores
6. **Lanzamiento**: Integrar en el sitio web

### Prioridades
- El rediseño del personaje es la prioridad máxima
- Mantener o mejorar la jugabilidad actual
- Asegurar coherencia visual con la marca
- Optimizar para dispositivos móviles

## 10. Ejemplos Visuales

### Referencias para el Personaje
- Utilizar el logo de Braves como base principal
- Simplificar manteniendo elementos distintivos (cuernos, forma)
- Añadir personalidad mediante animación y efectos

### Mockups
- Crear bocetos del personaje en diferentes estados
- Diseñar storyboard de la secuencia de juego
- Prototipos de la UI en diferentes estados

---

Este documento debe utilizarse como guía para el rediseño del juego demo, asegurando que el resultado final refuerce la identidad de marca de Braves y proporcione una experiencia de usuario atractiva y coherente. 