const fs = require("fs");
const path = require("path");

module.exports = function(request) {

  const csvPath =
    path.join(
      process.cwd(),
      "config-repo",
      "applications",
      "applications.csv"
    );

  console.log(
    "Updating:",
    csvPath
  );

  if (!fs.existsSync(csvPath)) {

    throw new Error(
      `CSV file not found: ${csvPath}`
    );

  }

  const csv =
    fs.readFileSync(
      csvPath,
      "utf8"
    );

  const lines =
    csv.trim().split("\n");

  const headers =
    lines[0].split(",");

  const updatedRows =
    lines.map((line, index) => {

      if(index === 0){
        return line;
      }

      const cols =
        line.split(",");

      const application =
        cols[0];

      const environment =
        cols[2];

      if(
        application === request.application
      ){

        if(
          environment !==
          request.currentEnvironment
        ){

          throw new Error(
            `Expected ${request.currentEnvironment} but found ${environment}`
          );

        }

        console.log(
          `Promoting ${application}: ${environment} -> ${request.targetEnvironment}`
        );

        cols[2] =
          request.targetEnvironment;

        if(
          request.targetEnvironment ===
          "PROD"
        ){

          cols[5] = "Live";

        } else {

          cols[5] = "Testing";

        }

        return cols.join(",");

      }

      return line;

    });

  fs.writeFileSync(
    csvPath,
    updatedRows.join("\n")
  );

  console.log(
    "CSV Updated Successfully"
  );

};