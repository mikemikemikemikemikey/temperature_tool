var btn = document.getElementById("submit");
var p = document.getElementById('p1');
p.style.display = "none";
var selectedCountry = {name: "", code: ""};

//creates map pulling data from openstreet and github
async function createMap(){
const mymap = L.map('map').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

const geojson = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
const geoLayer = await geojson.json();
L.geoJSON(geoLayer, {
	onEachFeature: onEachFeature
}).addTo(mymap);
}

//allows user to select countries using the map
function onEachFeature(feature, layer) {   
        layer.bindPopup(feature.properties.ADMIN); 
		layer.on('click', function(e){
			selectedCountry.name = feature.properties.ADMIN
			selectedCountry.code = feature.properties.ISO_A3;
		});       		
}

createMap();

//button submits form to calculate average temperature in two time
//periods for a given country
btn.addEventListener('click', async function(event) {
	event.preventDefault();
	
	let start1 = document.getElementById("start1").value;
	let end1 = document.getElementById("end1").value;
	let start2 = document.getElementById("start2").value;
	let end2 = document.getElementById("end2").value
	const country = selectedCountry.code;
	const api_url = `/temperature/${country}/${start1},${end1}/${start2},${end2}`;
	
	const resp = await fetch(api_url);
	const resp_json = await resp.json();
	
	
	displayResults(resp_json, start1, end1, start2, end2);		  	
});


//displays average temperature results
function displayResults(data, start1, end1, start2, end2){
	p.style.display = "block";
	document.getElementById('country').textContent = selectedCountry.name;
	document.getElementById('s1').textContent = start1; 
	document.getElementById('e1').textContent = end1;
	document.getElementById('s2').textContent = start2;
	document.getElementById('e2').textContent = end2;
	document.getElementById('temp1').textContent = data.average1;
	document.getElementById('temp2').textContent = data.average2;
	
	
}