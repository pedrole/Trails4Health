var mongoose = require('mongoose');

var canalSchema = new mongoose.Schema({
        username: { type: String, unique: true} ,
        password: String,  
        admin: Boolean,
        token: String     

});

module.exports = mongoose.model("User", canalSchema);