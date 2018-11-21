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
var VerifyToken = require('../../middleware/VerifyToken'), index = require('../../middleware/index');
var Canal = require('../../models/CanalModel'), Trilho = require('../../models/trilho');;

/* GET users listing. */
router.get("/", function (req, res, next) {
    var hardware_id = req.query.hardware_id;
    var hex = req.query.hex;

    if (hardware_id && hex) {
        Canal.findOne({ hardware_id: hardware_id }, (err, canal) => {
            if (err) {
                console.log(err);
                //res.status(500).send("");
                next(err);
            } else if (canal) {
                //var hexString =Number( 120).toString(16);
                var tempoContacto = index.decimalToHex(canal.tempoMinimoContacto);
                var variacao = index.decimalToHex(index.convertoFloatToUInt16(canal.variacaoTemperatura, 30));
                var tempoEspera = index.decimalToHex(canal.tempoEspera);
                var tempoConfig = index.decimalToHex(canal.tempoConfig);

                /* var tempoMinimoContacto = index.decimalToHex(2.34,4);
 
                var value = index.convertoFloatToUInt16(2.3,30);
 
                var valueFloat = value / 65536 * 30;*/

                res.json({
                    [hardware_id]:
                    { "downlinkData": tempoContacto + variacao + tempoEspera + tempoConfig }
                });

            } else
                next();



        });
    } else {
        // Get all campgrounds from DB
        Canal.find({}).select('-feeds').exec(function (err, allChannels) {
            if (err) {
                res.json(err);
            } else {
                res.json(allChannels);
            }
        });
    }
});
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Canal.findById(req.params.id).populate({
        path: 'feeds', options: {
            limit: 2, sort: { 'created_at': -1 }
        }
    }).exec(function (err, foundChannel) {
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
router.put("/:id", (req, res) => {
    var canal = getCanal(req);
    Canal.findByIdAndUpdate(req.params.id, /* canal */{$set: canal}, {new:true},function (err, updatedCanal) {
        if (err) {
            console.log(err);
        } else {
            //redirect somewhere(show page)
            console.log(updatedCanal);
            res.json(updatedCanal);
        }
    })
});


router.post("/", VerifyToken, function (req, res, next) {
    // get data from form and add to campgrounds array

    var newChannel = getCanal(req);
    // Create a new campground and save to DB
    Trilho.findById(newChannel.trilho, function (err, trilho) {
        if (err) {
            console.log(err);
            //res.status(500).send("");
            next(err);
        } else {
            if (!trilho) {
                next(err);
            }
            else {
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
        }
    });

});

function getCanal(req) {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var trilho = req.body.trilho;
    var hardware_id = req.body.hardware_id;
    var newChannel = {
        latitude: latitude, longitude: longitude, trilho: trilho,
        tempoMinimoContacto: req.body.tempoMinimoContacto, variacaoTemperatura: req.body.variacaoTemperatura,
        tempoEspera: req.body.tempoEspera, tempoConfig: req.body.tempoConfig, nome: req.body.nome
    }
    if(hardware_id)
        newChannel['hardware_id'] = hardware_id;


    return newChannel;
}

module.exports = router;
