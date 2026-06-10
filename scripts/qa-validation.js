const parse =
  require("../engine/request-parser");

const request =
  parse(process.env.ISSUE_BODY);

if(
  request.requestType ===
  "ROLLBACK"
){

  console.log(
    "Rollback QA Validation Passed"
  );

  process.exit(0);

}

const transitions = {

  DEV: "QA",
  QA: "UAT",
  UAT: "PROD"

};

if(
  transitions[
    request.currentEnvironment
  ] !==
  request.targetEnvironment
){

  console.error(
    "Invalid Environment Transition"
  );

  process.exit(1);

}

console.log(
  "Promotion QA Validation Passed"
);