var http = require('http');
var fs = require('fs');

fs.readFile('index.html', function (err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(8888);
});


// http.createServer(function (req, res) {

//     if(req.url.indexOf('.html') != -1){ //req.url has the pathname, check if it conatins '.html'

//       fs.readFile(__dirname + '/public/chatclient.html', function (err, data) {
//         if (err) console.log(err);
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write(data);
//         res.end();
//       });

//     }

//     if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'

//       fs.readFile(__dirname + '/public/js/script.js', function (err, data) {
//         if (err) console.log(err);
//         res.writeHead(200, {'Content-Type': 'text/javascript'});
//         res.write(data);
//         res.end();
//       });

//     }

//     if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

//       fs.readFile(__dirname + '/public/css/style.css', function (err, data) {
//         if (err) console.log(err);
//         res.writeHead(200, {'Content-Type': 'text/css'});
//         res.write(data);
//         res.end();
//       });

//     }

// }).listen(8888);
// console.log('Server running ');