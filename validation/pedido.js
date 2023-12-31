const Joi = require("joi");

const validacaoPedido = Joi.object({
  dataRegistro: Joi.date().max("now").required(),
  status: Joi.string()
    .default("Pendente")
    .valid(
      "Pendente",
      "Aguardando confirmação",
      "Confirmado",
      "A caminho",
      "Entregue",
      "Cancelado"
    ),
  clienteId: Joi.number().required(),
  restauranteId: Joi.number().required(),
  metodoPagamento: Joi.string()
    .valid(
      "Cartão de crédito",
      "Cartão de débito",
      "Dinheiro",
      "PIX",
      "VR",
      "VA",
      "Carteira Digital"
    ),
  enderecoPedido: {
    rua: Joi.string().required(),
    numero: Joi.string().required(),
    cep: Joi.string().max(9).required(),
    complemento: Joi.string().allow(""),
  },
});

const validacaoPedidoAtt = Joi.object({
  
  status: Joi.string()
    .default("Pendente")
    .valid(
      "Pendente",
      "Aguardando confirmação",
      "Confirmado",
      "A caminho",
      "Entregue",
      "Cancelado"
    ),
  metodoPagamento: Joi.string()
    .valid(
      "Cartão de crédito",
      "Cartão de débito",
      "Dinheiro",
      "PIX",
      "VR",
      "VA",
      "Carteira Digital"
    ),
  enderecoPedido: {
    rua: Joi.string().required(),
    numero: Joi.string().required(),
    cep: Joi.string().max(9).required(),
    complemento: Joi.string().allow(""),
  },
});

module.exports = { validacaoPedido, validacaoPedidoAtt };