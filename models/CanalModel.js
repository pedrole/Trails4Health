var mongoose = require('mongoose');

var canalSchema = new mongoose.Schema({
        loc: {
                type: [Number],
                index: '2d'
        },
        trilho: {

                type: mongoose.Schema.Types.ObjectId,
                ref: "Trilho"

        },
        hardware_id: Number,

        dados: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Feed"
                }
        ]


});

module.exports = mongoose.model("Canal", canalSchema);

