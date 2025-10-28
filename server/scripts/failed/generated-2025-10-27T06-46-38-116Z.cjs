console.log("Initializing Alice Knowledge Graph...");

const fs = require("fs");
const path = require("path");

class KnowledgeGraph {
  constructor() {
    this.graph = {};
    this.filePath = path.join(__dirname, "alice_kg.json");
    this.load();
  }

  load() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      this.graph = JSON.parse(data);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.graph, null, 2));
  }

  add(node, data) {
    this.graph[node] = { ...this.graph[node], ...data };
    this.save();
  }

  get(node) {
    return this.graph[node];
  }
}

const kg = new KnowledgeGraph();

kg.add("user_preferences", {});

console.log("Alice Knowledge Graph ready!");
