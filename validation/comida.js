const Joi = require("joi");

const validacaoComida = Joi.object({
  codigo: Joi.string().required(), //unique,
  nome: Joi.string().max(130).required(),
  descricao: Joi.string().required(),
  categoria: Joi.string()
    .valid(
      "Açaí",
      "Lanche",
      "Pizza",
      "Brasileira",
      "Italiana",
      "Sobremesa",
      "Japonesa",
      "Chinesa",
      "Vegetariana",
      "Padaria",
      "Marmita",
      "Carne",
      "Fit",
      "Árabe"
    )
    .required(),
  preco: Joi.string().required(),
  peso: Joi.number().required(),
  imagem: Joi.string().uri(),
  restauranteId: Joi.number().required(),
});

const validacaoComidaAtt = Joi.object({
  codigo: Joi.string(), //unique,
  nome: Joi.string().max(130),
  descricao: Joi.string(),
  categoria: Joi.string().valid(
    "Açaí",
    "Lanche",
    "Pizza",
    "Brasileira",
    "Italiana",
    "Sobremesa",
    "Japonesa",
    "Chinesa",
    "Vegetariana",
    "Padaria",
    "Marmita",
    "Carne",
    "Fit",
    "Árabe"
  ),
  preco: Joi.string(),
  peso: Joi.number(),
  imagem: Joi.string().uri(),
  restauranteId: Joi.number().required()
});

module.exports = { validacaoComida, validacaoComidaAtt };
