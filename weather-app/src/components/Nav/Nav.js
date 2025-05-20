import "./Nav.scss";
import {
  fetchWeather,
  fetchHourly,
  fetchWeatherByCoords,
} from "../../services/weatherApi.js";
import Header from "../Header/Header.js";
import Main from "../Main/Main.js";
import { translate } from "../Main/Translate.js";

export default function Nav() {
  const lang = localStorage.getItem("lang") || "ru";
  const t = translate[lang];

  const nav = document.createElement("nav");
  nav.className = "nav";

  const menuIcon = document.createElement("i");
  menuIcon.className = "fa-solid fa-bars";

  const menuPanel = document.createElement("div");
  menuPanel.className = "menu-panel";

  const favoritesContainer = document.createElement("div");
  favoritesContainer.className = "favorites-container";
  menuPanel.appendChild(favoritesContainer);
  document.body.appendChild(menuPanel);

  const form = document.createElement("form");
  form.className = "search-form";
  form.addEventListener("submit", (e) => e.preventDefault());

  const searchIcon = document.createElement("span");
  searchIcon.className = "material-symbols-outlined search-icon";
  searchIcon.textContent = "search";

  const input = document.createElement("input");
  input.placeholder = t.Search;
  input.className = "search-input";

  const addBtn = document.createElement("button");
  addBtn.textContent = t.add;
  addBtn.className = "add-button";
  addBtn.style.display = "none";

  let currentCity = "";
  let debounceTimer;

  input.addEventListener("input", () => {
    const rawCity = input.value.trim();
    currentCity = rawCity;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      if (!currentCity) return;

      const formattedCity =
        currentCity.charAt(0).toUpperCase() +
        currentCity.slice(1).toLowerCase();
      currentCity = formattedCity;

      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const isSaved = favorites.includes(currentCity);
      addBtn.style.display = isSaved ? "none" : "inline-block";

      loadCityWeather(currentCity);
    }, 800);
  });

  addBtn.addEventListener("click", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!favorites.includes(currentCity)) {
      favorites.push(currentCity);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
    }
    addBtn.style.display = "none";
  });

  form.append(addBtn, searchIcon, input);
  nav.append(menuIcon, form);

  menuIcon.addEventListener("click", () => {
    const isOpen = menuPanel.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
  });

  async function renderFavorites() {
    favoritesContainer.innerHTML = "";

    let geoCity = sessionStorage.getItem("geoCity");
    let geoData;

    if (!geoCity) {
      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        geoData = await fetchWeatherByCoords(lat, lon);
        geoCity = geoData.city;
        sessionStorage.setItem("geoCity", geoCity);
      } catch (err) {
        console.warn("Геолокация не доступна");
      }
    } else {
      geoData = await fetchWeather(geoCity);
    }

    if (geoData) {
      const now = Math.floor(Date.now() / 1000);
      const gradient = getGradientByTimeAndIcon(
        geoData.daily[0].weather[0].icon,
        now,
        geoData.sunrise,
        geoData.sunset
      );
      const card = createCityCard(geoData.city, geoData, gradient, true);
      favoritesContainer.appendChild(card);
    }

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    for (const city of favorites) {
      if (geoCity && city === geoCity) continue;

      try {
        const data = await fetchWeather(city);
        const now = Math.floor(Date.now() / 1000) + data.timezoneOffset;
        const gradient = getGradientByTimeAndIcon(
          data.daily[0].weather[0].icon,
          now,
          data.sunrise,
          data.sunset
        );
        const card = createCityCard(city, data, gradient);
        favoritesContainer.appendChild(card);
      } catch (err) {
        console.error(`Ошибка загрузки ${city}`, err);
      }
    }

    if (favorites.length > 0) {
      const containerDelete = document.createElement("div");
      containerDelete.className = "container-delete";

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.textContent = t.deleteAll;

      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fa-solid fa-trash";

      containerDelete.addEventListener("click", () => {
        localStorage.removeItem("favorites");
        renderFavorites();
      });

      containerDelete.appendChild(deleteButton);
      containerDelete.appendChild(deleteIcon);
      favoritesContainer.appendChild(containerDelete);
    }

    createLanguageButtons();
  }

  function createLanguageButtons() {
    let containerLanguage = document.querySelector(".container-language");

    // Если уже есть — удаляем
    if (containerLanguage) {
      containerLanguage.remove();
    }

    containerLanguage = document.createElement("div");
    containerLanguage.className = "container-language";

    const languages = [
      { code: "ru", label: "RU" },
      { code: "en", label: "EN" },
      { code: "ua", label: "UA" },
      { code: "cz", label: "CZ" },
    ];

    languages.forEach(({ code, label }) => {
      const button = document.createElement("button");
      button.className = "lang-button";
      button.textContent = label;

      button.addEventListener("click", () => {
        localStorage.setItem("lang", code);
        location.reload();
      });

      containerLanguage.appendChild(button);
    });

    menuPanel.appendChild(containerLanguage);
  }
  function createCityCard(cityName, data, gradient, isGeo = false) {
    const card = document.createElement("div");
    card.className = "city-card";

    if (isGeo) card.classList.add("geo-card");
    if (window.innerWidth < 600) card.style.background = gradient;

    card.addEventListener("click", () => {
      loadCityWeather(cityName);
      if (window.innerWidth < 600) {
        document.body.classList.remove("menu-open");
        menuPanel.classList.remove("open");
      }
    });

    const left = document.createElement("div");
    left.className = "left-container";

    const city = document.createElement("div");
    city.className = "city";
    city.textContent = capitalizeFirstLetter(data.city);
    left.appendChild(city);

    if (isGeo) {
      const locationLabel = document.createElement("div");
      locationLabel.className = "location-label";
      locationLabel.textContent = t.currentCity;
      left.appendChild(locationLabel);
    } else {
      const time = document.createElement("div");
      time.className = "time";
      const utc = Date.now();
      const offset = data.timezoneOffset * 1000;
      const localTime = new Date(utc + offset);
      time.textContent = localTime.toLocaleTimeString("ru-RU", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
      });
      left.appendChild(time);
    }

    const weather = document.createElement("div");
    weather.className = "weather";
    weather.textContent = capitalizeFirstLetter(
      data.daily[0].weather[0].description
    );
    left.appendChild(weather);

    const right = document.createElement("div");
    right.className = "right-container";

    const temp = document.createElement("div");
    temp.className = "temp";
    temp.textContent = `${Math.round(data.temperature)}°`;

    const minmax = document.createElement("div");
    minmax.className = "min-max";
    minmax.textContent = `${t.MAX} ${Math.round(data.max)}°, ${
      t.MIN
    } ${Math.round(data.min)}°`;

    right.append(temp, minmax);
    card.append(left, right);

    return card;
  }

  function loadCityWeather(cityName) {
    fetchWeather(cityName).then((data) => {
      const app = document.querySelector("#app");
      const isOpen = document.body.classList.contains("menu-open");
      const old = document.querySelector(".content-wrapper");
      if (old) old.remove();

      const header = Header(data);
      const now = Math.floor(Date.now() / 1000);
      const icon = data.daily[0].weather[0].icon;
      setBackgroundGradient(icon, now, data.sunrise, data.sunset);

      fetchHourly(cityName).then((hourly) => {
        const main = Main(
          hourly,
          data.visibility,
          data.feels_like,
          data.humidity,
          data.dew_point,
          data.temperature,
          data.daily,
          data.sunrise,
          data.sunset,
          data.aqi,
          data.timezoneOffset,
          data.pressure,

          data.windSpeed,
          data.windGust,
          data.windDeg,
          isOpen
        );

        const wrapper = document.createElement("div");
        wrapper.className = "content-wrapper";
        wrapper.append(header, main);
        app.appendChild(wrapper);

        if (isOpen) {
          document.body.classList.add("menu-open");
        }
      });
    });
  }

  function setBackgroundGradient(icon, now, sunrise, sunset) {
    document.body.style.background = getGradientByTimeAndIcon(
      icon,
      now,
      sunrise,
      sunset
    );
  }

  function getGradientByTimeAndIcon(iconCode, nowLocal, sunrise, sunset) {
    const dawnStart = sunrise - 1800;
    const dawnEnd = sunrise + 900;
    const duskStart = sunset - 900;
    const duskEnd = sunset + 1800;

    let timeOfDay;
    if (nowLocal < dawnStart) timeOfDay = "night";
    else if (nowLocal <= dawnEnd) timeOfDay = "dawn";
    else if (nowLocal < duskStart) timeOfDay = "day";
    else if (nowLocal <= duskEnd) timeOfDay = "dusk";
    else timeOfDay = "night";

    const gradients = {
      day: {
        clear: "linear-gradient(to bottom, #2275b8, #5baee5)",
        clouds: "linear-gradient(to bottom, #a5aaaf, #72777d)",
        rain: "linear-gradient(to bottom, #4b79a1, #283e51)",
        snow: "linear-gradient(to bottom, #e6dada, #274046)",
        thunder: "linear-gradient(to bottom, #232526, #414345)",
      },
      night: {
        clear: "linear-gradient(to bottom, #0a1029, #1a2d5a)",
        clouds: "linear-gradient(to bottom, #43474e, #1e2227)",
      },
      dawn: {
        clear: "linear-gradient(to bottom, #2a4378, #a05971)",
        clouds: "linear-gradient(to bottom, #43474e, #1e2227)",
      },
      dusk: {
        clear: "linear-gradient(to bottom, #1c2a48, #4a6d91, #e0c79d)",
        clouds: "linear-gradient(to bottom, #43474e, #1e2227)",
      },
    };

    let weatherType;
    if (iconCode.startsWith("01")) weatherType = "clear";
    else if (/^(02|03|04)/.test(iconCode)) weatherType = "clouds";
    else if (/^(09|10)/.test(iconCode)) weatherType = "rain";
    else if (iconCode.startsWith("11")) weatherType = "thunder";
    else if (iconCode.startsWith("13")) weatherType = "snow";
    else weatherType = "clear";

    return gradients[timeOfDay][weatherType] || gradients.day.clear;
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  renderFavorites();
  return nav;
}
