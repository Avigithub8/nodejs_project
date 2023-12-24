const express = require("express");
const router = express.Router();
//const User = require("../models/UserModel");
const User = require("../models/user");
//const Product = require("../models/productModel");
const Product = require("../models/product");
const { verifyToken, generateToken } = require("../middleware/verifyToken");
const Razorpay = require("razorpay");
const bcrypt = require("bcrypt");
const localStorage = require("localStorage");
const sequelize = require("../models/index");
const { Op } = require("sequelize");

router.use(verifyToken);

localStorage.getItem("jwtToken");
router.get("/addProduct/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;

  //const user = await User.findByPk(userId, { attributes: ['id', 'email', 'username', 'is_premium'] });
  const userProducts = await User.findByPk(userId, { include: Product });
  const username =
    userProducts?.username !== null && userProducts?.username !== undefined
      ? userProducts?.username
      : "N/A";
  res.render(`product/addProduct`, {
    username: username,
    isPremium: userProducts?.is_premium || false,
    products: userProducts?.Products || [],
    userId: userId,
  });
  //res.json({ user });
});

const razorpay = new Razorpay({
  key_id: "rzp_test_beQQ9JQjjfEj8a",
  key_secret: "wYVZZf1e8GhMDrXVdsEcJHCG",
});

router.get("/buyPremium", async (req, res) => {
  try {
    const userId = req.query.userId;

    console.log("^^^^^^", userId);
    res.render("product/buyPremium", { userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/buyPremium", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orderId = `order_${Date.now()}_${userId}`;

    res.cookie("userId", userId, { httpOnly: true, maxAge: 3600000 * 1000 });

    const order = await razorpay.orders.create({
      amount: 10 * 100,
      currency: "INR",
      receipt: orderId,
      payment_capture: 1,
    });

    // res.render("product/buyPremium", {
    //   orderId: order.id,
    //   keyId: razorpay.key_id,
    //   amount: order.amount,
    // });
    res.status(201).json({
      orderId: order.id,
      keyId: razorpay.key_id,
      amount: order.amount,
    });
    // res.redirect(`/product/verifyPayment/${userId}`)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/verifyPayment", async (req, res) => {
  try {
    const { paymentId, orderId, userId } = req.body;

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === "captured" && payment.order_id === orderId) {
      try {
        const user = await User.findByPk(userId);

        if (user) {
          user.is_premium = true;
          await user.save();
          res.json({ success: true });
        } else {
          res.json({ success: false, message: "User not found" });
        }
      } catch (userError) {
        console.error("Error updating user premium status:", userError);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    } else {
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/addProduct", async (req, res) => {
  const { userId, amount, description, category } = req.body;

  try {
    let user = await User.findByPk(userId);

    if (!user) {
      user = await User.create({ id: userId });
    }

   
      const newProduct = await Product.create({
        userId: userId,
        amount: amount,
        description: description,
        category: category,
      });
   

    //res.json({ success: true, message: 'Product added successfully' });
    res.redirect(`/product/addProduct/${userId}`);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/getProductList", async (req, res) => {
  try {
    const updatedProductList = await fetchUpdatedProductList();

    res.json({ products: updatedProductList });
  } catch (error) {
    console.error("Error fetching updated product list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



async function fetchUpdatedProductList() {
  const t = await sequelize.transaction();

  try {
    const updatedProductList = await Product.findAll({
      attributes: ["id", "amount", "description", "category"],
      transaction: t,
    });

    await t.commit();

    return updatedProductList;
  } catch (error) {
    await t.rollback();

    console.error("Error fetching updated product list:", error);
    throw error;
  }
}

router.delete("/deleteProduct/:productId", async (req, res) => {
  const { productId } = req.params;

  const { userId } = req.query;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/buyPremium/:userId", verifyToken, async (req, res) => {
  try {
    const userid = req.userId;

    const userId = req.params.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.render(`product/buyPremium`);
  } catch (error) {
    console.error("Error updating premium status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/leaderboard", async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const leaderboardData = await User.findAll({
      include: [{ model: Product }],
      order: [[sequelize.literal("Products.amount"), "DESC"]],
      transaction: t,
    });

    await t.commit();

    res.json({ success: true, leaderboard: leaderboardData });
  } catch (error) {
    await t.rollback();

    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
