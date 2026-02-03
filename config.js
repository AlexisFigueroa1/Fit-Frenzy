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
