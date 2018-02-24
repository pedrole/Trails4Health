var mongoose = require('mongoose'),
    PontosMonitorizados = mongoose.model('PontosMonitorizados');

exports.create_ponto_monitorizado = function (req, res) {
    var new_ponto_monitorizado = new PontosMonitorizados(req.body);
    new_ponto_monitorizado.save(function (err, pontoMonitorizado) {
        if (err)
            res.send(err);
        res.json(pontoMonitorizado);
    });
};


exports.list_all_pontos_monitorizados = function(req, res) {
    PontosMonitorizados.find({}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  };
  