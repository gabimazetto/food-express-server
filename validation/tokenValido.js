const jwt = require("jsonwebtoken");

//FUNÇÃO DE AUTENTICAÇÃO DO TOKEN;
function checkTokenValido(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "Acesso negado!" });
    try {
      const secret = process.env.SECRET;
      const decodedToken = jwt.verify(token, secret);
      if (decodedToken.role !== "restaurante" && decodedToken.role !== "cliente") {
        return res.status(403).json({ msg: "Acesso negado!" });
      }
      next();
    } catch (err) {
      res.status(400).json({ msg: "O Token é inválido!" });
    }
}

module.exports = checkTokenValido;