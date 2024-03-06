mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhY2V5bHJ5IiwiYSI6ImNsc2M5dnBraDBtenUya2xwYjRrZjVpNTkifQ.2TrM63nhF7bQGu6eY452vA'; //Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/staceylry/clsca4fd602y501p24p9u50rc', // style URL
    center: [-79.4, 43.663], // starting position [lng, lat]
    zoom: 14, // starting zoom
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

    map.addLayer({
        'id': 'buildings-hl',
        'type': 'circle',
        'source': 'buildings-data', // Same as before, use same source twice
        'source-layer': 'buildings-buv186', // Tileset NAME (diff to ID), get this from mapbox tileset page
        'paint': {  // styles of the point on map
            'circle-radius': 5,
            'circle-color': white
        },
        'filter': ['==', ['get', 'buildingname'], ''] //Set an initial filter to return nothing
    });
});

// Click and popup window
map.on('click', 'buildings-point', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Building Name:</b> " + e.features[0].properties.buildingname) //Add buildingname to popup
        .addTo(map); //Show popup on map
});

map.on('click', 'uoft-pnt', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Building Name:</b> " + e.features[0].properties.name) //Add buildingname to popup
        .addTo(map); //Show popup on map
});

//mousemove and highlght
map.on('mousemove', 'buildings-hl', (e) => {
    if (e.features.length > 0) { //if there are features in the event features array (i.e features under the mouse hover) then go into the conditional

        //set the filter of the provinces-hl to display the feature you're hovering over
        //e.features[0] is the first feature in the array and properties.PRUID is the Province ID for that feature
        map.setFilter('buildings-hl', ['==', ['get', 'buildingname'], e.features[0].properties.buildingname]);

    }
 });