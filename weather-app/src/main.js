import "./styles/main.scss";
import Nav from "./components/Nav/Nav.js";
import Header from "./components/Header/Header.js";
import Main from "./components/Main/Main.js";
import { API_KEY } from "./services/config.js";
import { getCityName } from "./services/weatherApi.js";

let savedWeatherData = null;
let savedCityName = "";
let savedHourlyData = null;
let savedAirQualityIndex = 1;

const app = document.querySelector("#app");
app.appendChild(Nav());

navigator.geolocation.getCurrentPosition(
  async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,alerts`
      );
      const weatherData = await weatherRes.json();

      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const airData = await airRes.json();
      const airQualityIndex = airData.list[0].main.aqi;

      const cityName = await getCityName(lat, lon);

      savedWeatherData = weatherData;
      savedCityName = cityName;
      savedAirQualityIndex = airQualityIndex;

      savedHourlyData = weatherData.hourly.slice(0, 20).map((item) => {
        const date = new Date(item.dt * 1000);
        const time = date.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
        });

        return {
          time,
          temp: item.temp,
          icon: item.weather[0].icon,
        };
      });

      renderApp();
      updateBackgroundGradient();
    } catch (err) {
      console.error("Ошибка при получении прогноза:", err);
    }
  },
  (err) => {
    alert("Не удалось определить местоположение");
    console.warn(err);
  }
);

function renderApp() {
  const app = document.querySelector("#app");
  const oldWrapper = document.querySelector(".content-wrapper");
  if (oldWrapper) oldWrapper.remove();

  const nowUTC = Math.floor(Date.now() / 1000);
  const iconCode = savedWeatherData.daily[0].weather[0].icon;

  setBackgroundGradient(
    iconCode,
    savedWeatherData.current.sunrise,
    savedWeatherData.current.sunset,
    nowUTC
  );

  const header = Header({
    city: savedCityName,
    temperature: Math.round(savedWeatherData.current.temp),
    feels_like: Math.round(savedWeatherData.current.feels_like),
    min: Math.round(savedWeatherData.daily[0].temp.min),
    max: Math.round(savedWeatherData.daily[0].temp.max),
  });

  const main = Main(
    savedHourlyData,
    savedWeatherData.current.visibility,
    savedWeatherData.current.feels_like,
    savedWeatherData.current.humidity,
    savedWeatherData.current.dew_point,
    savedWeatherData.current.temp,
    savedWeatherData.daily,
    savedWeatherData.current.sunrise,
    savedWeatherData.current.sunset,
    savedAirQualityIndex,
    savedWeatherData.timezone_offset,
    savedWeatherData.current.pressure,
    savedWeatherData.daily[0].rain || 0,
    savedWeatherData.current.wind_speed,
    savedWeatherData.current.wind_gust || 0,
    savedWeatherData.current.wind_deg
  );

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content-wrapper";
  contentWrapper.appendChild(header);
  contentWrapper.appendChild(main);

  app.appendChild(contentWrapper);
}

window.addEventListener("resize", () => {
  if (savedWeatherData) {
    renderApp();
  }
});

function setBackgroundGradient(iconCode, sunrise, sunset, nowUTC) {
  const dawnStart = sunrise - 1800;
  const dawnEnd = sunrise + 900;
  const duskStart = sunset - 900;
  const duskEnd = sunset + 1800;

  let timeOfDay;
  if (nowUTC < dawnStart) timeOfDay = "night";
  else if (nowUTC <= dawnEnd) timeOfDay = "dawn";
  else if (nowUTC < duskStart) timeOfDay = "day";
  else if (nowUTC <= duskEnd) timeOfDay = "dusk";
  else timeOfDay = "night";

  const gradients = {
    day: {
      clear: "linear-gradient(to bottom, #2275b8, #5baee5)",
      clouds: "linear-gradient(to bottom, #a5aaaf, #72777d)",
      rain: "linear-gradient(to bottom, #4b79a1, #283e51)",
      snow: "linear-gradient(to bottom, #e6dada, #274046)",
      thunder: "linear-gradient(to bottom, #232526, #414345)",
    },
    night: {
      clear: "linear-gradient(to bottom, #0a1029, #1a2d5a)",
      clouds: "linear-gradient(to bottom, #43474e, #1e2227)",
    },
    dawn: {
      clear: "linear-gradient(to bottom, #2a4378, #a05971)",
      clouds: "linear-gradient(to bottom, #43474e, #1e2227)",
    },
    dusk: {
      clear: "linear-gradient(to bottom, #1c2a48, #4a6d91, #e0c79d)",
      clouds: "linear-gradient(to bottom, #43474e, #1e2227)",
    },
  };

  let weatherType;
  if (iconCode.startsWith("01")) weatherType = "clear";
  else if (/^(02|03|04)/.test(iconCode)) weatherType = "clouds";
  else if (/^(09|10)/.test(iconCode)) weatherType = "rain";
  else if (iconCode.startsWith("11")) weatherType = "thunder";
  else if (iconCode.startsWith("13")) weatherType = "snow";
  else weatherType = "clear";

  const gradient = gradients[timeOfDay][weatherType] || gradients.day.clear;
  document.body.style.background = gradient;
}

function updateBackgroundGradient() {
  setInterval(() => {
    if (savedWeatherData) {
      const nowUTC = Math.floor(Date.now() / 1000);
      const iconCode = savedWeatherData.daily[0].weather[0].icon;
      setBackgroundGradient(
        iconCode,
        savedWeatherData.current.sunrise,
        savedWeatherData.current.sunset,
        nowUTC
      );
    }
  }, 10 * 60 * 1000);
}
