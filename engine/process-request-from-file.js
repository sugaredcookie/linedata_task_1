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

  if(!fs.existsSync(LOG_FILE)) {

    fs.writeFileSync(
      LOG_FILE,
      `# Promotion Log Started ${new Date().toISOString()}\n\n`
    );

  }

}

function logPromotion(
  request,
  status = "SUCCESS"
){

  ensureLogFile();

  const timestamp =
    new Date().toISOString();

  const logEntry =
    `[${timestamp}] ISSUE#${ISSUE_NUMBER} | ` +
    `By: ${TRIGGERED_BY} | ` +
    `PROMOTION | ` +
    `App: ${request.application} | ` +
    `From: ${request.currentEnvironment} | ` +
    `To: ${request.targetEnvironment} | ` +
    `Version: ${request.version} | ` +
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

if(
  !fs.existsSync(
    requestFile
  )
){

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

try {

  require("./promotion-handler")(
    request
  );

  logPromotion(
    request,
    "SUCCESS"
  );

  console.log(
    "Promotion Completed"
  );

}
catch(error){

  logPromotion(
    request,
    "FAILED"
  );

  console.error(
    error.message
  );

  process.exit(1);

}