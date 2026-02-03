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
