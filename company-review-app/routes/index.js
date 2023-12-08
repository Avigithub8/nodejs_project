// routes/index.js
const express = require('express');
const router = express.Router();
const {Op}=require('sequelize')
const Company = require('../models/Company');





router.post('/submit-review', async (req, res) => {
  try {
    const { companyName, pros, cons, rating } = req.body;
    const newReview = await Company.create({ companyName, pros, cons, rating });
    res.redirect('/');
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/', async (req, res) => {
  try {
    const companyName = req.query.companyName || '';

    let companies = [];

    
    if (companyName) {
      companies = await Company.findAll({
        where: {
          companyName: { [Op.like]: `%${companyName}%` },
        },
      });
    }

    res.render('index', { companies, companyName });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;
