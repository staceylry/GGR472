mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhY2V5bHJ5IiwiYSI6ImNsc2M5dnBraDBtenUya2xwYjRrZjVpNTkifQ.2TrM63nhF7bQGu6eY452vA'; //Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/staceylry/clsca4fd602y501p24p9u50rc', // style URL
    center: [-79.4, 43.685], // starting position [lng, lat]
    zoom: 11, // starting zoom
});

map.on('load', () => {
    //Add a data source containing GeoJSON data, data: sidney smith location spot
    map.addSource('uoft-data', {
        type: 'geojson',
        data: {  // type in your geojson data
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
        'type': 'circle', // point data
        'source': 'uoft-data',  // must match the source id
        'paint': {   // styles of the point on map
            'circle-radius': 5,
            'circle-color': '#FF00FF'
        }
    });

    // Add a data source from a Mapbox tileset, data: other u of t buildings
    map.addSource('buildings-data', { // Create your own source ID
        type: 'vector',
        url: 'mapbox://staceylry.1yadqcmn' // u of t buildings mapbox tileset ID
    });

    map.addLayer({
        'id': 'buildings-point',
        'type': 'circle',
        'source': 'buildings-data', // Must match source ID from addSource Method
        'source-layer': 'buildings-buv186', // Tileset NAME (diff to ID), get this from mapbox tileset page
        'paint': {  // styles of the point on map
            'circle-radius': 5,
            'circle-color': '#FF00FF'
        }
    });
});