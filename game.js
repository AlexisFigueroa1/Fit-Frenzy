// ======================= INICIALIZACIÓN DEL JUEGO =======================
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Configurar tamaño del canvas
    resizeCanvas();
    
    // Cargar récord desde localStorage
    loadHighScore();
    
    // Crear jugador
    player = new Player();
    
    // Inicializar controles
    initControls();
    
    // Inicializar barra de vida
    updateHealthBar(player.health, player.maxHealth);
    
    // Inicializar UI de intensidad
    updateIntensityUI();
    
    // Generar lista de objetos
    generateItemsList();
    
    // Configurar botones
    setupButtons();
    
    // Dibujar pantalla de inicio
    drawStartScreen();
    
    // Iniciar bucle del juego
    gameLoop();
}

// Configurar botones
function setupButtons() {
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('resumeButton').addEventListener('click', resumeGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
    document.getElementById('playAgainButton').addEventListener('click', restartGame);
    document.getElementById('menuButton').addEventListener('click', () => GameScreens.showStartScreen());
    document.getElementById('menuButton2').addEventListener('click', () => GameScreens.showStartScreen());
    document.getElementById('resetRecordButton').addEventListener('click', resetHighScore);
}

// ======================= FUNCIONES PRINCIPALES DEL JUEGO =======================
function startGame() {
    gameState = GameState.PLAYING;
    GameScreens.hideStartScreen();
    resetGame();
    
    // Vibración de inicio
    if (navigator.vibrate && isMobile) {
        navigator.vibrate(100);
    }
}

function pauseGame() {
    if (gameState === GameState.PLAYING) {
        gameState = GameState.PAUSED;
        GameScreens.showPauseScreen();
    }
}

function resumeGame() {
    if (gameState === GameState.PAUSED) {
        gameState = GameState.PLAYING;
        GameScreens.hidePauseScreen();
    }
}

function restartGame() {
    gameState = GameState.PLAYING;
    GameScreens.hideStartScreen();
    GameScreens.hidePauseScreen();
    GameScreens.hideGameOverScreen();
    resetGame();
}

function resetGame() {
    player.reset();
    fallingObjects = [];
    spawnTimer = 0;
    spawnRate = GameConfig.initialSpawnRate;
    gameTime = 0;
    lastCollisionEffect = 0;
    objectsPerSpawn = 1;
    gameIntensity = 1.0;
    lastIntensityUpdate = 0;
    
    updateHealthBar(player.health, player.maxHealth);
    updateIntensityUI();
    updateUI(player.score, gameTime, player.health, player.maxHealth);
}

function spawnObject() {
    // Aumentar probabilidad de objetos malos según la intensidad
    const badProbability = Math.min(0.2 + gameIntensity * 0.05, 0.6);
    
    // Generar múltiples objetos según la intensidad
    for (let i = 0; i < objectsPerSpawn; i++) {
        // Pequeño retraso aleatorio para que no aparezcan todos exactamente al mismo tiempo
        const delay = Math.random() * 20;
        
        setTimeout(() => {
            const type = Math.random() < badProbability ? 'bad' : 'good';
            fallingObjects.push(new FallingObject(type, gameIntensity));
        }, delay);
    }
}

function updateGame() {
    // Actualizar temporizador de spawn
    spawnTimer++;
    if (spawnTimer >= spawnRate) {
        spawnObject();
        spawnTimer = 0;
    }
    
    // Actualizar intensidad basada en puntos
    updateGameIntensity();
    
    // Actualizar objetos que caen
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        const obj = fallingObjects[i];
        obj.update();
        
        // Verificar colisión con el jugador
        if (checkCollision(player.getBounds(), obj.getBounds())) {
            if (obj.type === 'good') {
                player.score += obj.value;
                
                // Vibración positiva
                if (navigator.vibrate && isMobile) {
                    navigator.vibrate(50);
                }
                
                // 20% de probabilidad de obtener boost de velocidad (aumentado para móvil)
                if (Math.random() < 0.20) {
                    player.applySpeedBoost();
                    showBoostIndicator();
                }
            } else {
                // Restar salud en lugar de una vida
                player.takeDamage(Math.abs(obj.value));
                
                // Vibración negativa
                if (navigator.vibrate && isMobile) {
                    navigator.vibrate([100, 50, 100]);
                }
                
                // Verificar si el jugador ha perdido toda su salud
                if (player.health <= 0) {
                    gameOver();
                    return;
                }
            }
            
            // Efecto visual de colisión
            lastCollisionEffect = gameTime;
            
            // Remover el objeto
            fallingObjects.splice(i, 1);
        } 
        // Remover objetos que salieron de la pantalla
        else if (obj.isOffScreen()) {
            fallingObjects.splice(i, 1);
        }
    }
    
    gameTime++;
}

function gameOver() {
    gameState = GameState.GAME_OVER;
    
    // Vibración de game over
    if (navigator.vibrate && isMobile) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    GameScreens.showGameOverScreen(player.score, gameIntensity, gameTime);
}

// ======================= DIBUJADO OPTIMIZADO PARA MÓVIL =======================
function drawBackground() {
    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, 0, GameConfig.baseHeight);
    gradient.addColorStop(0, '#0f0f25');
    gradient.addColorStop(1, '#1a1a35');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GameConfig.baseWidth, GameConfig.baseHeight);
    
    // Dibujar cuadrícula sutil
    ctx.strokeStyle = 'rgba(40, 40, 60, 0.3)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < GameConfig.baseWidth; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GameConfig.baseHeight);
        ctx.stroke();
    }
    
    for (let y = 0; y < GameConfig.baseHeight; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(GameConfig.baseWidth, y);
        ctx.stroke();
    }
    
    // Dibujar línea de suelo con efecto
    ctx.strokeStyle = '#3a6ea5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GameConfig.baseHeight - 30);
    ctx.lineTo(GameConfig.baseWidth, GameConfig.baseHeight - 30);
    ctx.stroke();
    
    // Efecto de brillo en el suelo
    ctx.strokeStyle = 'rgba(58, 110, 165, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, GameConfig.baseHeight - 29);
    ctx.lineTo(GameConfig.baseWidth, GameConfig.baseHeight - 29);
    ctx.stroke();
    
    // Indicador visual de intensidad
    ctx.fillStyle = `rgba(255, ${255 - Math.min(gameIntensity * 50, 200)}, ${255 - Math.min(gameIntensity * 100, 255)}, 0.1)`;
    ctx.fillRect(0, 0, GameConfig.baseWidth, GameConfig.baseHeight);
}

function drawObjects() {
    // Dibujar objetos que caen
    fallingObjects.forEach(obj => obj.draw(ctx));
    
    // Efecto visual de colisión (si ocurrió recientemente)
    if (gameTime - lastCollisionEffect < 10) {
        const flashColor = player.health > 0 ? 'rgba(255, 255, 100, 0.7)' : 'rgba(255, 50, 50, 0.7)';
        ctx.strokeStyle = flashColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        // Efecto de partículas
        if (gameTime % 2 === 0) {
            ctx.fillStyle = flashColor;
            for (let i = 0; i < 5; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 60;
                const x = player.x + player.width/2 + Math.cos(angle) * distance;
                const y = player.y + player.height/2 + Math.sin(angle) * distance;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawGameScreen() {
    drawBackground();
    drawObjects();
    player.draw(ctx);
}

function drawStartScreen() {
    drawBackground();
    
    // Texto de bienvenida en el canvas
    ctx.fillStyle = '#3a6ea5';
    ctx.font = 'bold 32px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#3a6ea5';
    ctx.shadowBlur = 10;
    ctx.fillText('FIT FRENZY', GameConfig.baseWidth/2, GameConfig.baseHeight/4);
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f0f0f0';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText('Toca "COMENZAR JUEGO"', GameConfig.baseWidth/2, GameConfig.baseHeight/2);
}

// ======================= FUNCIONES DE UTILIDAD PARA MÓVIL =======================
// Redimensionar canvas para móvil
function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Ajustar tamaño del canvas
    canvas.width = GameConfig.baseWidth;
    canvas.height = GameConfig.baseHeight;
    
    // Calcular escala para mantener relación de aspecto
    const scaleX = width / GameConfig.baseWidth;
    const scaleY = height / GameConfig.baseHeight;
    canvasScale = Math.min(scaleX, scaleY);
    
    // Aplicar transformación de escala
    canvas.style.width = (GameConfig.baseWidth * canvasScale) + 'px';
    canvas.style.height = (GameConfig.baseHeight * canvasScale) + 'px';
}

// ======================= BUCLE PRINCIPAL DEL JUEGO OPTIMIZADO =======================
function gameLoop() {
    if (gameState === GameState.PLAYING) {
        // Procesar controles
        processControls();
        
        // Actualizar jugador
        player.update(gameTime);
        
        // Actualizar juego
        updateGame();
        
        // Dibujar juego
        drawGameScreen();
        
        // Actualizar UI
        updateUI(player.score, gameTime, player.health, player.maxHealth);
    }
    
    // Continuar el bucle
    requestAnimationFrame(gameLoop);
}

// ======================= INICIALIZACIÓN =======================
// Event listeners para redimensionamiento
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
});

// Prevenir acciones por defecto en móvil
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

// Prevenir el comportamiento por defecto de deslizar en iOS
document.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) { 
        e.preventDefault(); 
    }
}, { passive: false });

// Iniciar el juego cuando se carga la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
