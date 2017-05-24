//An app designed for the Slack command line to convert a quantity from one unit type to another
//Author: Dessa Brewington

//TODO: Add help subparams to identify units, and modify help to indicate these options exist
//TODO: Optimise parseInput and enable partial string searches to catch things like "celsius" when the unit says "degrees Celsius"
//TODO: Add unit tests for everything.


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');
//var inputParser = require('./input');
//var Qty = require('js-quantities');
var convert = require('convert-units')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//init
console.log("Application started");
console.log("Building Unit list...");
var unitList = convert().list();


//api
app.get('/', function (req, res){
    res.json('Unit-Converter server running');
});

app.post('/convert', function (req, res){
    var input = req.body.text;
    res.send(parseInput(input));
    
});

 
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env)
});

function parseInput(input) {
    if (input.toLowerCase() == "help") {
        return "Format: /convert <quantity> <unit> to <other unit> -- example: /convert 22 meters to feet";
    }
    if (input.toLowerCase() == "version") {
        return "We're at version 1.0 right now.  Dessa Brewington coded this.";
    }

    var output = "Program error: Output returned without being set.";
    var operands = input.split("to");
    var originalTerm = operands[0];
    var desiredUnit = operands[1].trim();
    
    var firstNonNumericChar;
    for(firstNonNumericChar = 0; firstNonNumericChar < originalTerm.length; firstNonNumericChar++) {
        if (/\D/.test(originalTerm[firstNonNumericChar])) break; 
    }
    
    var scalar = originalTerm.slice(0, firstNonNumericChar).trim();
    var denominator = originalTerm.slice(firstNonNumericChar).trim();

    if(scalar ===  "") scalar = 1;
    denominatorInfo = parseUnit(denominator);
    desiredUnitInfo = parseUnit(desiredUnit);
    
    function returnParseError(unit) {
        cappedAbbrParses = parseUnit(_.capitalize(unit));  
        if(cappedAbbrParses) 
            output = "Unit '" + unit + "' not recognized. Did you mean '" + cappedAbbrParses.abbr + "'? (" + cappedAbbrParses.plural +")";
        else 
            output = "Unit '" + unit + "' not recognized. Valid units include: --TODO--";
    }

    if(!denominatorInfo) returnParseError(denominator);
    else if(!desiredUnitInfo) returnParseError(desiredUnit);
    else {
        // console.log("Denominator abbr: " + denominatorInfo.abbr);
        // console.log("originalTerm: " + originalTerm + ", scalar: " + scalar + ", denominatorGiven: " + denominator + ", desired unit: " + desiredUnit);
        // console.log("Denominator Info:");
        // console.log(denominatorInfo)
        
        try {
            output = scalar + " " + denominatorInfo.plural + " = " + convert(scalar).from(denominatorInfo.abbr).to(desiredUnitInfo.abbr) + " " + desiredUnitInfo.plural;
        } catch(e) {
            output = e + "";
        }
    }
    console.log("Input: " + input + "\nOutput: " + output);
    return output;
}


function parseUnit(unit) {
    console.log("Parsing...")
    if( _.find(unitList, { "abbr": unit })) {
        console.log("Found " + unit + " by abbr. Returning " + _.find(unitList, {"abbr": unit }));
        return _.find(unitList, {"abbr": unit });
    }
    if( _.find(unitList, { "singular": _.capitalize(unit) })) {
        console.log("Found " + unit + " by singular. Returning " + _.find(unitList, {"singular": _.capitalize(unit) }));
        return _.find(unitList, {"singular": _.capitalize(unit) });
    }
    
    if (_.find(unitList, { "plural": _.capitalize(unit) })) {
        console.log("Found " + unit + " by plural. Returning " + _.find(unitList, {"plural": _.capitalize(unit) }));
        return _.find(unitList, {"plural": _.capitalize(unit) });
    }
    console.log("Could not find " + unit + ".  Returning false.");
    return false;
}

// var parseUnit = function(unit) {
//     var testCase = _.find(unitList, {"abbr": unit  + testCase}); 
//     if(testCase) {
//         console.log("testCase abbr is true");
//         console.log(testCase);
//         return testCase;
//     }
//     var testCase = _.find(unitList, {"singular": unit  + testCase}); 
//     if(testCase) {
//         console.log("testCase singular is true");
//         console.log(testCase);
//         return testCase;
//     }
//     var testCase = _.find(unitList, {"plural": unit });
//     if(testCase) {
//         console.log("testCase plural is true :");
//         console.log(testCase);
//         return testCase;
//     }
//     console.log("testCase is false");
//     return false;
// }



// Stubbed out old Qty code
// function parseInput(input) {
//     if (input.toLowerCase() == "help") {
//         //TODO: Make help return basic use instructions, including optional params, instead of units
//         var units = Qty.getUnits();
//         //console.log("Units: " + units);
//         for(var i = 0; i < units.length; i++) {
//             //console.log(units[i]);
//             try {
//                 console.log(Qty.getAliases(units[i]));
//             } catch(e) { 
//                 console.log(units[i] + " " + e.message);
//             }
//         }
//         return units;
//     }

//     var operands = input.split("to");

//     if (operands.length === 1) { 
//         return 'Invalid request. Format: /convert [quantity] [unit] to [desired unit] (example: /convert 32 fahrenheit to celsius)';
//     }

//     var initialTerm = operands[0];
//     var desiredUnit = operands[1];
   
//     try {
//         var output = Qty(initialTerm).to(desiredUnit);
//     } catch(e) {
//         output = e.message;
//     }

//     console.log("Input: " + input + ", Output: " + output)
//     return output;
    
// }



