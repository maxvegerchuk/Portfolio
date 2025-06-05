document.addEventListener("DOMContentLoaded", function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const slider = document.querySelector('.gallery-slider');
    if (!slider) return;

    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    const prevButton = slider.querySelector('.slider-arrow.prev');
    const nextButton = slider.querySelector('.slider-arrow.next');

    let currentIndex = 0;
    const slideCount = slides.length;
    let isTransitioning = false;

    // Function to update slider position
    function updateSlider() {
        if (isTransitioning) return;
        isTransitioning = true;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        if (prevButton) prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        if (nextButton) nextButton.style.opacity = currentIndex === slideCount - 1 ? '0.5' : '1';

        // Reset transition state
        setTimeout(() => {
            isTransitioning = false;
        }, 300);
    }

    // Обработчики для кнопок
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0 && !isTransitioning) {
                currentIndex--;
                updateSlider();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentIndex < slideCount - 1 && !isTransitioning) {
                currentIndex++;
                updateSlider();
            }
        });
    }

    // Обработчики для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isTransitioning && currentIndex !== index) {
                currentIndex = index;
                updateSlider();
            }
        });
    });

    // Добавляем обработку свайпов для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold && !isTransitioning) {
            if (diff > 0 && currentIndex < slideCount - 1) {
                // Свайп влево
                currentIndex++;
                updateSlider();
            } else if (diff < 0 && currentIndex > 0) {
                // Свайп вправо
                currentIndex--;
                updateSlider();
            }
        }
    }, { passive: true });

    // Инициализация слайдера
    updateSlider();
}); 