const parse =
  require("../engine/request-parser");

const request =
  parse(process.env.ISSUE_BODY);

console.log(
  "Parsed Request:"
);

console.log(request);

if(
  !request.application
){

  console.error(
    "Application Missing"
  );

  process.exit(1);

}

if(
  request.currentEnvironment ===
  request.targetEnvironment
){

  console.error(
    "Source and Target Environment Cannot Match"
  );

  process.exit(1);

}

console.log(
  "DEV Validation Passed"
);