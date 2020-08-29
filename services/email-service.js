var email = require("../config/email");
var sendgrid = require("sendgrid")(email.sendgridKey);

exports.send = async (to, subject, body) => {
  sendgrid.send({
    to: to,
    from: process.env.FROM_EMAIL,
    subject: subject,
    html: body,
  });
};
