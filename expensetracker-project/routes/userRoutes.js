const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const { verifyToken, generateToken } = require("../middleware/verifyToken");
const { json } = require("body-parser");
const localStorage = require("localStorage");

router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Incomplete data provided" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const token = generateToken(User.id);
    console.log("token", token);
    // localStorage.setItem('jwtToken',token);
    res.cookie("jwtToken", token, { httpOnly: true, maxAge: 3600000 * 1000 }); // 1 hour in milliseconds

    res.status(201).json({ token });
    // return res.render("user/signupScreen", {
    //   message: "Signup successful",
    //   user: newUser,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/signup", (req, res) => {
  res.render("user/signupScreen", { message: null });
});

router.get("/signin", (req, res) => {
  res.render("user/signinScreen", { message: null });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(User.id);
    // localStorage.setItem('jwtToken',token);
    res.cookie("jwtToken", token, { httpOnly: true, maxAge: 3600000 * 1000 }); // 1 hour in milliseconds
    localStorage.setItem("jwtToken", token);

    res.redirect(`/product/addProduct/${user.id}`);
    //res.json({user})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/deleteUser/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
