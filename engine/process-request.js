const sourceType = "SQL";

switch(sourceType) {

    case "JSON":
        require("./json-handler");
        break;

    case "CSV":
        require("./csv-handler");
        break;

    case "SQL":
        require("./sql-handler");
        break;

    case "YAML":
        require("./yaml-handler");
        break;

    default:
        throw new Error("Unsupported source type");
}