const fs = require("fs");
const path = require("path");

let logDir = path.join(require("os").homedir(), ".conversation-logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

class ConversationLog {
  constructor(userId) {
    this.userId = userId;
    this.logFile = path.join(logDir, `${userId}.log`);
    this.logs = this.readLogs();
  }

  readLogs() {
    try {
      return JSON.parse(fs.readFileSync(this.logFile, "utf8"));
    } catch (e) {
      return {};
    }
  }

  writeLog(message) {
    this.logs[Date.now()] = message;
    fs.writeFileSync(this.logFile, JSON.stringify(this.logs));
  }

  recall(context) {
    for (let timestamp in this.logs) {
      if (this.logs[timestamp].includes(context)) return this.logs[timestamp];
    }
    return null;
  }
}

const userId = "Bartosz";
const log = new ConversationLog(userId);

process.stdin.setEncoding("utf8");
process.stdin.on("data", (message) => {
  message = message.trim();
  if (message === "recall") {
    console.log(log.recall(prompt("Context: ")));
  } else {
    log.writeLog(message);
    console.log(`Logged: ${message}`);
  }
});
