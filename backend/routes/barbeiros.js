const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Barbeiro = require("../models/Barbeiro");
const Atendimento = require("../models/Atendimento");

const router = express.Router();

// Função auxiliar para autenticação
function verificarToken(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ erro: "Token não fornecido" });
    return null;
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "segredoBarbearia"
    );
    return decoded;
  } catch (err) {
    res.status(401).json({ erro: "Token inválido" });
    return null;
  }
}

// GET /api/barbeiros → listar barbeiros ativos
router.get("/", async (req, res) => {
  try {
    const barbeiros = await Barbeiro.find({ ativo: true });
    res.status(200).json(barbeiros);
  } catch (err) {
    console.error("Erro ao listar barbeiros:", err);
    res.status(500).json({ erro: "Erro ao listar barbeiros" });
  }
});

// GET /api/barbeiros/fecho-mensal → protegido
router.get("/fecho-mensal", async (req, res) => {
  const decoded = verificarToken(req, res);
  if (!decoded) return;

  try {
    const mes = parseInt(req.query.mes);
    const ano = parseInt(req.query.ano);

    if (!mes || !ano) {
      return res.status(400).json({ erro: "Mês e Ano são obrigatórios" });
    }

    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 1);

    const atendimentos = await Atendimento.find({
      data: { $gte: inicio, $lt: fim },
    });

    const barbeiros = await Barbeiro.find();

    const resumo = barbeiros.map((barbeiro) => {
      const atendimentosDoBarbeiro = atendimentos.filter((a) => {
        if (!a.barbeiro) return false;
        const idAtendimento = a.barbeiro._id ? a.barbeiro._id : a.barbeiro;
        return String(idAtendimento) === String(barbeiro._id);
      });

      const receita = atendimentosDoBarbeiro.reduce(
        (acc, a) => acc + (a.valorTotal || 0),
        0
      );
      const taxa = barbeiro.taxaComissao || 0.3;
      const comissao = receita * taxa;

      return {
        barbeiro: barbeiro.nome,
        totalAtendimentos: atendimentosDoBarbeiro.length,
        receita,
        comissao,
        taxaComissao: taxa,
      };
    });

    res.status(200).json(resumo);
  } catch (error) {
    console.error("Erro ao gerar fecho mensal:", error);
    res.status(500).json({ erro: "Erro ao gerar fecho mensal" });
  }
});

// GET /api/barbeiros/:id → buscar barbeiro por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const barbeiro = await Barbeiro.findById(id);
    if (!barbeiro) {
      return res.status(404).json({ erro: "Barbeiro não encontrado" });
    }
    res.status(200).json(barbeiro);
  } catch (err) {
    console.error("Erro ao buscar barbeiro:", err);
    res.status(500).json({ erro: "Erro ao buscar barbeiro" });
  }
});

// POST /api/barbeiros → protegido
router.post("/", async (req, res) => {
  const decoded = verificarToken(req, res);
  if (!decoded) return;

  try {
    const { nome, contacto, taxaComissao, imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ erro: "URL da imagem é obrigatória" });
    }

    const novo = new Barbeiro({ nome, contacto, taxaComissao, imageUrl });
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    console.error("Erro ao cadastrar barbeiro:", err);
    res.status(500).json({ erro: "Erro ao cadastrar barbeiro" });
  }
});

// PUT /api/barbeiros/:id → protegido
router.put("/:id", async (req, res) => {
  const decoded = verificarToken(req, res);
  if (!decoded) return;

  try {
    const { id } = req.params;
    const { nome, contacto, taxaComissao } = req.body;
    const atualizado = await Barbeiro.findByIdAndUpdate(
      id,
      { nome, contacto, taxaComissao },
      { new: true }
    );
    res.status(200).json(atualizado);
  } catch (err) {
    console.error("Erro ao atualizar barbeiro:", err);
    res.status(500).json({ erro: "Erro ao atualizar barbeiro" });
  }
});

// DELETE /api/barbeiros/:id → protegido
router.delete("/:id", async (req, res) => {
  const decoded = verificarToken(req, res);
  if (!decoded) return;

  try {
    const { id } = req.params;
    await Barbeiro.findByIdAndDelete(id);
    res.status(200).json({ mensagem: "Barbeiro removido com sucesso" });
  } catch (err) {
    console.error("Erro ao remover barbeiro:", err);
    res.status(500).json({ erro: "Erro ao remover barbeiro" });
  }
});

module.exports = router;
