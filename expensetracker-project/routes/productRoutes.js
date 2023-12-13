const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const productModel = require("../models/productModel");


router.get('/addProduct', async (req, res) => {
    try {
        const expenses = await productModel.findAll();

        
        res.render('product/addProduct', { expenses });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
router.post('/addProduct', async (req, res) => {
    console.log(req.body)
    const { amount, description, category } = req.body;
  
    try {
      const newExpense = await productModel.create({ amount, description, category });
      res.status(201).json(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;