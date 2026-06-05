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

    application:
      extract(body, "Application Name"),

    section:
      extract(body, "Section Name"),

    key:
      extract(body, "Configuration Key"),

    newValue:
      extract(body, "New Value"),

    reason:
      extract(body, "Change Reason")

  };

};