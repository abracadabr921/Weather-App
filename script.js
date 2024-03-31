let videoName = "";
let videoBackground = document.querySelector(".video__container");

let temperatureDiv = document.querySelector(".temperature");
let feelsLikeDiv = document.querySelector(".feels__like");
let windSpeedDiv = document.querySelector(".wind__speed");
let humidityDiv = document.querySelector(".humidity");
let weatherDiv = document.querySelector(".weather__info");
let cityNameDiv = document.querySelector(".city");
let dayGreeting = document.querySelector(".day");
let nightGreeting = document.querySelector(".night");
let dropdownOptions = document.querySelector(".dropdown__options");


let cityName = "";
let stateName = "";
let countryCode = "";

//max number of results that showing dropdown options
const limit = "30";

let temp;
let feelsLike;
let windSpeed;
let humidity;
let weather;
let isDay;
let latitude;
let longitude;


//closes tab with names of cities
document
  .querySelector(".dropdown")
  .addEventListener("keydown", function (event) {
    event._isClick = true;
    dropdownOptions.style.display = "block";

    if (event.key === "Enter") {
      dropdownOptions.style.display = "none";
    }
  });
document.body.addEventListener("click", function () {
  if (event._isClick == true) return;

  dropdownOptions.style.display = "none";
});

//converts wmo weather codes to words
function whatWeather(weather__code) {
  let what_weather = "";
  switch (weather__code) {
    case 0:
      what_weather = "Clear sky";
      break;
    case 1:
    case 2:
    case 3:
      what_weather = "Cloudy";
      break;

    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 48:
    case 49:
      what_weather = "Fog";
      break;

    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
    case 58:
    case 59:
      what_weather = "Drizzle";
      break;

    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 65:
    case 66:
    case 67:
    case 68:
    case 69:
      what_weather = "Rain";
      break;

    case 70:
    case 71:
    case 72:
    case 73:
    case 74:
    case 75:
    case 76:
    case 77:
    case 78:
    case 79:
      what_weather = "Snow fall";
      break;

    case 80:
    case 81:
    case 82:
    case 83:
    case 84:
      what_weather = "Rain showers";
      break;

    case 85:
    case 86:
      what_weather = "Snow showers";
      break;
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 97:
    case 98:
    case 99:
      what_weather = "Thunderstorm";
      break;
  }
  return what_weather;
}

//changes background video, depending on the weather conditions
function changeBackgroundVideo(what__weather) {
  switch (what__weather) {
    case "Clear sky":
      videoName = "clear";
      break;
    case "Cloudy":
      videoName = "cloudy";
      break;
    case "Fog":
      videoName = "fog";
      break;
    case "Rain showers":
    case "Drizzle":
    case "Rain":
      videoName = "rain";
      break;
    case "Snow showers":
    case "Snow fall":
      videoName = "snowfall";
      break;
    case "Thunderstorm":
      videoName = "storm";
      break;
  }
}


//get names of cities by help of user input
async function GetNameOfCities() {

  let NameOfCity;
  let CodeOfCountry;
  let NameOfState = "";

  cityName = document.querySelector(".input__city").value;

  geocodingAPI_url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=${limit}&language=en&format=json`;

  dropdownOptions.innerHTML = ""; //clear the options tab 

  try {
    const response = await fetch(geocodingAPI_url);
    const listOfCities = await response.json();
    console.log(listOfCities);

    //taking data from each element from array of cities
    for (let i = 0; i < listOfCities.results.length; i += 1) {
      NameOfCity = listOfCities.results[i].name;
      CodeOfCountry = listOfCities.results[i].country_code;

      //do not show, if undefined
      if (listOfCities.results[i].admin1 === undefined) {
        NameOfState = "";
      } else {
        NameOfState = `${listOfCities.results[i].admin1}, `;
      }

      dropdownOptions.innerHTML += `<p class="option" onclick="clickOfOption(${listOfCities.results[i].latitude}, ${listOfCities.results[i].longitude}, '${listOfCities.results[i].country_code}', '${listOfCities.results[i].admin1}', '${listOfCities.results[i].name}')">${NameOfCity}, ${NameOfState} ${CodeOfCountry}</p>`;
    }
  } catch (error) {
    console.log("error");
  }
}


let funcIsNotClicked = true;


function clickOfOption(lat, long, country__code, state__name, city__name) {//takes actual data from response from GetNameOfCities()
  latitude = lat;
  longitude = long;

  //do not show, if undefined
  if (state__name === "undefined") {
    stateName = "";
  } else {
    stateName = `${state__name}, `;
  }
  countryCode = country__code;
  cityName = city__name;

  //options from dropdown was clicked
  funcIsNotClicked = false;
  getWeatherInfo();
}


//main function, that calls API to get actual weather information from actual cities
async function getWeatherInfo() {
  if (funcIsNotClicked) {
    //manual input, if user did not use dropdown menu options
    let geocodingAPI_url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`;
    try {
      const response = await fetch(geocodingAPI_url);

      const cityInfo = await response.json();
      console.log(cityInfo);

      cityName = cityInfo.results[0].name;

      if (cityInfo.results[0].admin1 === undefined) {
        stateName = "";
      } else {
        stateName = `${cityInfo.results[0].admin1}, `;
      }
      countryCode = cityInfo.results[0].country_code;
      latitude = cityInfo.results[0].latitude;
      longitude = cityInfo.results[0].longitude;
    } catch (error) {
      console.log("error");
    }
  }

  let openMeteoAPI_url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timeformat=unixtime&utc_offset_seconds&forecast_days=1`;

  try {
    const response = await fetch(openMeteoAPI_url);
    const weatherData = await response.json();
    console.log(weatherData);
    temp = weatherData.current.temperature_2m;

    feelsLike = weatherData.current.apparent_temperature;
    windSpeed = weatherData.current.wind_speed_10m;
    humidity = weatherData.current.relative_humidity_2m;
    weather = weatherData.current.weather_code;
    weather = whatWeather(weather);
    isDay = weatherData.current.is_day;
    changeBackgroundVideo(weather);
  } catch (error) {
    console.log("error");
  }

  //changes background video by html
  videoBackground.innerHTML = `<video autoplay muted loop class="video"><source src="weather condition videos\/${videoName}.mp4" type="video/mp4"/></video>`;

  //shows current weather by html
  cityNameDiv.innerHTML = `${cityName}, ${stateName} ${countryCode.toUpperCase()}`;
  temperatureDiv.innerHTML = `${temp}°C`;
  feelsLikeDiv.innerHTML = `Feels like ${feelsLike}°C`;
  windSpeedDiv.innerHTML = `Wind: ${windSpeed} km/h`;
  humidityDiv.innerHTML = `Humidity: ${humidity}%`;
  weatherDiv.innerHTML = `Weather: ${weather}`;


  
  if (isDay) {
    //shows day greeting
    nightGreeting.style.display = "none";
    dayGreeting.style.display = "block";
  } else {
    //shows night greeting
    dayGreeting.style.display = "none";
    nightGreeting.style.display = "block";
  }
}


// function for manual input, that calles after button click
function requestWeather() {
  cityName = document.querySelector(".input__city").value;

  //checks, if in input field nothing, warns user
  if (cityName === "") {
    alert("Write a name of city!");
    return;
  }

  getWeatherInfo();
}

times = 0; //how many times user pressed keyboard keys after "pause"

document
  .querySelector(".input__city")
  .addEventListener("keydown", function (event) {
    times += 1;

    //if user clicked enter, options of cities tab closes and calling manual input function
    if (event.key === "Enter") {
      dropdownOptions.style.display = "none";
      requestWeather();
    }

    // code below uses timers, to set pauses between user enters

    //here is timer for bigger time, because this code should start after second timer
    if (times === 1) {
      setTimeout(() => {
        GetNameOfCities(); //updating data about cities in the tab
      }, 3 * 1000);
    }

    //timer for less time, code should run before above code
    setTimeout(() => {
      times = 0; //after 2 seconds we set a "pause"
    }, 2 * 1000);
  });
