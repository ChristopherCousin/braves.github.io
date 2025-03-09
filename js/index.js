/**
 * Archivo de entrada principal para Flappy Braves
 * Este archivo importa el juego y aplica los sistemas de adicción.
 */

import { applyAddictionSystems } from './addictionSystems.js';

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando sistemas de adicción para Flappy Braves...');
    
    // Comprobar si el juego ya está inicializado
    if (typeof window.flappyBravesGame !== 'undefined') {
        console.log('Aplicando sistemas de adicción al juego existente...');
        applyAddictionSystems(window.flappyBravesGame);
    } else {
        // Esperar a que el juego se inicialice
        console.log('Esperando a que el juego se inicialice...');
        
        // Verificar si la clase FlappyBraves ya existe
        if (typeof window.FlappyBraves !== 'undefined') {
            // Guardar referencia al constructor original
            const originalFlappyBraves = window.FlappyBraves;
            
            // Sobrescribir el constructor
            window.FlappyBraves = function(...args) {
                // Llamar al constructor original
                const gameInstance = new originalFlappyBraves(...args);
                
                // Guardar referencia global al juego
                window.flappyBravesGame = gameInstance;
                
                // Aplicar sistemas de adicción
                console.log('Juego inicializado, aplicando sistemas de adicción...');
                applyAddictionSystems(gameInstance);
                
                return gameInstance;
            };
            
            // Copiar propiedades del constructor original
            Object.assign(window.FlappyBraves, originalFlappyBraves);
            window.FlappyBraves.prototype = originalFlappyBraves.prototype;
        } else {
            // Si la clase FlappyBraves aún no existe, esperar a que se cargue
            console.log('Esperando a que se cargue la clase FlappyBraves...');
            
            // Comprobar periódicamente si la clase ya está disponible
            const checkInterval = setInterval(() => {
                if (typeof window.FlappyBraves !== 'undefined') {
                    clearInterval(checkInterval);
                    
                    // Guardar referencia al constructor original
                    const originalFlappyBraves = window.FlappyBraves;
                    
                    // Sobrescribir el constructor
                    window.FlappyBraves = function(...args) {
                        // Llamar al constructor original
                        const gameInstance = new originalFlappyBraves(...args);
                        
                        // Guardar referencia global al juego
                        window.flappyBravesGame = gameInstance;
                        
                        // Aplicar sistemas de adicción
                        console.log('Juego inicializado, aplicando sistemas de adicción...');
                        applyAddictionSystems(gameInstance);
                        
                        return gameInstance;
                    };
                    
                    // Copiar propiedades del constructor original
                    Object.assign(window.FlappyBraves, originalFlappyBraves);
                    window.FlappyBraves.prototype = originalFlappyBraves.prototype;
                    
                    console.log('Clase FlappyBraves interceptada correctamente.');
                }
            }, 100);
            
            // Establecer un tiempo límite para evitar que el intervalo se ejecute indefinidamente
            setTimeout(() => {
                clearInterval(checkInterval);
                console.log('No se pudo interceptar la clase FlappyBraves después de 10 segundos.');
            }, 10000);
        }
    }
}); 