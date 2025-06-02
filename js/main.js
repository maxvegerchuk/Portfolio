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

    // Функция для обновления видимости пагинации
    function updateNavigationVisibility() {
        if (!navigation) return;
        navigation.style.opacity = currentSlide === 0 ? '0' : '1';
        navigation.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
    }

    // Функция для обновления видимости слайдов
    function updateSlidesVisibility() {
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    // Функция для перехода к слайду
    function goToSlide(index) {
        if (isTransitioning) return;
        if (index < 0 || index >= totalSlides) return;

        const now = performance.now();
        if (now - lastWheelTime < wheelThrottle) return;
        lastWheelTime = now;

        isTransitioning = true;
        const prevSlide = currentSlide;
        currentSlide = index;

        // Предварительно загружаем следующий слайд
        const nextSlide = slides[currentSlide];
        if (nextSlide) {
            nextSlide.style.opacity = '0';
            nextSlide.style.transform = `translateY(${(currentSlide - prevSlide) * 100}%)`;
            // Принудительно вызываем reflow
            nextSlide.offsetHeight;
        }

        // Обновляем позиции слайдов с плавной анимацией
        requestAnimationFrame(() => {
            slides.forEach((slide, i) => {
                const offset = (i - currentSlide) * 100;
                slide.style.transform = `translateY(${offset}%)`;
                if (i === currentSlide) {
                    slide.style.opacity = '1';
                } else {
                    slide.style.opacity = '0';
                }
            });

            // Обновляем UI
            updateHeaderStyle();
            updateDots();
            updateNavigationVisibility();
            updateSlidesVisibility();
        });

        // Сбрасываем состояние перехода
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    // Инициализация позиций слайдов
    function initializeSlides() {
        // Сначала скрываем все слайды кроме hero
        slides.forEach((slide, i) => {
            if (i === 0) {
                slide.classList.add('active');
                slide.style.transform = 'translateY(0)';
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.transform = `translateY(${i * 100}%)`;
                slide.style.opacity = '0';
            }
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

        // Используем только текущее значение скролла, без накопления
        const direction = e.deltaY > 0 ? 1 : -1;
        
        // Проверяем, достигнут ли порог для перехода
        const threshold = 50; // Порог для перехода
        if (Math.abs(e.deltaY) >= threshold) {
            if (direction > 0 && currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            } else if (direction < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        }
    }, { passive: false });

    // Обработчик свайпов для мобильных устройств
    let touchStartY = 0;
    let lastTouchTime = 0;
    const touchThrottle = 300;
    let isTouchScrolling = false;

    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        isTouchScrolling = false;
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
        if (isTransitioning) return;

        const now = performance.now();
        if (now - lastTouchTime < touchThrottle) return;
        lastTouchTime = now;

        const touchEndY = e.touches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        // Проверяем, не является ли это обычным скроллом внутри секции
        const currentSlideElement = slides[currentSlide];
        const slideRect = currentSlideElement.getBoundingClientRect();
        const isAtTop = currentSlideElement.scrollTop === 0;
        const isAtBottom = currentSlideElement.scrollHeight - currentSlideElement.scrollTop === currentSlideElement.clientHeight;

        // Если мы не в начале или конце секции, позволяем обычный скролл
        if (!isAtTop && !isAtBottom) {
            return;
        }

        const threshold = 30;
        if (Math.abs(diff) >= threshold && !isTouchScrolling) {
            isTouchScrolling = true;
            if (diff > 0 && currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
                touchStartY = touchEndY;
            } else if (diff < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
                touchStartY = touchEndY;
            }
        }
    }, { passive: true });

    window.addEventListener('touchend', function() {
        isTouchScrolling = false;
    }, { passive: true });

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

    // Обработчик скролла для обновления стиля хедера
    window.addEventListener('scroll', updateHeaderStyle);

    // Инициализация
    initializeSlides();
    updateHeaderStyle();
    updateDots();
    updateNavigationVisibility();
    updateSlidesVisibility();
}); 