// ======================= FUNCIONES DE LA UI =======================
const uiElements = {
    score: document.getElementById('score'),
    intensity: document.getElementById('intensity'),
    time: document.getElementById('time'),
    healthFill: document.getElementById('healthFill'),
    healthText: document.getElementById('healthText'),
    boostIndicator: document.getElementById('boostIndicator'),
    damageEffect: document.getElementById('damageEffect'),
    startScreen: document.getElementById('startScreen'),
    pauseScreen: document.getElementById('pauseScreen'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    finalScore: document.getElementById('finalScore'),
    finalIntensity: document.getElementById('finalIntensity'),
    finalTime: document.getElementById('finalTime'),
    recordScore: document.getElementById('recordScore'),
    recordDetails: document.getElementById('recordDetails'),
    recordContainer: document.getElementById('recordContainer'),
    newRecordMessage: document.getElementById('newRecordMessage')
};

// Actualizar la barra de vida
function updateHealthBar(health, maxHealth) {
    const percentage = (health / maxHealth) * 100;
    uiElements.healthFill.style.width = `${percentage}%`;
    uiElements.healthText.textContent = `${Math.round(percentage)}%`;
    
    // Cambiar color de la barra según la salud
    if (percentage > 60) {
        uiElements.healthFill.style.background = 'linear-gradient(90deg, #64c864, #8cec8c)';
    } else if (percentage > 30) {
        uiElements.healthFill.style.background = 'linear-gradient(90deg, #ffd700, #ffec8b)';
    } else {
        uiElements.healthFill.style.background = 'linear-gradient(90deg, #dc4646, #ff6b6b)';
    }
}

// Mostrar efecto de daño (parpadeo rojo)
function showDamageEffect() {
    uiElements.damageEffect.style.opacity = '0.5';
    
    setTimeout(() => {
        uiElements.damageEffect.style.opacity = '0';
    }, 200);
}

// Actualizar toda la UI
function updateUI(score, gameTime, health, maxHealth) {
    uiElements.score.textContent = score;
    updateHealthBar(health, maxHealth);
    
    // Formatear tiempo (mm:ss)
    const minutes = Math.floor(gameTime / 3600);
    const seconds = Math.floor((gameTime % 3600) / 60);
    uiElements.time.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Mostrar indicador de boost con vibración (si está disponible)
function showBoostIndicator() {
    uiElements.boostIndicator.style.display = 'block';
    
    // Vibración en dispositivos móviles
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    setTimeout(() => {
        uiElements.boostIndicator.style.display = 'none';
    }, 1500);
}

// Pantallas del juego
const GameScreens = {
    showStartScreen: () => {
        uiElements.startScreen.classList.remove('hidden');
        uiElements.pauseScreen.classList.add('hidden');
        uiElements.gameOverScreen.classList.add('hidden');
        gameState = GameState.START;
    },
    
    hideStartScreen: () => {
        uiElements.startScreen.classList.add('hidden');
    },
    
    showPauseScreen: () => {
        uiElements.pauseScreen.classList.remove('hidden');
    },
    
    hidePauseScreen: () => {
        uiElements.pauseScreen.classList.add('hidden');
    },
    
    showGameOverScreen: (score, intensity, gameTime) => {
        uiElements.finalScore.textContent = score;
        uiElements.finalIntensity.textContent = `${intensity.toFixed(1)}x`;
        
        const minutes = Math.floor(gameTime / 3600);
        const seconds = Math.floor((gameTime % 3600) / 60);
        uiElements.finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Actualizar el récord en pantalla de game over
        uiElements.recordScore.textContent = highScore.score;
        
        const recordMinutes = Math.floor(highScore.time / 3600);
        const recordSeconds = Math.floor((highScore.time % 3600) / 60);
        const recordTimeFormatted = `${recordMinutes.toString().padStart(2, '0')}:${recordSeconds.toString().padStart(2, '0')}`;
        
        let detailsText = `Intensidad: ${highScore.intensity.toFixed(1)}x | Tiempo: ${recordTimeFormatted}`;
        if (highScore.date) {
            const date = new Date(highScore.date);
            detailsText += ` | Fecha: ${date.toLocaleDateString()}`;
        }
        uiElements.recordDetails.textContent = detailsText;
        
        // Verificar si es nuevo récord
        const isNewRecord = checkAndUpdateHighScore(score, intensity, gameTime);
        
        if (isNewRecord) {
            uiElements.newRecordMessage.style.display = 'block';
            uiElements.recordContainer.classList.add('new-record');
            
            // Efecto de confeti
            createConfettiEffect();
        } else {
            uiElements.newRecordMessage.style.display = 'none';
            uiElements.recordContainer.classList.remove('new-record');
        }
        
        uiElements.gameOverScreen.classList.remove('hidden');
    },
    
    hideGameOverScreen: () => {
        uiElements.gameOverScreen.classList.add('hidden');
        uiElements.newRecordMessage.style.display = 'none';
        uiElements.recordContainer.classList.remove('new-record');
    }
};

// Efecto de confeti para nuevo récord
function createConfettiEffect() {
    const confettiCount = 50;
    const colors = ['#ffd700', '#ff6b6b', '#64c864', '#40b4dc', '#d878d8'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.top = '50%';
        confetti.style.left = '50%';
        confetti.style.zIndex = '100';
        confetti.style.pointerEvents = 'none';
        
        document.getElementById('gameContainer').appendChild(confetti);
        
        // Animación
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200;
        const duration = 1000 + Math.random() * 1000;
        
        const animation = confetti.animate([
            { 
                transform: 'translate(-50%, -50%) rotate(0deg)',
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(360deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}
