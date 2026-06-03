const parse =
  require("../engine/request-parser");

const request =
  parse(process.env.ISSUE_BODY);

if(
  !request.reason ||
  request.reason.length < 10
){

  console.error(
    "Business Reason Too Short"
  );

  process.exit(1);

}

console.log(
  "UAT Validation Passed"
);