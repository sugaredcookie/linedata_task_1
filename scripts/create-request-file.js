const body = process.env.ISSUE_BODY;

function extract(label) {

  const lines = body.split("\n");

  for(let i = 0; i < lines.length; i++) {

    if(lines[i].includes(label)) {

      return lines[i + 2]?.trim();

    }

  }

  return "";

}

const fs = require("fs");

const request = {

  application: extract("Application Name"),
  section: extract("Section Name"),
  key: extract("Configuration Key"),
  newValue: extract("New Value")

};

console.log(request);

fs.mkdirSync("requests", { recursive: true });

fs.writeFileSync(
  `requests/request-${process.env.ISSUE_NUMBER}.json`,
  JSON.stringify(request, null, 2)
);