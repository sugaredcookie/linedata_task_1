const fs = require("fs");
const path = require("path");

const LOG_FILE =
  path.join(
    __dirname,
    "../config/config-changes.log"
  );

const ISSUE_NUMBER =
  process.env.ISSUE_NUMBER || "N/A";

const TRIGGERED_BY =
  process.env.GITHUB_ACTOR ||
  "github-actions";

function ensureLogFile() {

  if (!fs.existsSync(LOG_FILE)) {

    fs.writeFileSync(
      LOG_FILE,
      `# Configuration Changes Log - Started ${new Date().toISOString()}\n\n`
    );

  }

}

function logChange(
  operation,
  change,
  status = "SUCCESS"
) {

  ensureLogFile();

  const timestamp =
    new Date().toISOString();

  const logEntry =
    `[${timestamp}] ISSUE#${ISSUE_NUMBER} | ` +
    `By: ${TRIGGERED_BY} | ` +
    `${operation.toUpperCase()} | ` +
    `App: ${change.application} | ` +
    `Section: ${change.section || "N/A"} | ` +
    `Key: ${change.key} | ` +
    `New Value: ${change.newValue} | ` +
    `Status: ${status}\n`;

  fs.appendFileSync(
    LOG_FILE,
    logEntry
  );

}

const requestFile =
  `./requests/request-${ISSUE_NUMBER}.json`;

console.log(
  "Reading Request File:",
  requestFile
);

if (!fs.existsSync(requestFile)) {

  throw new Error(
    `Request File Not Found: ${requestFile}`
  );

}

const request =
  JSON.parse(
    fs.readFileSync(
      requestFile,
      "utf8"
    )
  );

console.log(
  "Loaded Request:"
);

console.log(request);

const change = {

  application:
    request.application,

  section:
    request.section,

  key:
    request.key,

  newValue:
    request.newValue,

  reason:
    request.reason ||
    "Approved via PR"

};

console.log(
  "Approved Request:"
);

console.log(change);

require("./json-handler")(change);