var basemapUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
var attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';


///////////////////////////////////////////////////////////////////////
// Map 1                                                             //
///////////////////////////////////////////////////////////////////////

// - deleted - 

///////////////////////////////////////////////////////////////////////
// Select data for Maps 2 & 3                                                             //
///////////////////////////////////////////////////////////////////////

// this object is empty, but when we call getJSON(), we'll set it to the result
var globalData;

//listen for clicks on the dropdown
$("ul.dropdown-menu li a").click(function(e) {
  selectedYear = e.target.id;

  //iterate over each layer (polygon) in the geojson, call setStyle() on each, pass in 2nd argument with whatever property the user selected
  geo2.eachLayer(function (layer) {  
      layer.setStyle(style(layer.feature, selectedYear)) 
  });

});



///////////////////////////////////////////////////////////////////////
// Map 2                                                             //
///////////////////////////////////////////////////////////////////////

var map2 = L.map('map2', {
  scrollWheelZoom: true
}).setView( [55.924586,9.228516], 3);

//clean background
var tile2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.light'
    });
tile2.addTo(map2);

function brewer2(d) {
    return d > 100000 ? '#0000cc' :
           d > 75000  ? '#BD0026' :
           d > 50000  ? '#E31A1C' :
           d > 30000  ? '#FC4E2A' :
           d > 10000  ? '#FD8D3C' :
           d > 5000   ? '#FEB24C' :
           d > 1000   ? '#FED976' :
                        '#FFEDA0';
}

//added a 2nd argument to style() so we can get different fill colors depending on which property we are styling
function style(featureData, property) {

  //first time it runs, use 'abs15'
  if (!property) {
    property = "abs15";
  }

  return {
      fillColor: brewer2(featureData.properties[property]),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}


//helper functions are defined -> get data and render map!
//need to specify style and onEachFeature options when calling L.geoJson().
var geo2;

$.getJSON('data/allData.geojson', function(allData) {
  globalData = allData
  geo2 = L.geoJson(allData,{
    style: style,
  }).addTo(map2);
});