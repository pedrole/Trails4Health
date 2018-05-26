var express = require('express');
var router = express.Router();
var Trilho = require('../models/trilho');
var ObjectId = require('mongoose').Types.ObjectId;

/* GET users listing. */
router.get("/", function (req, res) {
    /*   console.log('hello world');
      Trilho.find({}).then((trilhos) => {
          console.log(trilhos);
          PontoIntermedio.find({ id_trilho: '5a4f9eb81c45d1401080b439' }).
              then((coordenadas) => {
                  console.log(coordenadas);
                  trilhos[0].coordenadas = coordenadas;
                 
  
              });
          res.json(trilhos);
          // for(var trilho of trilhos){
          //      trilho.coordenadas = await PontoIntermedio.find({'id_trilho': });
  
  
          // }
          //   return Promise.all(trilho.coordenadas);   
      }).then(function (listOfJobs) {
          res.send(listOfJobs);
      }).catch(function (error) {
          res.status(500).send('one of the queries failed', error);
      }); */




    /*  Trilho.find({}).exec(function (err, allTrilhos) {
          /* `bands.members` is now an array of instances of `Person` */
    /*      if (err) {
              console.log(err);
          } else {
  
              for (var trilho of allTrilhos) {
                  PontoIntermedio.find({
                      'id_trilho': "5a4f9eb81c45d1401080b439"
                  }).exec(function (err, coordenadas) {
                      if (err)
                          console.log(err);
                      else {
                              trilho.coordenadas =  [new PontoIntermedio({id_trilho:"5a4f9eb81c45d1401080b439" })];
                              trilho.descricao = "descri";
                          //allTrilhos[0].coordenadas = coordenadas;
                      }
                  });
              }*/
    /*  allTrilhos.forEach(element => {
          var a =new ObjectId( element._id);
          
          PontoIntermedio.find({'id_trilho': "5a4f9eb81c45d1401080b439"
          }).exec(function (err, coordenadas) {
              if (err)
                  console.log(err);
              else{
                  allTrilhos[0] = "descricao"
                  element.coordenadas.push(coordenadas[0]);
                  //allTrilhos[0].coordenadas = coordenadas;
              }
          });
      });
      allTrilhos[0].coordenadas = [new PontoIntermedio({id_trilho:"5a4f9eb81c45d1401080b439" })];*/
    //      res.json(allTrilhos);

    //    }
    // });



    // Get all campgrounds from DB
    Trilho.find({}).populate({ path: 'canais'
    ,populate:{path:'feeds'}/* , select: '-feeds'*/  }).exec(function (err, allTrilhos) {
        if (err) {
            console.log(err);
        } else {
            res.json(allTrilhos);
        }
    });
});
// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    //populate({ path: 'feeds', options: { limit: 2 } })
    Trilho.findById(req.params.id).populate({ path: 'canais', select: '-feeds' }).exec(function (err, foundTrilho) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundTrilho)
            //render show template with that campground
            res.json(foundTrilho);
        }
    });
});

router.post("/", function (req, res) {
    // get data from form and add to campgrounds array

    var newTrilho = getTrilho(req);

    // Create a new campground and save to DB
    Trilho.create(newTrilho, function (err, trilho) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(trilho);
            res.json(trilho);
        }
    });
});
router.put("/:id", function (req, res) {
    // find and update the correct campground
    var trilho = getTrilho(req);
    Trilho.findByIdAndUpdate(req.params.id, trilho, function (err, updatedTrilho) {
        if (err) {
            console.log(err);
        } else {
            //redirect somewhere(show page)
            console.log(updatedTrilho);
            res.json(updatedTrilho);
        }
    });
});

function getTrilho(req) {
    var inicio = req.body.inicio;
    var fim = req.body.fim;
    var descricao = req.body.descricao;
    var featuredMedia = req.body.featured_media;
    var coordenadas = req.body.coordenadas
    var trilho = {
        inicio: inicio, fim: fim, descricao: descricao, featured_media: featuredMedia,
        coordenadas: coordenadas
    };
    return trilho;
}

module.exports = router;