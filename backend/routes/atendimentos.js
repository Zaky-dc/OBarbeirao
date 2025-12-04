const express = require("express");
const Atendimento = require("../models/Atendimento.js");
const corsMiddleware = require("../middleware/cors"); // <--- IMPORTAR
const router = express.Router();
// APLICAR CORS
router.use(corsMiddleware); // <--- APLICAR

// GET /atendimentos - listar todos os atendimentos
router.get("/", async (req, res) => {
  try {
    const atendimentos = await Atendimento.find().sort({ data: -1 });
    res.json(atendimentos);
  } catch (error) {
    console.error("Erro ao buscar atendimentos:", error);
    res.status(500).json({ erro: "Erro ao buscar atendimentos" });
  }
});

// GET /atendimentos/relatorio - gerar relatório com filtros
router.get("/relatorio", async (req, res) => {
  try {
    const { nome, telefone, servico, barbeiro, data } = req.query;
    const filtro = {};

    if (nome) filtro["cliente.nome"] = { $regex: nome, $options: "i" };
    if (telefone) filtro["cliente.telefone"] = { $regex: telefone, $options: "i" };
    if (servico) filtro["servicos.nome"] = { $regex: servico, $options: "i" };
    if (barbeiro) filtro["barbeiro.nome"] = { $regex: barbeiro, $options: "i" };
    if (data) {
      const inicio = new Date(data);
      const fim = new Date(data);
      fim.setHours(23, 59, 59, 999);
      filtro.data = { $gte: inicio, $lte: fim };
    }

    const atendimentos = await Atendimento.find(filtro).sort({ data: -1 });
    res.json(atendimentos);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ erro: "Erro ao gerar relatório" });
  }
});

// POST /atendimentos - registrar atendimento finalizado
router.post("/", async (req, res) => {
  try {
    const { cliente, barbeiro, servicos } = req.body;

    const valorTotal = servicos.reduce((acc, s) => acc + s.preco, 0);

    const novoAtendimento = new Atendimento({
      cliente: {
        nome: cliente.nome,
        telefone: cliente.telefone,
      },
      barbeiro: {
        _id: barbeiro._id, // ✅ usa o _id real enviado pelo frontend
        nome: barbeiro.nome,
      },
      servicos,
      valorTotal,
      data: new Date(),
    });

    await novoAtendimento.save();
    res.status(201).json(novoAtendimento);
  } catch (error) {
    console.error("Erro ao registrar atendimento:", error);
    res.status(500).json({ erro: "Erro ao registrar atendimento" });
  }
});

module.exports = router;
