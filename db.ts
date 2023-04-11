import pg from "pg";

const db = new pg.Client(process.env.dbUrl)
db.connect().then(() => console.log("connected to db successfully")).catch((err) => console.log(err))

export default db;
