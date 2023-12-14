const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("homeScreen");
});

router.get("/signup", (req, res) => {
  res.render("user/signupScreen", { message: null });
});

router.post("/signup", async (req, res) => {
  const { username, emailid, password } = req.body;
  console.log(req.body);
  try {
    const existingUser = await UserModel.findOne({ where: { emailid } });

    if (existingUser) {
      return res.redirect("user/signin");
    }
    bcrypt.hash(password, 8, async (err, hashPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error!" });
      }
      const newUser = await UserModel.create({
        username,
        emailid,
        password: hashPassword,
      });
      return res.render("user/signupScreen", {
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
  console.log("body", req.body);
  try {
    const user = await UserModel.findOne({ where: { emailid } });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error during password comparison:", err);
        return res.status(500).json({ message: "Internal Server Error!" });
      }

      if (result) {
        const userId = user.id || user.dataValues.id;
        console.log("User login successful. User ID:", userId);
        return res.redirect(`/product/addProduct/${userId}` );
      } else {
        console.log("Invalid password for user:", user);
        return res.status(400).json({ message: "Password is incorrect" });
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
