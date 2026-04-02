const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");
const adminRoutes = require("./routes/admin.routes");
const requestRoutes = require("./routes/request.routes");
// const mainRoutes = require("./routes/main.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/request", requestRoutes);

// app.use("/api", mainRoutes);

module.exports = app;