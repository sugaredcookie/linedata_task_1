const parse =
  require("../engine/request-parser");

const request =
  parse(process.env.ISSUE_BODY);

const forwardTransitions = {
  DEV: "QA",
  QA: "UAT",
  UAT: "PROD"
};

const rollbackTransitions = {
  PROD: "UAT",
  UAT: "QA",
  QA: "DEV"
};

const isRollback =
  request.reason &&
  request.reason
    .toLowerCase()
    .includes("rollback");

if (isRollback) {

  if (
    rollbackTransitions[
      request.currentEnvironment
    ] !==
    request.targetEnvironment
  ) {

    console.error(
      "Invalid Rollback Transition"
    );

    process.exit(1);

  }

  console.log(
    "Rollback Validation Passed"
  );

}
else {

  if (
    forwardTransitions[
      request.currentEnvironment
    ] !==
    request.targetEnvironment
  ) {

    console.error(
      "Invalid Promotion Transition"
    );

    process.exit(1);

  }

  console.log(
    "Promotion Validation Passed"
  );

}