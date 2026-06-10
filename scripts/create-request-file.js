const fs = require("fs");

const body = process.env.ISSUE_BODY || "";

function extract(label) {

  const lines = body.split("\n");

  for(let i = 0; i < lines.length; i++) {

    if(lines[i].includes(label)) {

      for(let j = i + 1; j < lines.length; j++) {

        const value = lines[j].trim();

        if(value !== "") {
          return value;
        }

      }

    }

  }

  return "";

}

console.log("===== ISSUE BODY =====");
console.log(body);
console.log("======================");

const request = {

  client:
    extract("Client"),

  application:
    extract("Application Name"),

  currentEnvironment:
    extract("Current Environment"),

  targetEnvironment:
    extract("Target Environment"),

  rollbackEnvironment:
    extract("Rollback Environment"),

  version:
    extract("Version"),

  rollbackVersion:
    extract("Rollback Version"),

  requestType:
    extract("Request Type"),

  reason:
    extract("Change Reason")

};

console.log("Generated Request:");
console.log(request);

fs.mkdirSync(
  "requests",
  {
    recursive: true
  }
);

fs.writeFileSync(
  `requests/request-${process.env.ISSUE_NUMBER}.json`,
  JSON.stringify(
    request,
    null,
    2
  )
);

console.log(
  `Created request-${process.env.ISSUE_NUMBER}.json`
);