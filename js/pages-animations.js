/**
 * Animations et interactions pour les pages thématiques du PAT Rufisque
 * Gère : Slideshow, graphiques circulaires animés, scroll animations
 */

// ========================================
// 1. SLIDESHOW AUTOMATIQUE
// ========================================

function initSlideshow() {
    const container = document.getElementById('slideshow-container');
    if (!container) return;

    const images = container.querySelectorAll('.slideshow-image');
    if (images.length === 0) return;

    let currentIndex = 0;
    images[0].classList.add('active');

    function nextSlide() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    // Change d'image toutes les 4 secondes
    setInterval(nextSlide, 4000);
}

// ========================================
// 2. GRAPHIQUES CIRCULAIRES ANIMÉS (KPI)
// ========================================

function animateCircularChart(chartElement) {
    const svg = chartElement.querySelector('svg');
    const circle = chartElement.querySelector('.circle-progress');
    const label = chartElement.querySelector('.percentage-label');

    if (!svg || !circle || !label) return;

    const percentage = parseInt(chartElement.dataset.percentage || 0);
    const radius = 52; // Rayon du cercle
    const circumference = 2 * Math.PI * radius;

    // Initialisation
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    // Animation du cercle
    const targetOffset = circumference - (percentage / 100) * circumference;
    setTimeout(() => {
        circle.style.strokeDashoffset = targetOffset;
    }, 100);

    // Animation du compteur
    let currentPercent = 0;
    const duration = 1500; // 1.5 secondes
    const increment = percentage / (duration / 16); // 60fps

    const counter = setInterval(() => {
        currentPercent += increment;
        if (currentPercent >= percentage) {
            currentPercent = percentage;
            clearInterval(counter);
        }
        label.textContent = Math.round(currentPercent) + '%';
    }, 16);
}

function initCircularCharts() {
    const charts = document.querySelectorAll('.kpi-circular-chart');

    // Observer pour animer quand l'élément est visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateCircularChart(entry.target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.3 });

    charts.forEach(chart => observer.observe(chart));
}

// ========================================
// 3. GRAPHIQUES CIRCULAIRES SVG (Gouvernance - style alternatif)
// ========================================

function initSVGCircularCharts() {
    const chartContainer = document.getElementById('stat-chart-container');
    if (!chartContainer) return;

    const progressCircle = chartContainer.querySelector('.progress-circle');
    const percentageText = chartContainer.querySelector('.percentage-text');

    if (!progressCircle || !percentageText) return;

    const targetPercentage = parseInt(chartContainer.dataset.percentage || 60);
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;

    let animationHasRun = false;

    const animateChart = (percentage) => {
        if (animationHasRun) return;
        animationHasRun = true;

        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;

        let currentPercent = 0;
        const interval = setInterval(() => {
            if (currentPercent >= percentage) {
                clearInterval(interval);
                percentageText.textContent = `${percentage}%`;
            } else {
                currentPercent++;
                percentageText.textContent = `${currentPercent}%`;
            }
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => animateChart(targetPercentage), 200);
                observer.unobserve(chartContainer);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(chartContainer);
}

// ========================================
// 4. ANIMATION AU SCROLL (Fade in up)
// ========================================

function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animationDelay = `${index * 100}ms`;
                    entry.target.classList.add('visible');
                }, 0);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// ========================================
// 5. SMOOTH SCROLL POUR LES ANCRES
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80; // Offset pour le sticky nav
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// 6. INITIALISATION AU CHARGEMENT DE LA PAGE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    initCircularCharts();
    initSVGCircularCharts();
    initScrollAnimations();
    initSmoothScroll();

    // Log pour debug
    console.log('✅ Pages animations initialized');
});
