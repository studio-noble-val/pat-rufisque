// This file defines a custom layer for mviewer using the recommended CustomLayer class.

// The ID of the layer, which must match the 'id' in the XML configuration.
const LAYER_ID = "pompes";

// The path to the KML file, relative to mviewer's main index.html file.
const KML_FILE_URL = 'apps/public/zone_de_lendeng/pompes.kml';

console.log(`[pompes.js] Defining custom layer '${LAYER_ID}' with modern CustomLayer class.`);
console.log(`[pompes.js] KML file URL is: ${KML_FILE_URL}`);

// Create the OpenLayers vector layer that will display the KML data.
const kmlLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: KML_FILE_URL,
        format: new ol.format.KML({
            // We set this to false because we will define our own style in JavaScript.
            extractStyles: false,
            // This ensures that all attributes from the KML are available for tooltips, etc.
            extractAttributes: true
        })
    }),
   // Define a custom style for the points to override the KML style.
    style: function(feature) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.9], // point d'ancrage de l'icône (0.5 = centre, 1 = bas)
                scale: 0.4,
                src: 'img/pumping-station.svg' // Chemin vers l'image de la pompe
            })
        });
    }
});

kmlLayer.getSource().on('featuresloadend', function(event) {
    // Iterate through the features and print the attributes to the console
    const features = event.target.getFeatures();
    features.forEach(feature => {
        // Get all attributes of the feature
        const attributes = feature.getProperties();

        // Log the attributes to the console
        console.log('Feature attributes:', attributes);

        // You can also log specific attributes, for example:
        // console.log('Name:', feature.get('name'));
    })
});

// Register the custom layer with mviewer.
// The CustomLayer class handles the necessary integration.
new CustomLayer(LAYER_ID, kmlLayer);
console.log(`[pompes.js] Custom layer '${LAYER_ID}' has been registered.`);