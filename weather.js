document.getElementById('search').addEventListener('click', async () => {
    const location = document.getElementById('location').value;
    const loader = document.getElementById('loader');
    const recentLocations = document.getElementById('recent-locations');
    
    if (location) {
        loader.style.display = 'block'; // Show loader
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${location}&days=3`);
            const data = await response.json();
            displayWeather(data);
            recentLocations.innerHTML += `<p>${location}</p>`; // Add to recent locations
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            loader.style.display = 'none'; // Hide loader
        }
    } else {
        alert('Please enter a location.');
    }
});

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    const { name, region, country, localtime } = data.location;
    const { temp_c, feelslike_c, condition, humidity, wind_kph } = data.current;

    weatherInfo.innerHTML = `
        <h3>${name}, ${region}, ${country}</h3>
        <p>Local Time: ${localtime}</p>
        <p>Temperature: ${temp_c}°C</p>
        <p>Feels Like: ${feelslike_c}°C</p>
        <p>Weather: ${condition.text} <img src="${condition.icon}" alt="icon"></p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${wind_kph} kph</p>
        <h4>3-Day Forecast</h4>
    `;

    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast-container');
    data.forecast.forecastday.forEach(day => {
        forecastContainer.innerHTML += `
            <div class="forecast-card">
                <p><strong>${day.date}</strong></p>
                <p>${day.day.avgtemp_c}°C</p>
                <img src="${day.day.condition.icon}" alt="icon">
                <p>${day.day.condition.text}</p>
            </div>
        `;
    });
    weatherInfo.appendChild(forecastContainer);
}
