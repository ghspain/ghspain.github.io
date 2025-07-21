(function() {
    'use strict';

    // Constantes
    const SELECTORS = {
        navLinks: '#navLinks',
        menuIcon: '#menu-icon',
        closeIcon: '#close-icon',
        smoothScrollLinks: 'a[href^="#"]'
    };

    const CLASSES = {
        menuVisible: 'menu-visible'
    };

    /**
     * Gestión del menú móvil
     */
    function initMobileMenu() {
        const navLinks = document.querySelector(SELECTORS.navLinks);
        const menuIcon = document.querySelector(SELECTORS.menuIcon);
        const closeIcon = document.querySelector(SELECTORS.closeIcon);

        if (!navLinks || !menuIcon || !closeIcon) return;

        function showMenu() {
            navLinks.style.right = '0';
            menuIcon.setAttribute('aria-expanded', 'true');
            document.body.classList.add(CLASSES.menuVisible);
        }

        function hideMenu() {
            navLinks.style.right = '-200px';
            menuIcon.setAttribute('aria-expanded', 'false');
            document.body.classList.remove(CLASSES.menuVisible);
        }

        // Event listeners
        menuIcon.addEventListener('click', showMenu);
        closeIcon.addEventListener('click', hideMenu);

        // Cerrar menú al hacer click en enlaces
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', hideMenu);
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains(CLASSES.menuVisible)) {
                hideMenu();
            }
        });
    }

    /**
     * Smooth scroll
     */
    function initSmoothScroll() {
        document.querySelectorAll(SELECTORS.smoothScrollLinks).forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Lazy loading básico para imágenes
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('loading-placeholder');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                img.classList.add('loading-placeholder');
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Mejora la accesibilidad del carousel
     */
    function initCarouselAccessibility() {
        const carousel = document.querySelector('.slide ul');
        if (carousel) {
            // Pausar animación al pasar el ratón
            carousel.addEventListener('mouseenter', () => {
                carousel.style.animationPlayState = 'paused';
            });

            carousel.addEventListener('mouseleave', () => {
                carousel.style.animationPlayState = 'running';
            });

            // Pausar animación al enfocar con teclado
            const carouselImages = carousel.querySelectorAll('img');
            carouselImages.forEach(img => {
                img.addEventListener('focus', () => {
                    carousel.style.animationPlayState = 'paused';
                });

                img.addEventListener('blur', () => {
                    carousel.style.animationPlayState = 'running';
                });
            });
        }
    }

    // Inicialización cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initSmoothScroll();
        initLazyLoading();
        initCarouselAccessibility();
    });
})();
