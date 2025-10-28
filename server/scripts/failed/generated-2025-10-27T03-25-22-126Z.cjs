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
      try {
        this.data = JSON.parse(fs.readFileSync(this.file, "utf8"));
      } catch (e) {}
    }
  }

  save() {
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
  }

  addConversation(conversationId, data) {
    this.data[conversationId] = data;
    this.save();
  }

  getConversation(conversationId) {
    return this.data[conversationId];
  }
}

const graph = new KnowledgeGraph(path.join(__dirname, "knowledge-graph.json"));

graph.addConversation("12345", { userPreferences: [" foo", "bar"], importantDetails: ["baz"] });
console.log(graph.getConversation("12345"));
