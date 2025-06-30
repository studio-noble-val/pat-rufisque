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

        mainContainer.innerHTML += render(accueilTpl, contenu);
        let axesItemsHtml = '';
        contenu.axes_strategiques.axes.forEach((axe, index) => {
            const axeData = { ...axe, image_column_order_class: index % 2 === 1 ? 'md:order-last' : '' };
            axesItemsHtml += render(axeItemTpl, axeData);
        });
        const axesSectionRendered = render(axesSectionTpl, contenu);
        mainContainer.innerHTML += axesSectionRendered;
        document.getElementById('axes-items-container').innerHTML = axesItemsHtml;
        let actionsItemsHtml = '';
        contenu.actions_concretes.actions.forEach(action => { actionsItemsHtml += render(actionItemTpl, action); });
        const actionsSectionRendered = render(actionsSectionTpl, contenu);
        mainContainer.innerHTML += actionsSectionRendered;
        document.getElementById('actions-items-container').innerHTML = actionsItemsHtml;
        let allianceActeursHtml = '';
        contenu.alliance.acteurs_liste.forEach(acteur => { allianceActeursHtml += render(allianceActeurItemTpl, acteur); });
        const allianceSectionRendered = render(allianceTpl, contenu);
        mainContainer.innerHTML += allianceSectionRendered;
        document.getElementById('alliance-acteurs-list').innerHTML = allianceActeursHtml;
        footerContainer.innerHTML = render(footerTpl, contenu);
        initVideoFacade();
    } catch (error) {
        console.error('Erreur lors de la construction de la page:', error);
        mainContainer.innerHTML = `<p class="text-center text-red-500">Erreur lors du chargement du contenu. Veuillez réessayer plus tard.</p>`;
    }
}

/**
 * Charge les composants réutilisables (header, carte, navbar, footer) pour les pages d'axe.
 */
async function loadStaticPageComponents() {
    // 1. Construire les composants dynamiques (header, carte)
    await buildPageHeader();
    await buildPageMap();

    // 2. Charger les fragments statiques (navbar, footer) via l'attribut data-include
    const fragmentElements = document.querySelectorAll('[data-include]');
    const fetchPromises = Array.from(fragmentElements).map(el => {
        const path = el.getAttribute('data-include');
        return fetch(path)
            .then(res => { if (!res.ok) throw new Error(`Fragment ${path} introuvable`); return res.text(); })
            .then(html => { el.innerHTML = html; })
            .catch(error => { 
                console.error(error); 
                el.innerHTML = `<p class="text-red-500 font-bold">${error.message}</p>`; 
            });
    });
    
    // Attendre que la navbar et le footer soient chargés
    await Promise.all(fetchPromises);

    // 3. Initialiser les interactions une fois le DOM prêt
    setActiveNav();
    initTabs(); // Le contenu des onglets est déjà dans le HTML, on initialise juste les listeners.
}

/**
 * Construit le header (titre, kpis) pour une page d'axe à partir d'un template.
 */
async function buildPageHeader() {
    const headerContainer = document.getElementById('page-header-container');
    if (!headerContainer) return;
    const pageId = document.body.getAttribute('data-active-page');
    if (!pageId) return;

    const pageData = {
        'gouvernance': { theme_class: 'gouvernance', emoji: '🤝', categorie: 'Gouvernance Alimentaire', titre: 'Une Gouvernance Locale et Participative', description: "Renforcer la collaboration et l'implication des acteurs pour un système alimentaire territorial inclusif et efficace, en soutenant notamment les TPE et les initiatives locales.", kpi1_valeur: '70%+', kpi1_label: 'TPE agro. portées par des femmes', kpi2_valeur: '9', kpi2_label: 'Établissements scolaires avec charte', kpi3_valeur: '3', kpi3_label: 'Axes d\'action pour les TPE' },
        'cantines': { theme_class: 'cantines', emoji: '🍽️', categorie: 'Cantines Scolaires', titre: "L'Alimentation Scolaire à Rufisque", description: "Un pilier pour la nutrition, l'éducation et le développement local.", kpi1_valeur: '5,500+', kpi1_label: 'élèves bénéficiaires', kpi2_valeur: '4', kpi2_label: 'cuisines centrales', kpi3_valeur: '22', kpi3_label: 'écoles desservies' },
        'sad': { theme_class: 'sad', emoji: '🌿', categorie: 'Systèmes Alimentaires Durables', titre: 'Renforcer la Durabilité de Notre Alimentation', description: "Focus sur la zone maraîchère de Lendeng : un pilier pour l'emploi, la préservation du foncier agricole et la gestion de l'eau.", kpi1_valeur: '187', kpi1_label: 'Membres GIE Lendeng (dont 30 femmes)', kpi2_valeur: '1000+', kpi2_label: 'Emplois directs (maraîchage Lendeng)', kpi3_valeur: '3,5 Mds', kpi3_label: 'FCFA CA annuel estimé (Lendeng)' }
    };
    
    const data = pageData[pageId];
    if (!data) return;

    try {
        const response = await fetch('partials/axe_header.html');
        if (!response.ok) throw new Error('Template partials/axe_header.html introuvable');
        let template = await response.text();
        
        template = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
            const cleanKey = key.trim();
            // Gère le cas spécial où la clé est utilisée pour une classe ET pour du texte
            if (cleanKey === 'theme_class') return data.theme_class;
            return data[cleanKey] || '';
        });
        headerContainer.innerHTML = template;

    } catch (error) { 
        console.error('Erreur construction header:', error);
        headerContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`;
    }
}

/**
 * Construit la carte mviewer pour une page d'axe à partir d'un template.
 */
async function buildPageMap() {
    const mapContainer = document.getElementById('page-map-container');
    if (!mapContainer) return;
    const pageId = document.body.getAttribute('data-active-page');
    if (!pageId) return;

    const mapData = {
        'gouvernance': { map_config_url: 'mviewer/?config=apps/public/gouvernance/map_gouvernance.xml' },
        'cantines': { map_config_url: '' }, // Pas de carte pour cette page
        'sad': { map_config_url: 'mviewer/?config=apps/public/zone_de_lendeng/zone_de_lendeng.xml' }
    };
    
    const data = mapData[pageId];
    if (!data || !data.map_config_url) { 
        if(mapContainer) mapContainer.remove(); // Supprime le conteneur si pas d'URL de carte
        return; 
    }

    try {
        const response = await fetch('partials/axe_carte.html');
        if (!response.ok) throw new Error('Template partials/axe_carte.html introuvable');
        let template = await response.text();

        template = template.replace('{{map_config_url}}', data.map_config_url);
        mapContainer.innerHTML = template;

    } catch (error) { 
        console.error('Erreur construction carte:', error);
        mapContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`;
    }
}


/** Met en évidence le lien de navigation correspondant à la page active. */
function setActiveNav() {
    const activePage = document.body.getAttribute('data-active-page');
    if (!activePage) return;
    
    // Le setTimeout est une sécurité pour s'assurer que le DOM de la navbar est bien présent
    setTimeout(() => {
        const navLink = document.getElementById(`nav-${activePage}`);
        if (navLink) {
            navLink.classList.remove('text-gray-500', 'border-transparent');
            const themeClass = `theme-${activePage}`;
            navLink.classList.add(`text-${themeClass}`, `border-${themeClass}`, 'font-bold');
        }
    }, 0);
}

/** Initialise le système d'onglets (les onglets sont en dur dans le HTML). */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length === 0) return;

    const tabPanels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPanelId = button.getAttribute('data-tab-target');
            tabButtons.forEach(btn => {
                btn.classList.remove('bg-pat-green-principal', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-600', 'hover:bg-gray-300', 'hover:text-gray-800');
                btn.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(panel => { panel.classList.add('hidden'); });

            button.classList.remove('bg-gray-200', 'text-gray-600', 'hover:bg-gray-300', 'hover:text-gray-800');
            button.classList.add('bg-pat-green-principal', 'text-white');
            button.setAttribute('aria-selected', 'true');
            const targetPanel = document.querySelector(targetPanelId);
            if (targetPanel) { targetPanel.classList.remove('hidden'); }
        });
    });
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