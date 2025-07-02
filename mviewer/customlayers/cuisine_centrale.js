const GEOJSON_FILE_URL = 'apps/public/cantines/cuisine_centrale.geojson';
const LAYER_ID = 'cuisine_centrale';

const legend = {
    items: [
        {
            label: "Cuisine centrale",
            geometry: "Point",
            styles: [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 2,
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(0, 0, 255, 0.8)', // Bleu
                        }),
                        radius: 8
                    }),
                }),
            ],
        },
    ],
};

const layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: GEOJSON_FILE_URL,
        format: new ol.format.GeoJSON(),
    }),
    style: function (feature, resolution) {
        return legend.items[0].styles;
    },
});

new CustomLayer(LAYER_ID, layer, legend);