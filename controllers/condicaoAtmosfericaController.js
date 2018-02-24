var mongoose = require('mongoose'),
    CondicaoAtmosferica = mongoose.model('CondicoesAtmosfericas');

exports.create_condicao_atmosferica = function (req, res) {
    var new_condicao_atmosferica = new CondicaoAtmosferica(req.body);
    new_condicao_atmosferica.save(function (err, condicaoAtmosferica) {
        if (err)
            res.send(err);
        res.json(condicaoAtmosferica);
    });
};


exports.list_all_condicoes_atmosfericas = function(req, res) {
    CondicaoAtmosferica.find({}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  };