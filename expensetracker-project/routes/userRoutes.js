const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyToken, generateToken } = require("../middleware/verifyToken");
//const User = require("../models/UserModel");
const User = require("../models/user");
const { json } = require("body-parser");
const localStorage = require("localStorage");
const { v3: uuidv3 } = require("uuid");
const SibApiV3Sdk = require("sib-api-v3-sdk");


const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = "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"; 

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

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

    res.cookie("jwtToken", token, { httpOnly: true, maxAge: 3600000 * 1000 }); // 1 hour in milliseconds

    res.status(201).json({ token });
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

    res.cookie("jwtToken", token, { httpOnly: true, maxAge: 3600000 * 1000 }); // 1 hour in milliseconds
    localStorage.setItem("jwtToken", token);

    res.redirect(`/product/addProduct/${user.id}`);
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


router.get("/forgotpassword", (req, res) => {
  res.render('user/forgotpassword', { message: null });
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const namespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';
    const uuid = uuidv3('Hello, World!', namespace);
    
    const resetToken = uuidv3(email,uuid);
    
    user.resetToken = resetToken;

    await user.save();

    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{email:email}];
    sendSmtpEmail.templateId = 1, 
    sendSmtpEmail.params = { resetLink: `http://localhost:3000/user/forgotPassword/${resetToken}` };

  
    const response = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);

    return res.json({ success: true, message: "Reset link sent to your email", response });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
module.exports = router;
