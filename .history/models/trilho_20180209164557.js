var mongoose = require('mongoose'), Schema = mongoose.Schema;
 PontoIntermedio = require('./pontoIntermedioModel');

var trilhoSchema = new mongoose.Schema({
    descricao: String,
    inicio: {
        type: [Number],
        index: '2d'
    },
    fim: {
        type: [Number],
        index: '2d'
    },
    pontosIntermedios: [PontoIntermedio],
        featured_media: String
});

module.exports = mongoose.model("Trilho", trilhoSchema);


