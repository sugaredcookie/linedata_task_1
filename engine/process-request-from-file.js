const fs = require("fs");

const files =
  fs.readdirSync("./requests");

if(files.length === 0) {

  throw new Error(
    "No Request Files Found"
  );

}

const latestFile =
  files.sort().pop();

const request =
  JSON.parse(
    fs.readFileSync(
      `./requests/${latestFile}`,
      "utf8"
    )
  );

const change = {

  application:
    request.application,

  section:
    request.section,

  key:
    request.key,

  newValue:
    request.newValue

};

console.log("Approved Request");
console.log(change);

require("./sql-handler")(change);