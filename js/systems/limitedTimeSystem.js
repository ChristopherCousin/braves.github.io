/**
 * Sistema de Eventos y Elementos de Tiempo Limitado
 * Este sistema implementa eventos y elementos que solo están disponibles
 * durante un tiempo limitado para generar FOMO (Fear Of Missing Out).
 */

class LimitedTimeSystem {
    constructor(game) {
        this.game = game;
        
        // Eventos limitados
        this.limitedTimeEvents = [
            {
                id: 'goldenWeekend',
                name: 'Fin de Semana Dorado',
                description: 'Todas las recompensas valen el doble. ¡Solo este fin de semana!',
                startDate: new Date(Date.now() + 86400000 * 2), // En 2 días
                endDate: new Date(Date.now() + 86400000 * 4), // Dura 2 días
                rewardMultiplier: 2,
                iconUrl: '🏆',
                isActive: false,
                hasParticipated: false
            },
            {
                id: 'exclusiveSkin',
                name: 'Skin Exclusiva Limitada',
                description: 'Desbloquea la skin legendaria "Fénix de Fuego". ¡Nunca volverá a estar disponible!',
                startDate: new Date(Date.now() + 86400000 * 5), // En 5 días
                endDate: new Date(Date.now() + 86400000 * 8), // Dura 3 días
                requiredScore: 100,
                iconUrl: '🔥',
                isActive: false,
                hasParticipated: false
            }
        ];
        
        // Elementos exclusivos que desaparecerán
        this.limitedTimeItems = [
            {
                id: 'goldenWings',
                name: 'Alas Doradas',
                description: 'Skin exclusiva disponible solo durante 48 horas',
                expiryDate: new Date(Date.now() + 86400000 * 2), // 2 días
                iconUrl: '👑',
                price: 500,
                purchased: false
            }
        ];
        
        // Cargar datos guardados
        this.loadLimitedTimeData();
    }
    
    /**
     * Carga los datos de eventos y elementos de tiempo limitado
     */
    loadLimitedTimeData() {
        try {
            const savedEvents = localStorage.getItem('flappyBravesLimitedEvents');
            if (savedEvents) {
                const events = JSON.parse(savedEvents);
                // Actualizar solo las propiedades que necesitamos persistir
                events.forEach((savedEvent, index) => {
                    if (index < this.limitedTimeEvents.length) {
                        this.limitedTimeEvents[index].hasParticipated = savedEvent.hasParticipated || false;
                    }
                });
            }
            
            const savedItems = localStorage.getItem('flappyBravesLimitedItems');
            if (savedItems) {
                const items = JSON.parse(savedItems);
                // Actualizar solo las propiedades que necesitamos persistir
                items.forEach((savedItem, index) => {
                    if (index < this.limitedTimeItems.length) {
                        this.limitedTimeItems[index].purchased = savedItem.purchased || false;
                    }
                });
            }
        } catch (e) {
            console.error('Error cargando datos de tiempo limitado:', e);
        }
    }
    
    /**
     * Guarda los datos de eventos y elementos de tiempo limitado
     */
    saveLimitedTimeData() {
        try {
            // Guardar solo las propiedades que necesitamos persistir
            const eventsToSave = this.limitedTimeEvents.map(event => ({
                id: event.id,
                hasParticipated: event.hasParticipated
            }));
            
            const itemsToSave = this.limitedTimeItems.map(item => ({
                id: item.id,
                purchased: item.purchased
            }));
            
            localStorage.setItem('flappyBravesLimitedEvents', JSON.stringify(eventsToSave));
            localStorage.setItem('flappyBravesLimitedItems', JSON.stringify(itemsToSave));
        } catch (e) {
            console.error('Error guardando datos de tiempo limitado:', e);
        }
    }
    
    /**
     * Actualiza el estado de eventos y elementos de tiempo limitado
     */
    update() {
        const currentDate = new Date();
        
        // Actualizar estado de eventos
        this.limitedTimeEvents.forEach(event => {
            event.isActive = currentDate >= event.startDate && currentDate <= event.endDate;
        });
        
        // Comprobar si hay eventos activos que mostrar
        const activeEvents = this.limitedTimeEvents.filter(event => 
            event.isActive && !event.hasParticipated
        );
        
        if (activeEvents.length > 0) {
            this.showLimitedTimeEventNotification(activeEvents[0]);
        }
        
        // Comprobar elementos de tiempo limitado
        const availableLimitedItems = this.limitedTimeItems.filter(item => 
            !item.purchased && currentDate <= item.expiryDate
        );
        
        if (availableLimitedItems.length > 0) {
            // Mostrar notificación de elementos que expirarán pronto
            const soonToExpireItems = availableLimitedItems.filter(item => {
                const timeToExpiry = item.expiryDate.getTime() - currentDate.getTime();
                const hoursToExpiry = timeToExpiry / (1000 * 60 * 60);
                return hoursToExpiry <= 24; // Mostrar si expira en menos de 24 horas
            });
            
            if (soonToExpireItems.length > 0) {
                this.showExpiringItemsNotification(soonToExpireItems);
            }
        }
    }
    
    /**
     * Muestra una notificación de evento de tiempo limitado
     * @param {Object} event - Evento de tiempo limitado
     */
    showLimitedTimeEventNotification(event) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'limited-event-notification';
        notification.style.position = 'absolute';
        notification.style.zIndex = '1000';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
        notification.style.padding = '15px';
        notification.style.borderRadius = '10px';
        notification.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        notification.style.color = '#000';
        notification.style.maxWidth = '300px';
        notification.style.animation = 'pulse 1s infinite alternate';
        
        // Calcular tiempo restante
        const timeRemaining = event.endDate.getTime() - new Date().getTime();
        const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        // Contenido de la notificación
        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="font-size: 30px; margin-right: 10px;">${event.iconUrl}</div>
                <div style="font-size: 18px; font-weight: bold;">${event.name}</div>
            </div>
            <div style="font-size: 14px; margin-bottom: 10px;">${event.description}</div>
            <div style="font-size: 14px; color: #FF0000; font-weight: bold; margin-bottom: 15px;">
                ¡TERMINA EN ${daysRemaining}D ${hoursRemaining}H!
            </div>
            <button id="event-details-btn" style="padding: 8px 15px; background-color: #FF0000; color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%;">¡Participar ahora!</button>
        `;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(notification);
        
        // Añadir evento al botón
        document.getElementById('event-details-btn').addEventListener('click', () => {
            notification.remove();
            this.showEventDetails(event);
        });
        
        // Eliminar después de un tiempo si el usuario no interactúa
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('notification-fade-out');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 10000); // 10 segundos
    }
    
    /**
     * Muestra los detalles de un evento de tiempo limitado
     * @param {Object} event - Evento de tiempo limitado
     */
    showEventDetails(event) {
        // Crear overlay para los detalles
        const detailsOverlay = document.createElement('div');
        detailsOverlay.className = 'event-details-overlay';
        detailsOverlay.style.position = 'absolute';
        detailsOverlay.style.zIndex = '1000';
        detailsOverlay.style.top = '0';
        detailsOverlay.style.left = '0';
        detailsOverlay.style.width = '100%';
        detailsOverlay.style.height = '100%';
        detailsOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        detailsOverlay.style.display = 'flex';
        detailsOverlay.style.justifyContent = 'center';
        detailsOverlay.style.alignItems = 'center';
        
        // Calcular tiempo restante
        const timeRemaining = event.endDate.getTime() - new Date().getTime();
        const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        // Crear el contenedor de detalles
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'event-details-container';
        detailsContainer.style.backgroundColor = 'rgba(50, 50, 50, 0.95)';
        detailsContainer.style.borderRadius = '15px';
        detailsContainer.style.padding = '30px';
        detailsContainer.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
        detailsContainer.style.textAlign = 'center';
        detailsContainer.style.maxWidth = '80%';
        detailsContainer.style.color = 'white';
        
        // Contenido de los detalles
        detailsContainer.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 10px;">${event.iconUrl}</div>
            <div style="font-size: 28px; color: #FFD700; margin-bottom: 20px;">${event.name}</div>
            <div style="font-size: 18px; margin-bottom: 30px;">${event.description}</div>
            
            <div style="background-color: rgba(255, 0, 0, 0.3); padding: 15px; border-radius: 10px; margin-bottom: 30px;">
                <div style="font-size: 16px; margin-bottom: 10px;">¡EVENTO DE TIEMPO LIMITADO!</div>
                <div style="font-size: 20px; font-weight: bold;">
                    ${daysRemaining}D ${hoursRemaining}H ${minutesRemaining}M RESTANTES
                </div>
            </div>
            
            <div style="font-size: 18px; margin-bottom: 20px;">
                ${this.getEventSpecificContent(event)}
            </div>
            
            <button id="participate-btn" style="padding: 15px 30px; font-size: 18px; background-color: #FF0000; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 15px;">PARTICIPAR AHORA</button>
            <button id="close-details-btn" style="padding: 10px 20px; font-size: 14px; background-color: transparent; color: #999; border: 1px solid #999; border-radius: 5px; cursor: pointer;">Cerrar</button>
        `;
        
        // Añadir al DOM
        detailsOverlay.appendChild(detailsContainer);
        this.game.gameCanvas.parentElement.appendChild(detailsOverlay);
        
        // Añadir eventos a los botones
        document.getElementById('participate-btn').addEventListener('click', () => {
            // Marcar como participado
            event.hasParticipated = true;
            this.saveLimitedTimeData();
            
            // Aplicar efectos del evento
            this.applyEventEffects(event);
            
            // Cerrar detalles
            detailsOverlay.remove();
        });
        
        document.getElementById('close-details-btn').addEventListener('click', () => {
            detailsOverlay.remove();
        });
    }
    
    /**
     * Obtiene contenido específico para cada tipo de evento
     * @param {Object} event - Evento de tiempo limitado
     * @returns {string} HTML con contenido específico del evento
     */
    getEventSpecificContent(event) {
        switch (event.id) {
            case 'goldenWeekend':
                return `
                    <div style="margin-bottom: 15px;">Durante este evento, todas las recompensas que obtengas valdrán el doble.</div>
                    <div style="font-size: 24px; color: #FFD700; margin-bottom: 15px;">¡MULTIPLICADOR x${event.rewardMultiplier}!</div>
                    <div>¡No pierdas esta oportunidad única de acumular monedas rápidamente!</div>
                `;
            case 'exclusiveSkin':
                return `
                    <div style="margin-bottom: 15px;">Consigue una puntuación de ${event.requiredScore} puntos durante este evento para desbloquear la skin exclusiva.</div>
                    <div style="font-size: 24px; color: #FF5722; margin: 15px 0;">🔥 "Fénix de Fuego" 🔥</div>
                    <div style="color: #FF0000; font-weight: bold; margin-bottom: 15px;">¡NUNCA VOLVERÁ A ESTAR DISPONIBLE!</div>
                `;
            default:
                return `<div>Participa en este evento exclusivo por tiempo limitado.</div>`;
        }
    }
    
    /**
     * Aplica los efectos específicos de cada evento
     * @param {Object} event - Evento de tiempo limitado
     */
    applyEventEffects(event) {
        switch (event.id) {
            case 'goldenWeekend':
                // Aplicar multiplicador de recompensas
                if (this.game.rewardSystem) {
                    // Guardar multiplicador en localStorage para que persista entre sesiones
                    try {
                        localStorage.setItem('flappyBravesEventMultiplier', JSON.stringify({
                            multiplier: event.rewardMultiplier,
                            endDate: event.endDate.getTime()
                        }));
                    } catch (e) {
                        console.error('Error guardando multiplicador de evento:', e);
                    }
                    
                    // Mostrar mensaje de confirmación
                    this.showEventConfirmation('¡Multiplicador Activado!', `Todas las recompensas valen x${event.rewardMultiplier} hasta que termine el evento.`);
                }
                break;
            case 'exclusiveSkin':
                // Activar desafío de skin exclusiva
                try {
                    localStorage.setItem('flappyBravesSkinChallenge', JSON.stringify({
                        skinId: 'phoenixFire',
                        requiredScore: event.requiredScore,
                        endDate: event.endDate.getTime()
                    }));
                } catch (e) {
                    console.error('Error guardando desafío de skin:', e);
                }
                
                // Mostrar mensaje de confirmación
                this.showEventConfirmation('¡Desafío Activado!', `Consigue ${event.requiredScore} puntos antes de que termine el evento para desbloquear la skin exclusiva.`);
                break;
        }
    }
    
    /**
     * Muestra una notificación de elementos que expirarán pronto
     * @param {Array} items - Elementos que expirarán pronto
     */
    showExpiringItemsNotification(items) {
        // Solo mostrar notificación para el primer elemento
        const item = items[0];
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'expiring-item-notification';
        notification.style.position = 'absolute';
        notification.style.zIndex = '1000';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
        notification.style.padding = '15px';
        notification.style.borderRadius = '10px';
        notification.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
        notification.style.color = 'white';
        notification.style.maxWidth = '300px';
        notification.style.animation = 'pulse 1s infinite alternate';
        
        // Calcular tiempo restante
        const timeRemaining = item.expiryDate.getTime() - new Date().getTime();
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        // Contenido de la notificación
        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="font-size: 30px; margin-right: 10px;">${item.iconUrl}</div>
                <div style="font-size: 18px; font-weight: bold;">${item.name}</div>
            </div>
            <div style="font-size: 14px; margin-bottom: 10px;">${item.description}</div>
            <div style="font-size: 14px; color: #FFFFFF; font-weight: bold; margin-bottom: 15px;">
                ¡DESAPARECE EN ${hoursRemaining}H ${minutesRemaining}M!
            </div>
            <button id="item-details-btn" style="padding: 8px 15px; background-color: #FFFFFF; color: #FF0000; border: none; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold;">¡Obtener ahora!</button>
        `;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(notification);
        
        // Añadir evento al botón
        document.getElementById('item-details-btn').addEventListener('click', () => {
            notification.remove();
            this.showItemDetails(item);
        });
        
        // Eliminar después de un tiempo si el usuario no interactúa
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('notification-fade-out');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 10000); // 10 segundos
    }
    
    /**
     * Muestra los detalles de un elemento de tiempo limitado
     * @param {Object} item - Elemento de tiempo limitado
     */
    showItemDetails(item) {
        // Implementación similar a showEventDetails pero para elementos
        // ...
    }
    
    /**
     * Muestra un mensaje de confirmación de evento
     * @param {string} title - Título del mensaje
     * @param {string} message - Contenido del mensaje
     */
    showEventConfirmation(title, message) {
        // Crear elemento para el mensaje
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'event-confirmation-message';
        confirmationMessage.style.position = 'absolute';
        confirmationMessage.style.zIndex = '1000';
        confirmationMessage.style.top = '50%';
        confirmationMessage.style.left = '50%';
        confirmationMessage.style.transform = 'translate(-50%, -50%)';
        confirmationMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        confirmationMessage.style.padding = '20px';
        confirmationMessage.style.borderRadius = '10px';
        confirmationMessage.style.color = 'white';
        confirmationMessage.style.textAlign = 'center';
        confirmationMessage.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        
        // Contenido del mensaje
        confirmationMessage.innerHTML = `
            <div style="font-size: 24px; color: #FFD700; margin-bottom: 10px;">${title}</div>
            <div style="font-size: 16px; margin-bottom: 20px;">${message}</div>
            <button id="event-confirm-btn" style="padding: 10px 20px; font-size: 16px; background-color: #FFD700; color: black; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">¡Entendido!</button>
        `;
        
        // Añadir al DOM
        this.game.gameCanvas.parentElement.appendChild(confirmationMessage);
        
        // Añadir evento al botón
        document.getElementById('event-confirm-btn').addEventListener('click', () => {
            confirmationMessage.remove();
        });
        
        // Eliminar después de un tiempo si el usuario no interactúa
        setTimeout(() => {
            if (document.body.contains(confirmationMessage)) {
                confirmationMessage.remove();
            }
        }, 5000);
    }
    
    /**
     * Inicializa el sistema
     */
    initialize() {
        // Actualizar estado de eventos y elementos
        this.update();
        
        // Programar actualizaciones periódicas
        setInterval(() => {
            this.update();
        }, 60000); // Comprobar cada minuto
    }
}

// Exportar la clase
export default LimitedTimeSystem; 