var express = require('express');
var router = express.Router();
var Feed = require('../../models/FeedModel'), Canal = require('../../models/CanalModel');
var VerifyToken = require('../../middleware/VerifyToken') , index = require('../../middleware/index');
const INT16_t_MAX = 32767, UINT16_t_MAX = 65536;

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
router.post("/",index.VerifyFeedsKey , function (req, res, next) {
    // get data from form and add to campgrounds array
    console.log(new Date());
    console.log(req.body);
    
    var hex = req.query.hex;
    console.log("parametro: " + hex);
    if(req.query.hex == true){
        next();
        return;
    }

    var newFeed = {
        temperatura: req.body.temperatura / INT16_t_MAX * 120, 
        humidade: req.body.humidade / UINT16_t_MAX * 110,
        bateria: !req.body.bateria ? 0: req.body.bateria / UINT16_t_MAX * 10,
        canal: req.body.canal, latitude: req.body.latitude, longitude: req.body.longitude
    };

    Canal.findOne({hardware_id: req.body.hardware_id}, (err,canal) =>{
        if (err) {
            console.log(err);
            //res.status(500).send("");
            next(err);
        } else {
            if (!canal) {
                next();
            }
            else {
                newFeed.canal = canal.id
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
    

   /*  Canal.findById(newFeed.canal, function (err, canal) {
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
    }); */


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