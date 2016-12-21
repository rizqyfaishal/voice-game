var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('../config');
var Word = require('../models/Word');
var GoogleTTS = require('google-tts-api');


router.use(jwt({secret: config.SECRET}));


router.get('/:level/:value',function (req, res) {
    Word.findOne({level: req.params.level, value: req.params.value},function (err, word) {
        if(err) {
            res.json({
                 status: 500,
                 message: 'Error'
            });
        } else {
            if(word){
                res.json(word);
            } else {
                res.json({
                    status: 404,
                    message: req.params.value + ' not found'
                });
            }
        }
    })
});

router.get('/:value',function (req, res) {
    Word.findOne({ value: req.params.value }, function (err, word) {
        if(err){
            res.json({
                status: 500,
                message: 'Error'
            });
        } else {
            if(word){
                res.json(word);
            } else {
                res.json({
                    status: 404,
                    message: req.params.value + ' not found'
                });
            }
        }
    })
});

router.get('/:level',function (req, res) {
    // Word.findOne({ value: req.params.level },{}, { skip: }, function (err, word) {
    //     if(err){
    //         res.json({
    //             status: 500,
    //             message: 'Error'
    //         });
    //     } else {
    //         if(word){
    //             res.json(word);
    //         } else {
    //             res.json({
    //                 status: 404,
    //                 message: req.params.value + ' not found'
    //             });
    //         }
    //     }
    // })
});


router.post('/save',function (req, res) {
    var newWord = new Word();
    newWord.level = req.body.level;
    newWord.value = req.body.value;
    GoogleTTS(newWord.value, 'en', 1)
        .then(function (url) {
            newWord.link = url;
            newWord.save(function (err, word) {
                if(err){
                    res.json({
                        status: 500,
                        err: err
                    })
                } else {
                    res.json(word);
                }
            })
        })
        .catch(function (err) {
            res.json({
                status: 500,
                message: 'Error'
            })
        })
});

module.exports = router;