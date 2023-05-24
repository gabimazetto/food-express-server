const { Router } = require("express");
const Cliente = require("../database/cliente");
const { Comida } = require("../database/comida");
const Restaurante = require("../database/restaurante");
const Favorito = require("../database/favorito");
const { Op } = require("sequelize");
const { validacaoComidaFavorito, validacaoRestauranteFavorito } = require("../validation/favorito");
const checkTokenCliente = require("../validation/tokenCliente");

const router = Router();

// Adicionando Restaurante Favorito
router.post("/restaurantes/favoritos", checkTokenCliente, async (req, res) => {
  const { favoritar, restauranteId, clienteId } = req.body;
  try {
    const cliente = await Cliente.findByPk(clienteId);
    const restaurante = await Restaurante.findByPk(restauranteId);

    const { error, value } = validacaoRestauranteFavorito.validateAsync(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (cliente && restaurante) {
      const novoFavorito = await Favorito.create({
        favoritar,
        restauranteId,
        clienteId,
      });
      res.status(201).json(novoFavorito);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error 500" });
  }
});

// Adicionando Comida Favorita
router.post("/comidas/favoritos", checkTokenCliente, async (req, res) => {
  const { favoritar, comidaId, clienteId } = req.body;
  try {
    const cliente = await Cliente.findByPk(clienteId);
    const comida = await Comida.findByPk(comidaId);

    const { error, value } = validacaoComidaFavorito.validateAsync(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ msg: " Erro na validação do Joi" }, { err: error.message });
    } else if (cliente && comida) {
      const novoFavorito = await Favorito.create({
        favoritar,
        comidaId,
        clienteId,
      });
      res.status(201).json(novoFavorito);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error 500" });
  }
});

//Rota GET para listar todas as comidas salvas como favoritas
router.get("/favoritos/comidas", checkTokenCliente, async (req, res) => {
  try {
    const favoritos = await Favorito.findAll({
      where: {
        comidaId: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: Comida,
          attributes: ["id", "nome", "descricao", "preco", "restauranteId"],
          include: [
            {
              model: Restaurante,
              attributes: ["nomeFantasia"],
            },
          ],
        },
      ],
    });

    const comidaIds = favoritos.map((favorito) => favorito.comidaId);
    const comidasFavoritadasUnico = Array.from(new Set(comidaIds));

    const comidasFavoritadas = await Comida.findAll({
      where: {
        id: {
          [Op.in]: comidasFavoritadasUnico,
        },
      },
      attributes: ["id", "nome", "descricao", "preco", "restauranteId"],
      include: [
        {
          model: Restaurante,
          attributes: ["nomeFantasia"],
        },
      ],
    });

    if (comidasFavoritadas.length > 0) {
      res.status(200).json(comidasFavoritadas);
    } else {
      res.status(404).json({ message: "Nenhuma comida favorita encontrada" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro 500" });
  }
});

//Rota GET para listar todas as comidas favoritas de um cliente especifico
router.get("/favoritos/comidas/:clienteId", checkTokenCliente, async (req, res) => {
  const { clienteId } = req.params;

  try {
    const favoritos = await Favorito.findAll({
      where: {
        comidaId: {
          [Op.ne]: null,
        },
        clienteId: clienteId,
      },
      include: [
        {
          model: Comida,
          attributes: ["id", "nome", "descricao", "preco", "restauranteId"],
          include: [
            {
              model: Restaurante,
              attributes: ["nomeFantasia"],
            },
          ],
        },
      ],
    });

    const comidaIds = favoritos.map((favorito) => favorito.comidaId);
    const comidasFavoritadasUnico = Array.from(new Set(comidaIds));

    const comidasFavoritadas = await Comida.findAll({
      where: {
        id: {
          [Op.in]: comidasFavoritadasUnico,
        },
      },
      attributes: ["id", "nome", "descricao", "preco", "restauranteId"],
      include: [
        {
          model: Restaurante,
          attributes: ["nomeFantasia"],
        },
      ],
    });

    if (comidasFavoritadas.length > 0) {
      res.status(200).json(comidasFavoritadas);
    } else {
      res.status(404).json({
        message: "Nenhuma comida favorita encontrada para este cliente",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro 500" });
  }
});

// Rota GET para listar todos os restaurantes favoritos
router.get("/favoritos/restaurantes", checkTokenCliente, async (req, res) => {
  try {
    const favoritos = await Favorito.findAll({
      where: {
        restauranteId: {
          [Op.ne]: null,
        },
      },
      attributes: ["restauranteId"], // Adicione esta linha
      include: [
        {
          model: Restaurante,
          attributes: ["id", "nomeFantasia", "razaoSocial", "cnpj", "email"],
        },
      ],
    });

    const restauranteIds = favoritos.map((favorito) => favorito.restauranteId);
    const RestaurantesFavoritadosUnico = Array.from(new Set(restauranteIds));

    const restaurantesFavoritados = await Restaurante.findAll({
      where: {
        id: {
          [Op.in]: RestaurantesFavoritadosUnico,
        },
      },
      attributes: ["id", "nomeFantasia", "razaoSocial", "cnpj", "email"],
    });

    if (restaurantesFavoritados.length > 0) {
      res.status(200).json(restaurantesFavoritados);
    } else {
      res.status(404).json({ message: "Não existem restaurantes favoritos" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error 500" });
  }
});

// Rota GET para listar dos restaurantes favoritos por um cliente especifico
router.get("/favoritos/restaurantes/:clienteId", checkTokenCliente, async (req, res) => {
  const { clienteId } = req.params;
  try {
    const favoritos = await Favorito.findAll({
      where: { clienteId },
      include: [
        {
          model: Restaurante,
          required: true,
        },
      ],
    });

    if (favoritos.length > 0) {
      res.status(200).json(favoritos);
    } else {
      res.status(404).json({ message: "Restaurante inexistente" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error 500" });
  }
});

// ROTA PARA REMOVER UMA COMIDA FAVORITA - DELETE
router.delete("/favoritos/comidas/:id", checkTokenCliente, async (req, res) => {
  const { id } = req.params;
  const favorito = await Favorito.findOne({ where: { id } });
  try {
    if (favorito) {
      await favorito.destroy();
      res.status(200).json({ message: "Comida favorita removida." });
    } else {
      res.status(404).json({ message: "Comida favorita não encontrada." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

router.delete("/favoritos/restaurantes/:id", checkTokenCliente, async (req, res) => {
  const { id } = req.params;
  const favorito = await Favorito.findOne({ where: { id } });
  try {
    if (favorito) {
      await favorito.destroy();
      res.status(200).json({ message: "Restaurante favorito removido." });
    } else {
      res.status(404).json({ message: "Restaurante não encontrado." });
    }
  } catch (err) {
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

module.exports = router;
