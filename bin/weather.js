#!/usr/bin/env node

import process from "node:process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import "dotenv/config";

import run from "../src/index.js";

yargs(hideBin(process.argv))
  .usage("Usage: $0 [options]")
  .help("help")
  .alias("help", "h")
  .option("lat", {
    describe: "Latitude",
    type: "number",
  })
  .option("lon", {
    describe: "Longitude",
    type: "number",
  })
  .option("mode", {
    alias: "m",
    describe: "Mode",
    type: "string",
    default: "json",
    choices: ["json", "xml", "html"],
  })
  .option("output", {
    alias: "o",
    describe: "Output file path. If not provided, output to stdout",
    type: "string",
  })
  .option("force", {
    alias: "f",
    describe: "Use the flag to overwrite the file",
    default: false,
    type: "boolean",
  })
  .strict()
  .command({
    command: "city <city>",
    default: "",
    describe: "Get weather by city name",
    type: "string",
    handler: (argv) => run(argv),
  })
  .command({
    command: "cities <cities>",
    default: "",
    describe: "Get weather for the cities",
    type: "string",
    handler: (argv) => run(argv),
  })
  .command({
    command: "$0",
    describe: "Get weather by longtitude and latitude",
    builder: (yargsEntity) => yargsEntity.demandOption(["lat", "lon"], "Please provide latitude and longitude"),
    handler: (argv) => run(argv),
  })
  .parse();
