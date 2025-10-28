const { execSync } = require("child_process");
console.log("🧪 Running creative feature tests...");
try {
  execSync("npm test", { cwd: "D:/Alice/projects/chat-app/server", stdio: "inherit" });
} catch (e) {
  console.error("Test error:", e.message);
}
