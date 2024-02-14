import PATHS from "./paths.js";

const getWeatherData = async (params) => {
  const {
    lat, lon, mode, city,
  } = params;

  const url = new URL(PATHS.WEATHER);
  const searchParams = new URLSearchParams({
    appid: process.env.WEATHER_API_KEY ?? "",
    mode,
  });

  if (city) {
    searchParams.append("q", city);
  } else {
    searchParams.append("lat", lat);
    searchParams.append("lon", lon);
  }

  url.search = searchParams.toString();

  const response = await fetch(url);
  return response.text();
};

export default getWeatherData;
