const Joi = require("joi");

const validacaoRestauranteFavorito = Joi.object({
  favoritar: Joi.boolean().required().default(false),
  restauranteId: Joi.number().required(),
  clienteId: Joi.number().required(),
});

const validacaoComidaFavorito = Joi.object({
  favoritar: Joi.boolean().required().default(false),
  comidaId: Joi.number().required(),
  clienteId: Joi.number().required(),
});

module.exports = { validacaoComidaFavorito, validacaoRestauranteFavorito };
