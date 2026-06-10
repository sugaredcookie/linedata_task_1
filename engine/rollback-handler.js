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

      const client =
        cols[0]?.trim();

      const application =
        cols[1]?.trim();

      if(

        client === request.client &&
        application === request.application

      ){

        found = true;

        const currentVersion =
          cols[2];

        const previousVersion =
          cols[3];

        const currentEnvironment =
          cols[4];

        const previousEnvironment =
          cols[5];

        cols[2] =
          previousVersion;

        cols[3] =
          currentVersion;

        cols[4] =
          previousEnvironment;

        cols[5] =
          currentEnvironment;

        cols[10] =
          new Date()
            .toISOString()
            .split("T")[0];

        return cols.join(",");

      }

      return line;

    });

  if(!found){

    throw new Error(
      `Application ${request.application} not found`
    );

  }

  const updatedCsv =
    updatedRows.join("\n");

  fs.writeFileSync(
    csvPath,
    updatedCsv
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
    "Rollback Completed"
  );

};