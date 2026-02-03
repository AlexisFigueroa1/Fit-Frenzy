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
