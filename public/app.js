// Check if service workers are supported in the browser
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installPrompt = document.getElementById('install-prompt');
  installPrompt.style.display = 'block';

  document.getElementById('install-btn').addEventListener('click', () => {
    installPrompt.style.display = 'none';
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
      });
    }
  });
});

const apiKey = "4b3df61189d04f959af103341250902"; // Your WeatherAPI key

// Display the default image on page load
window.onload = function() {
  document.getElementById("weather-image").src = "images/weatherdefoult.jfif";
};

document.getElementById("search-btn").addEventListener("click", function() {
  const city = document.getElementById("city-input").value;

  if (city) {
    getWeatherData(city);
  } else {
    alert("Please enter a city name!");
  }
});

function getWeatherData(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.location) {
        updateWeatherInfo(data);
      } else {
        alert("City not found. Please try again.");
        document.getElementById("weather-image").src = "images/weatherdefoult.jfif"; // Show default image on error
      }
    })
    .catch(error => {
      alert("Failed to fetch weather data. Please try again.");
      document.getElementById("weather-image").src = "images/weatherdefoult.jfif"; // Show default image on error
    });
}

function updateWeatherInfo(data) {
  // Update the weather information
  document.getElementById("city-name").innerText = data.location.name;
  document.getElementById("temperature-value").innerText = `${data.current.temp_c}°C`;
  document.getElementById("description-value").innerText = data.current.condition.text;
  document.getElementById("humidity-value").innerText = `${data.current.humidity}%`;
  document.getElementById("wind-value").innerText = `${data.current.wind_kph} km/h`;

  // Update the weather image based on condition
  const weatherCondition = data.current.condition.text.toLowerCase();
  const weatherImage = document.getElementById("weather-image");
  weatherImage.src = getWeatherImage(weatherCondition);
}

function getWeatherImage(condition) {
  if (condition.includes("sunny") || condition.includes("clear")) {
    return "images/sunny.jfif"; // Path to the sunny image
  } else if (condition.includes("rain")) {
    return "images/rainy.jfif"; // Path to the rain image
  } else if (condition.includes("cloud")) {
    return "images/cloudy.jfif"; // Path to the cloudy image
  } else if (condition.includes("wind")) {
    return "images/windy.jfif"; // Path to the windy image
  } else if (condition.includes("snow")) {
    return "images/snoworg.jfif"; // Path to the snow image
  } else {
    return "images/weatherdefoult.jfif"; // Default image for unknown conditions
  }
}
