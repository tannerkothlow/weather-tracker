$(".city-button").click(function () {

    //clearEntries();

    let city = this.id
    let unit = "imperial"

    pullWeatherData(city, unit);
});

$("#city-searcher").submit(function (event) {
    event.preventDefault();
    if ($("#city-entry").val() === "") {
        console.log("No city entered");
        return;
    }

    //clearEntries();

    let city = encodeURIComponent($("#city-entry").val())
    let unit = "imperial"
    
    pullWeatherData(city, unit);

    console.log("Form submit works");
    console.log($("#city-entry").val());
    //Clears search bar
    //$("#city-entry").val("");
});

var pullWeatherData = function(city, unit) {
    // GEOCODE
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1" + "&appid=1168898d2e6677ed97caa56280826004&units=" + unit)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //If user did not enter a real city
        if (data == false) {
            console.log("ERROR Did not enter a valid city")
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
            $("#current-weather").append("<li>Wind: " + data.list[0].wind.speed + " mph</li>");
            $("#current-weather").append("<li>Humidity: " + data.list[0].main.humidity + "%</li>");

            //Forecast Population

            for(let x = 0; x < data.list.length; x++) {
                if (data.list[x].dt_txt.includes("18:00:00")) {

                    let dayDate = moment.unix(data.list[x].dt).format("MM/DD/YYYY");

                    $(".five-day-forecast").append("<div class ='day-card'> <ol>" + 
                    "<li>" + dayDate + "</li>" +
                    "<li> <img src='http://openweathermap.org/img/wn/" + data.list[x].weather[0].icon + ".png' /> </li>" +
                    "<li>Temp: " + data.list[x].main.temp + " °F</li>" +
                    "<li>Wind: " + data.list[x].wind.speed + " mph</li>" +
                    "<li>Humidity: " + data.list[x].main.humidity + "%</li>" +
                    "</ol> </div>");
                };
            };
            //$("nav").append('<button class ="city-button" id="' + city + '">' + data.city.name + '</button>');
            //$("nav").append('<button class ="city-button" id="Minneapolis">Minneapolis</button>');
        });
    });
}

var clearEntries = function() {
    // Removes list elements and clears weather image
    $("#current-weather").empty();
    $("#weather-icon").remove();
    $(".five-day-forecast").empty();

    $("#city-entry").val("")

}

pullWeatherData("Saint%20Louis%20Park", "imperial");
//console.log(encodeURIComponent("Los Angeles"));