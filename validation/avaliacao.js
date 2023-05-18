const Joi = require("joi");

const validacaoAvaliacao = Joi.object({
  avaliacao: Joi.string().valid("1", "2", "3", "4", "5"),
  comentario: Joi.string().max(155),
  clienteId: Joi.number().required(),
  restauranteId: Joi.number().required(),
  pedidoId: Joi.number().required(),
});

module.exports = validacaoAvaliacao;
