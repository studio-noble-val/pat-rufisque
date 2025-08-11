// This file defines a custom layer for mviewer using the recommended CustomLayer class.

// The ID of the layer, which must match the 'id' in the XML configuration.
const LAYER_ID_BATIMENTS = "voies_ruissellement";

// The path to the KML file, relative to mviewer's main index.html file.
const KML_FILE_URL_BATIMENTS = 'apps/public/zone_de_lendeng/voies_ruissellement.kml';

console.log(`[voies_ruissellement.js] Defining custom layer '${LAYER_ID_BATIMENTS}' with modern CustomLayer class.`);
console.log(`[voies_ruissellement.js] KML file URL is: ${KML_FILE_URL_BATIMENTS}`);

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
    // [MODIFIÉ] Remplacement par un style simple pour des pointillés ronds.
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#000080', // Code couleur pour "Bleu marine"
            width: 4,         // Épaisseur, qui sera le diamètre de vos points. Ajustez si besoin.
            lineDash: [1, 10], // Motif : un "tiret" de 1px suivi d'un espace de 10px.
            lineCap: 'round'  // Essentiel : cela transforme chaque petit tiret en un point rond.
        })
    })
});

// Register the custom layer with mviewer.
new CustomLayer(LAYER_ID_BATIMENTS, kmlLayerBatiments);
console.log(`[voies_ruissellement.js] Custom layer '${LAYER_ID_BATIMENTS}' has been registered.`);