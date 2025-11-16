// routes/admin.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");


router.post("/login", async (req, res) => {
  const { username, senha } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin || !(await admin.validarSenha(senha))) {
    return res.status(401).json({ erro: "Credenciais inválidas." });
  }

  const token = jwt.sign({ id: admin._id }, "segredoBarbearia", { expiresIn: "2h" });
  res.json({ token });
});

// ⚠️ Rota temporária para criar o primeiro admin
router.post("/criar-admin", async (req, res) => {

  

  const { username, senhaHash } = req.body;
  try {
    const novo = new Admin({ username, senhaHash });
    await novo.save();
    res.status(201).json({ mensagem: "Admin criado com sucesso." });
  } catch (err) {
    console.error("Erro ao criar admin:", err);
    res.status(500).json({ erro: "Falha ao criar admin." });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ erro: "Token não fornecido." });

    const decoded = jwt.verify(token, "segredoBarbearia");
    const admin = await Admin.findById(decoded.id).select("username");
    if (!admin) return res.status(404).json({ erro: "Admin não encontrado." });

    res.json({ username: admin.username });
  } catch (err) {
    res.status(401).json({ erro: "Token inválido." });
  }
});



module.exports = router;