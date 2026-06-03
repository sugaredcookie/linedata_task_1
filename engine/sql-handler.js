const fs = require("fs");

console.log("SQL Handler Selected");

console.log("Updating Database...");

// pretend update succeeded

const auditFile = "audit/change-history.json";

const history = JSON.parse(
  fs.readFileSync(auditFile, "utf8")
);

history.push({
  timestamp: new Date().toISOString(),
  issueNumber: 1,
  sourceType: "SQL",
  operation: "UPDATE",
  target: "customers.email",
  oldValue: "john@test.com",
  newValue: "updated@test.com",
  status: "SUCCESS"
});

fs.writeFileSync(
  auditFile,
  JSON.stringify(history, null, 2)
);

console.log("Audit Record Created");