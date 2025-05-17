document.getElementById("submit").addEventListener("click", getAnswer);
document.getElementById("locate").addEventListener("click", getLocation);
document.getElementById("fetch").addEventListener("click", getCoordinates);

const url = new URL ("https://geocoding-api.open-meteo.com/v1/search?name=&count=5&language=en&format=json&countryCode=US");
const params = new URLSearchParams(url.search);

function getLocation() {
    const cityName = document.getElementById("city").value;
    params.set("name", cityName);
    url.search = params.toString();
    const cityURL = url.toString();
    document.getElementById("cityURL").innerHTML = cityURL;
}

async function getCoordinates() {
    const source = document.getElementById("cityURL").innerText;
    alert(source);
    const response = await fetch(source);
    const data = await response.json();
    alert(data);
    document.getElementById("test").innerHTML = JSON.stringify(data.results[0]);
    const x = data.results[0];
    alert(x.name)
}



function getAnswer() {
    const rawTemp = document.getElementById("temp").value;
    const condition = document.getElementById("condit").value.toLowerCase();

    let temp;
    if (condition.includes("sun") == true) {
        temp = Number(rawTemp) + 3;
    } else if (condition.includes("cloud") == true) {
        temp = Number(rawTemp) - 3;
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
    if (subjTemp > 68 && condition.includes("rain") == false) {
        answer = "nope!"
    } else if (subjTemp > 55 && condition.includes("rain") == true) {
        answer = "mostly for the rain, but yeah"
    } else if (subjTemp > 58) {
        answer = "yeah, something light"
    } else if (subjTemp > 45) {
        answer = "for sure"
    } else {
        answer = "jacket? try coat and hat"
    }
    document.getElementById("answer").innerText = answer;
}


