$("button").click(function () {
    console.log("Button hooray!")
    //For Minneapolis MN
    let lat = 44.9778
    let lon = -93.2650
    let unit = "imperial"
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=1168898d2e6677ed97caa56280826004&units=" + unit)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        console.log("Feels like temp: " + data.list[0].main.feels_like);
    });
});