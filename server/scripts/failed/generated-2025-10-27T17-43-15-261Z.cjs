const fs = require("fs");
const path = require("path");

let storage = {};

try {
  const data = fs.readFileSync(path.join(__dirname, "storage.json"), "utf8");
  storage = JSON.parse(data);
} catch (e) {}

const saveStorage = () => {
  fs.writeFileSync(path.join(__dirname, "storage.json"), JSON.stringify(storage));
};

const addInteraction = (interaction) => {
  const now = new Date().toISOString();
  storage[now] = interaction;
  saveStorage();
};

const getInteractions = () => {
  return Object.values(storage);
};

addInteraction("Initial interaction");

console.log(getInteractions());
