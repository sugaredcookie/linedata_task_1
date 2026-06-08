const parse =
  require("../engine/request-parser");

const request =
  parse(process.env.ISSUE_BODY);

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
  "QA Validation Passed"
);