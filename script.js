let forcastDate;
let temperature;
let windSpeed;
let humudity;
let uvIndex;
let cityName = '';
let newUrl = '';
let newUvUrl = '';
let newForecastUrl = '';
let todaysDate = moment().format('L');

let baseQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
let APIKey = 'adf4d0aef7ad9199ab0c939142564d4d';
let baseForcastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
let baseUvIndexUrl = 'https://api.openweathermap.org/data/2.5/uvi?appid=';
let cityList = [];

$(document).ready(function () {
	$('#search-button').on('click', function () {
		cityName = $("#search-value").val();
    $("#search-value").val('');
    if (cityList.indexOf(cityName) === -1) {
      	cityList.push(cityName)
      	localStorage.setItem('lastcity', JSON.stringify(cityName));
      	addCity(cityName);
      }
		currentWeather();
		forecastWeather();
  })
  
	$('.history').on('click', 'li', function () {
		cityName = $(this).text();
    currentWeather();
    forecastWeather();
	})

	function currentWeather() {
		newUrl = baseQueryUrl + cityName + '&appid=' + APIKey + '&units=metric';
		fetch(newUrl)
			.then(function (response) {
				return response.json()
			})
			.then(function (data) {

				$(".card-title").text(data.name + ' (' + todaysDate + ') ');
				$("#Wind").text('Wind Speed: ' + data.wind.speed + ' KPH');
				$("#Humidity").text('Humidity: ' + data.main.humidity + ' %');
				$("#Temperature").text('Temperature: ' + data.main.temp + ' °C');
				let img = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
				$(".card-title").append(img);

				// get the latitude and longtitude  from data and store it in a variable				
				let lat = data.coord.lat
				let lon = data.coord.lon

				// callAPI to get uv by passing the parameter lat and long from the above variable
				newUvUrl = baseUvIndexUrl + APIKey + '&lat=' + lat + '&lon=' + lon;
				fetch(newUvUrl)
					.then(function (response) {
						return response.json()
					})
					.then(function (uvData) {
						console.log(uvData)
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

	function forecastWeather() {
		newForecastUrl = baseForcastUrl + cityName + '&appid=' + APIKey + '&units=metric'
		fetch(newForecastUrl)
			.then(function (response) {
        return response.json()
        
			})
			.then(function (forecastData) {
        $('#forecast').html('<h4 class="mt-3">5-Day Forecast:</h4>').append('<div class="row">');
				for (let i = 0; i < forecastData.list.length; i++) {
					if (forecastData.list[i].dt_txt.indexOf('12:00:00') > -1) {
						let col = $('<div>').addClass('col-md-2');
						let card = $('<div>').addClass('card bg-primary text-white');
						let cardBody = $('<div>').addClass('card-body p-2');
						let title = $('<h5>').addClass('card-title').text(new Date(forecastData.list[i].dt_txt).toLocaleDateString());
						let img = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + forecastData.list[i].weather[0].icon + '.png');
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
  
	function addCity(city) {
		let li = $('<li>').addClass('list-group-item list-group-item-action').text(city);
		$('.history').append(li)
	}

	
	let lastcity = JSON.parse(localStorage.getItem('lastcity'));
	console.log(lastcity);

	if (lastcity !== null) {

		cityName = lastcity;
		currentWeather();
		forecastWeather();
	
	}

})








