var config = require('./config/' + (process.env.NODE_ENV || 'development') + '.json');
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
var transport = nodemailer.createTransport(smtpPool(config.transport));

module.exports = {
    sendMail: sendMail
};


function sendMail(mail_metadata, body, cb) {

    // console.log (mail_metadata);

    var mailOptions = {
        from: mail_metadata.from,
        to: mail_metadata.to,
        subject: mail_metadata.subject,
        html: body
    };

    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            cb(error);
        } else {
            cb(null, info.response);
        }
    });
}