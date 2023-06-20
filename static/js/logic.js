// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
    "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>" + 
    "</h3><hr><p>Depth: " + feature.geometry.coordinates[2] + "</p>");
}

function getColor(d) {
    return d < 10 ? 'rgb(26,152,80)' :
          d < 20  ? 'rgb(102,189,99)' :
          d < 30  ? 'rgb(166,217,106)' :
          d < 40  ? 'rgb(217,239,139)' :
          d < 50  ? 'rgb(255,255,191)' :
          d < 60  ? 'rgb(255,105,105)' :
          d < 70  ? 'rgb(254,224,139)' :
          d < 80  ? 'rgb(253,174,97)' :
          d < 90  ? 'rgb(244,109,67)' :
                      'rgb(215,48,39)';
}


  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      
        let geojsonMarkerOptions = {
            radius: 4*feature.properties.mag,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
      };
      
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });
  

  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      let div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 10, 20, 30, 40, 50, 60, 70, 80],
      labels = [];

      function getColor(d) {
        return d < 10 ? 'rgb(26,152,80)' :
              d < 20  ? 'rgb(102,189,99)' :
              d < 30  ? 'rgb(166,217,106)' :
              d < 40  ? 'rgb(217,239,139)' :
              d < 50  ? 'rgb(255,255,191)' :
              d < 60  ? 'rgb(255,105,105)' :
              d < 70  ? 'rgb(254,224,139)' :
              d < 80  ? 'rgb(253,174,97)' :
              d < 90  ? 'rgb(244,109,67)' :
                          'rgb(215,48,39)';
    }
    

      div.innerHTML+='Depth<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}