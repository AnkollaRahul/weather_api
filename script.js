const apiKey = '904999e57a7bc2e2653d3715986007e71';
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const weatherContent = document.getElementById('weatherContent');

function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        const cityName = data.name;
        const temperature = data.main.temp;
        const weatherDescription = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        displayWeatherData(cityName, temperature, weatherDescription, iconUrl);
      } else {
        console.error('Error fetching weather data:', data.message);
        weatherContent.textContent = 'Error: City not found.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      weatherContent.textContent = 'Error fetching weather data.';
    });
}

function displayWeatherData(city, temp, description, iconUrl) {
  weatherContent.innerHTML = `
    <h2>${city}</h2>
    <img src="${iconUrl}" alt="${description}">
    <p>Temperature: ${temp.toFixed(1)} &deg;C</p>
    <p>Description: ${description}</p>
  `;
}

searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
    cityInput.value = '';
  }
});
