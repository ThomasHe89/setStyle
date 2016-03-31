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
var selectedYear = "abs15"; 

//listen for clicks on the dropdown
$("ul.dropdown-menu li a").click(function(e) {
  selectedYear = e.target.id;

  //iterate over each layer (polygon) in the geojson, 
  //call setStyle() on each, pass in 2nd argument with 
  //whatever property the user selected
  geo2.eachLayer(function (layer) {  
      layer.setStyle(style(layer.feature, selectedYear)) 
  });
  infoHelper(selectedYear);
});

infoHelper(selectedYear);

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
function style(featureData) {

  //first time it runs, use 'abs15'
  // if (!selectedYear) {
  //   selectedYear = "abs15";
  // }

  return {
      fillColor: brewer2(featureData.properties[selectedYear]),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

function infoHelper(selectedYear) {
  // //first time it runs, use 'abs15'
  // if (!selectedYear) {
  //   selectedYear = "abs15";
  // }
  document.getElementById("res").innerHTML = selectedYear;
  return selectedYear;
}
//control that shows state info on hover
var info2 = L.control();

info2.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info2.update = function(properties) {
  console.log(selectedYear);
  this._div.innerHTML = '<h4>Immigration in 2015</h4>' +  (properties ?
    '<b>' + properties.SOVEREIGNT + '</b><br />' + properties[selectedYear]
    : 'Hover over a state');
};

info2.addTo(map2);


//this function is set to run when a user mouses over any polygon
function mouseover2(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
  }
  info2.update(layer.feature.properties);
}

//this runs on mouseout
function reset2(e) {
  console.log(e.target);
  e.target.setStyle(style(e.target.feature));
}

//this is executed once for each feature in the data, and adds listeners
function done2(feature, layer) {
  layer.on({
      mouseover: mouseover2,
      mouseout: reset2
      //click: zoomToFeature
  });
}


//helper functions are defined -> get data and render map!
//need to specify style and onEachFeature options when calling L.geoJson().
var geo2;

$.getJSON('data/allData.geojson', function(allData) {
  globalData = allData
  geo2 = L.geoJson(allData,{
    style: style,
    onEachFeature: done2
  }).addTo(map2);
});

var legend2 = L.control({position: 'bottomright'});

legend2.onAdd = function(map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1000, 5000, 10000, 30000, 50000, 75000, 100000],
    labels = [],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + brewer2(from + 1) + '"></i> ' +
      from + (to ? ' &ndash; ' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend2.addTo(map2);
