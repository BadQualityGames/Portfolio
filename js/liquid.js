// liquid.js - минималистичный вариант
const canvas = document.getElementById('liquidCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('infographics');

let particles = [];
const mouse = { x: 0, y: 0, isActive: false };

// Настройки
const config = {
    particleColor: '#0096ff', // Синий цвет
    particleSize: 3, // Размер точек
    particleCount: 200, // Количество точек
    trailOpacity: 0.05 // Прозрачность следа
};

function init() {
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + config.particleSize
        });
    }
}

function animate() {
    // Очищаем с легким следом
    ctx.fillStyle = `rgba(255, 255, 255, ${config.trailOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем только точки
    particles.forEach(p => {
        // Обновляем позицию
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Отскок от границ
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        
        // Реакция на мышь
        if (mouse.isActive) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                p.x -= Math.cos(angle) * 0.5;
                p.y -= Math.sin(angle) * 0.5;
            }
        }
        
        // Рисуем синюю точку
        ctx.fillStyle = config.particleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    requestAnimationFrame(animate);
}

// События мыши
if (container) {
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.isActive = true;
    });
    
    container.addEventListener('mouseleave', () => {
        mouse.isActive = false;
    });
}

// Запуск
window.addEventListener('resize', init);
setTimeout(() => {
    init();
    animate();
}, 100);