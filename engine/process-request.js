const body = process.env.ISSUE_BODY;

function extract(label) {

  const lines = body.split("\n");

  for (let i = 0; i < lines.length; i++) {

    if (lines[i].includes(label)) {
      return lines[i + 2]?.trim();
    }

  }

  return null;
}

const change = {

  application:
    extract("Application Name"),

  section:
    extract("Section Name"),

  key:
    extract("Configuration Key"),

  newValue:
    extract("New Value")

};

console.log("Incoming Request");
console.log(change);

require("./sql-handler")(change);