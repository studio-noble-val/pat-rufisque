document.addEventListener('DOMContentLoaded', async () => {
    // Détecte si nous sommes sur la page d'accueil (qui a des conteneurs spécifiques)
    // ou sur une page d'axe (qui n'en a pas).
    const isHomePage = document.getElementById('main-content') && document.getElementById('footer-container');

    if (isHomePage) {
        // Si c'est la page d'accueil, on la construit à partir du JSON.
        await buildHomePage();
    } else {
        // Sinon (page d'axe), on assemble les composants partagés.
        await loadStaticPageComponents();
    }
});

/**
 * Construit la page d'accueil dynamiquement en utilisant contenu.json et les templates.
 * (Code original de l'utilisateur)
 */
async function buildHomePage() {
    const mainContainer = document.getElementById('main-content');
    const footerContainer = document.getElementById('footer-container');

    try {
        const [
            contenuResponse,
            accueilTpl, axesSectionTpl, axeItemTpl,
            actionsSectionTpl, actionItemTpl, 
            allianceTpl, allianceActeurItemTpl, footerTpl
        ] = await Promise.all([
            fetch('contenu.json'),
            fetch('partials/accueil.html').then(res => res.text()),
            fetch('partials/axes.html').then(res => res.text()),
            fetch('partials/axe-item.html').then(res => res.text()),
            fetch('partials/actions.html').then(res => res.text()),
            fetch('partials/action-item.html').then(res => res.text()),
            fetch('partials/alliance.html').then(res => res.text()),
            fetch('partials/alliance-acteur-item.html').then(res => res.text()),
            fetch('partials/footer.html').then(res => res.text())
        ]);

        if (!contenuResponse.ok) throw new Error('Impossible de charger le fichier de contenu.');
        const contenu = await contenuResponse.json();
        const render = (template, data) => template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
            const keys = key.trim().split('.');
            let value = data;
            for (const k of keys) {
                if (value === undefined || value === null) return match;
                value = value[k];
            }
            return value !== undefined && value !== null ? value : '';
        });

        let mainHtml = render(accueilTpl, contenu);

        // Section Actions
        let actionsItemsHtml = '';
        contenu.actions_concretes.actions.forEach(action => { actionsItemsHtml += render(actionItemTpl, action); });
        mainHtml += render(actionsSectionTpl, contenu);

        // Section Axes
        let axesItemsHtml = '';
        contenu.axes_strategiques.axes.forEach((axe, index) => {
            const axeData = { ...axe, image_column_order_class: index % 2 === 1 ? 'md:order-last' : '' };
            axesItemsHtml += render(axeItemTpl, axeData);
        });
        mainHtml += render(axesSectionTpl, contenu);

        // Section Alliance
        let allianceActeursHtml = '';
        contenu.alliance.acteurs_liste.forEach(acteur => { allianceActeursHtml += render(allianceActeurItemTpl, acteur); });
        mainHtml += render(allianceTpl, contenu);

        // Injection unique dans le DOM pour le contenu principal
        mainContainer.innerHTML = mainHtml;

        // Remplissage des conteneurs d'items maintenant qu'ils sont dans le DOM
        document.getElementById('axes-items-container').innerHTML = axesItemsHtml;
        document.getElementById('actions-items-container').innerHTML = actionsItemsHtml;
        document.getElementById('alliance-acteurs-list').innerHTML = allianceActeursHtml;
        footerContainer.innerHTML = render(footerTpl, contenu);
        initVideoFacade();
    } catch (error) {
        console.error('Erreur lors de la construction de la page:', error);
        mainContainer.innerHTML = `<p class="text-center text-red-500">Erreur lors du chargement du contenu. Veuillez réessayer plus tard.</p>`;
    }
}



/** Initialise la façade vidéo pour la page d'accueil. */
function initVideoFacade() {
    const videoFacade = document.getElementById('video-facade');
    const videoContainer = document.getElementById('video-container');

    if (videoFacade && videoContainer) {
        videoFacade.addEventListener('click', function() {
            const videoId = this.dataset.videoid;
            const iframe = document.createElement('iframe');
            iframe.setAttribute('class', 'w-full h-full rounded-lg');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`);
            iframe.setAttribute('title', 'Vidéo illustrant la Politique Alimentaire Territoriale de Rufisque');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', '');
            
            videoContainer.innerHTML = '';
            videoContainer.appendChild(iframe);
            videoContainer.classList.remove('p-3', 'sm:p-5', 'bg-opacity-10');
        }, { once: true });
    }
}