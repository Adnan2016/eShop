const express = require('express');
const router = express.Router();

var passport = require('passport');

var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err, docs){
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('index', { title: 'Shopping Cart', products: productChunks });
    });

});

/* GET Signup page. */
router.get('/user/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken()});
});

router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/user/profile', function(req, res, next){
    res.render('user/profile');
});


module.exports = router;