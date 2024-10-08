document.addEventListener("DOMContentLoaded", function() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    function checkVisibility() {
        const triggerBottom = window.innerHeight * 0.8; // 80% высоты окна

        portfolioItems.forEach(item => {
            const box = item.getBoundingClientRect();
            if (box.top < triggerBottom) {
                item.style.opacity = '1'; // Устанавливаем прозрачность
                item.style.transform = 'translateY(0)'; // Возвращаем в исходное положение
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Проверяем видимость при загрузке страницы
});

let currentSlide = 0;

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active'); // Убираем класс active с текущего слайда

    currentSlide = (currentSlide + direction + slides.length) % slides.length; // Изменяем индекс слайда

    slides[currentSlide].classList.add('active'); // Добавляем класс active к новому слайду
    const offset = -currentSlide * 100; // Вычисляем смещение
    document.querySelector('.slides').style.transform = `translateX(${offset}%)`; // Применяем смещение
}

// Автоматическая смена слайдов (опционально)
setInterval(() => changeSlide(1), 6000); // Меняем слайд каждые 3 секунды