const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// load user modal
const user = require('../models/user');

module.exports= function(passport){
    passport.use(
        new localStrategy({usernameField: 'email'}, (email, password, done) => {
            user.findOne({email: email})
            .then(user => {
                if(!user){
                    return done(null, false, {message: 'That email is not registered'})
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'password incorrect'})
                    }
                })

            })
            .catch(err => {return err});
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
          done(err, user);
        });
    });
}