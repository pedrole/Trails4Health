var express = require("express");
var router = express.Router();
var Trilho = require("../models/trilho");
//var middleware = require("../middleware");

router.get("/", function (req, res) {
    // Get all campgrounds from DB
    Trilho.find({}, function (err, allTrilhos) {
        if (err) {
            console.log(err);
        } else {
            //console.log(body); // Show the HTML for the Modulus homepage.
            res.render('trilhos/index', { trilhos: allTrilhos });
        }
    });
});

router.get("/:id", function(req, res){
    //find the campground with provided ID
    Trilho.findById(req.params.id).exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;
