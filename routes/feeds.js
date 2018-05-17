var express = require('express');
var router = express.Router();
var Feed = require('../models/FeedModel'), Canal = require('../models/CanalModel');
var VerifyToken = require('../middleware/VerifyToken');

/* GET users listing. */
router.get("/", function (req, res) {
    // Get all campgrounds from DB
    Feed.find({}, function (err, allFeeds) {
        if (err) {
            console.log(err);
        } else {
            res.json(allFeeds);
        }
    });
});
router.post("/",VerifyToken , function (req, res, next) {
    // get data from form and add to campgrounds array

    var newFeed = {
        temperatura: req.body.temperatura, humidade: req.body.humidade,
        canal: req.body.canal
    };
    Canal.findById(newFeed.canal, function (err, canal) {
        if (err) {
            console.log(err);
            //res.status(500).send("");
            next(err);
        } else {
            if (!canal) {
                next();
            }
            else {
                Feed.create(newFeed, function (err, feed) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {

                        feed.save();
                        canal.feeds.push(feed);
                        canal.save();
                        console.log(feed);
                        res.json(feed);
                        //    req.flash('success', 'Created a comment!');
                        //   res.redirect('/campgrounds/' + Feed._id);
                    }
                });
            }
        }
    });


    // Create a new Feed and save to DB
    /*  Feed.create(newFeed, function(err, Feed){
         if(err){
             console.log(err);
         } else {
             //redirect back to campgrounds page
             Feed.comments.push(comment);
             Feed.save();
             console.log(Feed);
             res.json(Feed);
         }
     }); */
});

module.exports = router;