
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
else if(req.body.result && req.body.result.parameters && req.body.result.parameters.die)
{
	      var w=die();
        return res.json({
          speech: w,
          displayText: w,
          source: "Places"
        }); 
  

var result;
function die()
{
  var resu;
	var coin=Math.floor(Math.random() * 2);
  if(coin==0)
  {
    resu='heads';
    console.log('heads');}
  else{
    resu='tails';
    console.log('tails');
  }
  result=resu;
	while(result == undefined){
		require('deasync').runLoopOnce();
	}

	return result;
}
	
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
else if(req.body.result && req.body.result.parameters && req.body.result.parameters.quote)
{
        var w=getQuote();
        return res.json({
          speech: w,
          displayText: w,
          source: "quotee"
        }); 
  

var result;
function getQuote()
{
	result=undefined;
	const request = require('request');

//let apiKey = '392e5b9bd00f4c5c35a0533f7abbac5d';
//let city = 'portland';
let url = `https://random-math-quote-api.herokuapp.com/`
request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let q = JSON.parse(body);
    let message = `It's ${q.quote}!`;
    console.log(message);
    result=message;
  }

});
	while(result == undefined){
		require('deasync').runLoopOnce();
	}
		
	return result;
}

}
else if(req.body.result && req.body.result.parameters && req.body.result.parameters.date)
{
	var datetime = new Date();
    var w="Date is " +datetime.toISOString().slice(0,10);
	 return res.json({
          speech: w,
          displayText: w,
          source: "joke"
        });
	
	
}

else if(req.body.result && req.body.result.parameters && req.body.result.parameters.search)
{
    var query= req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.search
      ? req.body.result.parameters.search
      : 'chatbot';
  	
  //	if(city == null)
  //		city="Delhi";
        var w=search(query);
        return res.json({
          speech: w,
          displayText: w,
          source: "wikisearch"
        }); 
 

var result;
function search(query)
{
	result=undefined;
	const request = require('request');

//let apiKey = '392e5b9bd00f4c5c35a0533f7abbac5d';
//let city = 'portland';
let url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ query +"&format=json"
request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    var wiki = JSON.parse(body);
    for (var i = 0; i < 1; i++) {
       var data = `You searched for ${wiki[1][i]}: And these are the  details — ${wiki[2][i]} Follow this link to read more — ${wiki[3][i]}` + '\n';
        console.log(data);
    }
    result=data;
  }

});
	while(result == undefined){
		require('deasync').runLoopOnce();
	}
		
	return result;
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
