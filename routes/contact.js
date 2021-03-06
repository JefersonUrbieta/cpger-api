var express = require('express');
var router = express.Router();
var mail = require('../emails/sendEmail');

function formatMoney(amount, decimalCount = 2, decimal = ",", thousands = ".") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    let number = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");

    let numberStg = number + '';
    if(numberStg.substr(numberStg.length -3, numberStg.length) == decimal + '00'){
      return numberStg.substr(0, numberStg.length - 3);
    }

    return number;
  } catch (e) {
    console.log(e)
  }
}

function formatDataContact (contact) {
  contact.dados.vazao = formatMoney(Number(contact.dados.vazao).toFixed(2));
  contact.dados.pressao = formatMoney(Number(contact.dados.pressao).toFixed(2));
  contact.dados.potencia = formatMoney(Number(contact.dados.potencia).toFixed(2));
  contact.dados.valorDia = formatMoney(Number(contact.dados.valorDia).toFixed(2));
  contact.dados.valorMes = formatMoney(Number(contact.dados.valorMes).toFixed(2));
  contact.dados.valorAno = formatMoney(Number(contact.dados.valorAno).toFixed(2));

  contact.configuracao.tarifa = formatMoney(Number(contact.configuracao.tarifa).toFixed(2));
  contact.configuracao.rendimentoGerador = formatMoney(Number(contact.configuracao.rendimentoGerador).toFixed(2));
  contact.configuracao.pesoAgua = formatMoney(Number(contact.configuracao.pesoAgua).toFixed(2));
  contact.configuracao.aceleracaoGravidade = formatMoney(Number(contact.configuracao.aceleracaoGravidade).toFixed(2));
  contact.configuracao.horasPorDia = formatMoney(Number(contact.configuracao.horasPorDia).toFixed(2));

  console.log(contact)

  return contact;
}

/* GET users listing. */
router.post('/', function (req, res, next) {
  console.log(req.body)

  mail.sendEmail(process.env.CONTATO_ASSUNTO_EMAIL, formatDataContact(req.body));

  res.json({
    message: 'email enviado com sucesso'
  });
});

module.exports = router;
