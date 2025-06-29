class ParcelleCustomLayer extends CustomLayer {
    constructor(layerId, options) {
        super(layerId);
        this.options = options;
    }

    createLayer() {
        const KML_FILE_URL = '../data/lendeng_parcelles.kml'; // Path corrected to be relative to mviewer's index.html

        const vectorSource = new ol.source.Vector({
            url: KML_FILE_URL,
            format: new ol.format.KML({
                extractStyles: true,  // Extracts styles from the KML file
                extractAttributes: true // Extracts attributes from the KML file
            }),
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: null, // If extractStyles is true, styles from KML will be used. Otherwise, define your style here.
        });

        return vectorLayer;
    }
}

// mviewer looks for a class named 'CustomLayer' in your file, so make sure you export it as such
window.CustomLayer = ParcelleCustomLayer;