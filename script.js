// variable declaration for the weather data manipulation
let forcastDate;
let temperature;
let windSpeed;
let humudity;
let uvIndex;
let cityName = '';
let newUrl = '';
let newUvUrl = '';
let newForecastUrl = '';
let cityList = [];
let todaysDate = moment().format('L');
let APIKey = 'adf4d0aef7ad9199ab0c939142564d4d';

// Base URL to get the current weather
let baseQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
// Base URL to get the forecast weather
let baseForcastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
// Base URL to get the UV Index
let baseUvIndexUrl = 'https://api.openweathermap.org/data/2.5/uvi?appid=';


$(document).ready(function () {
  // Search button click event will load the weather data and forecast data
	$('#search-button').on('click', function () {
		cityName = $("#search-value").val();
		$("#search-value").val('');
		if (cityList.indexOf(cityName) === -1) {
      // check the search city is already available in the search history, if not, then store in the local storage
      // with the search city and search city list
			cityList.push(cityName)
			localStorage.setItem('lastcity', JSON.stringify(cityName));
			localStorage.setItem('lastCityList', JSON.stringify(cityList));
			addCity(cityName);
		}
		currentWeather();
		forecastWeather();
	})
  
  // searched list of cities in the history will bring the related city in the dashboard
	$('.history').on('click', 'li', function () {
		cityName = $(this).text();
		currentWeather();
		forecastWeather();
	})

  // function to load the current weather
	function currentWeather() {
    // API call to get the current weather by passing city name and API key
		newUrl = baseQueryUrl + cityName + '&appid=' + APIKey + '&units=metric';
		fetch(newUrl)
			.then(function (response) {
				return response.json()
			})
			.then(function (data) {
        // get the data and load into dash boad html elements
				$(".card-title").text(data.name + ' (' + todaysDate + ') ');
				$("#Wind").text('Wind Speed: ' + data.wind.speed + ' KPH');
				$("#Humidity").text('Humidity: ' + data.main.humidity + ' %');
				$("#Temperature").text('Temperature: ' + data.main.temp + ' °C');
				let img = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
				$(".card-title").append(img);

				// get the latitude and longtitude  from data and store it in a variable				
				let lat = data.coord.lat
				let lon = data.coord.lon

				// call API to get uv by passing the parameter lat and long from the above variable
				newUvUrl = baseUvIndexUrl + APIKey + '&lat=' + lat + '&lon=' + lon;
				fetch(newUvUrl)
					.then(function (response) {
						return response.json()
					})
					.then(function (uvData) {
						// get the UV data and load the html elements in the dashboard
						$("#UVindex").text('UVindex: ')
						let btn = $('<span>').addClass('btn btn-sm').text(uvData.value);

						if (uvData.value < 3) {
							btn.addClass('btn-success')
						} else if (uvData.value < 7) {
							btn.addClass('btn-warning')
						} else {
							btn.addClass('btn-danger')
						}
						$("#UVindex").append(btn)
					})
			})
	}
  // function to get the forecast weather for five days
	function forecastWeather() {
    // call the API to get five day forecast weather by passing City Name and API key
		newForecastUrl = baseForcastUrl + cityName + '&appid=' + APIKey + '&units=metric'
		fetch(newForecastUrl)
			.then(function (response) {
				return response.json()

			})
			.then(function (forecastData) {
        // get the five data forecast data and load the html elements in the dashboard
				$('#forecast').html('<h4 class="mt-3">5-Day Forecast:</h4>').append('<div class="row">');
				for (let i = 0; i < forecastData.list.length; i++) {
					if (forecastData.list[i].dt_txt.indexOf('12:00:00') > -1) {
						let col = $('<div>').addClass('col-md-2');
						let card = $('<div>').addClass('card bg-primary text-white');
						let cardBody = $('<div>').addClass('card-body p-2');
						let title = $('<h5>').addClass('card-title').text(new Date(forecastData.list[i].dt_txt).toLocaleDateString());
						let img = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + forecastData.list[i].weather[0].icon + '.png');
						let p1 = $('<p>').addClass('card-text').text('Temp: ' + forecastData.list[i].main.temp_max + ' °C');
						let p2 = $('<p>').addClass('card-text').text('Humidity: ' + forecastData.list[i].main.humidity + '%');
						cardBody.append(title, img, p1, p2);
						card.append(cardBody);
						col.append(card);
						$('#forecast .row').append(col);
					}
				}

			})
	}
  // function to add the list in the seach history
	function addCity(city) {
		let li = $('<li>').addClass('list-group-item list-group-item-action').text(city);
		$('.history').append(li)
	}

  // get the local storage of local city and local city list in the last search
	let lastcity = JSON.parse(localStorage.getItem('lastcity'));
	let lastCityList = JSON.parse(localStorage.getItem('lastCityList'));
	
	if (lastcity !== null) {

		cityName = lastcity;
    cityList = lastCityList;
    // load the current weather and five day forecast weather for the last searched city from local storage
		currentWeather();
		forecastWeather();
    // load the last search city list from the local storage
		for (let i = 0; i < lastCityList.length; i++) {
			cityName = lastCityList[i];
			addCity(cityName);

		}

	}

})








