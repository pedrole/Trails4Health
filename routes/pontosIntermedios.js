
var express = require('express');
var router = express.Router();
var PontoIntermedio = require('../models/pontoIntermedioModel'), Trilho = require('../models/trilho');

/* GET users listing. */
router.get("/", function (req, res) {
    // Get all campgrounds from DB
    PontoIntermedio.find({}, function (err, allPontosIntermedios) {
        if (err) {
            console.log(err);
        } else {
            res.json(allPontosIntermedios);
        }
    });
});
router.post("/", function (req, res) {
    id_trilho = req.body.id_trilho;
    Trilho.findById(id_trilho, function (err, trilho) {
        if (err) {
            console.log(err);
        } else {
            var newPontoIntermedio = { ponto: req.body.ponto, id_trilho: id_trilho }
            // Create a new campground and save to DB
            PontoIntermedio.create(newPontoIntermedio, function (err, pontoIntermedio) {
                if (err) {
                    console.log(err);
                } else {
                    //redirect back to campgrounds page
                    pontoIntermedio.save();
                    trilho.pontosIntermedios.push(pontoIntermedio);
                    trilho.save();
                    res.json(pontoIntermedio);
                }
            });
        }
    });
});

module.exports = router;