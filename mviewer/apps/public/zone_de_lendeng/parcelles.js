// This file defines a custom layer for mviewer using the recommended CustomLayer class.

// The ID of the layer, which must match the 'id' in the XML configuration.
const LAYER_ID = "parcelles";

// The path to the KML file, relative to mviewer's main index.html file.
const KML_FILE_URL = 'apps/public/zone_de_lendeng/lendeng_parcelles.kml';

console.log(`[parcelles.js] Defining custom layer '${LAYER_ID}' with modern CustomLayer class.`);
console.log(`[parcelles.js] KML file URL is: ${KML_FILE_URL}`);

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
    // Define a custom style for the polygons to override the KML style.
    style: new ol.style.Style({
        // Style for the fill of the polygons
        fill: new ol.style.Fill({
            color: 'rgba(76, 175, 80, 0.8)' // A semi-transparent green, matching the page theme
        })
    })
});

// Register the custom layer with mviewer.
// The CustomLayer class handles the necessary integration.
new CustomLayer(LAYER_ID, kmlLayer);
console.log(`[parcelles.js] Custom layer '${LAYER_ID}' has been registered.`);