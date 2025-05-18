document.getElementById("submit").addEventListener("click", getAnswer);
document.getElementById("fetch").addEventListener("click", getWeather);
// document.getElementById("test").addEventListener("click", getCondition);


const url = new URL ("https://geocoding-api.open-meteo.com/v1/search?name=&count=5&language=en&format=json&countryCode=US");
const params = new URLSearchParams(url.search);

function getLocation() {
    const cityName = document.getElementById("city").value;
    params.set("name", cityName);
    url.search = params.toString();
    const cityURL = url.toString();
    return cityURL;
}

async function getCoordinates() {
    const source = getLocation();
    const response = await fetch(source);
    const data = await response.json();

    const cityName = document.getElementById("city").value;
    const stateName = document.getElementById("state").value;

    const myArray = data.results;

    const locations = [];
    for (let i = 0; i < myArray.length; i++) {
        y = myArray[i];
        locations.push(y.name);
        if (y.name == cityName && y.admin1 == stateName) break;
    }

    const locIndex = Number(locations.length);
    const correctLocation = myArray[locIndex-1];

    const longitude = correctLocation.longitude;
    const latitude = correctLocation.latitude;

    return { longitude, latitude };
}

const weatherData = new URL ("https://api.open-meteo.com/v1/forecast?latitude=&longitude=&current=temperature_2m,weather_code,precipitation&timezone=auto&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch");
const weatherParams = new URLSearchParams(weatherData.search);

async function getAPI() {
    const { longitude, latitude } = await getCoordinates();
    weatherParams.set("latitude", latitude);
    weatherParams.set("longitude", longitude);
    weatherData.search = weatherParams.toString();
    const apiURL = weatherData.toString();
    return apiURL;
}

const conditions = new Map ([
    [0, "Clear sky"],
    [1, "Mainly clear"],
    [2, "Partly cloudy"],
    [3, "Overcast"],
    [45, "Fog"],
    [48, "Depositing rime fog"],
    [51, "Drizzle: Light intensity"],
    [53, "Drizzle: Moderate intensity"],
    [55, "Drizzle: Dense intensity"],
    [56, "Freezing Drizzle: Light intensity"],
    [57, "Freezing Drizzle: Dense intensity"],
    [61, "Rain: Slight intensity"],
    [63, "Rain: Moderate intensity"],
    [65, "Rain: Heavy intensity"],
    [66, "Freezing Rain: Light intensity"],
    [67, "Freezing Rain: Heavy intensity"],
    [71, "Snow fall: Slight intensity"],
    [73, "Snow fall: Moderate intensity"],
    [75, "Snow fall: Heavy intensity"],
    [77, "Snow grains"],
    [80, "Rain showers: Slight"],
    [81, "Rain showers: Moderate"],
    [82, "Rain showers: Violent"],
    [85, "Snow showers: Slight"],
    [86, "Snow showers: Heavy"],
    [95, "Thunderstorm: Slight or moderate"],
    [96, "Thunderstorm with slight hail"],
    [99, "Thunderstorm with heavy hail"]

]);

async function getWeather() {
    const link = await getAPI();
    const response = await fetch(link);
    const weather = await response.json();
    const data = weather.current;
    const temperature = data.temperature_2m;
    const weatherCode = data.weather_code;
    const condition = conditions.get(weatherCode);
    document.getElementById("temperature").innerHTML = temperature;
    document.getElementById("condition").innerHTML = condition;
    const tempInput = document.getElementById("temp");
    const conditInput = document.getElementById("condit");
    tempInput.value = temperature;
    conditInput.value = condition;
    return [temperature, condition];
}



async function getAnswer() {
    const rawTemp = document.getElementById("temp").value
    const userCondition = document.getElementById("condit").value

    let temp;
    if (userCondition.includes("sun") == true) {
        temp = Number(rawTemp) + 3;
    } else if (userCondition.includes("cloud") == true) {
        temp = Number(rawTemp) - 3;
    } else {
        temp = Number(rawTemp);
    }

    let subjTemp;
    if (document.getElementById("warm").checked == true) {
        subjTemp = Number(temp) + 5;
    } else if (document.getElementById("cold").checked == true) {
        subjTemp = Number(temp) - 5;
    } else {
        subjTemp = Number(temp);
    }

    let answer;
    if (subjTemp > 68 && userCondition.includes("rain") == false) {
        answer = "nope!"
    } else if (subjTemp > 55) {
        answer = "yeah, something light"
    } else if (subjTemp > 45) {
        answer = "for sure"
    } else {
        answer = "jacket? try coat and hat"
    }
    document.getElementById("answer").innerText = answer;
}


