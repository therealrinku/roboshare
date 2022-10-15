const pg = require("pg");

const db = new pg.Client(process.env.dbUrl)
db.connect().then(() => console.log("connected successfully")).catch(err => console.log(err))

module.exports = db;