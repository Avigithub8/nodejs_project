const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./models/index");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/product", productRoutes);

app.get("/", (req, res) => {
  return res.send("This is file");
});

sequelize.sync().then(() => {
  app.listen(3000);
});
