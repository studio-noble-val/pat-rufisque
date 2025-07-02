// Définition des variables
const GEOJSON_FILE_URL = 'apps/public/gouvernance/fournisseurs.geojson';
const LAYER_ID = 'fournisseurs_locaux';

// --- Style par statut ---
// Un objet qui mappe chaque valeur de 'statut' à un style OpenLayers.
const statusStyles = {
    'Gie': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(255, 165, 0, 0.8)' // Orange pour les GIE
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 1.5
            }),
            radius: 5 // Le rayon sera modifié dynamiquement
        })
    }),
    'Entreprise individuelle/ SUARL': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(0, 128, 255, 0.8)' // Bleu pour les entreprises
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 1.5
            }),
            radius: 5 // Le rayon sera modifié dynamiquement
        })
    }),
    // Style par défaut si le statut n'est pas trouvé
    'default': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(128, 128, 128, 0.8)' // Gris
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 1.5
            }),
            radius: 5
        })
    })
};

// --- Légende pour la carte ---
// Mviewer utilisera cet objet pour construire la légende grâce à `vectorlegend="true"`
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

// --- Fonction de style dynamique ---
const styleFunction = function (feature, resolution) {
    const statut = feature.get('statut');
    const livraisonKg = feature.get('livraison_kg') || 0;

    // 1. Choisir le style de base en fonction du statut
    let style = statusStyles[statut] || statusStyles['default'];
    style = style.clone(); // Toujours cloner pour ne pas altérer le style de la légende

    // 2. Calculer le rayon en fonction de 'livraison_kg'
    const minKg = 20, maxKg = 150;
    const minRadius = 5, maxRadius = 15;
    let radius = minRadius + ((livraisonKg - minKg) / (maxKg - minKg)) * (maxRadius - minRadius);
    radius = Math.max(minRadius, Math.min(radius, maxRadius)); // Assure que le rayon reste dans les bornes

    // 3. Appliquer le rayon calculé
    style.getImage().setRadius(radius);

    return style;
};

// Création de la couche OpenLayers
const layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: GEOJSON_FILE_URL,
        format: new ol.format.GeoJSON()
    }),
    style: styleFunction
});

// Enregistrement de la couche personnalisée dans mviewer
new CustomLayer(LAYER_ID, layer, legend);