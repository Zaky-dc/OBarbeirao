// middleware/autenticacao.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ erro: "Token ausente." });

  try {
    const decoded = jwt.verify(token, "segredoBarbearia");
    req.adminId = decoded.id;
    next();
  } catch {
    res.status(403).json({ erro: "Token inválido." });
  }
};
