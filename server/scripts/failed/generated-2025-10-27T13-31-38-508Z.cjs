console.log("Context-Aware Suggestion System");

const prompts = [
  "I want to manage files",
  "I need to configure network settings",
  "Help me with system updates",
];

const suggestions = {
  "file management": ["Get-ChildItem", "Remove-Item", "Copy-Item"],
  "network configuration": ["Get-NetAdapter", "Set-DNSClientServerAddress", "New-NetFirewallRule"],
  "system updates": ["Get-WindowsUpdateLog", "Install-WindowsUpdate", "Get-HotFix"],
};

for (const prompt of prompts) {
  let suggestion = "";
  Object.keys(suggestions).some((key) => {
    if (prompt.toLowerCase().includes(key)) {
      suggestion = suggestions[key][Math.floor(Math.random() * suggestions[key].length)];
      return true;
    }
  });
  console.log(`For "${prompt}", I suggest: ${suggestion}`);
}
