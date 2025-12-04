const express = require("express");
const mongoose = require("mongoose");
const Pagamento = require("../models/Pagamento");
const corsMiddleware = require("../middleware/cors"); // <--- IMPORTAR

// APLICAR CORS
router.use(corsMiddleware); // <--- APLICAR

const router = express.Router();

// Criar novo pagamento
router.post("/", async (req, res) => {
  try {
    const { tipo, periodo } = req.body;

    // Evitar duplicação de mensal
    if (tipo === "mensal") {
      const existente = await Pagamento.findOne({
        tipo: "mensal",
        "periodo.inicio": periodo.inicio,
        "periodo.fim": periodo.fim,
      });

      if (existente) {
        return res.status(400).json({
          error: "Pagamento mensal já registrado para este período.",
        });
      }
    }

    const novo = new Pagamento(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    console.error("Erro ao criar pagamento:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Listar todos os pagamentos
router.get("/", async (req, res) => {
  try {
    const pagamentos = await Pagamento.find();
    res.json(pagamentos);
  } catch (err) {
    console.error("Erro ao listar pagamentos:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Buscar pagamento por ID
router.get("/:pagamentoId", async (req, res) => {
  try {
    const pagamento = await Pagamento.findById(req.params.pagamentoId);
    if (!pagamento) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }
    res.json(pagamento);
  } catch (err) {
    console.error("Erro ao buscar pagamento:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Atualizar status de um barbeiro dentro do pagamento (PATCH)
router.patch("/:pagamentoId/barbeiro/:barbeiroId", async (req, res) => {
  try {
    const { pagamentoId, barbeiroId } = req.params;
    const { pago, dataPagamento, atendimentoId } = req.body;

    const pagamento = await Pagamento.findById(pagamentoId);
    if (!pagamento) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }

    const targetBarbeiroId = new mongoose.Types.ObjectId(barbeiroId);

    const barbeiro = pagamento.barbeiros.find(
      (b) =>
        b.barbeiroId.equals(targetBarbeiroId) &&
        (!atendimentoId || String(b.atendimentoId) === String(atendimentoId))
    );

    if (!barbeiro) {
      return res.status(404).json({ error: "Barbeiro/atendimento não encontrado no pagamento" });
    }

    barbeiro.pago = pago;
    barbeiro.dataPagamento = dataPagamento;

    await pagamento.save();
    res.json(pagamento);
  } catch (err) {
    console.error("Erro ao atualizar barbeiro no pagamento:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Atualizar pagamento inteiro (PUT)
router.put("/:pagamentoId", async (req, res) => {
  try {
    const { pagamentoId } = req.params;
    const dados = req.body;

    const atualizado = await Pagamento.findByIdAndUpdate(
      pagamentoId,
      dados,
      { new: true }
    );

    if (!atualizado) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }

    res.json(atualizado);
  } catch (err) {
    console.error("Erro ao atualizar pagamento:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Deletar pagamento
router.delete("/:pagamentoId", async (req, res) => {
  try {
    const deletado = await Pagamento.findByIdAndDelete(req.params.pagamentoId);
    if (!deletado) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }
    res.json({ message: "Pagamento deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar pagamento:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Resumo mensal
router.get("/resumo/:anoMes", async (req, res) => {
  try {
    const { anoMes } = req.params; // formato "2025-11"

    const inicio = `${anoMes}-01`;
    const fim = `${anoMes}-31`;

    const pagamentos = await Pagamento.find({
      $or: [
        { tipo: "semanal", "periodo.inicio": { $regex: `^${anoMes}` } },
        { tipo: "mensal", "periodo.inicio": inicio, "periodo.fim": fim },
      ],
    });

    const semanais = pagamentos.filter((p) => p.tipo === "semanal");
    const mensal = pagamentos.find((p) => p.tipo === "mensal");

    const jaPagoSemanal = semanais.reduce(
      (acc, p) => acc + p.barbeiros.reduce((s, b) => s + (b.pago ? b.valor : 0), 0),
      0
    );

    const faltavaSemanal = semanais.reduce(
      (acc, p) => acc + p.barbeiros.reduce((s, b) => s + (!b.pago ? b.valor : 0), 0),
      0
    );

    res.json({
      mes: anoMes,
      jaPagoSemanal,
      faltavaSemanal,
      mensalRegistrado: !!mensal,
      mensal: mensal || null,
    });
  } catch (err) {
    console.error("Erro ao gerar resumo mensal:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;
