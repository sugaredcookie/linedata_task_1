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

let sourceReleaseId = null;
let sourceVersion = null;

// ------------------------------------------------
// Find Source Release
// ------------------------------------------------

lines.forEach((line, index) => {


if(index === 0){
  return;
}

const cols =
  line.split(",");

const client =
  cols[0]?.trim();

const project =
  cols[1]?.trim();

const environment =
  cols[2]?.trim();

const releaseId =
  cols[3]?.trim();

const version =
  cols[4]?.trim();

if(

  client === request.client &&
  project === request.project &&
  environment === request.sourceEnvironment

){

  sourceReleaseId =
    releaseId;

  sourceVersion =
    version;

}


});

if(
!sourceReleaseId
){


throw new Error(
  `Source deployment not found for ${request.project} in ${request.sourceEnvironment}`
);


}

console.log(
`Source Release Found: ${sourceReleaseId} (${sourceVersion})`
);

// ------------------------------------------------
// Update Target Environment
// ------------------------------------------------

let targetFound = false;

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

    targetFound = true;

    console.log(
      `Promoting ${project}: ${request.sourceEnvironment} -> ${request.targetEnvironment}`
    );

    cols[3] =
      sourceReleaseId;

    cols[4] =
      sourceVersion;

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
!targetFound
){


throw new Error(
  `Target environment ${request.targetEnvironment} not found for ${request.project}`
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

// ------------------------------------------------
// Regenerate JSON
// ------------------------------------------------

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
