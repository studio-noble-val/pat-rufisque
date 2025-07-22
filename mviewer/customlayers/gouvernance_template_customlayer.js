// Fichier : template_customlayer_icon.js
// MODÈLE À COPIER/COLLER POUR CHAQUE ACTIVITÉ - VERSION RAPIDE

// ======================================================================
// === SEULE PARTIE À MODIFIER POUR CHAQUE COUCHE =======================
// ======================================================================

// 1. Infos de base
const ACTIVITY_FIELD = 'METTRE_LE_NOM_DU_CHAMP_ICI';
const LAYER_ID = 'METTRE_L_ID_DE_LA_COUCHE_ICI';
const LAYER_LABEL = 'METTRE_LE_LABEL_POUR_LA_LEGENDE';

// 2. Style de l'icône
const BACKGROUND_COLOR = '#CCCCCC'; // Couleur du cercle de fond (ex: '#FF5733')
const ICON_UNICODE = '\uf0eb';     // Code Unicode de l'icône FontAwesome (ici, une ampoule)

// 3. Décalage (si besoin)
const OFFSET_X = 0; // en mètres
const OFFSET_Y = 0; // en mètres

// ======================================================================
// === LE RESTE DU CODE EST AUTOMATIQUE ================================
// ======================================================================

// --- Configuration commune ---
const GEOJSON_FILE_URL = 'apps/public/gouvernance/fournisseurs.geojson';

// --- Définition du style ---
// On crée un style pour le cercle de fond et un pour l'icône
// On les passera dans un tableau pour qu'ils se superposent
const backgroundStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 12, // Rayon du cercle de fond
        fill: new ol.style.Fill({
            color: BACKGROUND_COLOR
        }),
        stroke: new ol.style.Stroke({ color: 'white', width: 2 })
    })
});

const iconStyle = new ol.style.Style({
    text: new ol.style.Text({
        text: ICON_UNICODE,
        // Police et poids pour Font Awesome 5 "Solid" (fas)
        font: '900 14px "Font Awesome 5 Free"',
        fill: new ol.style.Fill({
            color: 'white' // L'icône elle-même sera blanche
        })
    })
});

// Le style final est la superposition des deux
const finalLayerStyle = [backgroundStyle, iconStyle];

// --- Définition de la légende ---
const legend = {
    items: [{
        label: LAYER_LABEL,
        geometry: "Point",
        styles: finalLayerStyle // La légende utilise le même style que la couche
    }]
};

// --- Création de la source et filtrage (logique inchangée) ---
const vectorSource = new ol.source.Vector({
    url: GEOJSON_FILE_URL, format: new ol.format.GeoJSON()
});

vectorSource.on('featuresloadend', function(event) {
    const source = event.target; 
    const allFeatures = source.getFeatures();
    const filteredFeatures = allFeatures.filter(feature => feature.get(ACTIVITY_FIELD) === 1);
    filteredFeatures.forEach(feature => {
        const geom = feature.getGeometry();
        if (geom) {
            const coords = geom.getCoordinates();
            geom.setCoordinates([coords[0] + OFFSET_X, coords[1] + OFFSET_Y]);
        }
    });
    source.clear();
    source.addFeatures(filteredFeatures);
});

// --- Création de la couche et enregistrement ---
const layer = new ol.layer.Vector({
    source: vectorSource,
    style: finalLayerStyle
});
new CustomLayer(LAYER_ID, layer, legend);