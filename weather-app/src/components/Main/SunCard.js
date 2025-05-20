import { translate } from "../Main/Translate.js";

export default function createSunCard(sunrise, sunset, timezoneOffset) {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const nowUTC = Math.floor(Date.now() / 1000);
  const nowLocal = nowUTC + timezoneOffset;

  let showTitle, showTime, showLabel;

  if (nowLocal >= sunset) {
    showTitle = t.up;
    showTime = formatTime(sunrise + 86400, timezoneOffset);
    showLabel = `${t.down} ${formatTime(sunset + 86400, timezoneOffset)}`;
  } else {
    showTitle = t.down;
    showTime = formatTime(sunset, timezoneOffset);
    showLabel = `${t.up} ${formatTime(sunrise, timezoneOffset)}`;
  }

  const card = document.createElement("div");
  card.className = "card sun-card";

  const header = document.createElement("div");
  header.className = "header-card header";

  const icon = document.createElement("i");
  icon.className =
    showTitle === t.up ? "fa-solid fa-sun icon" : "fa-solid fa-moon icon";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = showTitle;

  const value = document.createElement("div");
  value.className = "value sun-value";
  value.textContent = showTime;

  const label = document.createElement("div");
  label.className = "label sun-label";
  label.textContent = showLabel;

  header.appendChild(icon);
  header.appendChild(title);

  card.appendChild(header);
  card.appendChild(value);
  card.appendChild(label);

  return card;
}

function formatTime(unixTimestamp, timezoneOffset) {
  const localTimeMs = (unixTimestamp + timezoneOffset) * 1000;
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(localTimeMs));
}
