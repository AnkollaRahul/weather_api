document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
    }
});

async function fetchWeatherData(city) {
    const apiKey = '904999e57a7bc2e2653d3715986007e71'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const fiveDayResponse = await fetch(fiveDayUrl);
        const fiveDayData = await fiveDayResponse.json();
        displayWeatherData(data);
        displayFiveDayForecast(fiveDayData);
        displaySunMoonData(data.sys.sunrise, data.sys.sunset);
    } catch (error) {
        alert('Error fetching weather data');
    }
}

function displayWeatherData(data) {
    if (data.cod !== 200) {
        alert('City not found');
        return;
    }

    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.classList.remove('d-none');
    weatherInfo.style.marginTop = '20px'; // Add margin to the weather info

    document.getElementById('city-name').textContent = data.name;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('temp-value').textContent = Math.round(data.main.temp);
    document.getElementById('humidity-value').textContent = data.main.humidity;
    document.getElementById('wind-value').textContent = data.wind.speed;

    const iconCode = data.weather[0].icon;
    const iconClass = getWeatherIconClass(iconCode);
    document.getElementById('weather-icon').className = `wi ${iconClass}`;

    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayLength = calculateDayLength(data.sys.sunrise, data.sys.sunset);

    document.getElementById('sunrise-time').textContent = sunriseTime;
    document.getElementById('sunset-time').textContent = sunsetTime;
    document.getElementById('day-length').textContent = dayLength;
}

function displayFiveDayForecast(data) {
    const fiveDayWeather = document.getElementById('five-day-weather');
    fiveDayWeather.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) { // get data for every 24 hours
        const item = data.list[i];
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
        const temp = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconClass = getWeatherIconClass(iconCode);

        const listItem = document.createElement('li');
        listItem.innerHTML = `<i class="wi ${iconClass}"></i> ${date}: ${temp}°C, ${item.weather[0].description}`;
        fiveDayWeather.appendChild(listItem);
    }
}

function getWeatherIconClass(iconCode) {
    const iconMap = {
        '01d': 'wi-day-sunny',
        '01n': 'wi-night-clear',
        '02d': 'wi-day-cloudy',
        '02n': 'wi-night-alt-cloudy',
        '03d': 'wi-cloud',
        '03n': 'wi-cloud',
        '04d': 'wi-cloudy',
        '04n': 'wi-cloudy',
        '09d': 'wi-showers',
        '09n': 'wi-showers',
        '10d': 'wi-day-rain',
        '10n': 'wi-night-alt-rain',
        '11d': 'wi-thunderstorm',
        '11n': 'wi-thunderstorm',
        '13d': 'wi-snow',
        '13n': 'wi-snow',
        '50d': 'wi-fog',
        '50n': 'wi-fog'
    };
    return iconMap[iconCode] || 'wi-na';
}

function calculateDayLength(sunrise, sunset) {
    const diff = (sunset - sunrise) / 3600; // difference in hours
    const hours = Math.floor(diff);
    const minutes = Math.round((diff - hours) * 60);
    return `${hours} hrs ${minutes} mins`;
}

function displaySunMoonData(sunrise, sunset) {
    const moonPhaseData = getMoonPhase(sunrise, sunset);
    const moonPhase = moonPhaseData[2];
    const moonrise = new Date(sunrise * 1000 + moonPhaseData[0] * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const moonset = new Date(sunset * 1000 + moonPhaseData[1] * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById('moon-phase').textContent = moonPhase;
    document.getElementById('moonrise-time').textContent = moonrise;
    document.getElementById('moonset-time').textContent = moonset;
}

function getMoonPhase(sunrise, sunset) {
    const now = new Date();
    const sunriseDate = new Date(sunrise * 1000);
    const sunsetDate = new Date(sunset * 1000);

    const sunriseDiff = (sunriseDate - now) / 60000; // in minutes
    const sunsetDiff = (sunsetDate - now) / 60000; // in minutes

    const illumination = (1 + Math.cos((now - sunriseDate) / (sunsetDate - sunriseDate) * Math.PI)) / 2;

    if (sunriseDiff < 0 && sunsetDiff > 0) {
        return [-sunriseDiff, sunsetDiff, 'Waxing Gibbous']; // before full moon
    } else if (sunriseDiff < 0 && sunsetDiff < 0) {
        return [-sunriseDiff, -sunsetDiff, 'Waning Gibbous']; // after full moon
    } else if (sunriseDiff > 0 && sunsetDiff > 0) {
        return [sunriseDiff, sunsetDiff, 'Waning Crescent']; // before new moon
    } else {
        return [sunriseDiff, -sunsetDiff, 'Waxing Crescent']; // after new moon
    }
}
