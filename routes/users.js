var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var config = require('../config');
var bcrypt = require('bcrypt-nodejs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


function authenticate(req, res, next) {
    if(!req.body.username || !req.body.password){
        res.status(400).end('Must provide username and password');
    }
    
    User.findOne({username: req.body.username},function (err, user) {
        if(err) {
            throw  err;
        }
        console.log(user);
        if(!user){
            res.json({
                status: 404,
                message: 'Invalid Credential'
            });
        } else {
            if(bcrypt.compareSync(req.body.password, user.password)){
                req.user = {
                    _id: user._id,
                    name: user.name,
                    username: user.username
                };
                next();
            } else {
                res.json({
                    status: 404,
                    message: 'Invalid Credential'
                });
            }
        }
    })
}

router.post('/login',authenticate, function (req, res) {
    var token = jwt.sign({
        _id: req.user._id
    },config.SECRET);


    res.json({
        data: req.user,
        token: token
    })

});

module.exports = router;
