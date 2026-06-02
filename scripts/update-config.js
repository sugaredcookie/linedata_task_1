const fs = require("fs");

const file = "config/configurations.json";

const data = JSON.parse(
  fs.readFileSync(file, "utf8")
);

const application = "LMS";
const key = "DB_HOST";
const value = "aws-prod.company.com";

data[application][key] = value;

fs.writeFileSync(
  file,
  JSON.stringify(data, null, 2)
);

console.log("Configuration updated");