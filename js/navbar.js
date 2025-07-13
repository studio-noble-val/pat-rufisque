

document.addEventListener('DOMContentLoaded', () => {


    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = data;
            }

            const currentPage = window.location.pathname.split('/').pop();
            const mainNavLinks = document.querySelectorAll('.main-nav-link');
            mainNavLinks.forEach(link => {
                const linkPage = link.getAttribute('href').split('/').pop();

                if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                    link.classList.add('active-page');
                }
            });

            initializeStickyNav();

            initializeBurgerMenu();
        })
        .catch(error => {
            console.error("Erreur lors du chargement de la navbar:", error);
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = '<p style="text-align:center; background:red; color:white; padding:10px;">La barre de navigation n\'a pas pu être chargée.</p>';
            }
        });



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


    function initializeStickyNav() {
        const mainHeader = document.getElementById('main-header');
        const subNav = document.getElementById('sub-nav');
        const heroSection = document.querySelector('main > section:first-of-type');

        if (!mainHeader || !subNav || !heroSection) {
            return;
        }

        const navButtons = subNav.querySelectorAll('.sub-nav-button');
        const contentSections = document.querySelectorAll('main section[id^="section-"]');

        const slider = subNav.querySelector('.active-background-slider');
        const headerHeight = mainHeader.offsetHeight;


        function updateSliderPosition() {
            const activeButton = subNav.querySelector('.sub-nav-button.active');
            if (activeButton && slider) {
                slider.style.left = `${activeButton.offsetLeft}px`;
                slider.style.width = `${activeButton.offsetWidth}px`;
            }
        }
        

        const stickyObserver = new IntersectionObserver(
            ([entry]) => {
                const isVisible = !entry.isIntersecting;
                subNav.classList.toggle('visible', isVisible);

                if (isVisible) {

                    setTimeout(updateSliderPosition, 50);
                }
            },
            { rootMargin: `-${headerHeight}px 0px 0px 0px`, threshold: 0 }
        );
        stickyObserver.observe(heroSection);


        if (navButtons.length > 0 && contentSections.length > 0) {
            const subNavHeight = subNav.offsetHeight;
            const sectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        const id = entry.target.getAttribute('id');
                        const navButton = subNav.querySelector(`a[href="#${id}"]`);
                        

                        if (entry.isIntersecting) {
                            navButtons.forEach(btn => btn.classList.remove('active'));
                            navButton.classList.add('active');

                            updateSliderPosition();
                        }
                    });
                },


                { rootMargin: `-${headerHeight + subNavHeight}px 0px -25% 0px` }
            );
            contentSections.forEach(section => sectionObserver.observe(section));
        }
        

        new ResizeObserver(updateSliderPosition).observe(subNav);
    }


    function initializeBurgerMenu() {
        const burgerButton = document.querySelector('.md\\:hidden button');
        const navLinks = document.querySelector('.hidden.md\\:flex');

        if (burgerButton && navLinks) {
            burgerButton.addEventListener('click', () => {

                navLinks.classList.toggle('open');
            });
        }
    }
});

