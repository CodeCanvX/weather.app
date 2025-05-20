import { API_KEY } from "./config.js";

// Получение координат по названию города
export async function getCoordinates(city) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${API_KEY}`
  );
  const data = await res.json();

  if (!data.length) {
    throw new Error("Город не найден");
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
  };
}

// Получение названия города по координатам
export async function getCityName(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  );
  const data = await res.json();

  return data[0]?.name || "Неизвестно";
}

// Получение полной информации о погоде по координатам
export async function fetchWeatherByCoords(lat, lon) {
  const [weatherData, airData, cityName] = await Promise.all([
    getWeatherData(lat, lon),
    getAirQuality(lat, lon),
    getCityName(lat, lon),
  ]);

  const current = weatherData.current;
  const today = weatherData.daily[0];

  return {
    city: cityName,
    temperature: Math.round(current.temp),
    feels_like: Math.round(current.feels_like),
    min: Math.round(today.temp.min),
    max: Math.round(today.temp.max),
    humidity: current.humidity,
    dew_point: current.dew_point,
    pressure: current.pressure,
    visibility: current.visibility,
    sunrise: current.sunrise,
    sunset: current.sunset,
    windSpeed: current.wind_speed,
    windGust: current.wind_gust || 0,
    windDeg: current.wind_deg,
    precipitation: today.rain || 0,
    timezoneOffset: weatherData.timezone_offset,
    daily: weatherData.daily,
    aqi: airData,
  };
}

// Получение полной информации о погоде по названию города
export async function fetchWeather(cityName) {
  const { lat, lon } = await getCoordinates(cityName);
  return fetchWeatherByCoords(lat, lon);
}

// Получение почасового прогноза погоды
export async function fetchHourly(cityName) {
  const { lat, lon } = await getCoordinates(cityName);
  const data = await getWeatherData(lat, lon);

  return data.hourly.slice(0, 20).map((hour) => {
    return {
      time: new Date(hour.dt * 1000).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
      }),
      temp: hour.temp,
      icon: hour.weather[0].icon,
    };
  });
}

// Получение данных о погоде (основной API)
async function getWeatherData(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&lang=ru&appid=${API_KEY}`
  );
  return res.json();
}

// Получение качества воздуха
async function getAirQuality(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  const data = await res.json();
  return data.list[0]?.main?.aqi || 1;
}
