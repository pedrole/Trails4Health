var mongoose = require('mongoose');

var feedsSchema = new mongoose.Schema({
    temperatura: Number,
    humidade: Number,
    created_at: { type: Date, default: Date.now },
    canal: { type: mongoose.Schema.Types.ObjectId, ref:"Canal"}

    
    
    
});
module.exports = mongoose.model("Feed", feedsSchema);