var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Qty = require('js-quantities');

console.log("Application started");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
    res.json('Unit-Converter server running');
});

app.post('/convert', function (req, res){
    var input = req.body.text.toLowerCase();
    var words = input.split("to");
    var output = Qty(words[0]).to(words[1]);
    console.log("Input: " + input + " Output: " + output + "Words: " + words )
    //var output = Qty.parse(input) || "Invalid Unit Provided";
    res.send('Input = ' + input + ". Output = " + output);
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env)
});