import { translate } from "../Main/Translate.js";

export default function createPressureCard(pres) {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const card = document.createElement("div");
  card.className = "pressure-card card";

  const headerPressure = document.createElement("div");
  headerPressure.className = "header-pressure header-card";

  const headerIcon = document.createElement("i");
  headerIcon.className = "fa-solid fa-gauge icon";

  const headerTitle = document.createElement("div");
  headerTitle.className = "header-title title";
  headerTitle.textContent = t.pressure;

  headerPressure.appendChild(headerIcon);
  headerPressure.appendChild(headerTitle);

  const mainPressure = document.createElement("div");
  mainPressure.className = "main-pressure";

  const pressureValue = document.createElement("div");
  pressureValue.className = "pressure-value";
  pressureValue.textContent = `${pres}`;

  const pressureText = document.createElement("div");
  pressureText.className = "pressure-text";
  pressureText.textContent = t.Gpa;

  mainPressure.appendChild(pressureValue);
  mainPressure.appendChild(pressureText);

  card.appendChild(headerPressure);
  card.appendChild(mainPressure);

  return card;
}
