# Documentación de Desarrollo del Juego Flappy Braves

Este documento proporciona instrucciones técnicas detalladas para el desarrollo y mantenimiento del juego "Flappy Braves" en la web de Braves.

## 1. Estructura de Archivos

```
braves.github.io/
├── js/
│   ├── braves-character.js  # Implementación del personaje (cabrita)
│   └── game.js              # Lógica principal del juego
├── css/
│   ├── game-variables.css   # Variables CSS específicas del juego
│   └── game-character.css   # Estilos para el personaje y elementos del juego
├── assets/
│   └── braves-goat.svg      # Imagen de referencia de la cabrita
```

## 2. Arquitectura del Juego

El juego está implementado siguiendo un patrón orientado a objetos con dos clases principales:

### `BravesCharacter` (braves-character.js)
- Responsable de la representación visual y comportamiento del personaje
- Maneja animaciones, efectos de partículas y estados del personaje
- Métodos principales:
  - `update(isPlaying, deltaTime)`: Actualiza la posición y estado del personaje
  - `jump()`: Maneja la mecánica de salto
  - `draw(isPlaying)`: Renderiza el personaje en el canvas
  - `setInvulnerable(value)`: Establece el estado de invulnerabilidad

### `FlappyBraves` (game.js)
- Clase principal que controla la lógica del juego
- Gestiona el ciclo de juego, colisiones, puntuación y estados
- Métodos principales:
  - `startGame()`: Inicia una nueva partida
  - `gameLoop(timestamp)`: Bucle principal del juego
  - `generatePipe()`: Crea nuevos obstáculos
  - `checkCollisions()`: Detecta colisiones con obstáculos
  - `loseLife()`: Maneja la pérdida de vidas
  - `gameOver()`: Finaliza el juego

## 3. Flujo de Ejecución

1. **Inicialización**:
   - Se crea una instancia de `FlappyBraves` cuando el DOM está cargado
   - Se inicializa el canvas y se configura el tamaño
   - Se crea una instancia de `BravesCharacter`
   - Se muestra la pantalla de inicio con instrucciones

2. **Inicio del Juego**:
   - El usuario hace clic en "Jugar"
   - Se oculta el overlay de instrucciones
   - Se reinician las variables de estado (puntuación, vidas)
   - Se inicia el bucle del juego con `requestAnimationFrame`

3. **Bucle del Juego**:
   - Se actualiza la posición del personaje aplicando gravedad
   - Se generan y mueven los obstáculos
   - Se comprueban colisiones
   - Se actualiza la puntuación
   - Se renderiza todo en el canvas
   - Se continúa el bucle mientras el juego esté activo

4. **Interacción del Usuario**:
   - El usuario hace clic/toca la pantalla para hacer saltar al personaje
   - Se aplica una fuerza de salto negativa a la velocidad vertical

5. **Fin del Juego**:
   - Cuando se pierden todas las vidas, se muestra la pantalla de game over
   - Se muestra la puntuación final
   - Se ofrece la opción de jugar de nuevo

## 4. Personalización del Personaje

El personaje de la cabrita está diseñado para parecerse al logo de Braves, con las siguientes características:

### Componentes Visuales
- **Cuerpo**: Forma ovalada en color rojo (#FF0000)
- **Cuernos**: Formas curvas características en la parte superior
- **Ojos**: Círculos blancos con pupilas negras
- **Hocico**: Círculo en tono rojo más claro (#FF3333)

### Métodos de Dibujo
- `drawGoatBody()`: Dibuja el cuerpo principal
- `drawHorns()`: Dibuja los cuernos curvados
- `drawFace()`: Dibuja ojos y hocico

### Efectos Visuales
- Efecto de neón (glow) alrededor del personaje
- Partículas al saltar y moverse
- Animación de flotación cuando no está jugando
- Rotación basada en la velocidad vertical

## 5. Física del Juego

### Parámetros Configurables
- **Gravedad**: 0.15 píxeles por frame
- **Fuerza de Salto**: -4 píxeles por frame
- **Velocidad Inicial**: 1.2 píxeles por frame
- **Velocidad Máxima**: 2.5 píxeles por frame

### Colisiones
- Detección de colisiones con los bordes del canvas
- Detección de colisiones con los obstáculos (tubos)
- Período de invulnerabilidad después de una colisión

## 6. Optimización

### Rendimiento
- Uso de `requestAnimationFrame` para sincronización con el refresco de pantalla
- Limitación del número de partículas
- Reutilización de objetos para evitar garbage collection
- Precálculo de valores constantes

### Compatibilidad
- Adaptación del tamaño del canvas según el dispositivo
- Controles adaptados para mouse y touch
- Ajuste de complejidad visual en dispositivos de menor rendimiento

## 7. Depuración

Para facilitar la depuración durante el desarrollo, se pueden utilizar las siguientes técnicas:

### Modo Debug
Añadir un parámetro `debug` a la URL para activar el modo de depuración:
```javascript
const urlParams = new URLSearchParams(window.location.search);
this.debugMode = urlParams.has('debug');
```

### Visualización de Hitboxes
En modo debug, dibujar los contornos de las hitboxes:
```javascript
if (this.debugMode) {
    this.ctx.strokeStyle = 'red';
    this.ctx.strokeRect(
        this.character.x,
        this.character.y,
        this.character.width,
        this.character.height
    );
}
```

### Controles de Depuración
Añadir teclas para controlar el juego durante la depuración:
- `P`: Pausar/reanudar
- `R`: Reiniciar
- `I`: Alternar invulnerabilidad
- `+/-`: Ajustar velocidad del juego

## 8. Extensiones Futuras

### Posibles Mejoras
- **Power-ups**: Implementar ítems coleccionables con efectos temporales
- **Obstáculos Variables**: Añadir diferentes tipos de obstáculos
- **Niveles**: Crear progresión con diferentes escenarios y dificultades
- **Tabla de Clasificación**: Integrar con backend para guardar puntuaciones
- **Personalización**: Permitir desbloquear diferentes aspectos para la cabrita

### Implementación de Power-ups
Ejemplo de estructura para un sistema de power-ups:
```javascript
class PowerUp {
    constructor(type, x, y, width, height) {
        this.type = type; // 'shield', 'slowTime', 'extraLife', etc.
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
    }
    
    update(gameSpeed) {
        this.x -= gameSpeed * 2;
    }
    
    draw(ctx) {
        // Dibujar según el tipo de power-up
    }
    
    apply(game) {
        // Aplicar efecto según el tipo
        switch(this.type) {
            case 'shield':
                game.character.setInvulnerable(true);
                setTimeout(() => game.character.setInvulnerable(false), 5000);
                break;
            case 'slowTime':
                const originalSpeed = game.gameSpeed;
                game.gameSpeed *= 0.5;
                setTimeout(() => game.gameSpeed = originalSpeed, 3000);
                break;
            // Otros tipos...
        }
    }
}
```

## 9. Integración con el Sitio

### Comunicación con Otros Componentes
El juego puede comunicarse con otros componentes del sitio mediante eventos personalizados:

```javascript
// Emitir evento cuando se consigue una nueva puntuación máxima
window.dispatchEvent(new CustomEvent('flappyBraves:newHighScore', {
    detail: { score: this.score }
}));

// Escuchar desde otros componentes
window.addEventListener('flappyBraves:newHighScore', (event) => {
    console.log(`Nueva puntuación máxima: ${event.detail.score}`);
    // Actualizar UI, desbloquear logros, etc.
});
```

### Persistencia de Datos
Guardar puntuaciones y configuraciones en localStorage:

```javascript
// Guardar puntuación máxima
localStorage.setItem('flappyBraves:highScore', this.score);

// Recuperar puntuación máxima
const highScore = localStorage.getItem('flappyBraves:highScore') || 0;
```

## 10. Mantenimiento

### Pruebas
- Probar en diferentes navegadores y dispositivos
- Verificar rendimiento en dispositivos de gama baja
- Comprobar controles táctiles y de teclado

### Actualizaciones
- Documentar cambios en el código
- Mantener compatibilidad con versiones anteriores
- Seguir las convenciones de estilo establecidas

---

Este documento debe utilizarse como referencia técnica para el desarrollo y mantenimiento del juego "Flappy Braves". Para aspectos visuales y de diseño, consultar también el documento GAME_REDESIGN.md. 