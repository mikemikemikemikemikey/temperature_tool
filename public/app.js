const btn = document.getElementById("submit");
const p = document.getElementById('p1');
const errorP = document.getElementById('error');
errorP.display = "none";
p.style.display = "none";
let selectedCountry = {name: "", code: ""};
let T = 'C';

//creates map pulling data from openstreet and github
async function createMap(){
const geojson = await fetch(
'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
	
	
const mymap = L.map('map').setView([20, 0], 2);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

const geoLayer = await geojson.json();
L.geoJSON(geoLayer, {
	onEachFeature: onEachFeature,
	style: countryStyle
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

//visual properties for each country
function countryStyle(feature){
	return {color: getRandomColor(),
	        weight: 1}
}

//color the countries on the map
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

createMap();

//button submits form to calculate average temperature in two time
//periods for a given country
btn.addEventListener('click', async function(event) {
	event.preventDefault();
	
	let start1 = document.getElementById("start1").value;
	let end1 = document.getElementById("end1").value;
	let start2 = document.getElementById("start2").value;
	let end2 = document.getElementById("end2").value;
    let selected = document.getElementById("select");
    T = selected.options[selected.selectedIndex].value;

	const country = selectedCountry.code;
	
//checks on user input	
	if(start1 < 1901 || start1 > 2012 || end1 < 1901 || end1 > 2012 ||
	  start2 < 1901 || start2 > 2012 || end2 < 1902 || end2 > 2012){
		p.style.display = "none";
		errorP.style.display = "block";
		errorP.textContent = "Sorry, no data for that time span!";
		return;
	}
	if(start1 == end1 || start2 == end2){
		p.style.display = "none";
		errorP.style.display = "block";
		errorP.textContent = "Let's try a larger time period";
		return;
	}		
	if(country === ""){
		p.style.display = "none";
		errorP.style.display = "block";
        errorP.textContent = "Woah slow down, you have to select a country";
		return;
	}	  
	if(start1 > end1){
		const temp1 = start1;
		start1 = end1;
		end1 = temp1;
	}
	if(start2 > end2){
		const temp2 = start2;
		start2 = end2;
		end2 = temp2;
	}
	
//call for data from server	
	const api_url = `/temperature/${country}/${start1},${end1}/${start2},${end2}?units=${T}`;
	
	const resp = await fetch(api_url);
	const resp_json = await resp.json();
	
	if(resp_json.average1 === null){
		p.style.display = "none";
		errorP.style.display = "block";
		errorP.textContent = `Bummer, no data for ${selectedCountry.name}`;
		return;
	}
	
	displayResults(resp_json, start1, end1, start2, end2);		  	
});


//displays average temperature results
function displayResults(data, start1, end1, start2, end2){
	errorP.style.display = "none";
	p.style.display = "block";
	document.getElementById('country').textContent = selectedCountry.name;
	document.getElementById('s1').textContent = start1; 
	document.getElementById('e1').textContent = end1;
	document.getElementById('s2').textContent = start2;
	document.getElementById('e2').textContent = end2;
	document.getElementById('temp1').textContent = data.average1;
	document.getElementById('temp2').textContent = data.average2;
	document.getElementById('u1').textContent = T;
	document.getElementById('u2').textContent = T;
	
	
}