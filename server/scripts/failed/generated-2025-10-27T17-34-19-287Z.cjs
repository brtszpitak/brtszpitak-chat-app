const fs = require("fs");
const path = require("path");

class ContextMemory {
  constructor() {
    this.memory = {};
    this.historyPath = path.join(__dirname, "conversation_history.json");
    this.loadHistory();
  }

  loadHistory() {
    try {
      const history = fs.readFileSync(this.historyPath, "utf8");
      this.memory = JSON.parse(history);
    } catch (e) {}
  }

  saveHistory() {
    fs.writeFileSync(this.historyPath, JSON.stringify(this.memory));
  }

  recall(topic) {
    return this.memory[topic] || [];
  }

  remember(topic, task) {
    if (!this.memory[topic]) this.memory[topic] = [];
    this.memory[topic].push(task);
    this.saveHistory();
  }
}

const contextMemory = new ContextMemory();

contextMemory.remember("natural language processing", "identify contextual relationships");
contextMemory.remember("conversation history", "store conversation data");

console.log(contextMemory.recall("natural language processing"));
