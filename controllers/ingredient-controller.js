const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');

router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({});
        res.render('ingredients/index');
    } catch(e) {
        console.log('Error occured: ', e);
        res.redirect('/');
    }
});

router.post('/', async (req, res) => {
    try {
        const newIng = new Ingredient(req.body);
        await newIng.save();
        res.redirect('/ingredients');
    } catch(e) {
        console.log('Erro occured: ', e);
        res.redirect('/');
    }
})

// working on implementing this with my recipe 

module.exports = router;