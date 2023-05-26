const Joi = require("joi");

const validacaoCliente = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().email(),
  senha: Joi.string().required(),
  confirmarSenha: Joi.ref("senha"),
  telefone: Joi.string().max(14).required(),
  cpf: Joi.string().max(14).required(),
  dataNascimento: Joi.date().required().max("2012-01-01"),
  endereco: {
    uf: Joi.string().max(2).required(),
    cidade: Joi.string().required(),
    cep: Joi.string().max(9).required(),
    rua: Joi.string().required(),
    numero: Joi.string().required(),
    complemento: Joi.string().allow(""),
  },
});


const validacaoClienteAtt = Joi.object({
  nome: Joi.string().required(),
  telefone: Joi.string().max(14).required(),
  cpf: Joi.string().max(14).required(),
  dataNascimento: Joi.date().required().max("2012-01-01"),
  endereco: {
    uf: Joi.string().max(2).required(),
    cidade: Joi.string().required(),
    cep: Joi.string().max(9).required(),
    rua: Joi.string().required(),
    numero: Joi.string().required(),
    complemento: Joi.string().allow(""),
  },
});

module.exports = { validacaoCliente, validacaoClienteAtt };
