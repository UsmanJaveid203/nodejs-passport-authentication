const express= require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user');

router.get('/login', function(req, res){
    res.render('login');
})

router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: 'login',
        failureFlash: true
    })(req, res, next);
})

router.get('/register', function(req, res){
    res.render('register');
})

router.post('/register', function(req, res){
    const {name, email, password, password2} = req.body;
    let errors= [];
    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Fill all the fields'});
    }
    if (password != password2) {
        errors.push({msg: 'password confirmation failed'});
    }
    if (password.length > 1 && password.length < 6) {
        errors.push({msg: 'password are too short'})
    }
    if(errors.length > 0) {
        res.render('register', {
            errors:errors,
            name:name,
            email:email,
            password:password,
            password2:password2
        })
    } else {
        User.findOne({ email: email})
        .then(user => {
            if (user) {
                errors.push({msg: 'User already exists'})
                res.render('register', {
                    errors:errors,
                    name:name,
                    email:email,
                    password:password,
                    password2:password2
                })
            } else {
                const newUser = new User ({
                    name,
                    email,
                    password
                })
                bcrypt.genSalt(15, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        if (err) return err;
                        newUser.password = hash;
                        newUser.save()
                        .then (result => {
                            req.flash('success_msg', 'account registered successfully......!')
                            res.redirect('users/login')
                        })
                        .catch (err => { return err; })
                    });
                })
            }
        })
    }
})

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg','you logged out successfully....')
    res.redirect('login');
})

module.exports =router;