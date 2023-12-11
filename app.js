// Load environment variables from the .env file
require('dotenv').config();

// Import required modules
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");


// Create an instance of the Express application
const app = express();

// Use bodyParser middleware to parse request bodies
app.use(bodyParser.urlencoded({extended: true}));

// Define a route for the home page
app.get("/", function(req, res){
    // Send the index.html file when accessing the root route
   res.sendFile(__dirname + "/index.html")
});

// Define a route to handle POST requests
app.post("/", async function(req, res){
    // Extract the city name from the request body
    const query = req.body.cityName

    // Retrieve the OpenWeatherMap API key from the environment variables
    const apiKey = process.env.API_KEY;
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    await https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data)

            // Extract relevant weather information
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            // res.write("<p>The weather is currently " + weatherDescription + "<p>");
            // res.write("<h1>The temperature in " + query + " is " + temp + "degrees Celcius.</h1>");
            // res.write("<img src=" + imageURL + ">");


            // Construct the HTML response to be sent
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

            // Send the constructed HTML response
            res.send(responseHTML)
        })
    })
   
})


// Start the Express server and listen on port 3000
app.listen(3000, function() {
    console.log("Listening on port 3000");
})
