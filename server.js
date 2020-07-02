const express = require("express");
const bodyparser = require("body-parser");
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});


app.use(bodyparser.json());
app.use(express.static('public'));


//server requesting information from worldbank
app.get('/temperature/:country/:years1/:years2', async (request, response) => {
	
	const temp_url = 'http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/tas/year/${request.params.country}';
	  
    const temp_response = await fetch(weather_url);
	const temp_data = await temp_data.json();
	
	
	const years1 = request.params.years1.split(',');
	const years2 = request.params.years2.split(',');
	
    let avg1 = averageTemp(temp_data, years1);
	let avg2 = averageTemp(temp_data, years2);
	
	const data = {
	  average1 : avg1,
	  average2 : avg2
	};
	
	response.json(data);
	
});

//function for calculating average temperature of data given years
function averageTemp(data, years){
	const yearStart = years[0];
	const yearEnd = years[1];
	
    let tempTotal = 0;
	let count = 0;
	for(obj of temp_data){
		
		if(obj.year < yearStart) continue;
		if(obj.year > yearEnd) break;
		tempTotal = tempTotal + obj.data;
		count++;
	}
	return tempTotal/count;
	
	
}

















