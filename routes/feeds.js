var express = require('express');
var router = express.Router();
var Feed =require('../models/FeedModel') , Canal = require('../models/CanalModel');

/* GET users listing. */
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Feed.find({}, function(err, allFeeds){
       if(err){
           console.log(err);
       } else {
          res.json(allFeeds);
       }
    });
});
router.post("/", function(req, res){
    // get data from form and add to campgrounds array
   
    var newFeed = {temperatura: req.body.temeperatura, humidade: req.body.humidade,
    canal: req.body.canal};
    Feed.findById(newFeed.canal, function(err, canal){
        if(err){
            console.log(err);
            next();
        } else {
         Feed.create(newFeed, function(err, feed){
            if(err){
                console.log(err); 
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