const parse =
  require("../engine/request-parser");

const request =
  parse(process.env.ISSUE_BODY);

const allowedValues = [

  "DEV",
  "QA",
  "UAT",
  "DR",
  "PROD"

];

if(
  !allowedValues.includes(
    request.newValue
  )
){

  console.error(
    "Invalid Value"
  );

  process.exit(1);

}

console.log(
  "QA Validation Passed"
);