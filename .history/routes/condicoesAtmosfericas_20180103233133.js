
module.exports = function(app) {
    var condicaoAtmosferica = require('../controllers/condicaoAtmosfericaController');
  
    // todoList Routes
    app.route('/condicoesAtmosfericas')
      .get(condicaoAtmosferica.list_all_condicoes_atmosfericas)
      .post(condicaoAtmosferica.create_condicao_atmosferica);
  
  
};