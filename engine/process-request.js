const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "../config/config-changes.log");
const ISSUE_NUMBER = process.env.ISSUE_NUMBER || 'N/A';
const TRIGGERED_BY = process.env.GITHUB_ACTOR || 'github-actions';

function ensureLogFile() {
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, `# Configuration Changes Log - Started ${new Date().toISOString()}\n\n`);
  }
}

function logChange(operation, change, status = "SUCCESS") {
  ensureLogFile();
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ISSUE#${ISSUE_NUMBER} | By: ${TRIGGERED_BY} | ${operation.toUpperCase()} | ` +
                   `App: ${change.application} | Section: ${change.section || 'N/A'} | ` +
                   `Key: ${change.key} | New Value: ${change.newValue} | Status: ${status}\n`;
  
  fs.appendFileSync(LOG_FILE, logEntry);
  console.log(`📝 Logged: #${ISSUE_NUMBER} ${operation} ${change.application}.${change.key}`);
}

// Main parsing logic
const body = process.env.ISSUE_BODY || "";
function extract(label) {
  if (!body) throw new Error("ISSUE_BODY env variable not found");
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(label)) {
      return lines[i + 2]?.trim() || null;
    }
  }
  return null;
}

const change = {
  application: extract("Application Name"),
  section: extract("Section Name"),
  key: extract("Configuration Key"),
  newValue: extract("New Value"),
  reason: extract("Change Reason") || "No reason provided"
};

console.log("=== Incoming Configuration Request ===");
console.log(change);

if (!change.application || !change.key) {
  console.error("Missing required fields");
  process.exit(1);
}

try {
  require("./sql-handler")(change);
  logChange("UPDATE", change, "SUCCESS");
  console.log("Configuration updated successfully");
} catch (error) {
  logChange("UPDATE", change, "FAILED");
  console.error("Error:", error.message);
  process.exit(1);
}