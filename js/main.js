document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на странице проекта
    if (document.querySelector('.project-page')) {
        return;
    }

    // Header elements
    const header = document.querySelector('.site-header');
    const headerLogo = document.querySelector('.header-logo img');
    const headerLinks = document.querySelectorAll('.header-link');
    const heroSection = document.querySelector('.hero-section');
    const navLinks = document.querySelectorAll('.header-nav a');
    const sectionNav = document.querySelector('.section-navigation');
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section[id]');

    // Функция для обновления стиля хедера
    function updateHeaderStyle() {
        if (heroSection) {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            if (heroBottom <= 0) {
                header.classList.add('dark');
                headerLogo.classList.add('dark');
                headerLinks.forEach(link => link.classList.add('dark'));
            } else {
                header.classList.remove('dark');
                headerLogo.classList.remove('dark');
                headerLinks.forEach(link => link.classList.remove('dark'));
            }
        }
    }

    // Функция для обновления активной точки навигации
    function updateActiveDot() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - header.offsetHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            const dot = navDots[index];
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Показываем/скрываем навигацию при скролле
    function toggleSectionNav() {
        if (window.scrollY > window.innerHeight / 2) {
            sectionNav.classList.add('visible');
        } else {
            sectionNav.classList.remove('visible');
        }
    }

    // Плавный скролл к секции
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = header.offsetHeight;
            const heroHeight = heroSection ? heroSection.offsetHeight : 0;
            let sectionTop = section.offsetTop - headerHeight;
            
            // Если это секция проектов, скроллим к её началу
            if (sectionId === 'portfolio') {
                sectionTop = section.offsetTop;
            }
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    // Обработчики событий для точек навигации
    navDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const sectionId = dot.getAttribute('data-section');
            scrollToSection(sectionId);
        });
    });

    // Обработчики событий для ссылок в хедере
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Обработчики событий скролла
    window.addEventListener('scroll', () => {
        updateHeaderStyle();
        updateActiveDot();
        toggleSectionNav();
    });

    // Инициализация при загрузке страницы
    updateHeaderStyle();
    updateActiveDot();
    toggleSectionNav();
}); 