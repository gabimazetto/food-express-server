const Joi = require("joi");

const validacaoRestaurante = Joi.object({
  nomeFantasia: Joi.string().max(130).required(),
  razaoSocial: Joi.string().required(), //UNIQUE
  telefone: Joi.string().max(14).required(),
  cnpj: Joi.string().max(18).required(), //UNIQUE
  email: Joi.string().email().required(), //UNIQUE
  senha: Joi.string().required(),
  confirmarSenha: Joi.ref("senha"),
  endereco: {
    uf: Joi.string().max(2).required(),
    cidade: Joi.string().required(),
    cep: Joi.string().max(9).required(),
    rua: Joi.string().required(),
    numero: Joi.string().required(),
    complemento: Joi.string().allow(""),
  },
});

const validacaoRestauranteAtt = Joi.object({
  nomeFantasia: Joi.string().max(130).required(),
  telefone: Joi.string().max(14).required(),
  endereco: {
    uf: Joi.string().max(2).required(),
    cidade: Joi.string().required(),
    cep: Joi.string().max(9).required(),
    rua: Joi.string().required(),
    numero: Joi.string().required(),
    complemento: Joi.string().allow(""),
  },
});

module.exports = { validacaoRestaurante, validacaoRestauranteAtt };
