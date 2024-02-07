mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhY2V5bHJ5IiwiYSI6ImNsc2M5dnBraDBtenUya2xwYjRrZjVpNTkifQ.2TrM63nhF7bQGu6eY452vA'; //Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/staceylry/clsca4fd602y501p24p9u50rc', // style URL
    center: [-79.4, 43.7], // starting position [lng, lat]
    zoom: 11, // starting zoom
});

map.on('load', () => {
    //Add a data source containing GeoJSON data
    map.addSource('uoft-data', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                    "name": "Sidney Smith Hall"
                    },
                    "geometry": {
                        "coordinates": [
                            -79.39865237301687,
                            43.662343395037766
                        ],
                        "type": "Point"
                    }
                }
            ]
        }
    });
    
    map.addLayer({
        'id': 'uoft-pnt',
        'type': 'circle',
        'source': 'uoft-data',
        'paint': {
            'circle-radius': 6,
            'circle-color': '#B42222'
        }
    });
});