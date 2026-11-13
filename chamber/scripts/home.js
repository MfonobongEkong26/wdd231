
// Port Harcourt Chamber of Commerce
// home.js

const API_KEY = "46f2e4761920ac31f2802ac1740c27ee";

const WEATHER_URL =
    "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_URL =
    "https://api.openweathermap.org/data/2.5/forecast";

// Port Harcourt coordinates
const LATITUDE = 4.8156;
const LONGITUDE = 7.0498;


// Run when the page loads
document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    updateFooter();
    loadWeather();
    loadSpotlights();
});


// Mobile navigation
function setupNavigation() {
    const menuButton = document.querySelector("#menu-button");
    const navigation = document.querySelector("#navigation");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            navigation.classList.toggle("open");

            const isOpen = navigation.classList.contains("open");

            menuButton.setAttribute("aria-expanded", isOpen);
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });
    }
}


// Footer dates
function updateFooter() {
    const year = document.querySelector("#current-year");
    const modified = document.querySelector("#last-modified");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    if (modified) {
        modified.textContent = document.lastModified;
    }
}


// Load current weather and forecast
async function loadWeather() {
    const temperature = document.querySelector("#temperature");
    const description = document.querySelector("#weather-description");
    const weatherIcon = document.querySelector("#weather-icon");
    const forecastContainer =
        document.querySelector("#weather-forecast");

    if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        temperature.textContent = "API key required";
        description.textContent =
            "Add your OpenWeatherMap API key in home.js.";

        forecastContainer.textContent =
            "Forecast will appear after the API key is added.";

        return;
    }

    const currentUrl =
        `${WEATHER_URL}?lat=${LATITUDE}&lon=${LONGITUDE}` +
        `&units=metric&appid=${API_KEY}`;

    const forecastUrl =
        `${FORECAST_URL}?lat=${LATITUDE}&lon=${LONGITUDE}` +
        `&units=metric&appid=${API_KEY}`;

    try {
        const [currentResponse, forecastResponse] =
            await Promise.all([
                fetch(currentUrl),
                fetch(forecastUrl)
            ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Unable to retrieve weather information.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        // Current temperature
        temperature.textContent =
            `${Math.round(currentData.main.temp)}°C`;

       
        // Current weather icon
const weatherCode = currentData.weather[0].icon;

const weatherIcons = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "🌤️",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️"
};

weatherIcon.textContent = weatherIcons[weatherCode] || "🌤️";
weatherIcon.setAttribute("aria-label", currentData.weather[0].description);


        // Three-day forecast
        displayForecast(forecastData.list);

    } catch (error) {
        console.error("Weather error:", error);

        temperature.textContent = "Weather unavailable";
        description.textContent =
            "Please check your internet connection or API key.";

        forecastContainer.textContent =
            "Unable to load the forecast.";
    }
}


// Display the next three days of forecast data
function displayForecast(forecastList) {
    const forecastContainer =
        document.querySelector("#weather-forecast");

    forecastContainer.innerHTML = "";

    const dailyForecasts = {};

    forecastList.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toLocaleDateString("en-CA");

        const today = new Date();
        const todayKey = today.toLocaleDateString("en-CA");

        if (dateKey === todayKey) {
            return;
        }

        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = {
                temperatures: [],
                weather: item.weather[0],
                date: date
            };
        }

        dailyForecasts[dateKey].temperatures.push(item.main.temp);

        // Prefer the forecast closest to midday
        if (date.getHours() >= 11 && date.getHours() <= 14) {
            dailyForecasts[dateKey].weather = item.weather[0];
        }
    });

    const nextThreeDays =
        Object.values(dailyForecasts).slice(0, 3);

    if (nextThreeDays.length === 0) {
        forecastContainer.textContent =
            "Forecast information is unavailable.";

        return;
    }

    nextThreeDays.forEach((day) => {
        const temperatures = day.temperatures;

        const minTemp = Math.round(Math.min(...temperatures));
        const maxTemp = Math.round(Math.max(...temperatures));

        const dayName = day.date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <h4>${dayName}</h4>
            <img
                src="https://openweathermap.org/img/wn/${day.weather.icon}.png"
                alt="${day.weather.description}"
                width="50"
                height="50">
            <p>${maxTemp}°C / ${minTemp}°C</p>
            <p>${day.weather.description}</p>
        `;

        forecastContainer.appendChild(card);
    });
}


// Load random Gold and Silver business members
async function loadSpotlights() {
    const container =
        document.querySelector("#spotlight-container");

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load member information.");
        }

        const members = await response.json();

        // Only Gold (3) and Silver (2) members
        const qualifiedMembers = members.filter((member) => {
            return Number(member.membershipLevel) === 2 ||
                Number(member.membershipLevel) === 3;
        });

        // Randomly shuffle qualified members
        const shuffledMembers = qualifiedMembers.sort(
            () => Math.random() - 0.5
        );

        // Randomly display two or three members
        const numberToDisplay =
            Math.min(
                shuffledMembers.length,
                Math.random() < 0.5 ? 2 : 3
            );

        const selectedMembers =
            shuffledMembers.slice(0, numberToDisplay);

        container.innerHTML = "";

        selectedMembers.forEach((member) => {
            const membership =
                Number(member.membershipLevel) === 3
                    ? "Gold"
                    : "Silver";

            const card = document.createElement("article");
            card.classList.add("spotlight-card");

            card.innerHTML = `
                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    loading="lazy">

                <div class="spotlight-info">
                    <h3>${member.name}</h3>

                    <p class="membership-level">
                        ${membership} Member
                    </p>

                    <p>${member.phone}</p>

                    <p>${member.address}</p>

                    <a href="${member.website}"
                        target="_blank"
                        rel="noopener noreferrer">
                        Visit Website
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

        if (selectedMembers.length === 0) {
            container.textContent =
                "No Gold or Silver members are currently available.";
        }

    } catch (error) {
        console.error("Spotlight error:", error);

        container.textContent =
            "Business spotlights could not be loaded.";
    }
}
