document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burgerBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    burgerBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Переключение между картинкой и текстом
document.addEventListener('DOMContentLoaded', function() {
    // Ваш существующий код для бургер-меню...
    
    // Добавьте этот код для переключения табов
    const switcherBtns = document.querySelectorAll('.switcher-btn');
    const contentTabs = document.querySelectorAll('.content-tab');
    
    switcherBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок
            switcherBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все табы
            contentTabs.forEach(tab => tab.classList.remove('active'));
            // Показываем нужный таб
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
});