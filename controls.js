// ======================= CONTROLES TÁCTILES OPTIMIZADOS =======================
function initControls() {
    // Controles de teclado (para debugging en desktop)
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        
        if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            if (gameState === GameState.PLAYING) {
                pauseGame();
            } else if (gameState === GameState.PAUSED) {
                resumeGame();
            }
        }
        
        if (e.key === 'Escape') {
            if (gameState === GameState.PLAYING) {
                pauseGame();
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Controles táctiles optimizados
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');
    
    // Función para crear efecto visual al tocar
    function createTouchEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'touch-feedback';
        effect.style.left = (x - 40) + 'px';
        effect.style.top = (y - 40) + 'px';
        document.getElementById('gameContainer').appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 500);
    }
    
    // Eventos para botón izquierdo
    const leftEvents = {
        start: (e) => {
            e.preventDefault();
            e.stopPropagation();
            keys['arrowleft'] = true;
            keys['arrowright'] = false;
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            createTouchEffect(touch.clientX, touch.clientY);
        },
        end: (e) => {
            e.preventDefault();
            e.stopPropagation();
            keys['arrowleft'] = false;
        }
    };
    
    // Eventos para botón derecho
    const rightEvents = {
        start: (e) => {
            e.preventDefault();
            e.stopPropagation();
            keys['arrowright'] = true;
            keys['arrowleft'] = false;
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            createTouchEffect(touch.clientX, touch.clientY);
        },
        end: (e) => {
            e.preventDefault();
            e.stopPropagation();
            keys['arrowright'] = false;
        }
    };
    
    // Asignar eventos a botones
    ['touchstart', 'mousedown'].forEach(event => {
        leftButton.addEventListener(event, leftEvents.start, {passive: false});
        rightButton.addEventListener(event, rightEvents.start, {passive: false});
    });
    
    ['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(event => {
        leftButton.addEventListener(event, leftEvents.end, {passive: false});
        rightButton.addEventListener(event, rightEvents.end, {passive: false});
    });
    
    // Control por gestos (deslizar)
    document.addEventListener('touchstart', (e) => {
        if (gameState !== GameState.PLAYING) return;
        
        touchStartX = e.touches[0].clientX;
        isTouching = true;
        
        // Crear efecto visual
        createTouchEffect(e.touches[0].clientX, e.touches[0].clientY);
    }, {passive: false});
    
    document.addEventListener('touchmove', (e) => {
        if (gameState !== GameState.PLAYING || !isTouching) return;
        
        const touchX = e.touches[0].clientX;
        const diff = touchX - touchStartX;
        
        if (Math.abs(diff) > 10) {
            if (diff > 0) {
                keys['arrowleft'] = false;
                keys['arrowright'] = true;
            } else {
                keys['arrowleft'] = true;
                keys['arrowright'] = false;
            }
            touchStartX = touchX;
        }
    }, {passive: false});
    
    document.addEventListener('touchend', () => {
        keys['arrowleft'] = false;
        keys['arrowright'] = false;
        isTouching = false;
    }, {passive: false});
}

// Procesar controles
function processControls() {
    // Movimiento del jugador
    if (keys['arrowleft'] || keys['a']) {
        player.move('left');
    }
    if (keys['arrowright'] || keys['d']) {
        player.move('right');
    }
}
