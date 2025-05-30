document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на странице проекта
    const isProjectPage = document.querySelector('.project-content') !== null;
    if (isProjectPage) return;

    // Основные элементы
    const header = document.querySelector('.site-header');
    const headerLinks = document.querySelectorAll('.header-link');
    const headerLogo = document.querySelector('.header-logo img');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-navigation .dot');
    const footer = document.querySelector('.site-footer');
    const navigation = document.querySelector('.slide-navigation');
    const projectLinks = document.querySelectorAll('.project-title-link');

    // Состояние навигации
    let currentSlide = 0;
    let isTransitioning = false;
    const totalSlides = slides.length;
    let lastWheelTime = 0;
    const wheelThrottle = 500; // Задержка между событиями колеса
    let wheelDelta = 0; // Добавляем переменную для отслеживания накопления скролла

    // Функция для обновления стиля хедера
    function updateHeaderStyle() {
        if (!header) return;
        const isDark = currentSlide > 0;
        header.classList.toggle('dark', isDark);
        headerLinks.forEach(link => link.classList.toggle('dark', isDark));
        if (headerLogo) headerLogo.classList.toggle('dark', isDark);
    }

    // Функция для обновления точек навигации
    function updateDots() {
        if (!dots.length) return;
        dots.forEach((dot) => {
            const index = parseInt(dot.getAttribute('data-index'));
            if (index === 0) return; // Пропускаем первую точку
            dot.classList.toggle('active', currentSlide === index);
        });
    }

    // Функция для обновления видимости футера
    function updateFooter() {
        if (!footer) return;
        footer.classList.toggle('visible', currentSlide === totalSlides - 1);
    }

    // Функция для обновления видимости пагинации
    function updateNavigationVisibility() {
        if (!navigation) return;
        navigation.style.opacity = currentSlide === 0 ? '0' : '1';
        navigation.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
    }

    // Функция для перехода к слайду
    function goToSlide(index) {
        if (isTransitioning) return;
        if (index < 0 || index >= totalSlides) return;

        const now = performance.now();
        if (now - lastWheelTime < wheelThrottle) return;
        lastWheelTime = now;

        isTransitioning = true;
        currentSlide = index;
        wheelDelta = 0;

        // Обновляем позиции слайдов
        slides.forEach((slide, i) => {
            const offset = (i - currentSlide) * 100;
            slide.style.transform = `translateY(${offset}%)`;
        });

        // Обновляем UI
        updateHeaderStyle();
        updateDots();
        updateNavigationVisibility();
        updateFooter();

        // Сбрасываем состояние перехода
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    // Инициализация позиций слайдов
    function initializeSlides() {
        slides.forEach((slide, i) => {
            const offset = (i - currentSlide) * 100;
            slide.style.transform = `translateY(${offset}%)`;
        });
    }

    // Обработчик колеса мыши
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (isTransitioning) return;

        const now = performance.now();
        if (now - lastWheelTime < wheelThrottle) return;

        // Проверяем значимость скролла
        if (Math.abs(e.deltaY) < 10) return;

        // Накопление скролла с учетом направления
        wheelDelta += e.deltaY;
        
        // Проверяем, достигнут ли порог для перехода
        const threshold = 50; // Порог для перехода
        if (Math.abs(wheelDelta) >= threshold) {
            if (wheelDelta > 0 && currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            } else if (wheelDelta < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
            wheelDelta = 0; // Сбрасываем накопление после перехода
        }
    }, { passive: false });

    // Обработчик свайпов для мобильных устройств
    let touchStartY = 0;
    let lastTouchTime = 0;
    const touchThrottle = 500;
    let touchDelta = 0;

    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchDelta = 0;
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (isTransitioning) return;

        const now = performance.now();
        if (now - lastTouchTime < touchThrottle) return;
        lastTouchTime = now;

        const touchEndY = e.touches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        touchDelta += diff;
        
        const threshold = 50;
        if (Math.abs(touchDelta) >= threshold) {
            if (touchDelta > 0 && currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
                touchStartY = touchEndY;
                touchDelta = 0;
            } else if (touchDelta < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
                touchStartY = touchEndY;
                touchDelta = 0;
            }
        }
    }, { passive: false });

    // Обработчики клика по точкам навигации
    dots.forEach((dot) => {
        dot.addEventListener('click', function() {
            if (isTransitioning) return;
            const index = parseInt(this.getAttribute('data-index'));
            if (index === 0) return; // Пропускаем клик по первой точке
            goToSlide(index);
        });
    });

    // Обработчики клика по ссылкам в хедере
    headerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#portfolio') {
                goToSlide(1); // Переход к первому проекту
            } else if (href === '#contact') {
                goToSlide(3); // Переход к контактам
            }
        });
    });

    // Обработчики клика по ссылкам проекта
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Разрешаем переход по ссылке, не блокируя событие
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                return true;
            }
            e.preventDefault();
        });
    });

    // Инициализация
    initializeSlides();
    updateHeaderStyle();
    updateDots();
    updateFooter();
    updateNavigationVisibility();
}); 