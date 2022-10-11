$("button").click(function () {

    console.log("Button ID: " + this.id);
    // Removes list elements and clears weather image
    $("#current-weather").empty();
    $("#weather-icon").remove();

    let city = this.id
    let unit = "imperial"

    // GEOCODE
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1" + "&appid=1168898d2e6677ed97caa56280826004&units=" + unit)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

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

            //Current Weather Population

            $("#place-date").text(data.city.name + " " + data.list[0].dt_txt + " ");
            $("#place-date").append("<img id='weather-icon' src='http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + ".png' />");

            $("#current-weather").append("<li>Temp: " + data.list[0].main.temp + " °F</li>")
            $("#current-weather").append("<li>Wind: " + data.list[0].wind.speed + " mph</li>")
            $("#current-weather").append("<li>Humidity: " + data.list[0].main.humidity + "%</li>")

            //Forecast Population

            for (let i = 0; i < 5; i++) {
                $(".five-day-forecast").append("<div class ='day-card'> <ol> </ol> </div>")
            }
            
            for(let x = 0; x < data.list.length; x++) {
            //Maybe just use moment.js so I dont have to reconfigure everything.
                if (data.list[x].dt_txt.includes("12:00:00")) {
                    console.log("Date and time GMT: " + data.list[x].dt_txt);
                    console.log("Temp: " + data.list[x].main.temp + " F");
                    console.log("Wind: " + data.list[x].wind.speed + " mph");
                    console.log("Humidity: " + data.list[x].main.humidity + "%");
                };
            };
        });
    });
});