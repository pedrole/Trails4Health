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
var Canal =require('../models/CanalModel');

/* GET users listing. */
router.get("/", function(req, res){
    // Get all campgrounds from DB
  Canal.find({}).exec(function(err, allChannels) {
       if(err){
          res.json(err);
       } else {
          res.json(allChannels);
       }
    });
});
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Canal.findById(req.params.id).populate('feeds').exec(function (err, foundChannel) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundChannel)
            //render show template with that campground
            res.json(foundChannel);
        }
    });
});


router.post("/", function(req, res){
    // get data from form and add to campgrounds array
    var loc = req.body.loc;
    var trilho = req.body.trilho;
    var newChannel = {loc: loc, trilho: trilho}
    // Create a new campground and save to DB
    Canal.create(newChannel, function(err, channel){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(channel);
            res.json(channel);
        }
    });
});

module.exports = router;
  