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
  itemId: Joi.number().required(),
  metodoPagamento: Joi.string()
    .required()
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
    bairro: Joi.string().required(),
    numero: Joi.string().required(),
    cep: Joi.string().max(9).required(),
    complemento: Joi.string(),
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
});

module.exports = { validacaoPedido, validacaoPedidoAtt };
