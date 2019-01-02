const express = require('express');
const router = express.Router();

var Category = require('../models/category');

router.get('/add-category', function(req, res, next){
    var messages = req.flash('error');
    res.render('admin/add-category', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/add-category', function(req, res, next){
    var category = new Category();
    category.name = req.body.name;

    category.save(function(err){
        if(err) return next(err);
        req.flash('success', 'Successfully added a category');
        return res.redirect('/admin/add-category');
    });
});

module.exports = router;