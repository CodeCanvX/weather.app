import { translate } from "../Main/Translate.js";

export default function createHourlyCard({ time, temp, icon }) {
  const card = document.createElement("div");
  card.className = "hour-card";

  const timeEl = document.createElement("div");
  timeEl.className = "hour-time";
  timeEl.textContent = time;

  const iconEl = document.createElement("div");
  iconEl.className = "hour-icon";
  iconEl.textContent = getWeatherEmoji(icon);

  const tempEl = document.createElement("div");
  tempEl.className = "hour-temp";
  tempEl.textContent = `${Math.round(temp)}°`;

  card.appendChild(timeEl);
  card.appendChild(iconEl);
  card.appendChild(tempEl);

  return card;
}

// 👇 Перенесён отдельно для читаемости
function getWeatherEmoji(iconCode) {
  const map = {
    "01d": "☀️", // ясно, день
    "01n": "🌙", // ясно, ночь
    "02d": "⛅️", // немного облаков
    "02n": "☁️",
    "03d": "🌥️", // облачно
    "03n": "🌥️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️", // дождь
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️", // гроза
    "11n": "🌩️",
    "13d": "❄️", // снег
    "13n": "❄️",
  };

  return map[iconCode] || "❓";
}
