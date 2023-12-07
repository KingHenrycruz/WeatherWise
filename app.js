require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
   res.sendFile(__dirname + "/index.html")
});


app.post("/", async function(req, res){
    const query = req.body.cityName
    const apiKey = process.env.API_KEY;
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    await https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            // res.write("<p>The weather is currently " + weatherDescription + "<p>");
            // res.write("<h1>The temperature in " + query + " is " + temp + "degrees Celcius.</h1>");
            // res.write("<img src=" + imageURL + ">");
            const responseHTML = `
                <div style="text-align: center; margin-top: 20px; background-color: #616263; color: #DFDBDB; padding: 20px;">
                    <h1 style="font-family: 'Lobster', sans-serif; font-size: 3.5rem; margin-bottom: -1rem;">WeatherWise</h1>
                    <p style="font-style: italic;">Your Weather, Your Way</p>

                    <p style="font-size: 1.5rem; color: #61dafb;">The weather is currently ${weatherDescription}</p>
                    <h1 style="font-size: 3.5rem;">The temperature in ${query} is ${temp} degrees Celsius.</h1>
                    <img src="${imageURL}" alt="Weather Icon" style="margin-top: 20px;">

                    <!-- Back Button -->
                    <a href="/" style="color: #61dafb; text-decoration: none; margin-top: 20px; display: block;">
                        &larr; Back to Home
                    </a>
                </div>
            `;
            res.send(responseHTML)
        })
    })
   
})


app.listen(3000, function() {
    console.log("Listening on port 3000");
})