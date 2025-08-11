// This file defines a custom layer for mviewer using the recommended CustomLayer class.

// The ID of the layer, which must match the 'id' in the XML configuration.
const LAYER_ID = "pt_alim";

// The path to the KML file, relative to mviewer's main index.html file.
const KML_FILE_URL = 'apps/public/zone_de_lendeng/pt_alim.kml';

console.log(`[pt_alim.js] Defining custom layer '${LAYER_ID}' with modern CustomLayer class.`);
console.log(`[pt_alim.js] KML file URL is: ${KML_FILE_URL}`);

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
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                    color: 'navy'
                }),
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 1.5
                }),
                points: 4,
                radius: 7,
                angle: Math.PI / 4
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
console.log(`[pt_alim.js] Custom layer '${LAYER_ID}' has been registered.`);