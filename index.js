
var http = require('http');
var fs = require('fs');
var hbs = require('handlebars');
var config = require('./config/' + (process.env.NODE_ENV || 'development') + '.json');

http.createServer(function (req, res) {
	
	if (req.method == 'POST') {
		var jsonString = '';
		var variables = {};
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
		    variables = JSON.parse(jsonString);
		});

		var maildata = loadMailData(req);

		fs.readFile(__dirname + "/templates/" + maildata.templatePath, "utf-8", function(error, source){
  			if(error)
  				res.status(404).send('Template' + maildata.templatePath +' Not Found');

  			var template = hbs.compile(source);
			var rendered = template(variables);

			//zalgo, do it async
			sendEmail(maildata,rendered);

			res.writeHead(200, {"Content-Type": "application/json"});
  			res.end('{ "response" : "mail sent" }');
		});
	}
}).listen(process.argv[2] || 8000);

function loadMailData(req){
	var presets = require( './presets/' + (req.headers['x-presets'] || 'empty.json'));
	return { 
		templatePath : req.headers['x-template'],
		from : req.headers['x-from'] || presets.from,
		subject : req.headers['x-subject'] || presets.subject,
		to : req.headers['x-to'] || presets.to,
		cc : req.headers['x-cc'] || presets.cc,
		cco : req.headers['x-cco'] || presets.cco 
	};
} 

function sendEmail(maildata, body ){
	console.log(maildata);
	console.log(body);
}

//not working on subfunctions ?!
function readVariables(req){
	var jsonString = '';
	var variables = {};
	req.on('data', function (data) {
		jsonString += data;
	});
	req.on('end', function () {
	    variables = JSON.parse(jsonString);
	});
	return variables;  
}