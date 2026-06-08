const fs = require("fs");

const body = process.env.ISSUE_BODY;

function extract(label) {

  const lines = body.split("\n");

  for(let i = 0; i < lines.length; i++) {

    if(lines[i].includes(label)) {
      return lines[i + 2]?.trim() || "";
    }

  }

  return "";

}

const request = {

  application:
    extract("Application Name"),

  currentEnvironment:
    extract("Current Environment"),

  targetEnvironment:
    extract("Target Environment"),

  version:
    extract("Version"),

  reason:
    extract("Change Reason")

};

console.log("Generated Request:");
console.log(request);

fs.mkdirSync(
  "requests",
  { recursive: true }
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