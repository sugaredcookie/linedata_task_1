const fs = require("fs");
const path = require("path");

module.exports = function(request) {

  const csvPath = path.join(
    process.cwd(),
    "config-repo",
    "applications",
    "applications.csv"
  );

  const jsonPath = path.join(
    process.cwd(),
    "config-repo",
    "applications",
    "applications.json"
  );

  console.log("Updating:", csvPath);

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

  const updatedRows =
    lines.map((line, index) => {

      if(index === 0){
        return line;
      }

      const cols =
        line.split(",");

      const application =
        cols[0].trim();

      const environment =
        cols[2].trim();

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

        }
        else if(
          request.targetEnvironment ===
          "UAT"
        ){

          cols[5] =
            "Ready For Promotion";

        }
        else {

          cols[5] =
            "Testing";

        }

        return cols.join(",");

      }

      return line;

    });

  const updatedCsv =
    updatedRows.join("\n");

  fs.writeFileSync(
    csvPath,
    updatedCsv
  );

  console.log(
    "CSV Updated Successfully"
  );

  // ---------------------------
  // Regenerate JSON
  // ---------------------------

  const csvLines =
    updatedCsv.trim().split("\n");

  const headers =
    csvLines[0]
      .split(",")
      .map(h => h.trim());

  const jsonData =
    csvLines
      .slice(1)
      .map(line => {

        const values =
          line
            .split(",")
            .map(v => v.trim());

        const obj = {};

        headers.forEach(
          (header, index) => {

            obj[header] =
              values[index];

          }
        );

        return obj;

      });

  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      jsonData,
      null,
      2
    )
  );

  console.log(
    "JSON Regenerated Successfully"
  );

};