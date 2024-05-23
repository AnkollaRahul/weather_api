const apiKey = '904999e57a7bc2e2653d3715986007e7';

document.getElementById('searchButton').addEventListener('click', () => {
  const city = document.getElementById('searchInput').value;
  fetchWeather(city);
});

function fetchWeather(city)
{
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
      fetchSunriseSunset(data.coord.lat, data.coord.lon);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      const weatherInfoDiv = document.getElementById('weatherInfo');
      weatherInfoDiv.innerHTML = `<p>${error.message}</p>`;
    });
}

function fetchForecast(lat, lon)
{
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Forecast Data:", data); // Log the fetched data
      const forecastData = data.daily.slice(0, 7); // Extract forecast data for next 7 days
      displayForecast(forecastData);
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
    });
}

function fetchSunriseSunset(lat, lon)
{
  const apiUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const sunrise = new Date(data.results.sunrise);
      const sunset = new Date(data.results.sunset);
      displaySunriseSunset(sunrise, sunset);
    })
    .catch(error => {
      console.error('Error fetching sunrise/sunset data:', error);
    });
}

function displayWeather(data)
{
  const weatherInfoDiv = document.getElementById('weatherInfo');
  weatherInfoDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
    <p>${data.weather[0].description}</p>
    <p>Temperature: ${Math.round(data.main.temp - 273.15)}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
  `;
}

function displayForecast(dailyData)
{
  console.log("Displaying Forecast Data:", dailyData); // Log the daily data received
  const forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = '';
  dailyData.forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const icon = day.weather[0].icon;
    const description = day.weather[0].description;
    const maxTemp = Math.round(day.temp.max - 273.15);
    const minTemp = Math.round(day.temp.min - 273.15);
    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day');
    forecastDay.innerHTML = `
      <h3>${dayOfWeek}</h3>
      <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
      <p>${description}</p>
      <p>Max Temperature: ${maxTemp}°C</p>
      <p>Min Temperature: ${minTemp}°C</p>
    `;
    forecastDiv.appendChild(forecastDay);
  });
}

function displaySunriseSunset(sunrise, sunset)
{
  const weatherInfoDiv = document.getElementById('weatherInfo');
  weatherInfoDiv.innerHTML += `
    <p><i class="fas fa-sun"></i> Sunrise: ${sunrise.toLocaleTimeString()}</p>
    <p><i class="fas fa-moon"></i> Sunset: ${sunset.toLocaleTimeString()}</p>
  `;
}
