/* var express = require('express');
var pontoMonitorizado = require('../controllers/pontoMonitorizadoController');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post(pontoMonitorizado.create_ponto_monitorizado);

module.exports = router; */

var express = require('express');
var router = express.Router();
var PontoMonitorizado =require('../models/PontoMonitorizadoModel');

/* GET users listing. */
router.get("/", function(req, res){
    // Get all campgrounds from DB
  PontoMonitorizado.find({}).populate('trilho.id').exec(function(err, allPontosMonitorizados) {
       if(err){
          res.json(err);
       } else {
          res.json(allPontosMonitorizados);
       }
    });
});
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    PontoMonitorizado.findById(req.params.id).populate('trilho.id').exec(function (err, foundPontoMonitorizado) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundPontoMonitorizado)
            //render show template with that campground
            res.json(foundPontoMonitorizado);
        }
    });
});


router.post("/", function(req, res){
    // get data from form and add to campgrounds array
    var loc = req.body.loc;
    var trilho = req.body.trilho;
    var newPontoMonitorizado = {loc: loc, trilho: trilho}
    // Create a new campground and save to DB
    PontoMonitorizado.create(newPontoMonitorizado, function(err, pontoMonitorizado){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(pontoMonitorizado);
            res.json(pontoMonitorizado);
        }
    });
});

module.exports = router;
  