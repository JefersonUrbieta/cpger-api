var nodemailer = require('nodemailer');
var Email = require('email-templates');

function getExtension (image) {
  if (image.indexOf('jpg') > -1) {
    return 'jpg';
  }

  if (image.indexOf('jpeg') > -1) {
    return 'jpeg';
  }

  if (image.indexOf('png') > -1) {
    return 'png';
  }

  return null;
}

function prepararAnexos (dados) {
  if (!dados.attachments) {
    return [];
  }

  var attachments = [];

  for (var i = 0; i < dados.attachments.length; i++) {
    var extesion = getExtension(dados.attachments[i].image);

    if (extesion) {

      attachments.push({
        filename: 'imagem' + i + '.' + extesion,
        content: dados.attachments[i].image.replace('data:image/' + extesion + ';base64,', ''),
        encoding: 'base64'
      });
    }
  }

  return attachments;
}

exports.sendEmail = function (subject, dados) {

  var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  const emailTemplate = new Email();

  emailTemplate
    .render('../templates/contact/html', dados)
    .then((html) => {

      var mailOptions = {
        from: process.env.MAIL_USER,
        to: process.env.MAIL_TO,
        cc: process.env.MAIL_CC,
        subject: subject,
        html: html,
        attachments: prepararAnexos(dados)
      };

      transporter.sendMail(mailOptions)
        .then((info) => {
          console.log('Message %s sent: %s', info.messageId, info.response);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch(console.error);

};

