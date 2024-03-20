/*--------------------------------------------------------------------
GGR472 LAB 4: Incorporating GIS Analysis into web maps using Turf.js 
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
Step 1: INITIALIZE MAP
--------------------------------------------------------------------*/
// Define access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhY2V5bHJ5IiwiYSI6ImNsc2M5dnBraDBtenUya2xwYjRrZjVpNTkifQ.2TrM63nhF7bQGu6eY452vA'; //****ADD YOUR PUBLIC ACCESS TOKEN*****

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', // container id in HTML
    style: 'mapbox://styles/staceylry/clsca4fd602y501p24p9u50rc',  // ****ADD MAP STYLE HERE *****
    center: [-79.39, 43.65],  // starting point, longitude/latitude
    zoom: 12 // starting zoom level
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/
//HINT: Create an empty variable
//      Use the fetch method to access the GeoJSON from your online repository
//      Convert the response to JSON format and then store the response in your new variable
// Fetch GeoJSON from URL and store response

//Create an empty variable
let geojson;

// Fetch GeoJSON from URL and store response
fetch('https://raw.githubusercontent.com/staceylry/GGR472/main/ggr472-lab4-main/data/pedcyc_collision_06-21.geojson')
    .then(response => response.json())
    .then(response => {
        console.log(response); //Check response in console
        geojson = response; // Store geojson as variable using URL from fetch response
});

// addSource and addLayer
map.on('load', () => {
    // Add datasource using GeoJSON variable
    map.addSource('inputgeojson', {
        type: 'geojson',
        data: geojson
    });

    // Set style for when new points are added to the data source
    map.addLayer({
        'id': 'input-pnts',
        'type': 'circle',
        'source': 'inputgeojson',
        'visiblity': 'none',
        'paint': {
            'circle-radius': 5,
            'circle-color': 'grey'
        }
    });

    let bboxgeojson;
    let bbox = turf.envelope(geojson); // use turf to create an 'envelope' (bounding box) around points
    let bboxscaled = turf.transformScale(bbox, 1.10); // Scale bbox up by 10%

    // put the resulting envelope in a geojson format FeatureCollection
    bboxgeojson = {
        "type": "FeatureCollection",
        "features": [bboxscaled]
    };

    // CREATE A HEX GRID
    // must be in order: minX, minY, maxX, maxY. Select from scaled envelope created previously
    let bboxcoords = [
        bboxscaled.geometry.coordinates[0][0][0],
        bboxscaled.geometry.coordinates[0][0][1],
        bboxscaled.geometry.coordinates[0][2][0],
        bboxscaled.geometry.coordinates[0][2][1]
    ];

    // CREATE A HEX GRID
    let hexgrid = turf.hexGrid(bboxcoords, 0.5, { units: 'kilometers' });

    // COLLISION
    let collishex = turf.collect(hexgrid, geojson, '_id', 'values');

    let maxcollis = 0;

    // for loop go over each feature in collishex 
    collishex.features.forEach((feature) => {
        feature.properties.COUNT = feature.properties.values.length; // add counts to feature's property table
        // look for the maximum collsions in map
        if (feature.properties.COUNT > maxcollis) {
            // console.log(feature);
            maxcollis = feature.properties.COUNT;
        }
    });

    // console.log(maxcollis); // got 78 as result

    // add hexgrid to map
    map.addSource('hex', {
        type: 'geojson',
        data: hexgrid
    });

    // view hexgrid to map
    map.addLayer({
        'id': 'hexgrid',
        'type': 'fill',
        'source': 'hex',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'COUNT'],
                'lightgreen',
                10, 'red',
                25, 'purple'
            ],
            'fill-opacity': 0.5,
            'fill-outline-color': 'white'
        }
    });
});

document.getElementById('togglePointsBtn').addEventListener('click', toggleInputPoints);

//helper function to toggle the visibility of points
function toggleInputPoints() {
    var visibility = map.getLayoutProperty('input-pnts', 'visibility');
    
    if (typeof visibility === 'none') {
        map.setLayoutProperty('input-pnts', 'visibility', 'visible');
    } else {
        map.setLayoutProperty('input-pnts', 'visibility', 'none');
    }
}


/*--------------------------------------------------------------------
    Step 3: CREATE BOUNDING BOX AND HEXGRID
--------------------------------------------------------------------*/
//HINT: All code to create and view the hexgrid will go inside a map load event handler
//      First create a bounding box around the collision point data then store as a feature collection variable
//      Access and store the bounding box coordinates as an array variable
//      Use bounding box coordinates as argument in the turf hexgrid function



/*--------------------------------------------------------------------
Step 4: AGGREGATE COLLISIONS BY HEXGRID
--------------------------------------------------------------------*/
//HINT: Use Turf collect function to collect all '_id' properties from the collision points data for each heaxagon
//      View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty



// /*--------------------------------------------------------------------
// Step 5: FINALIZE YOUR WEB MAP
// --------------------------------------------------------------------*/
//HINT: Think about the display of your data and usability of your web map.
//      Update the addlayer paint properties for your hexgrid using:
//        - an expression
//        - The COUNT attribute
//        - The maximum number of collisions found in a hexagon
//      Add a legend and additional functionality including pop-up windows