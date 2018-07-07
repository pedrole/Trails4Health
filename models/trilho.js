var mongoose = require('mongoose'), Schema = mongoose.Schema;
 

var trilhoSchema = new mongoose.Schema({
    descricao: String,
    nome: String,
    inicio: {
        type: [Number],
        index: '2d'
    },
    fim: {
        type: [Number],
        index: '2d'
    },
    coordenadas: String,
        featured_media: String,
        canais: [
            {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Canal"
            }
    ]
});

module.exports = mongoose.model("Trilho", trilhoSchema);


