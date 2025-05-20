import { translate } from "../Main/Translate.js";

export default function createWindCard(speed, gust, deg) {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const card = document.createElement("div");
  card.className = "card wind-card";

  const header = document.createElement("div");
  header.className = "header-wind header-card";

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-wind icon";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = t.wind;

  header.appendChild(icon);
  header.appendChild(title);

  const containerWindSpeed = document.createElement("div");
  containerWindSpeed.className = "container-wind-speed";

  const windSpeedLeft = document.createElement("div");
  windSpeedLeft.className = "wind-speed-left";
  windSpeedLeft.textContent = t.wind;

  const windSpeedRight = document.createElement("div");
  windSpeedRight.className = "value-wind";
  windSpeedRight.textContent = `${speed} ${t.speed}`;

  containerWindSpeed.appendChild(windSpeedLeft);
  containerWindSpeed.appendChild(windSpeedRight);

  const underline1 = document.createElement("hr");
  underline1.className = "underline";

  const containerGustText = document.createElement("div");
  containerGustText.className = "container-gust-text";

  const gustTextLeft = document.createElement("div");
  gustTextLeft.className = "guest-text-left";
  gustTextLeft.textContent = t.gusts;

  const gustTextRight = document.createElement("div");
  gustTextRight.className = "label-gust";
  gustTextRight.textContent = `${gust} ${t.speed}`;

  containerGustText.appendChild(gustTextLeft);
  containerGustText.appendChild(gustTextRight);

  const underline2 = document.createElement("hr");
  underline2.className = "underline";

  const containerDirextionText = document.createElement("div");
  containerDirextionText.className = "container-dirextion-text";

  const directionLeft = document.createElement("div");
  directionLeft.className = "direction-left";
  directionLeft.textContent = t.deg;

  const directionText = document.createElement("div");
  directionText.className = "label-direction";
  directionText.textContent = `${deg}° ${getWindDirection(deg, t)}`;

  containerDirextionText.appendChild(directionLeft);
  containerDirextionText.appendChild(directionText);

  card.appendChild(header);
  card.appendChild(containerWindSpeed);
  card.appendChild(underline1);
  card.appendChild(containerGustText);
  card.appendChild(underline2);
  card.appendChild(containerDirextionText);

  return card;
}

function getWindDirection(deg, t) {
  if (deg >= 337.5 || deg < 22.5) return t.s;
  if (deg >= 22.5 && deg < 67.5) return t.sv;
  if (deg >= 67.5 && deg < 112.5) return t.v;
  if (deg >= 112.5 && deg < 157.5) return t.uv;
  if (deg >= 157.5 && deg < 202.5) return t.u;
  if (deg >= 202.5 && deg < 247.5) return t.uz;
  if (deg >= 247.5 && deg < 292.5) return t.z;
  if (deg >= 292.5 && deg < 337.5) return t.sz;
  return t.Not;
}
