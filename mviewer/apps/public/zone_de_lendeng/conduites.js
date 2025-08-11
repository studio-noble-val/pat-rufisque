// This file defines a custom layer for mviewer using the recommended CustomLayer class.

// The ID of the layer, which must match the 'id' in the XML configuration.
const LAYER_ID = "conduites";

// The path to the KML file, relative to mviewer's main index.html file.
const KML_FILE_URL = 'apps/public/zone_de_lendeng/conduites.kml';

console.log(`[conduites.js] Defining custom layer '${LAYER_ID}' with modern CustomLayer class.`);
console.log(`[conduites.js] KML file URL is: ${KML_FILE_URL}`);

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
   // Define a custom style for the lines based on the 'Denominati' attribute.
    style: function(feature) {
        const denominatiStr = feature.get('Denominati');
        let strokeWidth = 1; // Default to smallest size
        let color = '#39FF14'; // Default to brightest color
        let zIndex = 1; // Default z-index for drawing order

        if (denominatiStr && typeof denominatiStr === 'string') {
            const parts = denominatiStr.split(' ');
            if (parts.length === 2) {
                const diameter = parseInt(parts[1], 10);
                if (!isNaN(diameter)) {
                    if (diameter <= 50) {
                        strokeWidth = 1;   // Strongly reduced width
                        color = '#39FF14'; // Brightest
                        zIndex = 1;        // Drawn first (at the bottom)
                    } else if (diameter <= 100) {
                        strokeWidth = 3;
                        color = '#2E8B57';
                        zIndex = 2;        // Drawn second
                    } else {
                        strokeWidth = 5;
                        color = '#006400'; // Darkest
                        zIndex = 3;        // Drawn last (on top)
                    }
                }
            }
        }

        // Increased the white border thickness
        const casingWidth = strokeWidth + 4;

        return [
            // Style for the white casing (the background line)
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: casingWidth
                }),
                zIndex: zIndex // zIndex ensures draw order
            }),
            // Style for the main, colored line
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: color,
                    width: strokeWidth
                }),
                zIndex: zIndex // zIndex ensures draw order
            })
        ];
    }
});

// This section helps you see the data from your KML in the browser's developer console.
kmlLayer.getSource().on('featuresloadend', function(event) {
    const features = event.target.getFeatures();
    console.log(`[conduites.js] Loaded ${features.length} features.`);
    const denominatiValues = new Set();
    features.forEach(feature => {
        denominatiValues.add(feature.get('Denominati'));
    });
    console.log("[conduites.js] Found 'Denominati' values:", Array.from(denominatiValues));
});

// Register the custom layer with mviewer.
new CustomLayer(LAYER_ID, kmlLayer);
console.log(`[conduites.js] Custom layer '${LAYER_ID}' has been registered.`);
