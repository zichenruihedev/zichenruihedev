/* ============================================
   Beijing Zichen Ruihe Enterprise Management Co., Ltd
   Global Enterprise Website JavaScript
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoadingScreen();
    initNavigation();
    initScrollEffects();
    initScrollReveal();
    initCounters();
    initContactForm();
    initSmoothScroll();
});

/* Loading Screen */
function initLoadingScreen() {
    const loading = document.querySelector('.loading');
    if (loading) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 800);
        });
    }
}

/* Navigation */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

/* Scroll Effects */
function initScrollEffects() {
    const scrollTop = document.querySelector('.scroll-top');

    if (scrollTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTop.classList.add('visible');
            } else {
                scrollTop.classList.remove('visible');
            }
        });

        scrollTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const heroBg = hero.querySelector('.hero-bg');
            if (heroBg && scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }
}

/* Scroll Reveal Animation */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealOnScroll = function() {
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

/* Counter Animation */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let counted = false;

    const startCounting = function() {
        if (counted) return;

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            counted = true;

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = function() {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            });
        }
    };

    window.addEventListener('scroll', startCounting);
    startCounting(); // Initial check
}

/* Contact Form */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate form
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            form.reset();
        });
    }
}

/* Notification System */
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00d4ff' : '#ff4444'};
        color: ${type === 'success' ? '#1a1a1a' : '#ffffff'};
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/* Smooth Scroll */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* Mouse Parallax Effect */
document.addEventListener('mousemove', function(e) {
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        }
    }
});

/* Intersection Observer for Animations */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.feature-card, .service-card, .app-card, .news-card, .team-card').forEach(el => {
    observer.observe(el);
});

/* Magnetic Button Effect */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

/* Page Transition Effect */
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});

document.addEventListener('DOMContentLoaded', function() {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
});

/* Console Branding */
console.log('%c Beijing Zichen Ruihe Enterprise Management Co., Ltd ', 
    'background: #00d4ff; color: #1a1a1a; font-size: 16px; padding: 10px 20px; border-radius: 5px;');
console.log('%c Website: https://zichenruihedev.com ', 
    'background: #1a1a1a; color: #00d4ff; font-size: 12px; padding: 5px 10px;');
