const pg = require("pg");

const db = new pg.Client(process.env.DB_URL);

db.connect()
  .then(() => {
    console.log("connected to postgres successfully.");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = db;
