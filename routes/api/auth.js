var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('../../middleware/VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../../models/User');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../../config'); // get config file

router.post('/login', function (req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token


    var token;
    if (!user.token) {

      token = jwt.sign({ id: user._id }, config.secret, {
        //  expiresIn: 86400 // expires in 24 hours
      });
    } else
      token = user.token

    // return the information including token as JSON
    res.status(200).send({ auth: true, token: token });
  });

});

router.get('/logout', function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', function (req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    username: req.body.name,
    admin: true,
    password: hashedPassword
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

});

router.get('/me', VerifyToken, function (req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });

});

router.get('/setup', function (req, res) {
  var user = createUser('sa', 'user');

  User.create(user,function (err, user) {
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

});

function createUser(username, password) {
  var hashedPassword = bcrypt.hashSync(password, 8);
  return {
    username: username,
    admin: true,
    password: hashedPassword
  }
}

module.exports = router;