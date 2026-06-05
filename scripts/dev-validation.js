const parse =
  require("../engine/request-parser");

const sqlite3 =
  require("sqlite3").verbose();

const request =
  parse(process.env.ISSUE_BODY);

console.log("Parsed Request:");
console.log(request);

const db =
  new sqlite3.Database("./database/demo.db");

db.get(
`
SELECT *
FROM config_entries
WHERE application = ?
AND section_name = ?
AND key_name = ?
`,
[
  request.application,
  request.section,
  request.key
],
(err,row)=>{

  if(!row){

    console.error(
      "Configuration Not Found"
    );

    process.exit(1);

  }

  console.log(
    "DEV Validation Passed"
  );

  db.close();

});