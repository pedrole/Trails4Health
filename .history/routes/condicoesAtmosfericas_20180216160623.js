var express = require('express');
var router = express.Router();
var CondicaoAtmosferica =require('../models/CondicaoAtmosfericaModel') , PontoMonitorizado = require('../models/PontoMonitorizadoModel');

/* GET users listing. */
router.get("/", function(req, res){
    // Get all campgrounds from DB
    CondicaoAtmosferica.find({}, function(err, allCondicoesAtmosfericas){
       if(err){
           console.log(err);
       } else {
          res.json(allCondicoesAtmosfericas);
       }
    });
});
router.post("/", function(req, res){
    // get data from form and add to campgrounds array
   
    var newCondicaoAtmosferica = {temperatura: req.body.temeperatura, humidade: req.body.humidade,
    ponto_monitorizado: req.body.ponto_monitorizado};
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                req.flash('success', 'Created a comment!');
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });


    // Create a new campground and save to DB
   /*  CondicaoAtmosferica.create(newCondicaoAtmosferica, function(err, CondicaoAtmosferica){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            campground.comments.push(comment);
            campground.save();
            console.log(CondicaoAtmosferica);
            res.json(CondicaoAtmosferica);
        }
    }); */
});

module.exports = router;