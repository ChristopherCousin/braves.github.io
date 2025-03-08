# Guía de Diseño Web - Braves

Esta guía establece los estándares de diseño para mantener una experiencia visual coherente en todo el sitio web de Braves. Debe consultarse antes de realizar cualquier modificación o adición al diseño.

## 1. Identidad de Marca

### Logo
- **Símbolo principal**: La cabrita estilizada de Braves debe ser prominente y reconocible
- **Proporciones**: Mantener las proporciones originales del logo en todas las aplicaciones
- **Espacio libre**: Mantener un espacio mínimo alrededor del logo equivalente al 20% de su altura
- **Versiones**: Usar la versión roja sobre fondo oscuro como estándar; versión blanca para fondos complejos

### Mascota
- El personaje del juego demo debe rediseñarse para parecerse a la cabrita del logo
- Mantener las características distintivas: cuernos curvados, forma estilizada
- Adaptar la mascota para que funcione en el contexto del juego manteniendo la identidad visual

## 2. Paleta de Colores

### Colores Primarios
- **Rojo Braves**: #FF0000 (RGB: 255, 0, 0)
- **Negro Profundo**: #0A0A14 (RGB: 10, 10, 20)

### Colores Secundarios
- **Cian Neón**: #00FFFF (RGB: 0, 255, 255)
- **Naranja Neón**: #FF3300 (RGB: 255, 51, 0)
- **Verde Neón**: #00FF66 (RGB: 0, 255, 102)

### Aplicación de Color
- Usar el rojo como color de acento principal para elementos interactivos y destacados
- Aplicar colores neón secundarios para efectos visuales, bordes y detalles
- Mantener fondos oscuros para el contraste óptimo con elementos neón
- Limitar el uso de colores brillantes al 30% de cada sección para evitar saturación visual

## 3. Tipografía

### Fuentes
- **Títulos y Encabezados**: Orbitron (pesos: 400, 500, 700, 900)
- **Cuerpo de texto**: Poppins (pesos: 300, 400, 500, 600, 700)

### Jerarquía Tipográfica
- **H1**: Orbitron, 48px/3rem (móvil: 36px/2.25rem), peso 900
- **H2**: Orbitron, 36px/2.25rem (móvil: 28px/1.75rem), peso 700
- **H3**: Orbitron, 24px/1.5rem (móvil: 20px/1.25rem), peso 700
- **H4**: Orbitron, 18px/1.125rem (móvil: 16px/1rem), peso 500
- **Párrafos**: Poppins, 16px/1rem (móvil: 14px/0.875rem), peso 400
- **Texto pequeño**: Poppins, 14px/0.875rem (móvil: 12px/0.75rem), peso 300

### Estilos de Texto
- Mantener alto contraste: texto claro sobre fondos oscuros
- Aplicar efectos de neón solo a títulos y elementos destacados
- Limitar el uso de mayúsculas a títulos cortos y botones
- Interlineado: 1.6 para párrafos, 1.2 para títulos

## 4. Elementos de Interfaz

### Botones
- **Primario**: Fondo rojo (#FF0000) con texto blanco, bordes con efecto neón
- **Secundario**: Fondo transparente con borde rojo neón, texto blanco
- **Terciario**: Texto rojo con subrayado animado, sin fondo
- **Estados**: Incluir estados hover, active y focus con animaciones sutiles
- **Forma**: Bordes redondeados (border-radius: 5px)
- **Padding**: 12px 24px (grande), 8px 16px (mediano), 4px 12px (pequeño)

### Tarjetas y Contenedores
- Fondos semi-transparentes (rgba(10, 10, 20, 0.8))
- Bordes con efectos de neón sutiles
- Efecto de vidrio (backdrop-filter: blur(10px))
- Sombras internas y externas para profundidad
- Border-radius consistente: 10px para contenedores grandes, 5px para elementos pequeños

### Iconos
- Estilo neón con contornos brillantes
- Tamaño mínimo: 24px en móvil, 32px en desktop
- Usar iconos de Font Awesome con estilos personalizados
- Mantener consistencia visual con el resto de elementos de interfaz

## 5. Efectos Visuales

### Animaciones
- **Transiciones**: Suaves y fluidas, duración entre 0.2s y 0.5s
- **Efectos de hover**: Cambios sutiles en escala (1.05x máximo) y brillo
- **Scroll animations**: Revelar elementos con fade-in y ligeros movimientos
- **Timing function**: Preferir ease-out para movimientos naturales

### Efectos Neón
- Aplicar glow (box-shadow/text-shadow) con colores de la paleta
- Intensidad variable según importancia del elemento
- Animaciones pulsantes sutiles para elementos clave
- Combinar con gradientes para efectos más ricos

### Partículas y Fondos
- Partículas flotantes con movimientos orgánicos
- Densidad reducida en móvil (30% de la versión desktop)
- Fondos con gradientes sutiles y efectos de profundidad
- Patrones de rejilla con líneas finas para reforzar estética cyberpunk

## 6. Responsividad

### Breakpoints
- **Móvil**: < 480px
- **Tablet**: 481px - 768px
- **Desktop pequeño**: 769px - 1024px
- **Desktop grande**: > 1025px

### Principios Responsivos
- Diseño mobile-first para todos los nuevos componentes
- Mantener la misma jerarquía visual en todas las resoluciones
- Simplificar efectos visuales en dispositivos móviles para mejorar rendimiento
- Adaptar espaciado y márgenes proporcionalmente al tamaño de pantalla

### Navegación
- Menú hamburguesa en móvil con animación fluida
- Menú horizontal completo en desktop
- Indicadores claros de sección actual
- Transiciones suaves entre estados del menú

## 7. Imágenes y Multimedia

### Estilo Fotográfico
- Imágenes con tonos oscuros y acentos neón
- Filtros consistentes para mantener unidad visual
- Relación de aspecto consistente dentro de cada sección

### Ilustraciones
- Estilo cyberpunk/futurista coherente con la identidad de marca
- Líneas de neón sobre fondos oscuros
- Detalles que reflejen el concepto de competición y habilidad

### Optimización
- Imágenes WebP con fallback a formatos tradicionales
- Carga lazy para contenido fuera de la vista inicial
- Tamaños responsivos con srcset para diferentes resoluciones
- Compresión óptima sin pérdida visible de calidad

## 8. Micro-interacciones

### Feedback Visual
- Respuesta inmediata a acciones del usuario
- Efectos sutiles para confirmar interacciones
- Consistencia en el comportamiento de elementos similares

### Estados de Elementos
- Definir claramente estados: normal, hover, active, focus, disabled
- Transiciones suaves entre estados
- Mantener accesibilidad con indicadores visibles de foco

### Animaciones Funcionales
- Usar animaciones con propósito, no solo decorativas
- Duración apropiada: 200-300ms para feedback inmediato
- Curvas de aceleración naturales (ease-out, cubic-bezier)

## 9. Accesibilidad

### Contraste y Legibilidad
- Ratio de contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- No depender solo del color para transmitir información
- Tamaño de texto mínimo: 14px en desktop, 12px en móvil

### Navegación por Teclado
- Todos los elementos interactivos deben ser accesibles por teclado
- Indicadores de foco visibles y consistentes
- Orden de tabulación lógico

### Semántica
- Estructura HTML semántica y correcta
- Textos alternativos descriptivos para imágenes
- Etiquetas ARIA cuando sea necesario

## 10. Implementación Técnica

### CSS
- Usar variables CSS para todos los valores recurrentes
- Mantener la estructura modular actual (desktop/mobile)
- Comentar secciones importantes del código
- Optimizar selectores para rendimiento

### JavaScript
- Separar lógica por componentes
- Optimizar animaciones para rendimiento (preferir GPU)
- Implementar lazy loading para scripts no críticos
- Documentar funciones complejas

### Rendimiento
- Tiempo de carga objetivo: < 3 segundos en 3G
- Optimizar Critical Rendering Path
- Minimizar y comprimir todos los assets
- Implementar estrategias de caching efectivas

## 11. Juego Demo (Flappy Braves)

### Personaje Principal
- Rediseñar el personaje para que se asemeje a la cabrita del logo
- Mantener la silueta reconocible con los cuernos característicos
- Añadir efectos de neón rojo alrededor del personaje
- Animación fluida de "aleteo" adaptada a la nueva forma

### Obstáculos y Entorno
- Diseñar obstáculos con estética cyberpunk coherente
- Usar gradientes y efectos de neón de la paleta principal
- Fondo con elementos que refuercen la identidad de marca
- Efectos de partículas al superar obstáculos

### UI del Juego
- Contador de puntos con tipografía Orbitron
- Efectos visuales de neón para feedback (puntos, colisiones)
- Tutorial inicial claro y conciso
- Transiciones fluidas entre estados del juego

## 12. Mantenimiento y Evolución

### Documentación
- Mantener esta guía actualizada con cada cambio significativo
- Documentar componentes nuevos siguiendo estos estándares
- Crear una biblioteca de componentes reutilizables

### Proceso de Revisión
- Verificar adherencia a esta guía antes de implementar cambios
- Revisar en múltiples dispositivos y navegadores
- Validar accesibilidad con herramientas automatizadas

### Iteración
- Recopilar feedback de usuarios para mejoras
- Evaluar métricas de rendimiento y usabilidad
- Actualizar la guía según evolucione la marca

---

Esta guía debe considerarse un documento vivo que evolucionará con la marca Braves. Cualquier excepción a estas pautas debe ser discutida y aprobada por el equipo de diseño. 