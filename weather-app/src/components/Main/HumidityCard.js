import { translate } from "../Main/Translate.js";

export default function createHumidityCard(humidity, dewPoint) {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const card = document.createElement("div");
  card.className = "card humidity-card";

  const header = document.createElement("div");
  header.className = "header-card";

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-droplet";

  const title = document.createElement("span");
  title.className = "title";
  title.textContent = t.humidity;

  header.appendChild(icon);
  header.appendChild(title);

  const humidityValue = document.createElement("div");
  humidityValue.className = "value-humidity";
  humidityValue.textContent = `${humidity}%`;

  const dew = document.createElement("div");
  dew.className = "dew-point";
  dew.textContent = `${t.devPoint} ${Math.round(dewPoint)}°`;

  card.appendChild(header);
  card.appendChild(humidityValue);
  card.appendChild(dew);

  return card;
}
