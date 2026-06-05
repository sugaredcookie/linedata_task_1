const fs = require("fs");

module.exports = function(change) {

  const file = `config-repo/configs/${change.application}/${change.section}.json`;

  console.log("Updating:", file);

  const config =
    JSON.parse(
      fs.readFileSync(file, "utf8")
    );

  const oldValue =
    config[change.key];

  config[change.key] =
    change.newValue;

  fs.writeFileSync(
    file,
    JSON.stringify(
      config,
      null,
      2
    )
  );

  console.log(
    `${change.key}: ${oldValue} -> ${change.newValue}`
  );

};