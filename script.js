/*
 * global variables
 */
// pertinent subset of the dataset 
var theMap = L.map('mapid', {dragging:false});
var hfdcenter = [41.7556111, -72.6855556];
var schoolsIn06106 =[]
var layers = [];
var fdbkIHTML= "Hartford had <span class='em'>{NN}</span> school{PL} in <span class='em'>{YYYY}</span>";

// create map and set fly into Hartford city
theMap.setView(hfdcenter, 7);
setTimeout(function() {
  theMap.flyTo(hfdcenter, 14);
},1000)

// populate data subset
for (i = 0; i<hfddat.schools.length; i++)
  if (/^06106[-\d*]?$/.test(hfddat.schools[i].pincode)){
    hfddat.schools[i].formattedSince = formatSince(hfddat.schools[i].since);
    schoolsIn06106.push(hfddat.schools[i]);
  }

// add mapbox tile
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(theMap);

// CT boundary map; the geoJSON has been manually created
// using geojson.io
L.geoJSON(ctFeature, {
  style: {color: "#000"},
}).addTo(theMap);

// manipulate "map control" to allow the user to manipulate confiugrations
var userCfg = L.control();
userCfg.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'userCfg');
    var heading = '<h3>Schools in Hartford Over Time</h3>';
    var slider = '<div id="slider"><span class="range">1984</span>'+ 
    '<input id="slide" type="range" min="1984" max="2012" step="4"'+
    'value="2012" onchange="updateSlider(this.value)" />'+
    '<span class="range">2012</span></div>';
    var feedback = '<div id="fdbk">'+formatFdbk(15,2012)+'</div>'
    this._div.innerHTML = heading + slider + feedback;
    return this._div;
};
userCfg.addTo(theMap);
updateSlider(2012);

/*
 * utility functions
 */
// extracts the year from "since" field of each school in the dataset
function formatSince(v){
  return parseInt(v[5]+v[6]+v[7]+v[8]);
}

function formatFdbk(n, y){
  return fdbkIHTML.replace(/{NN}/,n).replace(/{PL}/,(n>1?'s':'')).replace(/{YYYY}/,y);
}

function updateSlider(value){
  layers.forEach(function (e){ e.remove(); layers=[];})
  schoolsIn06106.forEach(function (el) {
    if (el.formattedSince <= value) {
      var l = L.marker(el.coord)
       .bindPopup("<div class='popup'>"
         + (!!!el.logo ? "" : "<img src='"+el.logo+"' width=120px/><br/>")
         + el.name+"<br/>"
         + "Tel: "+el.tel+"<br/>"
         + "Since: "+el.formattedSince)
       .addTo(theMap);
      layers.push(l);
    }
  });
  document.getElementById("fdbk").innerHTML = formatFdbk(layers.length,value);
}
