##mail-service
============

Centralised template repository that receives json objects, applies a template and sends an email.

### Usage
1) Add a new handlebars template to ```/templates/```
We will use test.hbs for the example.

2) Add the needed credentials to the different environments in ```/config/```

3) Start the application selecting the port you want to listen.
``` console
node index.js 8000
```

4) Send a HTTP POST request with the dynamic data of the template in json format and the destination address.
``` console
curl localhost:8000 \
--header "x-template: test.hbs" \
--header "x-to: user@address.com" \
-d '{"name" : "John Doe"}' 
```
5) You will get back a 200 response with a success message or a 500 in case any configuration fails.
``` js
{ "response" : "mail sent" }
```
6) The mail address receives the email with the selected template
```
Hello, my name is John Doe.
```

### Presets
You can also define shorthands in the ```/presets/``` folder for widely used configurations
```
{
  "template": "registrationEmail.hbs",
  "from": "registration@company.com",
  "subject": "Please confirm your signup",
  "to": "customer@domain.com"
}
```
This presets file can be selected by sending the ```x-presets``` header.
Additional headers like ```x-to``` or ```x-subject``` will override the preset configuration.

### Templates
The templates use [handlebars](http://handlebarsjs.com/) and they are compiled and cached on the application startup to optimise runtime performance.

### Mail setup
The mails are sent using [nodemailer](http://www.nodemailer.com/) library using a stmp pool. Environment files in ```/config/``` define the transport and pool size.

### Roadmap
-Improve testing coverage.

-Define load tests.

-Add authentication capabilities.

-Accept gzip requests.
