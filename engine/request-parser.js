function extract(body, label) {

  const lines = body.split("\n");

  for(let i = 0; i < lines.length; i++) {

    if(lines[i].includes(label)) {

      for(let j = i + 1; j < lines.length; j++) {

        const value = lines[j].trim();

        if(value !== "") {
          return value;
        }

      }

    }

  }

  return null;

}

module.exports = function(body) {

  return {

    client:
      extract(body, "Client"),

    application:
      extract(body, "Application Name"),

    currentEnvironment:
      extract(body, "Current Environment"),

    targetEnvironment:
      extract(body, "Target Environment"),

    rollbackEnvironment:
      extract(body, "Rollback Environment"),

    version:
      extract(body, "Version"),

    rollbackVersion:
      extract(body, "Rollback Version"),

    requestType:
      extract(body, "Request Type"),

    reason:
      extract(body, "Change Reason")

  };

};