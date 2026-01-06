const express = require("express");
const mongoose = require("mongoose");
const Checkin = require("../models/Checkin");
const Atendimento = require("../models/Atendimento");

const router = express.Router();

// POST /api/checkin → criar novo agendamento
router.post("/", async (req, res) => {
  try {
    const novo = new Checkin(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    console.error("❌ Erro ao criar check-in:", err);
    res.status(500).json({ erro: "Falha ao criar check-in." });
  }
});

// GET /api/checkin?telefone=... → consultar agendamentos por telefone
router.get("/", async (req, res) => {
  let { telefone } = req.query;
  if (!telefone) {
    return res
      .status(400)
      .json({ erro: "Telefone obrigatório para consulta." });
  }
  telefone = telefone.replace(/\D/g, "");
  try {
    const agendamentos = await Checkin.find({
      telefone,
      cancelado: { $ne: true },
    }).sort({ horario: -1 });

    if (agendamentos.length === 0) {
      return res.status(404).json({
        telefoneBuscado: telefone,
        mensagem: "Nenhum agendamento encontrado para este número.",
      });
    }
    res.json({
      telefoneBuscado: telefone,
      total: agendamentos.length,
      dados: agendamentos,
    });
  } catch (err) {
    console.error("❌ Erro ao consultar agendamentos:", err);
    res.status(500).json({ erro: "Erro interno ao consultar agendamentos." });
  }
});

// PATCH /api/checkin/cancelar/:id
router.patch("/cancelar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cancelado = await Checkin.findByIdAndUpdate(
      id,
      { cancelado: true },
      { new: true }
    );
    if (!cancelado)
      return res.status(404).json({ erro: "Agendamento não encontrado." });
    res.json({
      mensagem: "Agendamento cancelado com sucesso.",
      dados: cancelado,
    });
  } catch (err) {
    console.error("❌ Erro ao cancelar agendamento:", err);
    res.status(500).json({ erro: "Falha ao cancelar agendamento." });
  }
});

// PATCH /api/checkin/:id → marcar como atendido
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const atualizado = await Checkin.findByIdAndUpdate(
      id,
      { atendido: true },
      { new: true }
    );
    if (!atualizado)
      return res.status(404).json({ erro: "Check-in não encontrado." });
    res.json(atualizado);
  } catch (err) {
    console.error("❌ Erro ao atualizar check-in:", err);
    res.status(500).json({ erro: "Falha ao atualizar check-in." });
  }
});

// PATCH /api/checkin/:id/servicos
router.patch("/:id/servicos", async (req, res) => {
  try {
    const { id } = req.params;
    const checkin = await Checkin.findById(id);
    if (!checkin)
      return res.status(404).json({ erro: "Check-in não encontrado" });
    if (!Array.isArray(req.body.servicos))
      return res.status(400).json({ erro: "Serviços inválidos" });

    checkin.servicos = req.body.servicos;
    if (req.body.barbeiro) checkin.barbeiro = req.body.barbeiro;
    await checkin.save();
    res.json({ mensagem: "Serviços atualizados", dados: checkin });
  } catch (err) {
    console.error("Erro ao atualizar serviços:", err);
    res.status(500).json({ erro: "Erro interno ao salvar serviços" });
  }
});

// GET /api/checkin/relatorio?mes=...&ano=...
router.get("/relatorio", async (req, res) => {
  const { mes, ano } = req.query;
  if (!mes || !ano)
    return res.status(400).json({ erro: "Mês e ano são obrigatórios." });
  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 1);
  try {
    const atendidos = await Checkin.find({
      createdAt: { $gte: inicio, $lt: fim },
      atendido: true,
      cancelado: { $ne: true },
    }).sort({ createdAt: -1 });
    res.json({ total: atendidos.length, dados: atendidos });
  } catch (err) {
    console.error("❌ Erro ao gerar relatório:", err);
    res.status(500).json({ erro: "Falha ao gerar relatório." });
  }
});

// GET /api/checkin/fila-presencial
router.get("/fila-presencial", async (req, res) => {
  try {
    const fila = await Checkin.find({
      origem: "presencial",
      cancelado: { $ne: true },
      atendido: false,
    }).sort({ horario: 1 });
    res.json({ total: fila.length, dados: fila });
  } catch (err) {
    console.error("❌ Erro ao consultar fila presencial:", err);
    res.status(500).json({ erro: "Falha ao consultar fila." });
  }
});

// POST /api/checkin/presencial (changed from /api/checkin-presencial to fit router structure)
router.post("/presencial", async (req, res) => {
  const { nome, telefone } = req.body;
  if (!nome || !telefone)
    return res.status(400).json({ erro: "Nome e telefone são obrigatórios." });
  const numeroLimpo = telefone.replace(/\D/g, "");
  try {
    const novo = new Checkin({
      nome,
      telefone: numeroLimpo,
      horario: new Date(),
      origem: "presencial",
    });
    await novo.save();
    res
      .status(201)
      .json({
        mensagem: "Check-in presencial registrado com sucesso.",
        dados: novo,
      });
  } catch (err) {
    console.error("❌ Erro ao registrar check-in presencial:", err);
    res.status(500).json({ erro: "Falha ao registrar check-in presencial." });
  }
});

// POST /api/checkin/:id/finalizar
router.post("/:id/finalizar", async (req, res) => {
  try {
    const { id } = req.params;
    const checkin = await Checkin.findById(id);
    if (!checkin)
      return res.status(404).json({ erro: "Check-in não encontrado" });
    const { barbeiro, servicos } = req.body;
    const valorTotal = servicos.reduce((acc, s) => acc + s.preco, 0);
    const atendimento = new Atendimento({
      cliente: { nome: checkin.nome, telefone: checkin.telefone },
      barbeiro,
      servicos,
      valorTotal,
      data: new Date(),
    });
    await atendimento.save();
    await Checkin.findByIdAndDelete(id);
    res.status(201).json(atendimento);
  } catch (err) {
    console.error("Erro ao finalizar atendimento:", err);
    res.status(500).json({ erro: "Falha ao finalizar atendimento." });
  }
});

// DELETE /api/checkin/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removido = await Checkin.findByIdAndDelete(id);
    if (!removido)
      return res.status(404).json({ erro: "Check-in não encontrado" });
    res.json({ mensagem: "Check-in removido com sucesso" });
  } catch (err) {
    console.error("Erro ao remover check-in:", err);
    res.status(500).json({ erro: "Erro interno" });
  }
});

module.exports = router;
