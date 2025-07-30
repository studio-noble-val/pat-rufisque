// This file defines a custom layer for mviewer using the recommended CustomLayer class.

// The ID of the layer, which must match the 'id' in the XML configuration.
const LAYER_ID_BATIMENTS = "routes";

// The path to the KML file, relative to mviewer's main index.html file.
const KML_FILE_URL_BATIMENTS = 'apps/public/zone_de_lendeng/routes.kml';

console.log(`[routes.js] Defining custom layer '${LAYER_ID_BATIMENTS}' with modern CustomLayer class.`);
console.log(`[routes.js] KML file URL is: ${KML_FILE_URL_BATIMENTS}`);

// Create the OpenLayers vector layer that will display the KML data.
const kmlLayerBatiments = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: KML_FILE_URL_BATIMENTS,
        format: new ol.format.KML({
            // We set this to false because we will define our own style in JavaScript.
            extractStyles: false,
            // This ensures that all attributes from the KML are available for tooltips, etc.
            extractAttributes: true
        })
    }),
    // Define a custom style for the polygons to override the KML style.
    // To create an outlined effect (casing), we provide an array of two styles.
    // The first style is for the wider, black "outline".
    // The second style is for the narrower, white "interior" drawn on top.
    style: [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 1)', // Black color for the outline
                width: 4 // This is the outline, so it's wider.
            }),
            zIndex: 0 // Render this style first for all features.
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 255, 255, 1)', // White color for the interior
                width: 2
            }),
            zIndex: 1 // Render this style on top for all features.
        })
    ]
});

// Register the custom layer with mviewer.
new CustomLayer(LAYER_ID_BATIMENTS, kmlLayerBatiments);
console.log(`[routes.js] Custom layer '${LAYER_ID_BATIMENTS}' has been registered.`);