const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const expenseModel = require("../models/expenseModel");

// router.post("/signup", async (req, res) => {
//   try {
//     const { username, emailid, password } = req.body;

//     const existingUser = await expenseModel.findOne({ emailid });
//     if (existingUser) {
//       return res.status(403).send("Email ID is already in use");
//     }

//     const signup = await expenseModel.create({ username, emailid, password });

//     res.status(200).send({
//       message: "Form submitted successfully!",
//       // signupData: signup,
//     });
//   } catch (error) {
//     console.error("Error submitting:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.get("/", (req, res) => {
//   const { username, email, password } = req.query;
//   res.render("signupScreen", { username, email, password });
// });

router.get('/', (req, res) => {
  res.render('homeScreen');
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
  res.render("signinScreen",{message:null});
});

router.post("/signin", async (req, res) => {
  const { emailid, password } = req.body;

  try {
    const user = await expenseModel.findOne({ where: { emailid } });

    if (!user || user.password !== password) {
      return res.render("signinScreen", {
        message: "Invalid email or password",
      });
    }

    return res.render("homeScreen", { message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
