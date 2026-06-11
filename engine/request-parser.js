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

    project:
      extract(body, "Project"),

    sourceEnvironment:
      extract(body, "Source Environment"),

    targetEnvironment:
      extract(body, "Target Environment"),

    releaseId:
      extract(body, "Release ID"),

    version:
      extract(body, "Version"),

    requestType:
      extract(body, "Request Type"),

    reason:
      extract(body, "Change Reason")

  };

};