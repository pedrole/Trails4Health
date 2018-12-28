
function registerUser(user){
    User.create({
        username : req.body.name,
        admin : true,
        password : hashedPassword
      }, 
      function (err, user) {
        if (err) return res.status(500).send("Houve um problema a registar o utilizador`.");
    
        // if user is registered without errors
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
         // expiresIn: 86400 // expires in 24 hours
        });
        user.token = token;
        user.save();
    
        res.status(200).send({ auth: true, token: token });
      });


}