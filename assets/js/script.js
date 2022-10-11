$("button").click(function () {
    console.log(this.id);

    //For Minneapolis MN
    // let lat = 44.9778
    // let lon = -93.2650

    let city = this.id
    let unit = "imperial"
    // fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=1168898d2e6677ed97caa56280826004&units=" + unit)

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

            // if (data.list[6].dt_txt.includes("12:00:00")) {
            //     console.log("includes works")
            // }

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

        // fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&cnt=5&appid=1168898d2e6677ed97caa56280826004&units=" + unit)
        // .then(function(response) {
        //     return response.json();
        // })
        // .then(function(data) {
        //     console.log(data);
        // })
    });
});