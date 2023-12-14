const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const path = require("path");
const productModel = require("../models/productModel");
const UserModel = require("../models/UserModel");

router.get("/addProduct/:userid", async (req, res) => {
  console.log("id======", req.params.userid);
  try {
    const userid = req.params.userid;

    const expenses = await productModel.findAll({
      where: { userid: userid },
      include: [
        { model: UserModel, attributes: ["id", "username", "emailid"] },
      ],
    });

    const viewPath = "product/addProduct";
    console.log("userId", viewPath);
    res.render(viewPath, { expenses, userid });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/addProduct", async (req, res) => {
  console.log(req.body);
  const { amount, description, category, userid } = req.body;

  try {
    //const currentUser = req.body.userid;
    //console.log("Current User:", currentUser);

    const newExpense = await productModel.create({
      amount,
      description,
      category,
      userid,
    });

    res.status(201).json(newExpense);
    // res.redirect(`/product/addProduct/${userid}`)
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete('/deleteProduct', async (req, res) => {
  console.log("item---",req.body.userId,req.body.itemId)
  try {
      const {userId, itemId } = req.body;

      
      if (!userId ||!itemId) {
          return res.status(400).json({ success: false, error: 'itemId is required' });
      }

      
      const deletedProduct = await productModel.destroy({
          where: { id: itemId,userid: userId, },
          force: true
      });
      console.log("sdsff",deletedProduct,id);
      if (deletedProduct) {
          return res.json({ success: true, message: 'Product deleted successfully' });
      } else {
          return res.status(404).json({ success: false, error: 'Product not found or could not be deleted.' });
      }
  } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
