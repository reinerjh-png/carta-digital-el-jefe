/**
 * El Jefe Lounge - Optimized Performance Module
 * Lightweight version with reduced animations
 */

(function() {
    'use strict';

    // Optimized Configuration
    const CONFIG = {
        particleCount: 25,  // Reduced from 50
        preloaderDuration: 2000,  // Reduced from 2800
        scrollThreshold: 100,
        observerThreshold: 0.1
    };

    // Cached Elements
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const elements = {
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

    // Initialize
    function init() {
        if (!elements.preloader) return;
        
        createParticles();
        initPreloader();
        initNavigation();
        initMenuFilter();
        initScrollAnimations();
        initCategoryNavigation();
        initMicroInteractions();
    }

    // Optimized Particle System
    function createParticles() {
        if (!elements.particles) return;

        const fragment = document.createDocumentFragment();
        const particleHTML = [];

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 10 + Math.random() * 10;
            const size = 2 + Math.random() * 4;
            
            particleHTML.push(
                `<div class="particle" style="left:${left}%;animation-delay:${delay}s;animation-duration:${duration}s;width:${size}px;height:${size}px"></div>`
            );
        }

        elements.particles.innerHTML = particleHTML.join('');
    }

    // Preloader
    function initPreloader() {
        setTimeout(() => {
            elements.preloader.classList.add('hidden');
            document.body.classList.add('loaded');
            setTimeout(animateMenuCards, 300);
        }, CONFIG.preloaderDuration);
    }

    // Navigation
    function initNavigation() {
        elements.navTrigger?.addEventListener('click', toggleMobileMenu);
        elements.navOverlay?.addEventListener('click', closeMobileMenu);
        
        $$('.nav-item').forEach(item => {
            item.addEventListener('click', closeMobileMenu);
        });

        // Optimized scroll handler with passive listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    elements.navbar?.classList.toggle('scrolled', window.scrollY > CONFIG.scrollThreshold);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    function toggleMobileMenu() {
        const isActive = elements.navList?.classList.contains('active');
        isActive ? closeMobileMenu() : openMobileMenu();
    }

    function openMobileMenu() {
        elements.navList?.classList.add('active');
        elements.navOverlay?.classList.add('active');
        elements.navTrigger?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        elements.navList?.classList.remove('active');
        elements.navOverlay?.classList.remove('active');
        elements.navTrigger?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Menu Filter
    function initMenuFilter() {
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterMenu(btn.dataset.filter);
            });
        });
    }

    function filterMenu(filter) {
        let delay = 0;
        elements.menuCards.forEach(card => {
            const category = card.dataset.category;
            
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                setTimeout(() => card.classList.add('visible'), delay);
                delay += 30;
            } else {
                card.classList.add('hidden');
                card.classList.remove('visible');
            }
        });
    }

    function animateMenuCards() {
        let delay = 0;
        elements.menuCards.forEach(card => {
            setTimeout(() => card.classList.add('visible'), delay);
            delay += 50;
        });
    }

    // Scroll Animations with Intersection Observer
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Unobserve after animation
                }
            });
        }, { threshold: CONFIG.observerThreshold, rootMargin: '0px 0px -80px 0px' });

        $$('.categories, .menu, .featured, .experience, .section-header').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    // Category Navigation
    function initCategoryNavigation() {
        elements.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const filterBtn = [...elements.filterBtns].find(btn => btn.dataset.filter === card.dataset.category);
                if (filterBtn) {
                    filterBtn.click();
                    $('#menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // Optimized Micro-interactions
    function initMicroInteractions() {
        // Simple hover effect without tilt (better performance on mobile)
        $$('.menu-card, .featured-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, { passive: true });
        });

        // Ripple effect on buttons
        $$('.btn, .tab-btn, .card-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = button.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.cssText = `
                    position:absolute;width:${size}px;height:${size}px;
                    left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;
                    background:rgba(255,255,255,0.3);border-radius:50%;
                    transform:scale(0);animation:ripple 0.6s ease-out;pointer-events:none;
                `;

                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            }, { passive: true });
        });
    }

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple{to{transform:scale(4);opacity:0}}
        .reveal{opacity:0;transform:translateY(50px);transition:all 0.6s cubic-bezier(0.4,0,0.2,1)}
        .reveal.visible{opacity:1;transform:translateY(0)}
    `;
    document.head.appendChild(style);

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Console Easter Egg
    console.log('%c🌿 El Jefe - Fusión Amazónica & Lounge','font-size:24px;color:#22C55E;font-weight:bold;');

})();
