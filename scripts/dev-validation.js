const parse =
  require("../engine/request-parser");

const request =
  parse(process.env.ISSUE_BODY);

console.log(
  "Parsed Request:"
);

console.log(request);

if(
  !request.client
){

  console.error(
    "Client Missing"
  );

  process.exit(1);

}

if(
  !request.project
){

  console.error(
    "Project Missing"
  );

  process.exit(1);

}

if(
  !request.releaseId
){

  console.error(
    "Release ID Missing"
  );

  process.exit(1);

}

if(
  !request.version
){

  console.error(
    "Version Missing"
  );

  process.exit(1);

}

if(
  request.requestType ===
  "PROMOTION"
){

  if(
    !request.sourceEnvironment
  ){

    console.error(
      "Source Environment Missing"
    );

    process.exit(1);

  }

  if(
    !request.targetEnvironment
  ){

    console.error(
      "Target Environment Missing"
    );

    process.exit(1);

  }

  if(
    request.sourceEnvironment ===
    request.targetEnvironment
  ){

    console.error(
      "Source and Target Environment Cannot Match"
    );

    process.exit(1);

  }

}

if(
  request.requestType ===
  "ROLLBACK"
){

  if(
    !request.targetEnvironment
  ){

    console.error(
      "Target Environment Missing"
    );

    process.exit(1);

  }

}

console.log(
  "DEV Validation Passed"
);