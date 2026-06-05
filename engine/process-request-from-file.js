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
  console.log(`Logged: #${ISSUE_NUMBER} ${operation} ${change.application}.${change.key}`);
}

// Read latest request file
const files = fs.readdirSync("./requests");
if (files.length === 0) {
  throw new Error("No Request Files Found");
}

const latestFile = files.sort().pop();
const request = JSON.parse(fs.readFileSync(`./requests/${latestFile}`, "utf8"));

const change = {
  application: request.application,
  section: request.section,
  key: request.key,
  newValue: request.newValue,
  reason: request.reason || "Approved via PR"
};

console.log("=== Approved Configuration Request ===");
console.log(change);

try {
  require("./sql-handler")(change);
  logChange("PROD_DEPLOY", change, "SUCCESS");
  console.log("Production deployment completed successfully");
} catch (error) {
  logChange("PROD_DEPLOY", change, "FAILED");
  console.error("Error:", error.message);
  process.exit(1);
}