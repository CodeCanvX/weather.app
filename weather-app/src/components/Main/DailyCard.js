import { translate } from "../Main/Translate.js";
export default function createDailyCard(day, isFirst = false, isLast = false) {
  const date = new Date(day.dt * 1000);
  const today = new Date();

  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const weekdayIndex = date.getDay();

  const weekday = isToday ? t.today : t.weekdays[weekdayIndex];

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const weatherIcon = getWeatherEmoji(day.weather[0].icon);
  const rainProbability = day.pop ? Math.round(day.pop * 100) : 0;
  const tempMin = Math.round(day.temp.min);
  const tempMax = Math.round(day.temp.max);

  const wrapper = document.createElement("div");
  wrapper.className = "daily-wrapper";

  if (isFirst) {
    const header = document.createElement("div");
    header.className = "header-card";

    const calendarIcon = document.createElement("i");
    calendarIcon.className = "fa-regular fa-calendar-days icon";

    const title = document.createElement("div");
    title.className = "daily-title title";
    title.textContent = t.dailyTitle;

    header.appendChild(calendarIcon);
    header.appendChild(title);
    wrapper.appendChild(header);

    const underline = document.createElement("hr");
    underline.className = "underline";
    wrapper.appendChild(underline);
  }

  const card = document.createElement("div");
  card.className = "daily-card";

  const dayName = document.createElement("div");
  dayName.className = "daily-week";
  dayName.textContent = capitalize(weekday);

  const iconRainWrapper = document.createElement("div");
  iconRainWrapper.className = "icon-rain-wrapper";

  const icon = document.createElement("div");
  icon.className = "daily-icon";
  icon.textContent = weatherIcon;
  iconRainWrapper.appendChild(icon);

  if (rainProbability > 0) {
    const rain = document.createElement("div");
    rain.className = "daily-rain";
    rain.textContent = `${rainProbability}%`;
    iconRainWrapper.appendChild(rain);
  }

  const tempBar = document.createElement("div");
  tempBar.className = "daily-temp-bar";

  const minTemp = document.createElement("span");
  minTemp.className = "temp-min";
  minTemp.textContent = `${tempMin}°`;

  const bar = document.createElement("div");
  bar.className = "bar";
  bar.style.width = `${(tempMax - tempMin) * 4}px`;

  bar.style.background = getTempGradient(tempMin, tempMax);

  const maxTemp = document.createElement("span");
  maxTemp.className = "temp-max";
  maxTemp.textContent = `${tempMax}°`;

  tempBar.appendChild(minTemp);
  tempBar.appendChild(bar);
  tempBar.appendChild(maxTemp);

  card.appendChild(dayName);
  card.appendChild(iconRainWrapper);
  card.appendChild(tempBar);

  wrapper.appendChild(card);

  if (!isLast) {
    const underline = document.createElement("hr");
    underline.className = "underline";
    wrapper.appendChild(underline);
  }

  return wrapper;
}

function getWeatherEmoji(iconCode) {
  const map = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅️",
    "02n": "☁️",
    "03d": "🌥️",
    "03n": "🌥️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "🌩️",
    "13d": "❄️",
    "13n": "❄️",
  };
  return map[iconCode] || "❓";
}

function getTempGradient(minTemp, maxTemp) {
  if (maxTemp <= 0) {
    return "linear-gradient(to right, #001f3f, #0074D9)";
  }
  if (maxTemp > 0 && maxTemp <= 5) {
    return "linear-gradient(to right, #0074D9, #7FDBFF)";
  }
  if (maxTemp > 5 && maxTemp <= 15) {
    return "linear-gradient(to right, #7FDBFF, #FFE066)";
  }
  if (maxTemp > 15 && maxTemp <= 25) {
    return "linear-gradient(to right, #FFE066, orange)";
  }
  return "linear-gradient(to right, orange, red)";
}
