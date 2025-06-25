document.addEventListener('DOMContentLoaded', async () => {
    const mainContainer = document.getElementById('main-content');
    const footerContainer = document.getElementById('footer-container');

    try {
        // 1. Charger le contenu et les templates en parallèle
        const [
            contenuResponse,
            accueilTpl,
            axesSectionTpl,
            axeItemTpl,
            actionsSectionTpl,
            actionItemTpl,
            allianceTpl,
            allianceActeurItemTpl, // Nouveau partial pour un élément d'acteur
            footerTpl
        ] = await Promise.all([
            fetch('contenu.json'),
            fetch('partials/accueil.html').then(res => res.text()),
            fetch('partials/axes.html').then(res => res.text()),
            fetch('partials/axe-item.html').then(res => res.text()),
            fetch('partials/actions.html').then(res => res.text()),
            fetch('partials/action-item.html').then(res => res.text()),
            fetch('partials/alliance.html').then(res => res.text()),
            fetch('partials/alliance-acteur-item.html').then(res => res.text()), // Nouveau
            fetch('partials/footer.html').then(res => res.text())
        ]);

        if (!contenuResponse.ok) {
            throw new Error('Impossible de charger le fichier de contenu.');
        }

        const contenu = await contenuResponse.json();

        // 2. Fonction de "templating" simple pour les placeholders {{objet.propriete}}
        const render = (template, data) => {
            return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
                const keys = key.trim().split('.');
                let value = data;
                for (const k of keys) {
                    if (value === undefined || value === null) return match; // Laisse le placeholder si la clé n'est pas trouvée
                    value = value[k];
                }
                return value !== undefined && value !== null ? value : ''; // Retourne une chaîne vide si undefined/null
            });
        };

        // 3. Construire et injecter chaque section
        
        // Section Accueil
        mainContainer.innerHTML += render(accueilTpl, contenu);

        // Section Axes Stratégiques
        let axesItemsHtml = '';
        contenu.axes_strategiques.axes.forEach((axe, index) => {
            const axeData = {
                ...axe, // Copie toutes les propriétés de l'objet axe
                image_column_order_class: index % 2 === 1 ? 'md:order-last' : '' // Ajoute la classe pour l'agencement alterné de l'image dans la grille
            };
            axesItemsHtml += render(axeItemTpl, axeData);
        });
        const axesSectionRendered = render(axesSectionTpl, contenu);
        mainContainer.innerHTML += axesSectionRendered;
        document.getElementById('axes-items-container').innerHTML = axesItemsHtml;


        // Section Actions Concrètes
        let actionsItemsHtml = '';
        contenu.actions_concretes.actions.forEach(action => {
            actionsItemsHtml += render(actionItemTpl, action);
        });
        const actionsSectionRendered = render(actionsSectionTpl, contenu);
        mainContainer.innerHTML += actionsSectionRendered;
        document.getElementById('actions-items-container').innerHTML = actionsItemsHtml;


        // Section Alliance Territoriale
        let allianceActeursHtml = '';
        contenu.alliance.acteurs_liste.forEach(acteur => {
            allianceActeursHtml += render(allianceActeurItemTpl, acteur);
        });
        const allianceSectionRendered = render(allianceTpl, contenu);
        mainContainer.innerHTML += allianceSectionRendered;
        document.getElementById('alliance-acteurs-list').innerHTML = allianceActeursHtml;

        // Footer
        footerContainer.innerHTML = render(footerTpl, contenu);


        // 4. Ré-initialiser les scripts interactifs (comme la vidéo)
        initVideoFacade();

    } catch (error) {
        console.error('Erreur lors de la construction de la page:', error);
        mainContainer.innerHTML = `<p class="text-center text-red-500">Erreur lors du chargement du contenu. Veuillez réessayer plus tard.</p>`;
    }
});

/**
 * Initialise la façade vidéo. Cette fonction doit être appelée APRES que le HTML
 * de la section accueil a été injecté dans le DOM.
 */
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
