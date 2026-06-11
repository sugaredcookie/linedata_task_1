const parse =
  require("../engine/request-parser");

const request =
  parse(process.env.ISSUE_BODY);

if(
  request.requestType ===
  "PROMOTION"
){

  if(
    !request.sourceEnvironment ||
    !request.targetEnvironment
  ){

    console.error(
      "Environment Missing"
    );

    process.exit(1);

  }

}

if(
  request.requestType ===
  "ROLLBACK"
){

  if(
    !request.releaseId
  ){

    console.error(
      "Rollback Release Missing"
    );

    process.exit(1);

  }

}

console.log(
  "QA Validation Passed"
);