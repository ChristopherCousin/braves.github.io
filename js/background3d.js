// Fondo 3D con Three.js para la sección hero

class Background3D {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;
        
        // Configuración básica
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        
        // Ajustar tamaño del renderer
        this.resize();
        
        // Posicionar cámara
        this.camera.position.z = 30;
        
        // Crear objetos
        this.createObjects();
        
        // Añadir eventos
        window.addEventListener('resize', this.resize.bind(this));
        
        // Iniciar animación
        this.animate();
    }
    
    resize() {
        const container = this.canvas.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
    
    createObjects() {
        // Crear grid de líneas
        this.createGrid();
        
        // Crear partículas flotantes
        this.createParticles();
    }
    
    createGrid() {
        // Crear material para las líneas
        const material = new THREE.LineBasicMaterial({
            color: 0x00FFFF,
            transparent: true,
            opacity: 0.1
        });
        
        // Crear grid horizontal
        const gridSize = 100;
        const gridDivisions = 20;
        const gridStep = gridSize / gridDivisions;
        
        // Líneas horizontales
        for (let i = -gridDivisions / 2; i <= gridDivisions / 2; i++) {
            const geometry = new THREE.BufferGeometry();
            const points = [
                new THREE.Vector3(-gridSize / 2, i * gridStep, 0),
                new THREE.Vector3(gridSize / 2, i * gridStep, 0)
            ];
            geometry.setFromPoints(points);
            
            const line = new THREE.Line(geometry, material);
            this.scene.add(line);
        }
        
        // Líneas verticales
        for (let i = -gridDivisions / 2; i <= gridDivisions / 2; i++) {
            const geometry = new THREE.BufferGeometry();
            const points = [
                new THREE.Vector3(i * gridStep, -gridSize / 2, 0),
                new THREE.Vector3(i * gridStep, gridSize / 2, 0)
            ];
            geometry.setFromPoints(points);
            
            const line = new THREE.Line(geometry, material);
            this.scene.add(line);
        }
    }
    
    createParticles() {
        // Crear geometría para las partículas
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color1 = new THREE.Color(0xFF00A0); // Rosa neón
        const color2 = new THREE.Color(0x00FFFF); // Cian neón
        const color3 = new THREE.Color(0xFF3300); // Naranja neón
        const color4 = new THREE.Color(0x00FF66); // Verde neón
        
        for (let i = 0; i < particleCount; i++) {
            // Posición aleatoria
            positions[i * 3] = (Math.random() - 0.5) * 100; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
            
            // Color aleatorio entre los 4 colores neón
            let color;
            const colorIndex = Math.floor(Math.random() * 4);
            switch (colorIndex) {
                case 0: color = color1; break;
                case 1: color = color2; break;
                case 2: color = color3; break;
                case 3: color = color4; break;
            }
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // Tamaño aleatorio
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Crear material para las partículas
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    
                    // Animación simple
                    vec3 pos = position;
                    pos.y += sin(time * 0.2 + position.x * 0.05) * 2.0;
                    pos.x += cos(time * 0.2 + position.y * 0.05) * 2.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * pixelRatio;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Crear partícula circular con borde suave
                    vec2 center = gl_PointCoord - 0.5;
                    float dist = length(center);
                    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                    
                    // Añadir brillo
                    vec3 glow = vColor * (1.0 - dist * 2.0);
                    vec3 finalColor = mix(glow, vColor, dist * 2.0);
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(geometry, particleMaterial);
        this.scene.add(this.particles);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Actualizar tiempo para la animación de partículas
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = performance.now() * 0.001;
        }
        
        // Rotar la cámara suavemente
        this.camera.position.x = Math.sin(performance.now() * 0.0002) * 5;
        this.camera.position.y = Math.cos(performance.now() * 0.0001) * 3;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si THREE está disponible
    if (typeof THREE === 'undefined') {
        console.log('THREE no está disponible - Asegúrate de que three.js esté cargado correctamente');
        return;
    }

    // Resto del código para el fondo 3D
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.log('Canvas para el fondo 3D no encontrado');
        return;
    }

    // Inicializar Three.js
    const background = new Background3D();
}); 