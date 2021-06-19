const express= require('express');
const router = express.Router();
let Auth = require('../middleweare/auth');

router.get('/', function(req, res){
    res.render('wellcome');
})

router.get('/dashboard', Auth.ensureAuthenticated, function(req, res){
    res.render('dashboard', {
        user: req.user
    });
})

module.exports =router;