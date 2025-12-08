// liquid.js - плавные волны без пузырьков
const canvas = document.getElementById('liquidCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('infographics');

let time = 0;
let mouse = { x: 0, y: 0, isActive: false };

// Настройки
const config = {
    waveCount: 2,
    waveAmplitude: 25,
    waveSpeed: 0.015,
    waveLength: 120,
    colors: ['#2563EB', '#3B82F6'],
    mouseInfluence: 1.2,
    mouseRadius: 200,
    rippleStrength: 0.8,
    followStrength: 0.3
};

function init() {
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

function drawLiquid() {
    if (!canvas.width || !canvas.height) return;
    
    // Полностью очищаем канвас для плавного эффекта
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    time += config.waveSpeed;
    
    // Рисуем плавный градиентный фон
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, 'rgba(248, 250, 252, 0.8)'); // Светлый сверху
    bgGradient.addColorStop(0.5, 'rgba(224, 242, 254, 0.6)'); // Плавный переход
    bgGradient.addColorStop(1, 'rgba(240, 249, 255, 0.3)'); // Очень прозрачный снизу
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем волны
    for (let i = 0; i < config.waveCount; i++) {
        const phase = time + i * Math.PI / 3;
        const amplitude = config.waveAmplitude * (1 - i * 0.2);
        
        ctx.beginPath();
        
        // Начинаем с левого нижнего угла для плавного перехода
        ctx.moveTo(0, canvas.height);
        
        // Поднимаемся к началу волны
        ctx.lineTo(0, canvas.height * 0.6);
        
        // Создаем волну
        for (let x = 0; x <= canvas.width; x += 8) {
            let waveY = canvas.height * 0.6;
            
            // Базовая волна
            waveY += Math.sin(x / config.waveLength + phase) * amplitude;
            
            // Вторая гармоника для плавности
            waveY += Math.sin(x / (config.waveLength * 0.7) + phase * 1.7) * amplitude * 0.4;
            
            // Влияние курсора
            if (mouse.isActive) {
                const dx = mouse.x - x;
                const dy = mouse.y - canvas.height * 0.6;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.mouseRadius) {
                    const influence = (1 - distance / config.mouseRadius) * config.mouseInfluence;
                    
                    // Эффект расхождения волн от курсора
                    const ripple = Math.sin(time * 3 + distance * 0.05) * amplitude * config.rippleStrength * influence;
                    waveY += ripple;
                    
                    // Волны следуют за движением курсора
                    const followWave = Math.sin(x * 0.02 - time * 2) * amplitude * config.followStrength * influence;
                    waveY += followWave;
                }
            }
            
            // Ограничиваем волну в пределах канваса
            waveY = Math.max(canvas.height * 0.4, Math.min(canvas.height * 0.8, waveY));
            
            ctx.lineTo(x, waveY);
        }
        
        // Плавно опускаемся к правому нижнему углу
        ctx.lineTo(canvas.width, canvas.height * 0.7);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        // Плавный градиент для волны
        const gradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
        gradient.addColorStop(0, `${config.colors[i]}40`); // Начало волны
        gradient.addColorStop(0.5, `${config.colors[i]}20`); // Середина
        gradient.addColorStop(1, `${config.colors[i]}05`); // Плавное исчезновение внизу
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Очень легкая обводка только для верхнего края волны
        if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height * 0.6);
            
            for (let x = 0; x <= canvas.width; x += 8) {
                let waveY = canvas.height * 0.6;
                waveY += Math.sin(x / config.waveLength + phase) * amplitude;
                waveY += Math.sin(x / (config.waveLength * 0.7) + phase * 1.7) * amplitude * 0.4;
                
                if (mouse.isActive) {
                    const dx = mouse.x - x;
                    const dy = mouse.y - canvas.height * 0.6;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < config.mouseRadius) {
                        const influence = (1 - distance / config.mouseRadius) * config.mouseInfluence;
                        waveY += Math.sin(time * 3 + distance * 0.05) * amplitude * config.rippleStrength * influence;
                    }
                }
                
                ctx.lineTo(x, waveY);
            }
            
            ctx.strokeStyle = `${config.colors[i]}30`; // Очень прозрачная обводка
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    
    requestAnimationFrame(drawLiquid);
}

// События мыши
if (container) {
    let mouseTimer;
    
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.isActive = true;
        
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
            mouse.isActive = false;
        }, 150);
    });
    
    container.addEventListener('mouseleave', () => {
        mouse.isActive = false;
    });
    
    // Поддержка сенсорных экранов
    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
        mouse.isActive = true;
        
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
            mouse.isActive = false;
        }, 150);
    }, { passive: false });
}

// Запуск
window.addEventListener('resize', () => {
    init();
});

setTimeout(() => {
    init();
    drawLiquid();
}, 100);