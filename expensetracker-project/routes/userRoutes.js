const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const expenseModel = require("../models/expenseModel");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("homeScreen");
});

router.get("/signup", (req, res) => {
  res.render("user/signupScreen", { message: null });
});

router.post("/signup", async (req, res) => {
  const { username, emailid, password } = req.body;

  try {
    const existingUser = await expenseModel.findOne({ where: { emailid } });

    if (existingUser) {
      return res.redirect("/signin");
    }
    bcrypt.hash(password, 8, async (err, password) => {
      console.log(err);
      const newUser = await expenseModel.create({
        username,
        emailid,
        password: password,
      });
      return res.render("signupScreen", {
        message: "Signup successful",
        user: newUser,
      });
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/signin", (req, res) => {
  res.render("user/signinScreen", { message: null });
});

router.post("/signin", async (req, res) => {
  const { emailid, password } = req.body;

  try {
    const user = await expenseModel.findOne({ where: { emailid } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error during password comparison:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result) {
         return res.redirect('/product/addProduct');
      } else {
        return res.status(400).json({ message: "Password is incorrect" });
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
