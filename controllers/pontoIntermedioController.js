var mongoose = require('mongoose'),
    PontosIntermedios = mongoose.model('PontosIntermedios');

exports.create_ponto_intermedio = function (req, res) {
    var new_ponto_intermedio = new PontosIntermedios(req.body);
    new_ponto_intermedio.save(function (err, pontoIntermedio) {
        if (err)
            res.send(err);
        res.json(pontoIntermedio);
    });
};


exports.list_all_pontos_intermedios = function(req, res) {
    PontosIntermedios.find({}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  };