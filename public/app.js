var btn = document.getElementById("submit");
var p = document.getElementById('p1');
p.style.display = "none";

btn.addEventListener('click', async function(event) {
	event.preventDefault();
	
	let start1 = document.getElementById("start1").value;
	let end1 = document.getElementById("end1").value;
	let start2 = document.getElementById("start2").value;
	let end2 = document.getElementById("end2").value
	const country = 'USA';
	const api_url = `/temperature/${country}/${start1},${end1}/${start2},${end2}`;
	
	const resp = await fetch(api_url);
	const resp_json = await resp.json();
	alert('test');
	displayResults(resp_json, start1, end1, start2, end2);		  	
});



function displayResults(data, start1, end1, start2, end2){
	p.style.display = "block";
	document.getElementById('s1').textContent = start1; 
	document.getElementById('e1').textContent = end1;
	document.getElementById('s2').textContent = start2;
	document.getElementById('e2').textContent = end2;
	document.getElementById('temp1').textContent = data.average1;
	document.getElementById('temp2').textContent = data.average2;
	
	
}