var mongoose = require('mongoose');

var canalSchema = new mongoose.Schema({
        username: String,
        password: String,  
        admin: Boolean,
        token: String     

});

module.exports = mongoose.model("User", canalSchema);