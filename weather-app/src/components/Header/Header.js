import "./Header.scss";
import { translate } from "../Main/Translate.js";
export default function Header(data) {
  if (!data || !data.city) {
    console.warn("Header получил некорректные данные:", data);
    return document.createElement("div");
  }

  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const header = document.createElement("header");
  header.className = "header";

  const location = document.createElement("div");
  location.className = "HeaderLocation";
  location.textContent = data.city;
  header.appendChild(location);

  const temperature = document.createElement("div");
  temperature.className = "HeaderTemperature";
  temperature.textContent = `${data.temperature}°`;
  header.appendChild(temperature);

  if (data.feels_like !== undefined) {
    const feels = document.createElement("div");
    feels.className = "HeaderFeels";
    feels.textContent = ` ${t.feels} ${data.feels_like}°`;
    header.appendChild(feels);
  }

  if (data.min !== undefined && data.max !== undefined) {
    const minmax = document.createElement("div");
    minmax.className = "HeaderMinMax";
    minmax.textContent = `${t.MAX} ${data.max}°, ${t.MIN} ${data.min}°`;
    header.appendChild(minmax);
  }

  return header;
}
