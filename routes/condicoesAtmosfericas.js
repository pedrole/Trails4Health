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
    PontoMonitorizado.findById(newCondicaoAtmosferica.ponto_monitorizado, function(err, pontoMonitorizado){
        if(err){
            console.log(err);
            next();
        } else {
         CondicaoAtmosferica.create(newCondicaoAtmosferica, function(err, condicaoAtmosferica){
            if(err){
                console.log(err); 
            } else {
               
                condicaoAtmosferica.save();
                pontoMonitorizado.condicoesAtmosfericas.push(condicaoAtmosferica);
                pontoMonitorizado.save();
                console.log(condicaoAtmosferica);
                res.json(condicaoAtmosferica);
            //    req.flash('success', 'Created a comment!');
             //   res.redirect('/campgrounds/' + PontoMonitorizado._id);
            }
         });
        }
    });


    // Create a new PontoMonitorizado and save to DB
   /*  CondicaoAtmosferica.create(newCondicaoAtmosferica, function(err, CondicaoAtmosferica){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            PontoMonitorizado.comments.push(comment);
            PontoMonitorizado.save();
            console.log(CondicaoAtmosferica);
            res.json(CondicaoAtmosferica);
        }
    }); */
});

module.exports = router;