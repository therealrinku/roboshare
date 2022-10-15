const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const route = require("./route");
app.use("", route);

const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log("i am listening");
});
