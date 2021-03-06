const express = require("express");
const bodyparser = require("body-parser");
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 8400;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));
app.use(express.static('public'));


//server requesting information from worldbank
app.get('/temperature/:country/:years1/:years2', async (request, response) => { 
	try{
	const units = request.query.units;
	const temp_url = 
	`http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/tas/year/${request.params.country}`;
	 
    const temp_response = await fetch(temp_url);	
	const temp_data = await temp_response.json();
	
	const years1 = request.params.years1.split(',');
	const years2 = request.params.years2.split(',');
	
    let avg1 = averageTemp(temp_data, years1, units);
	let avg2 = averageTemp(temp_data, years2, units);
	
	const data = {
	  average1 : avg1,
	  average2 : avg2
	};

	response.send(JSON.stringify(data));
	
	} catch (error){
		console.log(error)
	}
});

//function for calculating average temperature of data given years
function averageTemp(data, years, units){
	const yearStart = years[0];
	const yearEnd = years[1];
	
    let tempTotal = 0;
	let count = 0;
	for(obj of data){
		
		if(obj.year < yearStart) continue;
		if(obj.year > yearEnd) break;
		tempTotal = tempTotal + obj.data;
		count++;
	}
	if(units === "C"){
	return roundTo(tempTotal/count, 2);
	}
	return roundTo(convertF(tempTotal/count),2);
	
    		
}

//function for rounding temperature averages
function roundTo(n, digits) {
     if (digits === undefined) {
       digits = 0;
     }

     var multiplicator = Math.pow(10, digits);
     n = parseFloat((n * multiplicator).toFixed(11));
     var test =(Math.round(n) / multiplicator);
     return +(test.toFixed(digits));
}

function convertF(n){
	return n*(9/5) + 32;
}













