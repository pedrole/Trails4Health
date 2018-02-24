var mongoose = require('mongoose'),
    Trilho = mongoose.model('Trilho');

exports.create_trilho = function (req, res) {
    var new_trilho = new Trilho(req.body);
    new_trilho.save(function (err, trilho) {
        if (err)
            res.send(err);
        res.json(trilho);
    });
};


exports.list_all_trilhos = function(req, res) {
    Trilho.find({}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  };