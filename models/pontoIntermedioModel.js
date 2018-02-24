var mongoose = require('mongoose');

var PontoIntermedioSchema = new mongoose.Schema({

    ponto: {
        type: [Number],
        index: '2d'
    }/*,
    id_trilho: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trilho"
    }*/
});
module.exports = PontoIntermedioSchema;
// module.exports = mongoose.model("PontoIntermedio", pontoIntermedioSchema);
