const INT16_t_MAX = 32767, UINT16_t_MAX = 65536;
var User = require('../models/User');

module.exports = {
    shouldReturnHtml: function (request) {
        //accept = request.headers("Accept");
        var accept = request.headers.accept;
        return accept != null && accept.includes("text/html");
    },

    decimalToHex: function (d, padding = 4) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

        while (hex.length < padding) {
            hex = "0" + hex;
        }

        return hex;
    },
    convertoFloatToUInt16: function (value, max, min = 0) {
        conversionFactor = (UINT16_t_MAX) / (max - min);
        resultado = Math.trunc((value * conversionFactor));
        return resultado;
    },

    convertUInt16ToFloat: function (value, max) {

        resultado = value / UINT16_t_MAX * max;
        return resultado;
    },
    VerifyFeedsKey: function (req, res, next) {
        // verifica chave no cabeçalho ou no corpo da mensagem 
        var feeds_key = req.body.feeds_api_key || req.headers['x-feeds-api-key'];
        if (!feeds_key)
            return res.status(403).send({ auth: false, message: 'Sem chave fornecido.' });
        User.findOne({ hardware_id: req.body.hardware_id }, (err, user) => {
            if (err) if (err) return res.status(500).send("Ocorreu um erro ao encontrar utilizador.");
            else {
                req.userId = user.id;
                next();
            }
        });
    }
}