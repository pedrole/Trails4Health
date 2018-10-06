const INT16_t_MAX = 32767, UINT16_t_MAX = 65536;

module.exports = {
    shouldReturnHtml :function(request) {
        //accept = request.headers("Accept");
        var accept = request.headers.accept;
        return accept != null && accept.includes("text/html");
    },

    decimalToHex :function (d, padding = 4) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    
        while (hex.length < padding) {
            hex = "0" + hex;
        }
    
        return hex;
    },
     convertoFloatToUInt16 :function( value,  max, min = 0) {
        conversionFactor =  (UINT16_t_MAX) / (max - min);
        return Math.trunc( (value * conversionFactor));
      },

      convertUInt16ToFloat :function(value, max){

        return value / UINT16_t_MAX * max;
      }

      
}