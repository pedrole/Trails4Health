var express = require('express');
var router = express.Router();
var Trilho = require('../../models/trilho'), VerifyToken = require('../../middleware/VerifyToken');
var ObjectId = require('mongoose').Types.ObjectId, flatMap = require('array.prototype.flatmap');

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
      

    var query = Trilho.find({});
    const populate = req.query.populate;
    if (!populate || populate==1)
    query = query.populate({
        path: 'canais'
        , populate: {
            path: 'feeds', options: {
                limit: 2,
                sort: { 'created_at': -1 }

            }
        }/* , select: '-feeds'*/
    });



    // Get all campgrounds from DB
   /* Trilho.find({}).populate({
        path: 'canais'
        , populate: {
            path: 'feeds', options: {
                limit: 2,
                sort: { 'created_at': -1 }

            }
        }/* , select: '-feeds'*/
   // })
    query.exec(function (err, allTrilhos) {
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
    const timeScale = Number( req.query.timescale);
    var start = Number(req.query.start) || 0, end = Number(req.query.end) || 99999999999999;
    date = new Date(start)

    

    Trilho.findById(req.params.id).lean().populate({
        path: 'canais', populate: {
            path: 'feeds', options: {
                 limit:   timeScale ? 8000 : Number(req.query.results) || 2 ,
                sort: { 'created_at': -1 }
            },
            match: { created_at: { "$gte": date, "$lte": new Date(end) } }
        }
        /*, select: '-feeds'*/
    }).exec(function (err, foundTrilho) {
        if (err) {
            console.log(err);
            if (err) return res.status(500).send("Houve um pro.");
        } else {
           
            if (timeScale && foundTrilho) {
                for (const canal of foundTrilho.canais) {
                    let feeds = [];
                    canal.feeds.forEach((element, indice) => {
                        if (indice == 0 || getMinutesBetweenDates(new Date(element.created_at), new Date(feeds[feeds.length - 1].created_at)) >= timeScale) {
                            feeds.push(element)
                        }
                    });
                    canal.feedsCount = feeds.length;
                    canal.feeds = feeds
                }
            }
            //render show template with that campground
          
            
            res.json(foundTrilho);
        }
    });
});

function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 60000);
}

router.post("/", VerifyToken, function (req, res, next) {
    // get data from form and add to campgrounds array

    var newTrilho = getTrilho(req);

    // Create a new campground and save to DB
    Trilho.create(newTrilho, function (err, trilho) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
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
    var coordenadas = req.body.coordenadas;
    var utilizador = req.userId;
    var trilho = {
        inicio: inicio, fim: fim, descricao: descricao, featured_media: featuredMedia,
        coordenadas: coordenadas, utilizador: utilizador
    };
    return trilho;
}

module.exports = router;