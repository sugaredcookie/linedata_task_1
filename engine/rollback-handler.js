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

  const project =
    cols[1]?.trim();

  const environment =
    cols[2]?.trim();

  if(

    client === request.client &&
    project === request.project &&
    environment === request.targetEnvironment

  ){

    found = true;

    console.log(
      `Rolling Back ${project} in ${environment}`
    );

    cols[3] =
      request.releaseId;

    cols[4] =
      request.version;

    cols[5] =
      new Date()
        .toISOString()
        .split("T")[0];

    cols[6] =
      "DEPLOYED";

    return cols.join(",");

  }

  return line;

});


if(
!found
){


throw new Error(
  `Project ${request.project} not found`
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
