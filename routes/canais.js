/* var express = require('express');
var channel = require('../controllers/pontoMonitorizadoController');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post(channel.create_ponto_monitorizado);

module.exports = router; */

var express = require('express');
var router = express.Router();
var Canal = require('../models/CanalModel'), Trilho = require('../models/trilho');;

/* GET users listing. */
router.get("/", function (req, res) {
    // Get all campgrounds from DB
    Canal.find({}).select('-feeds').exec(function (err, allChannels) {
        if (err) {
            res.json(err);
        } else {
            res.json(allChannels);
        }
    });
});
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Canal.findById(req.params.id).populate({ path: 'feeds', options: { limit: 2, sort: { 'created_at': -1 } 
    } }).exec(function (err, foundChannel) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundChannel)
            //render show template with that campground
            res.json(foundChannel);
        }
    });
});

/* Canal.findById(newFeed.canal, function(err, canal){
    if(err){
        console.log(err);
        //res.status(500).send("");
        next(err);
    } else {
     Feed.create(newFeed, function(err, feed){
        if(err){
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
    } */


router.post("/", function (req, res) {
    // get data from form and add to campgrounds array
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var trilho = req.body.trilho;
    var newChannel = { latitude: latitude, longitude: longitude, trilho: trilho }
    // Create a new campground and save to DB
    Trilho.findById(newChannel.trilho, function (err, trilho) {
        if (err) {
            console.log(err);
            //res.status(500).send("");
            next(err);
        } else {

            Canal.create(newChannel, function (err, channel) {
                if (err) {
                    console.log(err);
                } else {
                    //redirect back to campgrounds page
                    console.log(channel);
                    channel.save();
                    trilho.canais.push(channel);
                    trilho.save();
                    res.json(channel);
                }
            });
        }
    });
});

module.exports = router;
