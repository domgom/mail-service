var http = require('http');
var fs = require('fs');
var hbs = require('handlebars');
var concat = require('concat-stream');
var mailer = require('./mailer');

var templates = {}; //Map cache with all the compiled hbs templates
compileTemplates();

http.createServer(function (req, res) {
    if (req.method == 'POST') {
        var variables = {};
        req.pipe(concat(function (body) {
            variables = JSON.parse(body);
            var mail_metadata = loadMailMetaData(req);
            var mail_body = templates[mail_metadata.template](variables);

            mailer.sendMail(mail_metadata, mail_body, function (error, response) {
                if (error) {
                    res.writeHead(500, {"Content-Type": "application/json"});
                    console.log(error);
                    res.end('{ "response" : "mail error" }');
                }
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end('{ "response" : "mail sent" }');
            });

        }));
    }
}).listen(process.argv[2] || 8000);

function loadMailMetaData(req) {
    var presets = require('./presets/' + (req.headers['x-presets'] || 'empty.json'));
    var overrided = {};
    for (var k in presets) {
        overrided[k] = req.headers['x-' + k] || presets[k];
    }
    return overrided;
}

function compileTemplates() {
    fs.readdir(__dirname + "/templates/", function (error, files) {
        files.forEach(function (file) {
            compileTemplate(file);
        });
    });
}

function compileTemplate(name) {
    fs.readFile(__dirname + "/templates/" + name, "utf-8", function (error, source) {
        console.log("compiling " + name);
        templates[name] = hbs.compile(source);
    });
}