let forcastDate;
let temperature;
let windSpeed;
let humudity;
let uvIndex;
let cityName = ''
let newUrl = ''
let newUvUrl=''
let todaysDate =moment().format('L');

let baseQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
let APIKey = 'adf4d0aef7ad9199ab0c939142564d4d';
let baseForcastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
let baseUvIndexUrl= 'https://api.openweathermap.org/data/2.5/uvi?appid=';

$(document).ready(function () {
	$('#search-button').on('click', function () {
		// write two functions one for current weather and another for forcast
        cityName = $("#search-value").val();
		console.log(cityName);
		currentWeather();


		function currentWeather() {
			newUrl = baseQueryUrl + cityName + '&appid=' + APIKey + '&units=metric';
			console.log(newUrl);

			$.ajax({
				url: newUrl,
				method: 'GET'
			}).then(function (data) {
				
				// $('#today').empty();
				$(".card-title").text(data.name + ' ('+ todaysDate +') ' );
				$("#Wind").text('Wind Speed: ' + data.wind.speed + ' KPH');
				$("#Humidity").text('Humidity: ' + data.main.humidity+ ' %');
				$("#Temperature").text('Temperature: ' + data.main.temp+ ' °C');
				let img =$('<img>').attr('src', 'http://openweathermap.org/img/w/'+ data.weather[0].icon + '.png');
				$(".card-title").append(img); 

				// get the latitude and longtitude  from data and store it in a variable
				let lat = data.coord.lat
				let lon = data.coord.lon
				console.log(lat)
				console.log(lon)

				// callAPI to get uv by passing the parameter lat and long from the above variable
				newUvUrl= baseUvIndexUrl + APIKey + '&lat='+ lat + '&lon='+ lon;
				console.log(newUvUrl)
				$.ajax({
					url: newUvUrl,
					method: 'GET'
				}).then(function (uvData) {
					console.log(uvData)
					$("#UVindex").text ('UVindex: '  )
					let btn = $('<span>') .addClass('btn btn-sm') .text(uvData.value);

					if (uvData.value < 3) {
						btn.addClass('btn-success')
					  } else if (uvData.value < 7) {
						btn.addClass('btn-warning')
					  } else {
						btn.addClass('btn-danger')
					  }
					$("#UVindex").append(btn)
					

				})




				// add the element uv with the value of uv return above




	


			})

		}

	})
})









