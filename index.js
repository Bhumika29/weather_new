
'use strict';

const express = require("express");
const bodyParser = require("body-parser");
//const uuidv1 = require('uuid/v1');
const request=require("request");
var deasync = require('deasync');
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const path=require("path");
//const server=require("http").createServer(app);
//const io=require("socket.io")(server);
app.post('/webhook',(req,res) =>{
	//var city="delhi";
	
//	var city=req.body.result.parameters.geoCity;
//	if(city == null)
//		city="Delhi";
	var city =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.geoCity
      ? req.body.result.parameters.geoCity
      : "Delhi";
	var w=getWeatherCity(city);
	
	return res.json({
    speech: w,
    displayText: w,
    source: "webhook-echo-sample"
  });
  
	
	
});
//console.log(w);

var result;
function getWeatherCity(city)
{
	result=undefined;
	var apiKey="34a9377e8da80bcf07ce23338784491c";
	var url="http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid="+apiKey;
	console.log(url);
	var req=request(url,function (err,response,body){
	if(err)
		console.log(err);
	var weather=JSON.parse(body);
	console.log(weather);
	if(weather.message === 'city not found')
	{
			result="unable to get weather "+weather.message;
	}
	else
	{
		result="Right now its "+weather.main.temp+" degree with "+weather.weather[0].description;
	}
});
	while(result == undefined){
		require('deasync').runLoopOnce();
	}
		
	return result;
}


app.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
