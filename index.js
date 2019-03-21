
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

if(req.body.result && req.body.result.parameters && req.body.result.parameters.any)
{
	
  var speech =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.any
      ? req.body.result.parameters.any
      : "Seems like some problem. Speak again.";
  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
}

else if(req.body.result && req.body.result.parameters && req.body.result.parameters.weather)
{
	var city =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.geoCity
      ? req.body.result.parameters.geoCity
      : loc();
	 
	var w=getWeatherCity(city);
	
	return res.json({
    speech: w,
    displayText: w,
    source: "webhook-echo-sample"
  });
  
}
else if(req.body.result && req.body.result.parameters && req.body.result.parameters.joke)
{

  //	if(city == null)
  //		city="Delhi";
        var w=getJoke();
        return res.json({
          speech: w,
          displayText: w,
          source: "joke"
        }); 
  

var r;
function getJoke()
{
	r=undefined;
	const request = require('request');

//let apiKey = '392e5b9bd00f4c5c35a0533f7abbac5d';
//let city = 'portland';
let url = `https://api.yomomma.info/`
request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body);
    let message = `It's ${weather.joke}!`;
    console.log(message);
    r=message;
  }

});
	while(r == undefined){
		require('deasync').runLoopOnce();
	}
		
	return r;
}
	
}


});
//console.log(w);
var rlt;
function loc()
{
	rlt=undefined;
	var req=request("http://ipinfo.io", function(err,response,body) {
	var loc=JSON.parse(body);
	console.log(loc);
	console.log(loc.city);
    rlt=loc.city;
});
while(rlt == undefined){
		require('deasync').runLoopOnce();
	}
		
	return rlt;

}
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
