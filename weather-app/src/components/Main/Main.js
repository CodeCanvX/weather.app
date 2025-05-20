// Main.js
import "./Main.scss";
import createHourlyCard from "./HourlyCard.js";
import createDailyCard from "./DailyCard.js";
import createVisibilityCard from "./VisibilityCard.js";
import createFeelsLikeCard from "./FeelsLikeCard.js";
import createHumidityCard from "./HumidityCard.js";
import createAirQualityCard from "./AirQualityCard.js";
import createSunCard from "./SunCard.js";
import createPressureCard from "./PressureCard.js";
import { translate } from "./Translate.js";
import createWindCard from "./WidCard.js";
import Header from "../Header/Header.js";

let savedWeatherData = null;
let savedCityName = "";
let savedHourlyData = null;
let savedAirQualityIndex = 1;

export default function Main(
  hourlyData,
  visibility,
  feels,
  humidity,
  dewPoint,
  actualTemp,
  dailyData,
  sunrise,
  sunset,
  airQualityIndex,
  timezoneOffset,
  pres,
  speed,
  gust,
  deg
) {
  const main = document.createElement("main");
  main.className = "main";
  const width = window.innerWidth;

  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const hourlyWrapper = document.createElement("div");
  hourlyWrapper.className = "hourly-wrapper card";
  const hourlyHeader = document.createElement("div");
  hourlyHeader.className = "hourly-header header-card";
  const clockIcon = document.createElement("i");
  clockIcon.className = "fa-regular fa-clock icon";
  const headerTitle = document.createElement("div");
  headerTitle.className = "hourly-title title";
  headerTitle.textContent = t.hourlyTitle;
  const underlineSecond = document.createElement("hr");
  underlineSecond.className = "second-underline";
  hourlyHeader.append(clockIcon, headerTitle);
  hourlyWrapper.append(hourlyHeader, underlineSecond);

  const hourlyContainer = document.createElement("div");
  hourlyContainer.className = "hourly-container";
  hourlyData.forEach((hour) => {
    const card = createHourlyCard(hour);
    hourlyContainer.appendChild(card);
  });
  hourlyWrapper.appendChild(hourlyContainer);
  main.appendChild(hourlyWrapper);

  const bottomWrapper = document.createElement("div");
  bottomWrapper.className = "bottom-wrapper";

  const dailyWrapper = document.createElement("div");
  dailyWrapper.className = "daily-container card";
  dailyData.slice(0, 10).forEach((day, index, arr) => {
    const isFirst = index === 0;
    const isLast = index === arr.length - 1;
    const card = createDailyCard(day, isFirst, isLast);
    dailyWrapper.appendChild(card);
  });

  const visibilityCard = createVisibilityCard(visibility);
  const feelsCard = createFeelsLikeCard(feels, actualTemp);
  const humidityCard = createHumidityCard(humidity, dewPoint);
  const airCard = createAirQualityCard(airQualityIndex);
  const sunCard = createSunCard(sunrise, sunset, timezoneOffset);
  const presCard = createPressureCard(pres);

  const windCard = createWindCard(speed, gust, deg);

  const extraWrapper = document.createElement("div");
  extraWrapper.className = "extra-cards";

  if (width >= 990) {
    extraWrapper.append(windCard, airCard);
    const sunAirPresWrapper = document.createElement("div");
    sunAirPresWrapper.className = "sun-air-pres-wrapper";
    sunAirPresWrapper.append(sunCard, visibilityCard, presCard);

    const humidityFeelsWrapper = document.createElement("div");
    humidityFeelsWrapper.className = "humidity-feels-wrapper";
    humidityFeelsWrapper.append(humidityCard, feelsCard);

    extraWrapper.append(sunAirPresWrapper, humidityFeelsWrapper);
    bottomWrapper.append(dailyWrapper, extraWrapper);
  } else if (width >= 750) {
    const firstBlock = document.createElement("div");
    firstBlock.className = "first-block";
    const rightFirstBlock = document.createElement("div");
    rightFirstBlock.className = "right-first-block";
    rightFirstBlock.append(humidityCard, feelsCard, visibilityCard);
    firstBlock.append(dailyWrapper, rightFirstBlock);

    const secondBlock = document.createElement("div");
    secondBlock.className = "second-block";
    const rightSecondBlock = document.createElement("div");
    rightSecondBlock.className = "right-second-block";
    rightSecondBlock.append(presCard, sunCard);
    const leftSecondBlock = document.createElement("div");
    leftSecondBlock.className = "left-second-block";
    leftSecondBlock.append(windCard, airCard);

    secondBlock.append(leftSecondBlock, rightSecondBlock);
    extraWrapper.append(firstBlock, secondBlock);
    bottomWrapper.append(extraWrapper);
  } else {
    const block = document.createElement("div");
    block.className = "block";

    block.appendChild(dailyWrapper);

    const secondBlock = document.createElement("div");
    secondBlock.className = "second-block";

    secondBlock.appendChild(visibilityCard);
    secondBlock.appendChild(feelsCard);

    const thirdBlock = document.createElement("div");
    thirdBlock.className = "third-block";

    thirdBlock.appendChild(sunCard);
    thirdBlock.appendChild(humidityCard);

    block.appendChild(secondBlock);
    block.appendChild(airCard);
    block.appendChild(thirdBlock);

    block.appendChild(windCard);

    bottomWrapper.appendChild(block); // ❗добавляем block в DOM
  }

  main.appendChild(bottomWrapper);
  return main;
}

// Ререндер при resize
export function renderApp(weatherData, cityName, airQualityIndex) {
  const app = document.querySelector("#app");
  savedWeatherData = weatherData;
  savedCityName = cityName;
  savedAirQualityIndex = airQualityIndex;

  savedHourlyData = weatherData.hourly.slice(0, 20).map((item) => {
    const date = new Date(item.dt * 1000);
    const time = date.toLocaleTimeString("ru-RU", { hour: "2-digit" });
    return { time, temp: item.temp, icon: item.weather[0].icon };
  });

  const oldWrapper = document.querySelector(".content-wrapper");
  if (oldWrapper) oldWrapper.remove();

  const header = Header({
    city: savedCityName,
    temperature: Math.round(weatherData.current.temp),
    feels_like: Math.round(weatherData.current.feels_like),
    min: Math.round(weatherData.daily[0].temp.min),
    max: Math.round(weatherData.daily[0].temp.max),
  });

  const main = Main(
    savedHourlyData,
    weatherData.current.visibility,
    weatherData.current.feels_like,
    weatherData.current.humidity,
    weatherData.current.dew_point,
    weatherData.current.temp,
    weatherData.daily,
    weatherData.current.sunrise,
    weatherData.current.sunset,
    airQualityIndex,
    weatherData.timezone_offset,
    weatherData.current.pressure,
    weatherData.daily[0].rain || 0,
    weatherData.current.wind_speed,
    weatherData.current.wind_gust || 0,
    weatherData.current.wind_deg
  );

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content-wrapper";
  contentWrapper.append(header, main);
  app.appendChild(contentWrapper);
}

window.addEventListener("resize", () => {
  if (savedWeatherData) {
    renderApp(savedWeatherData, savedCityName, savedAirQualityIndex);
  }
});
