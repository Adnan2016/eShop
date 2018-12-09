var passport = require('passport');
var User = require ('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.assert('email', 'Invalid email').notEmpty().isEmail();
    req.assert('password', 'Invalid password: Your password length should be minimum of 4 characters').notEmpty().isLength({min: 4});

    var errors = req.validationErrors();

    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Email is already in use'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.assert('email', 'Invalid email').notEmpty().isEmail();
    req.assert('password', 'Invalid password').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    //find user
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }

        if(!user){
            return done(null, false, {message: ' We couldn"t find your Email Address. Please try again with valid one'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Wrong Email Address or password.'});
        }
        return done(null, user);
    });

}));
