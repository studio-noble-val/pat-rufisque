// --- DÉFINITION DE L'ACTIVITÉ À FILTRER ---
// C'EST LA SEULE LIGNE À MODIFIER POUR CHAQUE FICHIER
const ACTIVITY_FIELD = 'boutique'; // Ex: 'maraichage', 'aviculture', etc.

// --- CONFIGURATION COMMUNE ---
const GEOJSON_FILE_URL = 'apps/public/gouvernance/fournisseurs.geojson';
const LAYER_ID = `fournisseurs_${ACTIVITY_FIELD}`;

// Styles et légende (identiques à votre ancien fichier)
const statusStyles = {
    'Gie': new ol.style.Style({ image: new ol.style.Circle({ fill: new ol.style.Fill({ color: 'rgba(255, 165, 0, 0.8)' }), stroke: new ol.style.Stroke({ color: 'white', width: 1.5 }), radius: 5 }) }),
    'Entreprise individuelle/ SUARL': new ol.style.Style({ image: new ol.style.Circle({ fill: new ol.style.Fill({ color: 'rgba(0, 128, 255, 0.8)' }), stroke: new ol.style.Stroke({ color: 'white', width: 1.5 }), radius: 5 }) }),
    'default': new ol.style.Style({ image: new ol.style.Circle({ fill: new ol.style.Fill({ color: 'rgba(128, 128, 128, 0.8)' }), stroke: new ol.style.Stroke({ color: 'white', width: 1.5 }), radius: 5 }) })
};
const legend = { items: [{ label: "GIE", geometry: "Point", styles: [statusStyles['Gie']] }, { label: "Entreprise individuelle/ SUARL", geometry: "Point", styles: [statusStyles['Entreprise individuelle/ SUARL']] }] };
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

// --- SOURCE FILTRÉE ---
const vectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    // On utilise un loader personnalisé pour filtrer les données
    loader: function(extent, resolution, projection, success, failure) {
        fetch(GEOJSON_FILE_URL)
            .then(response => response.json())
            .then(data => {
                const format = new ol.format.GeoJSON();
                let features = format.readFeatures(data);
                
                // C'est ici que la magie opère : on filtre les features !
                features = features.filter(feature => {
                    return feature.get(ACTIVITY_FIELD) === 1;
                });

                vectorSource.addFeatures(features);
                success(features);
            })
            .catch(err => {
                console.error("Erreur de chargement ou de filtrage du GeoJSON pour la couche " + LAYER_ID, err);
                failure();
            });
    },
    strategy: ol.loadingstrategy.all
});

// Création de la couche OpenLayers
const layer = new ol.layer.Vector({
    source: vectorSource,
    style: styleFunction
});

// Enregistrement de la couche
new CustomLayer(LAYER_ID, layer, legend);