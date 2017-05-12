var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Qty = require('js-quantities');

console.log("Running on port " + process.env.PORT );

var result = "Result GET!!"

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
    res.json('Unit-Converter server running');
});

app.post('/convert', function (req, res){
    var text = req.body.text;
    res.send('Hello world!');
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env)
});