// ======================= LOCALSTORAGE FUNCTIONS =======================
function loadHighScore() {
    try {
        const savedHighScore = localStorage.getItem('fitFrenzyHighScore');
        if (savedHighScore) {
            highScore = JSON.parse(savedHighScore);
            console.log('High score loaded:', highScore);
        }
    } catch (error) {
        console.error('Error loading high score:', error);
        highScore = { score: 0, intensity: 1.0, time: 0, date: null };
    }
    updateHighScoreDisplay();
}

function saveHighScore() {
    try {
        localStorage.setItem('fitFrenzyHighScore', JSON.stringify(highScore));
        console.log('High score saved:', highScore);
    } catch (error) {
        console.error('Error saving high score:', error);
    }
}

function updateHighScoreDisplay() {
    // Actualizar en pantalla de inicio
    const startRecordScore = document.getElementById('startRecordScore');
    const startRecordDetails = document.getElementById('startRecordDetails');
    
    if (startRecordScore) {
        startRecordScore.textContent = highScore.score;
    }
    
    if (startRecordDetails) {
        const minutes = Math.floor(highScore.time / 3600);
        const seconds = Math.floor((highScore.time % 3600) / 60);
        const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        let detailsText = `Intensidad: ${highScore.intensity.toFixed(1)}x | Tiempo: ${timeFormatted}`;
        if (highScore.date) {
            const date = new Date(highScore.date);
            detailsText += ` | Fecha: ${date.toLocaleDateString()}`;
        }
        startRecordDetails.textContent = detailsText;
    }
}

function checkAndUpdateHighScore(finalScore, finalIntensity, finalTime) {
    let isNewRecord = false;
    
    // Solo actualizar si es mayor puntuación
    if (finalScore > highScore.score) {
        isNewRecord = true;
        highScore = {
            score: finalScore,
            intensity: finalIntensity,
            time: finalTime,
            date: new Date().toISOString()
        };
        saveHighScore();
        updateHighScoreDisplay();
    }
    
    return isNewRecord;
}

function resetHighScore() {
    if (confirm('¿Estás seguro de que quieres reiniciar tu récord? Esta acción no se puede deshacer.')) {
        highScore = { score: 0, intensity: 1.0, time: 0, date: null };
        saveHighScore();
        updateHighScoreDisplay();
        alert('Récord reiniciado correctamente.');
    }
}

// ======================= FUNCIONES DE DIFICULTAD =======================
function updateGameIntensity() {
    // Calcular intensidad basada en los puntos (cada 100 puntos aumenta la intensidad)
    const intensityLevel = 1 + Math.floor(player.score / 100);
    
    // La intensidad aumenta progresivamente, no por saltos
    const targetIntensity = 1.0 + (intensityLevel * 0.1);
    
    // Suavizar el cambio de intensidad
    if (targetIntensity > gameIntensity) {
        gameIntensity += 0.001; // Aumento muy suave por frame
        gameIntensity = Math.min(gameIntensity, targetIntensity);
    }
    
    // Actualizar UI de intensidad
    updateIntensityUI();
    
    // Actualizar spawn rate basado en intensidad
    spawnRate = Math.max(GameConfig.minSpawnRate, GameConfig.initialSpawnRate / gameIntensity);
    
    // Actualizar objetos por spawn basado en intensidad
    objectsPerSpawn = Math.min(1 + Math.floor(gameIntensity), 5);
    
    // Si hemos alcanzado un nuevo múltiplo de 100 puntos, hacer efecto
    if (player.score >= lastIntensityUpdate + 100) {
        lastIntensityUpdate = player.score - (player.score % 100);
        showIntensityIncreaseEffect();
    }
}

function updateIntensityUI() {
    const intensityElement = document.getElementById('intensity');
    const intensityFill = document.getElementById('intensityFill');
    
    if (intensityElement) {
        intensityElement.textContent = `${gameIntensity.toFixed(1)}x`;
        
        // Cambiar color según la intensidad
        if (gameIntensity < 2.0) {
            intensityElement.style.color = '#64c864';
        } else if (gameIntensity < 3.0) {
            intensityElement.style.color = '#ffd700';
        } else {
            intensityElement.style.color = '#dc4646';
        }
    }
    
    if (intensityFill) {
        // Calcular porcentaje de intensidad (máximo 5x = 100%)
        const intensityPercent = Math.min((gameIntensity - 1) / 4 * 100, 100);
        intensityFill.style.width = `${intensityPercent}%`;
        
        // Cambiar color del relleno según intensidad
        if (gameIntensity < 2.0) {
            intensityFill.style.background = 'linear-gradient(90deg, #64c864, #8cec8c)';
        } else if (gameIntensity < 3.0) {
            intensityFill.style.background = 'linear-gradient(90deg, #ffd700, #ffec8b)';
        } else {
            intensityFill.style.background = 'linear-gradient(90deg, #dc4646, #ff6b6b)';
        }
    }
}

function showIntensityIncreaseEffect() {
    // Efecto visual de aumento de intensidad
    const effect = document.createElement('div');
    effect.style.position = 'absolute';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.fontSize = '24px';
    effect.style.fontWeight = 'bold';
    effect.style.color = '#ffd700';
    effect.style.textShadow = '0 0 10px #ffd700';
    effect.style.zIndex = '100';
    effect.style.pointerEvents = 'none';
    effect.textContent = `¡INTENSIDAD ${gameIntensity.toFixed(1)}x!`;
    
    document.getElementById('gameContainer').appendChild(effect);
    
    // Animación
    const animation = effect.animate([
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1.2)' },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(1.5)' }
    ], {
        duration: 1500,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    animation.onfinish = () => {
        effect.remove();
    };
    
    // Vibración
    if (navigator.vibrate && isMobile) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Verificar colisiones (optimizado para móvil)
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// ======================= GENERAR LISTA DE OBJETOS =======================
function generateItemsList() {
    const goodItemsList = document.getElementById('goodItemsList');
    const badItemsList = document.getElementById('badItemsList');
    
    // Limpiar listas existentes
    goodItemsList.innerHTML = '';
    badItemsList.innerHTML = '';
    
    // Generar lista de objetos buenos
    GameConfig.goodItems.forEach(item => {
        const objectItem = document.createElement('div');
        objectItem.className = 'object-item';
        objectItem.innerHTML = `
            <span class="object-bullet" style="color: ${item.color}">●</span>
            <span class="object-name" style="color: ${item.color}">${item.name} (+${item.value}p)</span>
        `;
        goodItemsList.appendChild(objectItem);
    });
    
    // Generar lista de objetos malos
    GameConfig.badItems.forEach(item => {
        const damage = Math.abs(item.value);
        const objectItem = document.createElement('div');
        objectItem.className = 'object-item';
        objectItem.innerHTML = `
            <span class="object-bullet" style="color: ${item.color}">●</span>
            <span class="object-name" style="color: ${item.color}">${item.name} (-${damage} salud)</span>
        `;
        badItemsList.appendChild(objectItem);
    });
}
