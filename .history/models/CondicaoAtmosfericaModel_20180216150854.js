var mongoose = require('mongoose');

var condicaoAtmosfericaSchema = new mongoose.Schema({
    temperatura: Number,
    humidade: Number,
    created_at: { type: Date, default: Date.now },
    ponto_monitoriazado: { type: Schema.Types.ObjectId, ref="PontosMonitorizados"}

    
    
    
});
module.exports = mongoose.model("CondicaoAtmosferica", condicaoAtmosfericaSchema);