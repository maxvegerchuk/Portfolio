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

    // Function to update slider position
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex === slideCount - 1 ? '0.5' : '1';
    }

    // Обработчики для кнопок
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < slideCount - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Возвращаемся к первому слайду
        }
        updateSlider();
    });

    // Обработчики для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });

    // Инициализация слайдера
    updateSlider();
}); 