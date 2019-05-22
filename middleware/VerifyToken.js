var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file

function verifyToken(req, res, next) {
 // verifica token nos parametros de consulta ou no cabeçalho 
  var token = req.query.token || req.headers['x-access-token']; 
  if (!token) 
    return res.status(403).send({ auth: false, message: 'Sem token fornecido.' });

  // virifica segredo
  jwt.verify(token, config.secret, function(err, decoded) {      
    if (err) 
      return res.status(500).send({ auth: false, message: 'Não foi possível autenticar token.' });    

    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;