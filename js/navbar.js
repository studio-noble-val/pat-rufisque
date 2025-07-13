// js/navbar.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CHARGEMENT DE LA NAVBAR PRINCIPALE ---
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = data;
            }
            initializeStickyNav();
        })
        .catch(error => {
            console.error("Erreur lors du chargement de la navbar:", error);
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = '<p style="text-align:center; background:red; color:white; padding:10px;">La barre de navigation n\'a pas pu être chargée.</p>';
            }
        });

    // --- 2. GESTION DU DIAPORAMA (SLIDESHOW) ---
    // (Cette partie reste inchangée)
    const slideshowImages = document.querySelectorAll('.slideshow-image');
    if (slideshowImages.length > 0) {
        let currentImageIndex = 0;
        slideshowImages[0].classList.add('active');
        setInterval(() => {
            slideshowImages[currentImageIndex].classList.remove('active');
            currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
            slideshowImages[currentImageIndex].classList.add('active');
        }, 5000);
    }

    // --- 3. FONCTION POUR LA LOGIQUE DE LA NAVIGATION COLLANTE (STICKY SUB-NAV) ---
    function initializeStickyNav() {
        const mainHeader = document.getElementById('main-header');
        const subNav = document.getElementById('sub-nav');
        const heroSection = document.querySelector('main > section:first-of-type');

        if (!mainHeader || !subNav || !heroSection) {
            return;
        }

        const navButtons = subNav.querySelectorAll('.sub-nav-button');
        const contentSections = document.querySelectorAll('main section[id^="section-"]');
        const slider = subNav.querySelector('.active-background-slider'); // On récupère notre curseur
        const headerHeight = mainHeader.offsetHeight;

        // Fonction pour mettre à jour la position du curseur
        function updateSliderPosition() {
            const activeButton = subNav.querySelector('.sub-nav-button.active');
            if (activeButton && slider) {
                slider.style.left = `${activeButton.offsetLeft}px`;
                slider.style.width = `${activeButton.offsetWidth}px`;
            }
        }
        
        // Observeur pour afficher/cacher la sub-nav
        const stickyObserver = new IntersectionObserver(
            ([entry]) => {
                const isVisible = !entry.isIntersecting;
                subNav.classList.toggle('visible', isVisible);
                // Si la nav devient visible, on s'assure que le curseur est bien placé
                if (isVisible) {
                    setTimeout(updateSliderPosition, 50); // Petit délai pour s'assurer que tout est rendu
                }
            },
            { rootMargin: `-${headerHeight}px 0px 0px 0px`, threshold: 0 }
        );
        stickyObserver.observe(heroSection);

        // Observeur pour mettre en évidence le lien actif
        if (navButtons.length > 0 && contentSections.length > 0) {
            const subNavHeight = subNav.offsetHeight;
            const sectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        const id = entry.target.getAttribute('id');
                        const navButton = subNav.querySelector(`a[href="#${id}"]`);
                        
                        // On active/désactive le bouton si la section entre ou sort de la zone
                        if (entry.isIntersecting) {
                            navButtons.forEach(btn => btn.classList.remove('active'));
                            navButton.classList.add('active');
                            updateSliderPosition(); // On déplace le curseur
                        }
                    });
                },
                // MODIFICATION CLÉ : On rend la "zone active" plus grande sur l'écran
                // Le bouton restera actif jusqu'à ce que la section ait scrollé au-delà de 75% du haut de l'écran.
                { rootMargin: `-${headerHeight + subNavHeight}px 0px -25% 0px` }
            );
            contentSections.forEach(section => sectionObserver.observe(section));
        }
        
        // S'assurer que le curseur se repositionne si la taille de la fenêtre change
        new ResizeObserver(updateSliderPosition).observe(subNav);
    }
});