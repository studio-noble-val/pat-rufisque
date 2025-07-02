const GEOJSON_FILE_URL = 'apps/public/cantines/cantines_scolaires.geojson';
const LAYER_ID = 'cantines_scolaires';

const legend = {
    items: [
        {
            label: "Cantine scolaire",
            geometry: "Point",
            styles: [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 1.5,
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(0, 128, 0, 0.8)', // Vert
                        }),
                        radius: 6
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