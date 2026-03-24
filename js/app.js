/**
 * El Jefe Lounge - Main JavaScript
 * Compatible con todos los dispositivos móviles
 */

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        particleCount: 25,
        preloaderDuration: 2000,
        scrollThreshold: 100,
        observerThreshold: 0.1
    };

    // Función segura para seleccionar elementos
    const $ = (selector) => {
        try {
            return document.querySelector(selector);
        } catch(e) {
            return null;
        }
    };
    
    const $$ = (selector) => {
        try {
            return document.querySelectorAll(selector);
        } catch(e) {
            return [];
        }
    };

    // Elementos del DOM
    let elements = {};

    // Inicializar
    function init() {
        cacheElements();
        
        // Si no hay preloader, continuar de todas formas
        if (!elements.preloader) {
            document.body.classList.add('loaded');
            animateMenuCards();
            return;
        }

        createParticles();
        initPreloader();
        initNavigation();
        initMenuFilter();
        initScrollAnimations();
        initCategoryNavigation();
        initMicroInteractions();
    }

    // Cachear elementos
    function cacheElements() {
        elements = {
            preloader: $('#preloader'),
            navbar: $('#navbar'),
            navTrigger: $('#navTrigger'),
            navList: $('#navList'),
            navOverlay: $('#navOverlay'),
            particles: $('#particles'),
            filterBtns: $$('.tab-btn'),
            menuCards: $$('.menu-card'),
            categoryCards: $$('.category-card')
        };
    }

    // Sistema de partículas
    function createParticles() {
        if (!elements.particles) return;

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 10 + Math.random() * 10;
            const size = 2 + Math.random() * 4;

            particle.style.cssText = `
                left: ${left}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                width: ${size}px;
                height: ${size}px;
            `;

            fragment.appendChild(particle);
        }

        elements.particles.appendChild(fragment);
    }

    // Preloader
    function initPreloader() {
        try {
            setTimeout(() => {
                if (elements.preloader) {
                    elements.preloader.classList.add('hidden');
                }
                document.body.classList.add('loaded');
                setTimeout(animateMenuCards, 300);
            }, CONFIG.preloaderDuration);
        } catch(e) {
            console.log('Preloader error:', e);
            document.body.classList.add('loaded');
        }
    }

    // Navegación
    function initNavigation() {
        if (!elements.navTrigger) return;

        elements.navTrigger.addEventListener('click', toggleMobileMenu);
        
        if (elements.navOverlay) {
            elements.navOverlay.addEventListener('click', closeMobileMenu);
        }

        const navItems = $$('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', closeMobileMenu);
        });

        // Scroll handler optimizado
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking && elements.navbar) {
                window.requestAnimationFrame(function() {
                    elements.navbar.classList.toggle('scrolled', window.scrollY > CONFIG.scrollThreshold);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    function toggleMobileMenu() {
        if (!elements.navList || !elements.navTrigger) return;
        
        const isActive = elements.navList.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        if (!elements.navList) return;
        
        elements.navList.classList.add('active');
        if (elements.navOverlay) elements.navOverlay.classList.add('active');
        if (elements.navTrigger) elements.navTrigger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!elements.navList) return;
        
        elements.navList.classList.remove('active');
        if (elements.navOverlay) elements.navOverlay.classList.remove('active');
        if (elements.navTrigger) elements.navTrigger.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Filtro de menú
    function initMenuFilter() {
        if (!elements.filterBtns.length) return;

        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover active de todos
                elements.filterBtns.forEach(b => b.classList.remove('active'));
                // Agregar active al actual
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                if (filter) {
                    filterMenu(filter);
                }
            });
        });
    }

    function filterMenu(filter) {
        if (!elements.menuCards.length) return;

        let delay = 0;
        
        elements.menuCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.classList.add('visible');
                }, delay);
                delay += 30;
            } else {
                card.classList.add('hidden');
                card.classList.remove('visible');
            }
        });
    }

    function animateMenuCards() {
        if (!elements.menuCards.length) return;

        let delay = 0;
        elements.menuCards.forEach(card => {
            setTimeout(() => {
                card.classList.add('visible');
            }, delay);
            delay += 50;
        });
    }

    // Animaciones al hacer scroll
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback para navegadores antiguos
            const revealElements = $$('.reveal');
            revealElements.forEach(el => el.classList.add('visible'));
            return;
        }

        try {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: CONFIG.observerThreshold, 
                rootMargin: '0px 0px -80px 0px' 
            });

            const revealElements = $$('.categories, .menu, .featured, .experience, .section-header');
            revealElements.forEach(el => {
                el.classList.add('reveal');
                observer.observe(el);
            });
        } catch(e) {
            console.log('Observer error:', e);
        }
    }

    // Navegación por categorías
    function initCategoryNavigation() {
        if (!elements.categoryCards.length) return;

        elements.categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                if (!category) return;

                // Buscar el botón correspondiente
                const filterBtn = Array.from(elements.filterBtns).find(btn => 
                    btn.getAttribute('data-filter') === category
                );

                if (filterBtn) {
                    filterBtn.click();
                    
                    // Scroll suave al menú
                    const menuSection = $('#menu');
                    if (menuSection) {
                        setTimeout(() => {
                            menuSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }, 300);
                    }
                }
            });
        });
    }

    // Micro-interacciones
    function initMicroInteractions() {
        // Efecto hover en cards
        const hoverCards = $$('.menu-card, .featured-card, .category-card');
        hoverCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });

        // Ripple effect en botones
        const buttons = $$('.btn, .tab-btn, .card-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${e.clientX - rect.left - size/2}px;
                    top: ${e.clientY - rect.top - size/2}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });
    }

    // Agregar estilos dinámicos para ripple y reveal
    function addDynamicStyles() {
        const existingStyle = $('#dynamic-styles');
        if (existingStyle) return;

        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            .reveal {
                opacity: 0;
                transform: translateY(50px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .reveal.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addDynamicStyles();
            init();
        });
    } else {
        addDynamicStyles();
        init();
    }

    // Console Easter Egg
    console.log('%c🌿 El Jefe - Fusión Amazónica & Lounge', 'font-size: 24px; color: #22C55E; font-weight: bold;');

})();
