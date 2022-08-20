// change temp with database api
var departure_temp = "0"

async function getWeather() {
    let url = '';
    try {
        const response = await fetch("http://api.openweathermap.org/data/2.5/weather?id=294421&appid=d9cb5ce31d5e2c4a4874388b55a78972&units=metric");
        const parsedJson = await response.json();
        return [parsedJson["main"]["temp"],parsedJson["weather"][0]["main"]];
    } catch (error) {
        console.log(error);
    }
}

async function renderWeather() {
    let weather = await getWeather();
    var temp_sign = "°"
    departure_temp = weather[0]
    document.getElementById("temperature-text").innerHTML = weather[0] + temp_sign;
    if (weather[1] == "Clouds"){
        document.getElementById("weather-icon").className = "ph-cloud";
    }
    else if (weather[1] == "Clear"){
        document.getElementById("weather-icon").className = "ph-sun";
    }
    else if (weather[1] == "Atmosphere"){
        document.getElementById("weather-icon").className = "ph-cloud-fog";
    }
    else if (weather[1] == "Snow"){
        document.getElementById("weather-icon").className = "ph-snowflake";
    }
    else if (weather[1] == "Drizzle"){
        document.getElementById("weather-icon").className = "ph-drop-half";
    }
    else if (weather[1] == "Thunderstorm"){
        document.getElementById("weather-icon").className = "ph-cloud-lightning";
    }
}
renderWeather()

;(async () => {
    const weather = await getWeather()
    departure_temp = weather[0]
    for (var i = 0; i < 3; i++) {
        var new_flight ="\
        <div class=\"transfer\">\
            <div class=\"transfer-logo\">\
                <img src=\"plane-arrival-svgrepo-com.svg\" />\
            </div>\
            <dl class=\"transfer-details\">\
                <div>\
                    <dt>Reg. Day</dt>\
                    <dd>Holiday</dd>\
                </div>\
                <div>\
                    <dt>El-Al</dt>\
                    <dd>Company</dd>\
                </div>\
                <div>\
                    <dt>Ben-Gurion</dt>\
                    <dd>Dep. Airport</dd>\
                </div>\
                <div>\
                    <dt>Ben-Gurion</dt>\
                    <dd>Arr. Airport</dd>\
                </div>\
                <div>\
                    <dt>4012</dt>\
                    <dd>Fligh Number</dd>\
                </div>\
                <div>\
                    <dt>28 Oct. 21</dt>\
                    <dd>Flight Departure</dd>\
                </div>\
                <div>\
                    <dt>28 Oct. 21</dt>\
                    <dd>Flight Arrival</dd>\
                </div>\
                <div>\
                    <dt>Long</dt>\
                    <dd>Distance</dd>\
                </div>\
                <div>\
                    <dt>"+departure_temp+"°</dt>\
                    <dd>Temp. D.</dd>\
                </div>\
                <div>\
                    <dt>30.01°</dt>\
                    <dd>Temp. A.</dd>\
                </div>\
                <div>\
                <dt>H.Delay</dt>\
                <dd>Delay</dd>\
            </div>\
            </dl>\
        </div>";
        document.getElementById("list-of-flights").innerHTML += new_flight;
     }
  })()


