# Refactorisation de la page `index.html`

Ce document récapitule les étapes clés de la refactorisation de la page `index.html` pour la rendre plus modulaire, maintenable et évolutive, en utilisant JavaScript pour l'assemblage dynamique du contenu.

---

## Étape 1 : Centralisation du contenu dans `contenu.json`

**Objectif :** Séparer le contenu textuel du HTML pour faciliter les mises à jour et la gestion.

**Action :**
- Création du fichier `c:/wamp64/www/pat-rufisque/contenu.json`.
- Transfert de tous les textes, titres, descriptions, liens, IDs de vidéo, etc., de `index.html` vers ce fichier JSON, structuré par section.

---

## Étape 2 : Création des fragments HTML (`partials`)

**Objectif :** Découper la page `index.html` en petites sections réutilisables et rendre les éléments de liste dynamiques.

**Actions :**
- Création du dossier `c:/wamp64/www/pat-rufisque/partials/`.
- Création des fichiers de section principaux :
    - `c:/wamp64/www/pat-rufisque/partials/accueil.html`
    - `c:/wamp64/www/pat-rufisque/partials/axes.html` (structure de la section Axes)
    - `c:/wamp64/www/pat-rufisque/partials/actions.html` (structure de la section Actions)
    - `c:/wamp64/www/pat-rufisque/partials/alliance.html` (structure de la section Alliance)
    - `c:/wamp64/www/pat-rufisque/partials/footer.html`
- Création des fichiers pour les éléments de liste (utilisés dans les boucles JavaScript) :
    - `c:/wamp64/www/pat-rufisque/partials/axe-item.html` (pour un seul axe stratégique)
    - `c:/wamp64/www/pat-rufisque/partials/action-item.html` (pour une seule carte d'action)
    - `c:/wamp64/www/pat-rufisque/partials/alliance-acteur-item.html` (pour un seul acteur de l'alliance)
- Remplacement de tous les textes dans ces fichiers HTML par des placeholders `{{chemin.vers.donnee}}` qui seront remplis par le JavaScript.

---

## Étape 3 : Transformation de `index.html` en "coquille" vide

**Objectif :** Réduire `index.html` à sa structure minimale, agissant comme un point d'entrée pour le chargement dynamique.

**Action :**
- Suppression de tout le contenu HTML des sections `<main>` et `<footer>`.
- Ajout d'IDs (`id="main-content"`, `id="footer-container"`) aux conteneurs pour que le JavaScript puisse les cibler.
- Suppression du script JavaScript de la vidéo YouTube qui était en ligne.
- Ajout d'une balise `<script src="js/main-builder.js"></script>` à la fin du `<body>` pour charger le script d'assemblage.

---

## Étape 4 : Création du script d'assemblage `js/main-builder.js`

**Objectif :** Développer la logique JavaScript pour charger le contenu JSON, les fragments HTML, les assembler et les injecter dans la page.

**Actions :**
- Création du fichier `c:/wamp64/www/pat-rufisque/js/main-builder.js`.
- Implémentation de la logique suivante :
    - Chargement asynchrone de `contenu.json` et de tous les fichiers `partials/*.html`.
    - Création d'une fonction `render()` pour remplacer les placeholders `{{...}}` dans les templates HTML avec les données du JSON.
    - Bouclage sur les tableaux de données (axes, actions, acteurs) pour générer le HTML de chaque élément en utilisant les `*-item.html` correspondants.
    - Injection du HTML généré dans les conteneurs appropriés de `index.html`.
    - Ré-initialisation des scripts interactifs (comme la façade vidéo YouTube) une fois le contenu injecté.

---

**Résultat :** La page `index.html` est désormais construite dynamiquement au chargement, avec un contenu géré séparément et une structure modulaire.