var mongoose = require('mongoose');

var feedsSchema = new mongoose.Schema({
    temperatura: Number,
    humidade: Number,
    bateria: Number,
    created_at: { type: Date, default: Date.now },
    canal: { type: mongoose.Schema.Types.ObjectId, ref:"Canais"},
    hardware_id: {type: String, ref:"Canais"},
    lastMessage: Number,
    latitude: {type: Number,
      
}, 
longitude: {type: Number}

    
    
    
});
module.exports = mongoose.model("Feed", feedsSchema);