$(document).on('click', '.city-button', function () {

    //clearEntries();

    let city = this.id
    let unit = "imperial"

    pullWeatherData(city, unit);
});

$("#city-searcher").submit(function (event) {
    event.preventDefault();
    if ($("#city-entry").val() === "") {
        console.log("No city entered");
        errorHandler(0);
        return;
    }

    let city = encodeURIComponent($("#city-entry").val())
    let unit = "imperial"
    
    pullWeatherData(city, unit);

    console.log("Form submit works");
    console.log($("#city-entry").val());
    
});

var pullWeatherData_old = function(city, unit) {
    // GEOCODE
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1" + "&appid=1168898d2e6677ed97caa56280826004&units=" + unit)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //If user did not enter a real city
        if (data == false) {
            console.log("ERROR Did not enter a valid city")
            errorHandler(1);
            return;
        }

        clearEntries();

        console.log(data[0]);
        console.log(data[0].lat + " " + data[0].lon);

        let lat = data[0].lat
        let lon = data[0].lon

        //Using the geocoded lat and lon, get the true weather
        fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=1168898d2e6677ed97caa56280826004&units=" + unit)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            console.log("City: " + data.city.name);

            let currentDate = moment.unix(data.list[0].dt).format("MM/DD/YYYY");

            //Current Weather Population

            $("#place-date").text(data.city.name + " (" + currentDate + ") ");
            $("#place-date").append("<img id='weather-icon' src='http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + ".png' />");

            $("#current-weather").append("<li>Temp: " + data.list[0].main.temp + " °F</li>");
            $("#current-weather").append("<li>Wind: " + data.list[0].wind.speed + " MPH</li>");
            $("#current-weather").append("<li>Humidity: " + data.list[0].main.humidity + "%</li>");

            //Forecast Population

            for(let x = 0; x < data.list.length; x++) {
                if (data.list[x].dt_txt.includes("18:00:00")) {

                    let dayDate = moment.unix(data.list[x].dt).format("MM/DD/YYYY");

                    $(".five-day-forecast").append("<div class ='day-card'> <ol>" + 
                    "<li>" + dayDate + "</li>" +
                    "<li> <img src='http://openweathermap.org/img/wn/" + data.list[x].weather[0].icon + ".png' /> </li>" +
                    "<li>Temp: " + data.list[x].main.temp + " °F</li>" +
                    "<li>Wind: " + data.list[x].wind.speed + " MPH</li>" +
                    "<li>Humidity: " + data.list[x].main.humidity + "%</li>" +
                    "</ol> </div>");
                };
            };
            //$("nav").append('<button class ="city-button" id="' + city + '">' + data.city.name + '</button>');
            //$("nav").append('<button class ="city-button" id="Minneapolis">Minneapolis</button>');
        });
    });
}

pullWeatherData = (city, unit) => {
  // GEOCODE
  fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1" + "&appid=1168898d2e6677ed97caa56280826004&units=" + unit)
  .then(function(response) {
      return response.json();
  })
  .then(function(data) {
      //If user did not enter a real city
      if (data == false) {
          console.log("ERROR Did not enter a valid city")
          errorHandler(1);
          return;
      }

      clearEntries();

      console.log(data[0]);
      console.log(data[0].lat + " " + data[0].lon);

      let lat = data[0].lat
      let lon = data[0].lon

      //Using the geocoded lat and lon, get the true weather
  fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=1168898d2e6677ed97caa56280826004&units=imperial")
  .then(function(response) {return response.json();})
  .then(function(data) {

  console.log(data);
    //console.log("City: " + data.city.name);

    let indexDay = moment.unix(data.list[0].dt).format("MM/DD/YYYY");
    let maxTemp 
    let minTemp
    let humidity = []
    let maxWind
    // let rainTime 
    // let snowTime
    let indexRain = false;
    let indexSnow = false;
    let iconID

    //Current Weather Population

    $("#place-date").text(data.city.name + " (" + indexDay + ") ");
    $("#place-date").append("<img id='weather-icon' src='http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + ".png' />");
    
    $("#current-weather").append("<li>Temp: " + data.list[0].main.temp + " °F</li>");
    $("#current-weather").append("<li>Wind: " + data.list[0].wind.speed + " MPH</li>");
    $("#current-weather").append("<li>Humidity: " + data.list[0].main.humidity + "%</li>");
    
    
    // Crunches Weather Data
    for (let i = 0; i < data.list.length; i++) {
      //Adds humidity to the array
      humidity.push(data.list[i].main.humidity);
      //Will only keep the highest max temp
      if (maxTemp < data.list[i].main.temp_max || maxTemp === undefined) {
        maxTemp = data.list[i].main.temp_max;
      };
      //Will only keep the lowest temp
      if (minTemp > data.list[i].main.temp_min || minTemp === undefined) {
        minTemp = data.list[i].main.temp_min;
      };
      //Grabs the highest wind speed
      if (maxWind > data.list[i].wind.speed || maxWind === undefined) {
        maxWind = data.list[i].wind.speed;
      };
      //Sets the weather icon if it's raining or snowing, snowing will take priority over rain
      if (data.list[i].weather[0].description.includes('rain') && indexRain === false && indexSnow === false) {
        iconID = data.list[i].weather[0].icon;
        indexRain = true;
      } else if (data.list[i].weather[0].description.includes('snow') && indexSnow === false) {
        iconID = data.list[i].weather[0].icon;
        indexSnow = true;
      } else if ((indexRain != true || indexSnow != true) && data.list[i].dt_txt.includes('18:00:00')) {
        iconID = data.list[i].weather[0].icon;
      };

      if (indexDay != moment.unix(data.list[i].dt).format("MM/DD/YYYY")) {
        //In case iconID was never defined. This can happen if the weather API is called at an inopprotune time.
        if (iconID === undefined) {
          iconID = data.list[i - 1].weather[0].icon;
        };
        //Calculate humidity
        let humidOp = 0;
        for (let x = 0; x < humidity.length; x++) {
          humidOp = humidOp + humidity[x];
        };
        let aveHumid = Math.round(humidOp / humidity.length);

        $(".five-day-forecast").append("<div class ='day-card'> <ol>" + 
            "<li>" + indexDay + "</li>" +
            "<li> <img src='http://openweathermap.org/img/wn/" + iconID + ".png' /> </li>" +
            "<li>Max Temp: " + maxTemp + " °F</li>" +
            "<li>Min Temp: " + minTemp + " °F</li>" +
            "<li>Wind: " + maxWind + " MPH</li>" +
            "<li>Humidity: " + aveHumid + "%</li>" +
            "</ol> </div>");
       
            maxTemp = undefined;
            minTemp = undefined;
            indexRain = false;
            // rainTime = undefined;
            indexSnow = false;
            // snowTime = undefined;
            humidity = [];
            indexDay = moment.unix(data.list[i].dt).format("MM/DD/YYYY");

          };
        };
      });
  });
}

historyButtons = city => {
    // Create a button just like the city button
    if ($('#button-container').children().length === 0) {
      $('#button-container').append('<p>History</p>');
      console.log('No children in button container')
    };
    console.log('City button appender value ' + city);
    $('#button-container').append('<button class ="city-button" id="' + city + '">' + city + '</button>');
}

function clearEntries() {
    // Removes list elements and clears weather image
    $("#current-weather").empty();
    $("#weather-icon").remove();
    $(".five-day-forecast").empty();

    $("#city-entry").val("")

}

errorHandler = type => {
    if (type === 0) {
        //Type 0 Error No City Entered
        $("#city-searcher").append("<p id='error'>No City Entered!</p>")
        setTimeout(function() {
        $("#error").remove();
        }, 2000);
    } else {
        //Type 1 Error No City Found
        $("#city-searcher").append("<p id='error'>City Not Found! Try Again</p>")
        setTimeout(function() {
        $("#error").remove();
        }, 2000);
    }
}

//pullWeatherData("Saint%20Louis%20Park", "imperial");
//console.log(encodeURIComponent("Los Angeles"));