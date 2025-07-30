// This file defines a custom layer for mviewer using the recommended CustomLayer class.

// The ID of the layer, which must match the 'id' in the XML configuration.
const LAYER_ID_BATIMENTS = "limite_zone";

// The path to the KML file, relative to mviewer's main index.html file.
const KML_FILE_URL_BATIMENTS = 'apps/public/zone_de_lendeng/limite_zone_buffer.kml';

console.log(`[limite_zone.js] Defining custom layer '${LAYER_ID_BATIMENTS}' with modern CustomLayer class.`);
console.log(`[limite_zone.js] KML file URL is: ${KML_FILE_URL_BATIMENTS}`);

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
    style: new ol.style.Style({
        // Style for the stroke of the polygons
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 61, 71, 0)', // Dark red
            width: 2
        }),
        // Style for the fill of the polygons
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.36)' // A semi-transparent red
        })
    })
});

// Register the custom layer with mviewer.
new CustomLayer(LAYER_ID_BATIMENTS, kmlLayerBatiments);
console.log(`[limite_zone.js] Custom layer '${LAYER_ID_BATIMENTS}' has been registered.`);