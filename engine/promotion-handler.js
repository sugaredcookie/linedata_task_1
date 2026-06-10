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

  let found = false;

  const updatedRows =
    lines.map((line, index) => {

      if(index === 0){
        return line;
      }

      const cols =
        line.split(",");

        console.log("LINE:", line);
        console.log("COLS:", cols);
        console.log("COUNT:", cols.length);

        const client = cols[0]?.trim();
        const application = cols[1]?.trim();
        const version = cols[2]?.trim();
        const environment = cols[3]?.trim();

      if(

        client === request.client &&
        application === request.application

      ){

        found = true;

        if(
          environment !==
          request.currentEnvironment
        ){

          throw new Error(
            `Expected ${request.currentEnvironment} but found ${environment}`
          );

        }

        console.log(
          `Promoting ${client} | ${application}: ${environment} -> ${request.targetEnvironment}`
        );

        cols[3] =
          request.targetEnvironment;

        if(
          request.targetEnvironment ===
          "PROD"
        ){

          cols[6] = "Live";

        }
        else if(
          request.targetEnvironment ===
          "UAT"
        ){

          cols[6] =
            "Ready For Promotion";

        }
        else {

          cols[6] =
            "Testing";

        }

        cols[8] =
          new Date()
            .toISOString()
            .split("T")[0];

        return cols.join(",");

      }

      return line;

    });

  if(!found){

    throw new Error(
      `Application ${request.application} for client ${request.client} not found`
    );

  }

  const updatedCsv =
    updatedRows.join("\n");

  fs.writeFileSync(
    csvPath,
    updatedCsv
  );

  console.log(
    "CSV Updated Successfully"
  );

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