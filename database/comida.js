

const { DataTypes } = require("sequelize");
const { connection } = require("./database");
const Restaurante = require("./restaurante");
const { storage } = require("./firebase/config");
const { getDownloadURL, ref, uploadBytes } = require("firebase/storage");

const Comida = connection.define(
    "comida",
    {
        codigo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        nome: {
            type: DataTypes.STRING(130),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [
                    [
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
                        "Árabe",
                    ]
                ],
            },
        },
        preco: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        peso: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        imagem: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { paranoid: true }
);

Restaurante.hasMany(Comida, { foreignKey: "restauranteId" });
Comida.belongsTo(Restaurante, { foreignKey: "restauranteId" });

// file.originalname, vai trazer o nome do arquivo que selecionar.
// file.buffer, vai trazer o arquivo que está na memória do computador para upload.
async function uploadImagemComida(file) {
    const filename = file.originalname;
    const imageRef = ref(storage, `refeições/${filename}-${Date.now()}`);
    const result = await uploadBytes(imageRef, file.buffer);
    return await getDownloadURL(result.ref);
}

module.exports = { Comida, uploadImagemComida };
