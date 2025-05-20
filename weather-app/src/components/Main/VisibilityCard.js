import { translate } from "../Main/Translate.js";

export default function createVisibilityCard(visibilityMeters) {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const isShort = visibilityMeters < 1000;
  const visibilityText = isShort
    ? `${visibilityMeters} ${t.meters}`
    : `${(visibilityMeters / 1000).toFixed(1)} ${t.kilomiters}`;

  const level = getVisibilityLevel(visibilityMeters, t);

  const card = document.createElement("div");
  card.className = "card visibility-card";

  const headerWrapper = document.createElement("div");
  headerWrapper.className = "header-card header";

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-eye icon";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = t.visibility;

  headerWrapper.appendChild(icon);
  headerWrapper.appendChild(title);

  const value = document.createElement("div");
  value.className = "value-visibility";
  value.textContent = visibilityText;

  const label = document.createElement("div");
  label.className = "label-visibility";
  label.textContent = level;

  card.appendChild(headerWrapper);
  card.appendChild(value);
  card.appendChild(label);

  return card;
}

function getVisibilityLevel(meters, t) {
  const km = meters / 1000;
  if (km > 9) return t.veryGoodVisibility;
  if (km > 5) return t.goodVisibility;
  if (km > 3) return t.mediumVisibility;
  return t.badVisibility;
}
