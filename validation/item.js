const Joi = require("joi");

const validacaoItem = Joi.object({
  quantidade: Joi.number().required(),
  comidaId: Joi.number().required(),
  pedidoId: Joi.number().required()
});

module.exports = validacaoItem;
