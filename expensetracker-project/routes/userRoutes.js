const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const expenseModel = require("../models/expenseModel");

router.get("/", (req, res) => {
  res.render("homeScreen");
});

router.get("/signup", (req, res) => {
  res.render("signupScreen", { message: null });
});

router.post("/signup", async (req, res) => {
  const { username, emailid, password } = req.body;

  try {
    const existingUser = await expenseModel.findOne({ where: { emailid } });

    if (existingUser) {
      return res.redirect("/signin");
    }

    const newUser = await expenseModel.create({ username, emailid, password });

    return res.render("signupScreen", {
      message: "Signup successful",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/signin", (req, res) => {
  res.render("signinScreen", { message: null });
});

router.post("/signin", async (req, res) => {
  const { emailid, password } = req.body;

  try {
    const user = await expenseModel.findOne({ where: { emailid } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user && user.password === password) {
      return res.status(200).json({ message: "User login successful" });
    } else {
      return res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
