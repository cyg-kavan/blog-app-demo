//Blog app backend entry point

const express = require("express");
const Connection = require("./database/db.js");
const authRoute = require("./routes/route.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8000;

Connection();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", authRoute);

app.listen(PORT, () => {console.log(`Server is running at PORT: ${PORT}`)})