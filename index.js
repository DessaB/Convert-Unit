var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Qty = require('js-quantities');

console.log("Let's do this");

var result = "Result GET!!"

app.get('/', function (req, res){
    res.json('Unit-Converter server running');
});

app.post('/convert', function (req, res){
    var text = req.body.text;
    res.send('Hello world!');
});


app.listen(3000);