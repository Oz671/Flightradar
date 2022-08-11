// change temp with database api
async function getWeather() {
    let url = '';
    try {
        const response = await fetch("http://api.openweathermap.org/data/2.5/weather?id=294421&appid=d9cb5ce31d5e2c4a4874388b55a78972&units=metric");
        const parsedJson = await response.json();
        return await parsedJson["main"]["temp"];
    } catch (error) {
        console.log(error);
    }
}
async function renderWeather() {
    let weather = await getWeather();
    var temp_sign = "°"
    document.getElementById("temperature-text").innerHTML = weather + temp_sign;
}

renderWeather();
