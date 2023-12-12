const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const expenseModel = require("../models/expenseModel");

router.post("/signup", async (req, res) => {
  try {
    const { username, emailid, password } = req.body;

    const existingUser = await expenseModel.findOne({ emailid });
    if (existingUser) {
      return res.status(403).send("Email ID is already in use");
    }

    const signup = await expenseModel.create({ username, emailid, password });

    res.status(200).send({
      message: "Form submitted successfully!",
      // signupData: signup,
    });
  } catch (error) {
    console.error("Error submitting:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", (req, res) => {
  const { username, email, password } = req.query;
  res.render("signupScreen", { username, email, password });
});

module.exports = router;
