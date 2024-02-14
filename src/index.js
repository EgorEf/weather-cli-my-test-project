import fs from "node:fs/promises";
import Listr from "listr";
import isFileExists from "./utils/isFileExists.js";
import getWeatherData from "./api/getWeatherData.js";

const getTasksForCities = (cities, mode) => cities.map((city) => ({
  title: city,
  task: async (context) => {
    const weatherData = await getWeatherData({ city, mode });
    context.state.push([`Data for ${city}`, weatherData]);
  },
}));

const getTasksByCoordinates = (lat, lon, mode) => [{
  title: `Data by coordinates latitude=${lat} and longitude=${lon}`,
  task: async (context, task) => {
    const weatherData = await getWeatherData({ lat, lon, mode });
    context.state.push([task.title, weatherData]);
  },
}];

export default async (options) => {
  const {
    output,
    force,
    city = "",
    cities = "",
    lat = null,
    lon = null,
    mode,
  } = options;

  console.log("Requesting data...");

  const allCities = `${cities} ${city}`.split(" ").filter((cityName) => cityName);

  const preparedTasks = allCities.length
    ? getTasksForCities(allCities, mode)
    : getTasksByCoordinates(lat, lon, mode);
  const tasks = new Listr(preparedTasks);
  const { state } = await tasks.run({ state: [] });

  const renderedData = state.map(([title, data]) => `${title}:\n${data}`).join("\n");

  if (!output) {
    return console.log(renderedData);
  }

  if (await isFileExists(output) && !force) {
    throw new Error(`File ${output} already exists`);
  }

  await fs.writeFile(output, renderedData);

  return true;
};
