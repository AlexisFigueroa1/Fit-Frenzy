 <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Fit Frenzy - Arcade Fitness Game</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Courier New', monospace;
            -webkit-tap-highlight-color: transparent;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
        }
        
        body {
            background-color: #0a0a1a;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
            color: #f0f0f0;
            touch-action: manipulation;
        }
        
        #gameContainer {
            position: relative;
            text-align: center;
            width: 100vw;
            height: 100vh;
            margin: 0;
            overflow: hidden;
        }
        
        canvas {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #0f0f25;
            display: block;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
            touch-action: none;
        }
        
        /* UI optimizada para móvil */
        #ui {
            position: absolute;
            top: 10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 0 10px;
            pointer-events: none;
            z-index: 5;
        }
        
        #scoreContainer, #centerUI, #healthContainer {
            background-color: rgba(0, 0, 0, 0.8);
            padding: 6px 10px;
            border-radius: 8px;
            border: 2px solid #3a6ea5;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 75px;
            backdrop-filter: blur(5px);
        }
        
        #scoreLabel, #intensityLabel, #timeLabel, #healthLabel {
            font-size: 10px;
            margin-bottom: 2px;
        }
        
        #scoreLabel { color: #64c864; }
        #intensityLabel { color: #ffd700; }
        #timeLabel { color: #40b4dc; }
        #healthLabel { color: #dc4646; margin-bottom: 4px; }
        
        #score, #intensity, #time {
            font-weight: bold;
            color: #ffffff;
        }
        
        #score {
            font-size: 18px;
            text-shadow: 0 0 5px #64c864;
        }
        
        #intensity {
            font-size: 16px;
            color: #ffd700;
            text-shadow: 0 0 5px #ffd700;
        }
        
        #time {
            font-size: 14px;
        }
        
        /* Barra de vida */
        #healthBar {
            width: 80px;
            height: 12px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
        }
        
        #healthFill {
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, #dc4646, #ff6b6b, #64c864);
            border-radius: 5px;
            transition: width 0.3s ease;
            position: relative;
        }
        
        #healthText {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 9px;
            font-weight: bold;
            color: white;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
            z-index: 1;
        }
        
        /* Pantallas optimizadas para móvil */
        .screen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: rgba(10, 10, 26, 0.98);
            z-index: 10;
            text-align: center;
            padding: 15px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
        
        .screen.hidden {
            display: none;
        }
        
        /* Botones optimizados para toque */
        button {
            background: linear-gradient(145deg, #3a6ea5, #2d5685);
            color: white;
            border: none;
            padding: 14px 25px;
            margin: 10px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            touch-action: manipulation;
            min-height: 55px;
            min-width: 180px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        button:active {
            transform: scale(0.95);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .pulse {
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 4px 15px rgba(58, 110, 165, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 6px 20px rgba(58, 110, 165, 0.6); }
            100% { transform: scale(1); box-shadow: 0 4px 15px rgba(58, 110, 165, 0.4); }
        }
        
        /* Pantalla de inicio optimizada para móvil */
        .title {
            font-size: 28px;
            margin-bottom: 8px;
            color: #3a6ea5;
            text-shadow: 0 0 10px #3a6ea5;
            line-height: 1.2;
        }
        
        .subtitle {
            font-size: 14px;
            margin-bottom: 12px;
            color: #ffffff;
            line-height: 1.3;
            padding: 0 8px;
        }
        
        .instructions {
            font-size: 18px;
            margin: 12px 0;
            color: #ffd700;
            text-shadow: 0 0 5px #ffd700;
        }
        
        .controls {
            margin: 12px 0;
            color: #ffffff;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 6px;
        }
        
        .key {
            display: inline-block;
            background: linear-gradient(145deg, #555, #333);
            color: white;
            padding: 4px 10px;
            border-radius: 6px;
            border: 2px solid #666;
            font-size: 12px;
            min-width: 30px;
            text-align: center;
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
        }
        
        .objects-list {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 12px 0;
            width: 100%;
            max-height: 50vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border: 1px solid rgba(58, 110, 165, 0.3);
        }
        
        .object-category {
            width: 100%;
            margin-bottom: 15px;
        }
        
        .category-title {
            font-size: 16px;
            margin-bottom: 10px;
            color: #ffd700;
            padding: 6px;
            border-radius: 6px;
            background-color: rgba(0, 0, 0, 0.4);
            font-weight: bold;
        }
        
        .object-item {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            padding: 6px 10px;
            border-radius: 6px;
            background-color: rgba(0, 0, 0, 0.2);
            font-size: 14px;
            line-height: 1.2;
            transition: transform 0.2s;
        }
        
        .object-item:active {
            transform: scale(0.98);
        }
        
        .object-bullet {
            font-size: 20px;
            margin-right: 10px;
            min-width: 20px;
            text-shadow: 0 0 3px currentColor;
        }
        
        .object-name {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .good-category .category-title {
            color: #64c864;
            background-color: rgba(100, 200, 100, 0.15);
            border: 1px solid rgba(100, 200, 100, 0.3);
        }
        
        .bad-category .category-title {
            color: #dc4646;
            background-color: rgba(220, 70, 70, 0.15);
            border: 1px solid rgba(220, 70, 70, 0.3);
        }
        
        .tip {
            font-size: 14px;
            margin: 15px 0;
            color: #40b4dc;
            line-height: 1.3;
            padding: 0 12px;
            text-align: center;
        }
        
        /* Controles táctiles optimizados para móvil */
        #touchControls {
            position: absolute;
            bottom: 30px;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 20px;
            z-index: 3;
            pointer-events: none;
        }
        
        .touch-button {
            width: 70px;
            height: 70px;
            background: linear-gradient(145deg, rgba(58, 110, 165, 0.9), rgba(45, 86, 133, 0.9));
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 35px;
            color: white;
            border: 3px solid rgba(255, 255, 255, 0.3);
            user-select: none;
            touch-action: manipulation;
            opacity: 0.9;
            pointer-events: auto;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
            transition: all 0.1s;
        }
        
        .touch-button:active {
            transform: scale(0.9);
            background: linear-gradient(145deg, rgba(45, 86, 133, 1), rgba(58, 110, 165, 1));
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
        }
        
        /* Indicadores */
        .boost-indicator {
            position: absolute;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(145deg, rgba(255, 215, 0, 0.9), rgba(255, 200, 0, 0.8));
            padding: 8px 16px;
            border-radius: 20px;
            border: 2px solid #ffd700;
            font-size: 14px;
            font-weight: bold;
            color: #000;
            display: none;
            z-index: 6;
            white-space: nowrap;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
            animation: float 2s infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-5px); }
        }
        
        /* Efecto de toque */
        .touch-feedback {
            position: absolute;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
            pointer-events: none;
            z-index: 100;
            opacity: 0;
            animation: touchEffect 0.5s ease-out;
        }
        
        @keyframes touchEffect {
            0% { transform: scale(0.5); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        
        /* Pantalla de Game Over optimizada */
        #gameOverScreen h1 {
            font-size: 32px;
            margin-bottom: 15px;
            color: #dc4646;
            text-shadow: 0 0 10px rgba(220, 70, 70, 0.5);
        }
        
        #gameOverScreen p {
            font-size: 16px;
            margin: 8px 0;
        }
        
        /* Efecto de daño */
        .damage-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(220, 70, 70, 0.3);
            pointer-events: none;
            z-index: 4;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        /* Récord */
        .record-container {
            background: linear-gradient(145deg, rgba(255, 215, 0, 0.2), rgba(255, 200, 0, 0.15));
            border: 2px solid rgba(255, 215, 0, 0.5);
            border-radius: 10px;
            padding: 12px 20px;
            margin: 15px 0;
            min-width: 250px;
            text-align: center;
        }
        
        .record-title {
            font-size: 16px;
            color: #ffd700;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .record-score {
            font-size: 24px;
            color: #ffffff;
            font-weight: bold;
            text-shadow: 0 0 8px #ffd700;
        }
        
        .new-record {
            animation: newRecordPulse 1.5s infinite;
            background: linear-gradient(145deg, rgba(255, 215, 0, 0.4), rgba(255, 200, 0, 0.3));
            border-color: #ffd700;
        }
        
        @keyframes newRecordPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
        }
        
        /* Indicador de intensidad */
        .intensity-bar {
            width: 100%;
            height: 6px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 3px;
            margin-top: 5px;
            overflow: hidden;
        }
        
        .intensity-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #64c864, #ffd700, #dc4646);
            border-radius: 3px;
            transition: width 0.5s ease;
        }
        
        /* Ajustes para pantallas pequeñas */
        @media (max-height: 700px) {
            .title { font-size: 24px; }
            .subtitle { font-size: 12px; margin-bottom: 8px; }
            .instructions { font-size: 16px; margin: 8px 0; }
            .controls { margin: 8px 0; font-size: 12px; }
            .key { padding: 3px 8px; font-size: 11px; min-width: 25px; }
            .object-item { padding: 5px 8px; font-size: 12px; margin-bottom: 5px; }
            .object-bullet { font-size: 18px; margin-right: 8px; }
            .tip { font-size: 12px; margin: 12px 0; }
            button { padding: 12px 20px; font-size: 14px; min-height: 45px; min-width: 160px; }
            .touch-button { width: 60px; height: 60px; font-size: 30px; }
            #touchControls { bottom: 20px; }
        }
        
        @media (max-height: 600px) {
            .objects-list { max-height: 40vh; }
            .title { font-size: 22px; }
            button { padding: 10px 18px; font-size: 13px; min-height: 40px; min-width: 140px; }
            .touch-button { width: 55px; height: 55px; font-size: 25px; }
            #touchControls { bottom: 15px; }
        }
        
        @media (max-width: 400px) {
            #ui { padding: 0 5px; }
            #scoreContainer, #centerUI, #healthContainer { 
                padding: 5px 8px; 
                min-width: 70px;
            }
            #score { font-size: 16px; }
            #intensity { font-size: 14px; }
            #time { font-size: 12px; }
            .title { font-size: 22px; }
            button { min-width: 140px; padding: 10px 16px; }
            .touch-button { width: 60px; height: 60px; }
            #healthBar { width: 70px; }
        }
        
        /* Animación de entrada */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .screen > * {
            animation: fadeIn 0.5s ease-out;
        }
    </style>
</head>
<body>
    <div id="gameContainer">
        <canvas id="gameCanvas"></canvas>
        
        <!-- Efecto de daño (rojo parpadeante) -->
        <div id="damageEffect" class="damage-effect"></div>
        
        <!-- UI del juego durante la partida -->
        <div id="ui">
            <!-- Puntos en la parte superior izquierda -->
            <div id="scoreContainer">
                <div id="scoreLabel">PUNTOS</div>
                <div id="score">0</div>
            </div>
            
            <!-- Intensidad y tiempo en el centro superior -->
            <div id="centerUI">
                <div id="intensityContainer">
                    <div id="intensityLabel">INTENSIDAD</div>
                    <div id="intensity">1.0x</div>
                    <div class="intensity-bar">
                        <div id="intensityFill" class="intensity-fill" style="width: 0%;"></div>
                    </div>
                </div>
                <div id="timeContainer">
                    <div id="timeLabel">TIEMPO</div>
                    <div id="time">00:00</div>
                </div>
            </div>
            
            <!-- Barra de vida en la parte superior derecha -->
            <div id="healthContainer">
                <div id="healthLabel">SALUD</div>
                <div id="healthBar">
                    <div id="healthFill" style="width: 100%;"></div>
                    <div id="healthText">100%</div>
                </div>
            </div>
        </div>
        
        <!-- Controles táctiles optimizados para móvil -->
        <div id="touchControls">
            <div class="touch-button" id="leftButton">←</div>
            <div class="touch-button" id="rightButton">→</div>
        </div>
        
        <!-- Indicador de boost de velocidad -->
        <div id="boostIndicator" class="boost-indicator">
            ¡BOOST DE VELOCIDAD!
        </div>
        
        <!-- Pantalla de inicio optimizada para móvil -->
        <div id="startScreen" class="screen">
            <h1 class="title">FIT FRENZY</h1>
            <p class="subtitle">¡Atrapa los objetos saludables y evita la comida chatarra!</p>
            
            <!-- Récord actual -->
            <div id="startRecordContainer" class="record-container">
                <div class="record-title">RÉCORD ACTUAL</div>
                <div id="startRecordScore" class="record-score">0</div>
                <div id="startRecordDetails" style="font-size: 12px; color: #aaa; margin-top: 5px;">Tiempo: 00:00</div>
            </div>
            
            <div class="instructions">INSTRUCCIONES</div>
            
            <div class="controls">
                <span class="key">←</span> <span class="key">→</span> para mover
                <span style="margin: 0 5px;">|</span>
                <span class="key">P</span> para pausar
            </div>
            
            <div class="objects-list">
                <!-- Objetos buenos -->
                <div class="object-category good-category">
                    <div class="category-title">OBJETOS BUENOS (+puntos)</div>
                    <div id="goodItemsList"></div>
                </div>
                
                <!-- Objetos malos -->
                <div class="object-category bad-category">
                    <div class="category-title">OBJETOS MALOS (-salud)</div>
                    <div id="badItemsList"></div>
                </div>
            </div>
            
            <p class="tip">¡La dificultad aumenta progresivamente con tus puntos! Cada 100 puntos, el juego se vuelve más rápido y caen más objetos.</p>
            
            <button id="startButton" class="pulse">COMENZAR JUEGO</button>
            
            <div style="margin-top: 20px;">
                <button id="resetRecordButton" style="background: linear-gradient(145deg, #dc4646, #c23e3e); min-height: 40px; min-width: 160px; font-size: 14px; padding: 10px 15px;">
                    REINICIAR RÉCORD
                </button>
            </div>
        </div>
        
        <!-- Pantalla de pausa optimizada para móvil -->
        <div id="pauseScreen" class="screen hidden">
            <h1>JUEGO PAUSADO</h1>
            <br>
            <button id="resumeButton">CONTINUAR</button>
            <button id="restartButton">REINICIAR</button>
            <button id="menuButton">MENÚ</button>
        </div>
        
        <!-- Pantalla de Game Over optimizada para móvil -->
        <div id="gameOverScreen" class="screen hidden">
            <h1>GAME OVER</h1>
            <br>
            <p>Puntuación final: <span id="finalScore">0</span></p>
            <p>Intensidad máxima: <span id="finalIntensity">1.0x</span></p>
            <p>Tiempo jugado: <span id="finalTime">00:00</span></p>
            
            <!-- Récord -->
            <div id="recordContainer" class="record-container">
                <div class="record-title">TU RÉCORD</div>
                <div id="recordScore" class="record-score">0</div>
                <div id="recordDetails" style="font-size: 12px; color: #aaa; margin-top: 5px;"></div>
            </div>
            
            <!-- Nuevo récord mensaje -->
            <div id="newRecordMessage" class="record-container new-record" style="display: none; margin-top: 10px;">
                <div style="font-size: 16px; color: #ffd700; font-weight: bold;">🎉 ¡NUEVO RÉCORD! 🎉</div>
                <div style="font-size: 14px; margin-top: 5px;">¡Felicidades! Has superado tu mejor puntuación</div>
            </div>
            
            <br>
            <button id="playAgainButton">JUGAR DE NUEVO</button>
            <button id="menuButton2">MENÚ PRINCIPAL</button>
        </div>
    </div>

    <script>
        // ======================= CONFIGURACIÓN OPTIMIZADA PARA MÓVIL =======================
        const GameConfig = {
            // Tamaño dinámico basado en la pantalla del dispositivo
            get baseWidth() {
                return Math.min(window.innerWidth, window.innerWidth);
            },
            get baseHeight() {
                return Math.min(window.innerHeight, window.innerHeight);
            },
            fps: 60,
            playerSpeed: 10, // Aumentado para móvil
            initialSpawnRate: 100,
            minSpawnRate: 40,
            
            // Objetos buenos con sus propiedades
            goodItems: [
                {id: 'proteina', name: 'Proteína', color: '#d878d8', value: 15, shape: 'circle', size: 25},
                {id: 'creatina', name: 'Creatina', color: '#40b4dc', value: 20, shape: 'diamond', size: 28},
                {id: 'frutas', name: 'Frutas', color: '#64c864', value: 10, shape: 'circle', size: 22},
                {id: 'verduras', name: 'Verduras', color: '#2e8b57', value: 10, shape: 'square', size: 24},
                {id: 'agua', name: 'Agua', color: '#1e90ff', value: 5, shape: 'circle', size: 20},
                {id: 'barrita', name: 'Barrita', color: '#ffa500', value: 12, shape: 'square', size: 26}
            ],
            
            // Objetos malos con sus propiedades
            badItems: [
                {id: 'hamburguesa', name: 'Hamburguesa', color: '#dc4646', value: -15, shape: 'square', size: 28},
                {id: 'refresco', name: 'Refresco', color: '#8b0000', value: -20, shape: 'circle', size: 26},
                {id: 'dulces', name: 'Dulces', color: '#ff69b4', value: -10, shape: 'triangle', size: 24},
                {id: 'papas', name: 'Papas Fritas', color: '#daa520', value: -12, shape: 'square', size: 22},
                {id: 'helado', name: 'Helado', color: '#ffb6c1', value: -18, shape: 'triangle', size: 26},
                {id: 'pizza', name: 'Pizza', color: '#ff4500', value: -25, shape: 'square', size: 30}
            ]
        };

        // ======================= ESTADOS DEL JUEGO =======================
        const GameState = {
            START: 'start',
            PLAYING: 'playing',
            PAUSED: 'paused',
            GAME_OVER: 'game_over'
        };

        // ======================= VARIABLES GLOBALES =======================
        let gameState = GameState.START;
        let player;
        let fallingObjects = [];
        let spawnTimer = 0;
        let spawnRate = GameConfig.initialSpawnRate;
        let gameTime = 0;
        let lastCollisionEffect = 0;
        let keys = {};
        let canvas, ctx;
        let canvasScale = 1;
        let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        let touchStartX = 0;
        let isTouching = false;
        let highScore = {
            score: 0,
            intensity: 1.0,
            time: 0,
            date: null
        };
        let objectsPerSpawn = 1; // Cantidad de objetos que aparecen simultáneamente
        let gameIntensity = 1.0; // Intensidad del juego (multiplicador de dificultad)
        let lastIntensityUpdate = 0; // Último puntaje donde se actualizó la intensidad

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

        // ======================= CLASE DEL JUGADOR (OPTIMIZADA PARA MÓVIL) =======================
        class Player {
            constructor() {
                this.width = 80; // Más grande para móvil
                this.height = 40;
                this.x = GameConfig.baseWidth / 2 - this.width / 2;
                this.y = GameConfig.baseHeight - 100; // Más arriba para dejar espacio a controles
                this.speed = GameConfig.playerSpeed;
                this.color = '#4682b4';
                this.score = 0;
                this.health = 100; // Cambiado de lives a health
                this.maxHealth = 100;
                this.speedBoost = 0;
                this.boostTime = 0;
                this.armOffset = 0;
                this.glowEffect = 0;
            }
            
            update(gameTime) {
                // Animación de brazos
                this.armOffset = Math.sin(gameTime * 0.1) * 8;
                
                // Efecto de brillo cuando tiene boost
                if (this.speedBoost > 0) {
                    this.glowEffect = (Math.sin(gameTime * 0.2) + 1) * 0.5;
                } else {
                    this.glowEffect = 0;
                }
                
                // Reducir boost de velocidad con el tiempo
                if (this.boostTime > 0) {
                    this.boostTime--;
                    if (this.boostTime === 0) {
                        this.speedBoost = 0;
                    }
                }
            }
            
            draw(ctx) {
                // Efecto de brillo si tiene boost
                if (this.glowEffect > 0) {
                    ctx.shadowColor = '#ffff64';
                    ctx.shadowBlur = 15 * this.glowEffect;
                }
                
                // Cuerpo del jugador
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                
                // Cabeza
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y - 15, 18, 0, Math.PI * 2);
                ctx.fill();
                
                // Brazos (animados)
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 8;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.x + 8, this.y + 15);
                ctx.lineTo(this.x - 20, this.y + 15 + this.armOffset);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(this.x + this.width - 8, this.y + 15);
                ctx.lineTo(this.x + this.width + 20, this.y + 15 - this.armOffset);
                ctx.stroke();
                
                // Resetear sombra
                ctx.shadowBlur = 0;
                
                // Indicador de velocidad boost
                if (this.speedBoost > 0) {
                    ctx.fillStyle = '#ffff64';
                    ctx.beginPath();
                    ctx.arc(this.x + 15, this.y + 10, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            move(direction) {
                if (direction === 'left') {
                    this.x -= this.speed + this.speedBoost;
                } else if (direction === 'right') {
                    this.x += this.speed + this.speedBoost;
                }
                
                // Limitar al jugador dentro de la pantalla
                if (this.x < 0) this.x = 0;
                if (this.x > GameConfig.baseWidth - this.width) {
                    this.x = GameConfig.baseWidth - this.width;
                }
            }
            
            applySpeedBoost() {
                this.speedBoost = 5; // Más boost en móvil
                this.boostTime = 180;
            }
            
            takeDamage(amount) {
                this.health -= amount;
                if (this.health < 0) {
                    this.health = 0;
                }
                
                // Mostrar efecto visual de daño
                showDamageEffect();
            }
            
            getBounds() {
                return {
                    x: this.x - 8, // Margen más grande para colisiones más fáciles en móvil
                    y: this.y - 8,
                    width: this.width + 16,
                    height: this.height + 16
                };
            }
            
            reset() {
                this.x = GameConfig.baseWidth / 2 - this.width / 2;
                this.y = GameConfig.baseHeight - 100;
                this.score = 0;
                this.health = this.maxHealth;
                this.speedBoost = 0;
                this.boostTime = 0;
                this.armOffset = 0;
                this.glowEffect = 0;
            }
        }

        // ======================= CLASE PARA OBJETOS QUE CAEN (OPTIMIZADA PARA MÓVIL) =======================
        class FallingObject {
            constructor(type, intensity = 1.0) {
                this.type = type; // 'good' o 'bad'
                this.intensity = intensity;
                
                // Configuración basada en el tipo
                const itemList = this.type === 'good' ? GameConfig.goodItems : GameConfig.badItems;
                const item = itemList[Math.floor(Math.random() * itemList.length)];
                
                this.id = item.id;
                this.name = item.name;
                this.color = item.color;
                this.value = item.value;
                this.shape = item.shape;
                this.baseSize = item.size;
                
                // Propiedades físicas (más grandes para móvil)
                this.size = this.baseSize + Math.random() * 10;
                this.x = Math.random() * (GameConfig.baseWidth - this.size * 2) + this.size;
                this.y = -this.size;
                
                // La velocidad aumenta con la intensidad (más suave y progresivo)
                this.speed = (Math.random() * 2 + 1.5) * intensity;
                
                this.rotation = 0;
                this.rotationSpeed = (Math.random() - 0.5) * 0.15 * intensity;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.05 + 0.02;
                this.wobbleAmount = Math.random() * 3 + 1;
            }
            
            update() {
                this.y += this.speed;
                this.rotation += this.rotationSpeed;
                this.wobble += this.wobbleSpeed;
                
                // Efecto de bamboleo (más pronunciado con alta intensidad)
                this.x += Math.sin(this.wobble) * this.wobbleAmount * 0.1 * (this.intensity / 2);
                
                // Limitar rotación
                if (this.rotation > Math.PI * 2) this.rotation -= Math.PI * 2;
                if (this.rotation < 0) this.rotation += Math.PI * 2;
            }
            
            draw(ctx) {
                ctx.save();
                
                // Posición con wobble
                const wobbleX = Math.sin(this.wobble) * this.wobbleAmount;
                ctx.translate(this.x + wobbleX, this.y);
                ctx.rotate(this.rotation);
                
                // Sombra para objetos buenos
                if (this.type === 'good') {
                    ctx.shadowColor = this.color;
                    ctx.shadowBlur = 10;
                }
                
                // Dibujar según la forma
                ctx.fillStyle = this.color;
                
                switch (this.shape) {
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                        
                    case 'square':
                        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                        break;
                        
                    case 'triangle':
                        ctx.beginPath();
                        ctx.moveTo(0, -this.size/2);
                        ctx.lineTo(-this.size/2, this.size/2);
                        ctx.lineTo(this.size/2, this.size/2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                        
                    case 'diamond':
                        ctx.beginPath();
                        ctx.moveTo(0, -this.size/2);
                        ctx.lineTo(-this.size/2, 0);
                        ctx.lineTo(0, this.size/2);
                        ctx.lineTo(this.size/2, 0);
                        ctx.closePath();
                        ctx.fill();
                        break;
                }
                
                // Resetear sombra
                ctx.shadowBlur = 0;
                
                // Dibujar un pequeño destello en objetos buenos
                if (this.type === 'good') {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(-this.size/4, -this.size/4, this.size/6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Aura para objetos buenos
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size/2 + 3, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                // Para objetos malos, dibujar una "X" pequeña
                if (this.type === 'bad') {
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(-this.size/3, -this.size/3);
                    ctx.lineTo(this.size/3, this.size/3);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(this.size/3, -this.size/3);
                    ctx.lineTo(-this.size/3, this.size/3);
                    ctx.stroke();
                    
                    // Aura roja para objetos malos
                    ctx.strokeStyle = 'rgba(220, 70, 70, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size/2 + 3, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                ctx.restore();
            }
            
            getBounds() {
                return {
                    x: this.x - this.size/2,
                    y: this.y - this.size/2,
                    width: this.size,
                    height: this.size
                };
            }
            
            isOffScreen() {
                return this.y > GameConfig.baseHeight + this.size;
            }
        }

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
    </script>
</body>
</html>
            <span class="object-name" style="color: ${item.color}">${item.name} (-${damage} salud)</span>
        `;
        badItemsList.appendChild(objectItem);
    });
}
