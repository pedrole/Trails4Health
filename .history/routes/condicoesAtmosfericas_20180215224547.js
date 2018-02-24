var express = require('express');
var router = express.Router();
var CondicaoAtmosferica =require('../models/CondicaoAtmosfericaModel');

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
    // Create a new campground and save to DB
    CondicaoAtmosferica.create(newCondicaoAtmosferica, function(err, CondicaoAtmosferica){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(CondicaoAtmosferica);
            res.json(CondicaoAtmosferica);
        }
    });
});

module.exports = router;