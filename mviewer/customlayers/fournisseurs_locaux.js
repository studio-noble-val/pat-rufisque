// Fichier : gouvernance_template_customlayer.js
// A copier/coller pour chaque activité.

// ======================================================================
// === SEULE PARTIE À MODIFIER POUR CHAQUE COUCHE =======================
// ======================================================================

// 1. Définir le nom du champ à filtrer (ex: 'cereales', 'maraichage'...)
const ACTIVITY_FIELD = 'locaux'; 

// 2. Définir l'identifiant unique de la couche (doit correspondre au 'id' du XML)
const LAYER_ID = 'fournisseurs_locaux';

// ======================================================================
// === LE RESTE DU CODE EST IDENTIQUE POUR TOUTES LES COUCHES ===========
// ======================================================================

// --- Configuration commune ---
const GEOJSON_FILE_URL = 'apps/public/gouvernance/fournisseurs.geojson';

// --- Styles et Légende ---
const statusStyles = {
    'Gie': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({ color: 'rgba(255, 165, 0, 0.8)' }),
            stroke: new ol.style.Stroke({ color: 'white', width: 1.5 }),
            radius: 5
        })
    }),
    'Entreprise individuelle/ SUARL': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({ color: 'rgba(0, 128, 255, 0.8)' }),
            stroke: new ol.style.Stroke({ color: 'white', width: 1.5 }),
            radius: 5
        })
    }),
    'default': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({ color: 'rgba(128, 128, 128, 0.8)' }),
            stroke: new ol.style.Stroke({ color: 'white', width: 1.5 }),
            radius: 5
        })
    })
};
const legend = {
    items: [{
        label: "GIE",
        geometry: "Point",
        styles: [statusStyles['Gie']]
    }, {
        label: "Entreprise individuelle/ SUARL",
        geometry: "Point",
        styles: [statusStyles['Entreprise individuelle/ SUARL']]
    }]
};
const styleFunction = function (feature, resolution) {
    const statut = feature.get('statut');
    const livraisonKg = feature.get('livraison_kg') || 0;
    let style = (statusStyles[statut] || statusStyles['default']).clone();
    const minKg = 20, maxKg = 150;
    const minRadius = 5, maxRadius = 15;
    let radius = minRadius + ((livraisonKg - minKg) / (maxKg - minKg)) * (maxRadius - minRadius);
    radius = Math.max(minRadius, Math.min(radius, maxRadius));
    style.getImage().setRadius(radius);
    return style;
};

// --- Création de la source et filtrage ---
const vectorSource = new ol.source.Vector({
    url: GEOJSON_FILE_URL,
    format: new ol.format.GeoJSON()
});

vectorSource.on('featuresloadend', function(event) {
    const source = event.target; 
    const allFeatures = source.getFeatures();
    const filteredFeatures = allFeatures.filter(feature => {
        return feature.get(ACTIVITY_FIELD) === 1;
    });
    source.clear();
    source.addFeatures(filteredFeatures);
});

// --- Création de la couche OpenLayers ---
const layer = new ol.layer.Vector({
    source: vectorSource,
    style: styleFunction
});

// --- Enregistrement de la couche dans mviewer ---
new CustomLayer(LAYER_ID, layer, legend);