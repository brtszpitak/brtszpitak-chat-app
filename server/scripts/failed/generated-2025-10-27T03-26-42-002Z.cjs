const fs = require("fs");
const path = require("path");

class KnowledgeGraph {
  constructor(file) {
    this.file = file;
    this.data = {};
    this.load();
  }

  load() {
    if (fs.existsSync(this.file)) {
      this.data = JSON.parse(fs.readFileSync(this.file, "utf8"));
    }
  }

  save() {
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
  }

  add(node) {
    this.data[node.id] = node;
    this.save();
  }

  get(id) {
    return this.data[id];
  }

  remove(id) {
    delete this.data[id];
    this.save();
  }
}

const graph = new KnowledgeGraph(path.join(__dirname, "knowledge.json"));

graph.add({ id: "user-preferences", data: {} });
graph.add({ id: "conversations", data: [] });

console.log(graph.get("user-preferences"));
console.log(graph.get("conversations"));
