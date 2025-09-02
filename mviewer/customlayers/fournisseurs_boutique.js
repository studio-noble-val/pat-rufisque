// Fichier : template_customlayer_icon.js
// MODÈLE À COPIER/COLLER POUR CHAQUE ACTIVITÉ - VERSION HYBRIDE (SVG ou FontAwesome)

// ======================================================================
// === SEULE PARTIE À MODIFIER POUR CHAQUE COUCHE =======================
// ======================================================================

// 1. Infos de base
const ACTIVITY_FIELD = 'boutique';
const LAYER_ID = 'fournisseurs_boutique';
const LAYER_LABEL = 'Boutiques / Épiceries';

// 2. Style du pictogramme (HYBRIDE: SVG prioritaire, sinon FontAwesome)
const BACKGROUND_COLOR = '#778899';      // Couleur du cercle de fond (gris ardoise)
const ICON_SVG_PATH = null;             // Chemin vers l'icône SVG (ex: 'statics/picto_boutique.svg')
const ICON_UNICODE = '\uf54e';          // Icône FontAwesome (magasin) si SVG non fourni

// 3. Décalage (si besoin)
const OFFSET_X = 0; // en mètres
const OFFSET_Y = 0; // en mètres

// ======================================================================
// === LE RESTE DU CODE EST AUTOMATIQUE ================================
// ======================================================================

// --- Configuration commune ---
const GEOJSON_FILE_URL = 'apps/public/gouvernance/fournisseurs.geojson';

// --- Définition du style ---
const backgroundStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 12,
        fill: new ol.style.Fill({ color: BACKGROUND_COLOR }),
        stroke: new ol.style.Stroke({ color: 'white', width: 2 })
    })
});

let iconStyle;
if (ICON_SVG_PATH) {
    iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            src: ICON_SVG_PATH,
            // Vous pouvez ajuster l'échelle si vos SVG ne sont pas à la bonne taille
            // scale: 0.8 
        })
    });
} else {
    iconStyle = new ol.style.Style({
        text: new ol.style.Text({
            text: ICON_UNICODE,
            font: '900 14px "Font Awesome 5 Free"',
            fill: new ol.style.Fill({ color: 'white' })
        })
    });
}

const finalLayerStyle = [backgroundStyle, iconStyle];

// --- Définition de la légende ---
const legend = {
    items: [{
        label: LAYER_LABEL,
        geometry: "Point",
        styles: finalLayerStyle
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