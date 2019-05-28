var b = [new Date(2016, 05, 10), new Date(2016, 05, 11), new Date(2016, 05, 12)]

a.reduce(function (prevVal, elem) {
    return prevVal + elem.launches;
}, 0);




var resultado = a.filter(function (element, index, result) {
    console.log(this);
    if (index && (element - result[index]) > 2) return true;
    else return false;
})
console.log('resultado: ' + resultado);

var a = [1, 1, 2, 3, 4, 8, 9, 9];
var resultado = []
a.forEach((element, indice) => {
    console.log(resultado[indice - 1])
    if (indice == 0) resultado.push(element)
   else if (((element - resultado[resultado.length - 1]) > 2))
        resultado.push(element)
});


var trilho = {
    "_id": "5bf5f39210e74000142a5b4e",
    "descricao": "Trilhos do Contrabando",
    "featured_media": "https://s2.wklcdn.com/image_36/1103239/13452217/8314721Master.jpg",
    "coordenadas": "https://dl.dropboxusercontent.com/s/g96j8ne71ghp0z9/trilhos-do-contrabando.kml",
    "__v": 1,
    "canais": [
        {
            "_id": "5bf5f40610e74000142a5b4f",
            "latitude": 40.33491,
            "longitude": -6.89436,
            "trilho": "5bf5f39210e74000142a5b4e",
            "nome": "Cruz",
            "hardware_id": "1D212A",
            "__v": 4054,
            "tempoConfig": 360,
            "tempoMinimoContacto": 120,
            "variacaoTemperatura": 1,
            "tempoEspera": 15,
            "feeds": [
                {
                    "_id": "5cb71d9ad39c7800156b50a4",
                    "temperatura": -0.003662221137119663,
                    "humidade": 109.99832153320312,
                    "bateria": 2.236328125,
                    "canal": "5bf5f40610e74000142a5b4f",
                    "latitude": 41,
                    "longitude": -7,
                    "__v": 0,
                    "created_at": "2019-04-17T12:35:38.436Z"
                },
                {
                    "_id": "5cb719c6d39c7800156b50a3",
                    "temperatura": -0.003662221137119663,
                    "humidade": 109.99832153320312,
                    "bateria": 2.2393798828125,
                    "canal": "5bf5f40610e74000142a5b4f",
                    "latitude": 41,
                    "longitude": -7,
                    "__v": 0,
                    "created_at": "2019-04-17T12:19:18.042Z"
                }
            ]
        }
    ]
}

for (const canal of trilho.canais) {
        canal.feeds.forEach( (element, indice) => {
                
        });
}

console.log(trilho.canais[0]);



console.log(resultado);


