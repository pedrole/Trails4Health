
module.exports = {
    shouldReturnHtml :function(request) {
        //accept = request.headers("Accept");
        var accept = request.headers.accept;
        return accept != null && accept.includes("text/html");
    }
}