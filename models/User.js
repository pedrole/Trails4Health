var mongoose = require('mongoose');

var canalSchema = new mongoose.Schema({
        username: { type: String, unique: true} ,
        password: String,  
        admin: Boolean,
        feeds_api_key: String     

});

module.exports = mongoose.model("User", canalSchema);