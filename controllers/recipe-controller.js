const express = require('express');
const router = express.Router();

const Recipe = require('../models/recipe');
const isSignedIn = require('../middleware/is-signed-in');
const Ingredient = require('../models/ingredient');

router.get('/', isSignedIn, async (req, res) => {
    try {
        const recipes = await Recipe.find({ owner: req.session.user._id }).populate('ingredients').exec();
        res.render('recipes/index.ejs', { recipes }); 
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

//lets provide the user a form to create a recipe
// recipes/new
router.get('/new', isSignedIn, async (req, res) => {
    const ingredients = await Ingredient.find();
    res.render('recipes/new.ejs', {ingredients});
});

//next is to create the recipe after recieving the form submission
//'/' a route to create a new recipe
router.post('/', isSignedIn, async (req, res) => {
    try {
        const { name, instructions, ingredients } = req.body;
        const newRecipe = new Recipe({
            name,
            instructions,
            owner: req.session.user._id,
            ingredients
        });
        await newRecipe.save();
        res.redirect('/recipes');
    } catch (e) {
        console.log('Error Occured: ', e);
        res.redirect('/recipes/new');
    }
});

//lets show a recipe by id (simply to say show a single recipe)
router.get('/:recipeId', isSignedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients').exec();
        res.render('recipes/show.ejs', { recipe });
    } catch (e) {
        console.log('Error occured: ', e);
        res.redirect('/recipes');
    }
    
});

//I can see each recipe now
//next I need to show a form to edit the specific recipe
router.get('/:recipeId/edit', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients').exec();
        const ingredients = await Ingredient.find({});
        res.render('recipes/edit.ejs', { recipe, ingredients });
    } catch (e) {
        console.log('Error occurred', e);
        res.redirect('/');
    }
});

//after form is submitted by user, I need to update the specific recipe
router.put('/:recipeId', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if(recipe.owner.equals(req.session.user._id)) {
            await Recipe.findByIdAndUpdate(req.params.recipeId, req.body);
            res.redirect(`/recipes/${req.params.recipeId}`);
        } else {
            res.redirect('/recipes');
        }
    } catch(e) {
        console.log('Error occured: '. e);
        res.redirect('/');
    }
});

// user can add and edit a recipe -- delete 
// delete a recipe using its unique id - same logic as editing but change it from edit to remove
router.delete('/:recipeId', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (recipe.owner.equals(req.session.user._id)) {
            await Recipe.findByIdAndDelete(req.params.recipeId);
            res.redirect('/recipes');
        } else {
            res.redirect('/recipes');
        }
    } catch(e) {
        console.log('Error occured: ', e);
        res.redirect('/')
    }
});

module.exports = router;