import { translate } from "../Main/Translate.js";

export default function createAirQualityCard(aqi) {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const card = document.createElement("div");
  card.className = "air-quality-card card";

  const header = document.createElement("div");
  header.className = "header-card";

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-wind icon";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = t.airQuality;

  header.appendChild(icon);
  header.appendChild(title);

  const label = document.createElement("div");
  label.className = "label-air";
  label.textContent = getAirQualityLevel(aqi, t);

  const bar = document.createElement("div");
  bar.className = "air-bar";

  const indicator = document.createElement("div");
  indicator.className = "air-indicator";
  indicator.style.left = `${(aqi - 1) * 25}%`;
  bar.appendChild(indicator);

  // Описание
  const note = document.createElement("div");
  note.className = "note-air";
  note.textContent = getAirQualityDescription(aqi, t);

  // Собираем всё
  card.appendChild(header);
  card.appendChild(label);
  card.appendChild(bar);
  card.appendChild(note);

  return card;
}

function getAirQualityLevel(index, t) {
  const levels = [t.noLabel, t.veryGood, t.good, t.notGood, t.bad, t.veryBad];
  return levels[index] || t.noLabel;
}

function getAirQualityDescription(index, t) {
  const descriptions = [
    "",
    t.clearAir,
    t.goodQuality,
    t.easeBadAir,
    t.badAir,
    t.dangerous,
  ];
  return descriptions[index] || t.noLabel;
}
