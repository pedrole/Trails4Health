var mongoose = require('mongoose');

var canalSchema = new mongoose.Schema({
        latitude: {
                type: Number,
              
        }, 
        longitude: {type: Number},
        trilho: {

                type: mongoose.Schema.Types.ObjectId,
                ref: "Trilho"

        },
        hardware_id: Number,

        feeds: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Feed"
                }
        ]


});

module.exports = mongoose.model("Canal", canalSchema);

