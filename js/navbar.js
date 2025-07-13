// js/navbar.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CHARGEMENT DE LA NAVBAR PRINCIPALE ---
    // On charge le HTML de la navbar dans le conteneur prévu à cet effet.
    fetch('navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau ou fichier navbar.html introuvable');
            }
            return response.text();
        })
        .then(data => {
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = data;
            }
            // On initialise la logique de la navigation collante APRÈS que la navbar soit chargée.
            initializeStickyNav();
        })
        .catch(error => {
            console.error("Erreur lors du chargement de la navbar:", error);
            // Afficher un message de secours si la navbar ne charge pas
            const navbarContainer = document.getElementById('navbar-container');
            if(navbarContainer) {
                navbarContainer.innerHTML = '<p style="text-align:center; background:red; color:white; padding:10px;">La barre de navigation n\'a pas pu être chargée.</p>';
            }
        });

    // --- 2. GESTION DU DIAPORAMA (SLIDESHOW) ---
    // Cette partie est générique et fonctionnera si la page contient un slideshow.
    const slideshowImages = document.querySelectorAll('.slideshow-image');
    if (slideshowImages.length > 0) {
        let currentImageIndex = 0;
        slideshowImages[0].classList.add('active'); // Affiche la première image
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
        // On cible la première section de la page qui sert de "hero"
        const heroSection = document.querySelector('main > section:first-of-type'); 

        if (!mainHeader || !subNav || !heroSection) {
            // S'il manque un des éléments, on ne fait rien pour éviter les erreurs.
            return;
        }

        const navButtons = subNav.querySelectorAll('.sub-nav-button');
        const contentSections = document.querySelectorAll('main section[id^="section-"]');
        const headerHeight = mainHeader.offsetHeight;

        // Observeur pour afficher/cacher la sub-nav
        const stickyObserver = new IntersectionObserver(
            ([entry]) => {
                // Si la section "hero" n'est plus visible en haut de la page, on affiche la sub-nav
                subNav.classList.toggle('visible', !entry.isIntersecting);
            },
            { rootMargin: `-${headerHeight}px 0px 0px 0px`, threshold: 0 }
        );
        stickyObserver.observe(heroSection);

        // Observeur pour mettre en évidence le lien actif dans la sub-nav
        if (navButtons.length > 0 && contentSections.length > 0) {
            const subNavHeight = subNav.offsetHeight;
            const sectionObserver = new IntersectionObserver(
                (entries) => {
                    let activeSectionId = null;
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            activeSectionId = entry.target.getAttribute('id');
                        }
                    });

                    navButtons.forEach(btn => {
                        const href = btn.getAttribute('href').substring(1);
                        btn.classList.toggle('active', href === activeSectionId);
                    });
                },
                { rootMargin: `-${headerHeight + subNavHeight}px 0px -45% 0px` }
            );
            contentSections.forEach(section => sectionObserver.observe(section));
        }
    }
});