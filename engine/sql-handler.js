const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

module.exports = function(change) {

  const db =
    new sqlite3.Database("./database/demo.db");

  db.get(
    `
    SELECT value
    FROM config_entries
    WHERE application = ?
    AND section_name = ?
    AND key_name = ?
    `,
    [
      change.application,
      change.section,
      change.key
    ],
    (err, row) => {

      if (err) {

        console.error(err);
        process.exit(1);

      }

      if (!row) {

        throw new Error(
          "Configuration Not Found"
        );

      }

      const oldValue = row.value;

      db.run(
        `
        UPDATE config_entries
        SET value = ?
        WHERE application = ?
        AND section_name = ?
        AND key_name = ?
        `,
        [
          change.newValue,
          change.application,
          change.section,
          change.key
        ],
        function(updateErr) {

          if (updateErr) {

            console.error(updateErr);
            process.exit(1);

          }

          console.log(
            "Rows Updated:",
            this.changes
          );

          const auditFile =
            "audit/change-history.json";

          const history =
            JSON.parse(
              fs.readFileSync(
                auditFile,
                "utf8"
              )
            );

          history.push({

            timestamp:
              new Date().toISOString(),

            application:
              change.application,

            section:
              change.section,

            key:
              change.key,

            oldValue,

            newValue:
              change.newValue,

            status:
              "SUCCESS"

          });

          fs.writeFileSync(
            auditFile,
            JSON.stringify(
              history,
              null,
              2
            )
          );

          console.log(
            "Audit Record Created"
          );

          db.close();

        }
      );

    }
  );

};