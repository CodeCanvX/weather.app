import { translate } from "../Main/Translate.js";

export default function createFeelsLikeCard(feelsLikeTemp, actualTemp) {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const feelsLevelText = getFeelsLevel(feelsLikeTemp, t);

  const feelsCard = document.createElement("div");
  feelsCard.className = "card feels-card";

  const feelsHeader = document.createElement("div");
  feelsHeader.className = "header-card";

  const feelsIcon = document.createElement("i");
  feelsIcon.className =
    "fa-solid fa-temperature-three-quarters feels-icon icon";

  const feelsTitle = document.createElement("div");
  feelsTitle.className = "title";
  feelsTitle.textContent = t.feelsLike;

  feelsHeader.appendChild(feelsIcon);
  feelsHeader.appendChild(feelsTitle);

  const feelsValue = document.createElement("div");
  feelsValue.className = "value-feels";
  feelsValue.textContent = `${Math.round(feelsLikeTemp)}°`;

  const feelsFact = document.createElement("div");
  feelsFact.className = "feels-fact";
  feelsFact.textContent = `${t.fackt} ${Math.round(actualTemp)}°`;

  const feelsLabel = document.createElement("div");
  feelsLabel.className = "label-fells";
  feelsLabel.textContent = feelsLevelText;

  feelsCard.appendChild(feelsHeader);
  feelsCard.appendChild(feelsValue);
  feelsCard.appendChild(feelsFact);
  feelsCard.appendChild(feelsLabel);

  return feelsCard;
}

function getFeelsLevel(temp, t) {
  if (temp <= 0) return t.veryCold;
  if (temp <= 10) return t.cold;
  if (temp <= 20) return t.comfort;
  if (temp <= 30) return t.warm;
  return t.hot;
}
