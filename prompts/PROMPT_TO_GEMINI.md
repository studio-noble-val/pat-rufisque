# Reprise du Développement - Site Vitrine ONG Rufisque

Salut Gemini ! Nous avons bien avancé hier sur la page d'accueil du site vitrine de la PAT Rufisque.

**État Actuel du Projet (Résumé des étapes précédentes) :**

*   Structure de base HTML, CSS, JS mise en place.
*   Page d'accueil (`index.html`) construite avec les sections suivantes :
    *   Hero (avec dégradé, titre, boutons, stats, image placeholder)
    *   Axes Stratégiques (layout alterné, images placeholders, descriptions, icônes Lucide)
    *   Actions Concrètes (cartes responsives, icônes Lucide, badges, CTA vers PDF)
    *   Alliance Territoriale (liste d'acteurs avec badges, citation, placeholder visualisation)
*   Footer complet (colonnes, infos contact, liens sociaux avec icônes Lucide, copyright).
*   Polices Google Fonts ('Montserrat' et 'Open Sans') intégrées.
*   Animations CSS subtiles (fade-in sections, scale-up image hero).
*   Premiers visuels (images de `placehold.co` et icônes Lucide) intégrés.
*   Le site est conçu pour être potentiellement intégré dans une iframe (pas de header/menu de navigation principal sur `index.html`).
*   Nous avons un fichier `RESUME_ETAPES.md` qui retrace notre progression.

**Objectifs pour Aujourd'hui :**

Nous allons nous concentrer sur les points suivants, en procédant étape par étape comme d'habitude (code, puis diff du `RESUME_ETAPES.md` avant de passer à l'étape suivante) :

1.  **Étape 8 : Amélioration de la Responsivité (Mobile-First)**
    *   Revoir chaque section de `index.html` pour s'assurer qu'elle s'affiche correctement sur les petits écrans (mobiles).
    *   Utiliser des media queries CSS pour ajuster les layouts, tailles de police, espacements si nécessaire.
    *   Points d'attention particuliers :
        *   Section Hero : lisibilité du texte, taille des boutons.
        *   Axes Stratégiques : passage des `axe-item` en une seule colonne sur mobile.
        *   Actions Concrètes : la grille `actions-grid` devrait déjà bien se comporter, mais vérifier.
        *   Alliance Territoriale : affichage de la liste des acteurs et de la citation.
        *   Footer : passage des colonnes `footer-col` en une seule colonne sur mobile.

2.  **Étape 9 : Préparation de la Structure pour les Pages Thématiques**
    *   Le client a indiqué que "chaqu'une des rubriques thématiques fera l'objet d'une page spécifique avec un module carto et du texte."
    *   Créons la structure pour une première page thématique type. Par exemple, une page pour l'"Axe 1 : Gouvernance Alimentaire".
    *   **Tâches :**
        *   Créer un nouveau fichier HTML (ex: `axe-gouvernance.html`).
        *   Ce fichier devra inclure une structure de base similaire à `index.html` (doctype, head avec liens CSS/JS/Fonts/Lucide, body, main, footer).
        *   Dans `<main>`, prévoir :
            *   Un titre de page clair.
            *   Une section pour le contenu textuel descriptif de l'axe.
            *   Un placeholder bien identifié pour le "module carto mViewer" (ex: `<div id="map-gouvernance" class="map-container">[Module Carto mViewer pour la Gouvernance Alimentaire]</div>`).
            *   Lier cette nouvelle page depuis `index.html` si pertinent (par exemple, rendre le titre de l'axe cliquable dans la section "Axes Stratégiques" sur la page d'accueil, ou ajouter un bouton "En savoir plus").
        *   Ajouter des styles CSS de base pour `.map-container` (ex: hauteur minimale, bordure) dans `style.css`.

## Étape 9 (suite) : Homogénéisation de la Page d'Accueil (`index.html`)

**Objectif :** Aligner le style de la page d'accueil (`index.html`) avec celui de la page thématique "Cantines Scolaires" (`page-cantines-scolaires.html`), en adoptant Tailwind CSS et en s'inspirant des styles existants de `css/style.css` pour une transition cohérente.

**Modifications apportées au fichier `index.html` :**

1.  **Adoption de Tailwind CSS :**
    *   Remplacement du lien vers `css/style.css` par le CDN de Tailwind CSS.
    *   Utilisation extensive des classes utilitaires de Tailwind pour la mise en page, la typographie, les espacements, les couleurs, et les ombres.
2.  **Stylisation des Sections avec Tailwind et CSS Personnalisé :**
    *   **Général :** Définition des polices de base ('Open Sans', 'Montserrat') et des couleurs principales (`bg-pat-green-principal`, `text-pat-green-principal`, etc.) dans une balise `<style>` pour compléter Tailwind et refléter les intentions de `css/style.css`.
    *   **Section Hero (`#accueil`) :** Application d'un dégradé de fond (`hero-gradient`), stylisation des titres, boutons (`btn-hero-primary`, `btn-hero-secondary`), et de l'image placeholder.
    *   **Section Axes Stratégiques (`#axes`) :** Utilisation de cartes avec images et textes alternés, stylisation des titres d'axe avec icônes SVG et couleur thématique. Fond de section alterné (`bg-section-alt`).
    *   **Section Actions Concrètes (`#actions`) :** Cartes d'action avec icônes SVG dans des cercles colorés, titres spécifiques, et badges d'impact (`badge-impact`). Bouton CTA stylisé.
    *   **Section Alliance Territoriale (`#alliance`) :** Mise en page en grille, liste des acteurs avec badges colorés spécifiques (`badge-acteur-*`), et citation mise en valeur.
    *   **Footer :** Stylisation avec des couleurs de fond sombres (`bg-footer-dark`, `bg-footer-bottom-dark`), titres et textes avec couleurs adaptées, et icônes sociales en SVG.
3.  **Intégration d'Icônes SVG :** Remplacement des icônes Lucide par des SVG inline pour une meilleure intégration et contrôle.
4.  **Cohérence Visuelle :** Harmonisation de l'apparence des éléments (cartes, titres, boutons, badges, espacements) pour une expérience utilisateur unifiée entre la page d'accueil et les pages thématiques.


3.  **Étape 10 (Optionnel, si le temps le permet) : Petites Améliorations et JavaScript**
    *   **Placeholder de visualisation des acteurs :** Si nous avons une idée simple pour remplacer le `[Espace pour une visualisation plus graphique des acteurs]` par quelque chose de plus visuel (même sans JS complexe), nous pouvons l'explorer.
    *   **JavaScript pour interactions simples :**
        *   Par exemple, un effet "smooth scroll" plus contrôlé si les ancres natives ne suffisent pas (peu probable vu qu'on a `scroll-behavior: smooth;`).
        *   Peut-être un bouton "Retour en haut" si la page devient très longue.

**Instructions pour chaque étape :**

*   Tu me fourniras les objectifs clairs de la sous-étape.
*   Tu me donneras le code complet (HTML, CSS, JS) à ajouter ou modifier, sous forme de diff si possible et si cela ne pose pas de problème.
*   Je validerai le code.
*   Tu me donneras ensuite le diff pour `RESUME_ETAPES.md`.
*   Je validerai le MD.
*   Nous passerons à la sous-étape ou à l'étape suivante.

Commençons par l'**Étape 8 : Amélioration de la Responsivité (Mobile-First)**.
Propose-moi les modifications pour rendre la section Hero responsive.
