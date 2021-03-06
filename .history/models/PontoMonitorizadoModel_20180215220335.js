var mongoose = require('mongoose');

var pontoMonitorizadoSchema = new mongoose.Schema({
   loc: {
        type: [Number],
        index: '2d'
   } ,
   trilho: {
       id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Trilho"
       }
   },
   hardware_id: Number,

   condicoesAtmosfericas: [
    {
       type: mongoose.Schema.Types.ObjectId,
       ref: "CondicaoAtmosferica"
    }
 ]


});

module.exports = mongoose.model("PontosMonitorizados", pontoMonitorizadoSchema);

