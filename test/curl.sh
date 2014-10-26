curl localhost:8000  \
--header "x-template: test.hbs" \
--header "x-presets: confirmationEmail.json" \
--header "x-to: xxx@gmail.com" \
-d '{"name" : "Dom"}'