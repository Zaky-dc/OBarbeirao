const express = require("express");
const mongoose = require("mongoose");
const Pagamento = require("../models/Pagamento");

const router = express.Router();

// 2. POST /api/pagamentos → criar novo pagamento
router.post("/", async (req, res) => {
  try {
    const { tipo, periodo } = req.body;

    if (tipo === "mensal") {
      const existente = await Pagamento.findOne({
        tipo: "mensal",
        "periodo.inicio": periodo.inicio,
        "periodo.fim": periodo.fim,
      });
      if (existente) {
        return res
          .status(400)
          .json({ error: "Pagamento mensal já registrado para este período." });
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

// 3. GET /api/pagamentos → listar todos
router.get("/", async (req, res) => {
  try {
    const pagamentos = await Pagamento.find();
    res.status(200).json(pagamentos);
  } catch (err) {
    console.error("Erro ao listar pagamentos:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// 4. GET /api/pagamentos/:id → buscar por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pagamento = await Pagamento.findById(id);
    if (!pagamento)
      return res.status(404).json({ error: "Pagamento não encontrado" });
    res.status(200).json(pagamento);
  } catch (err) {
    console.error("Erro ao buscar pagamento:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// 5. PATCH /api/pagamentos/:pagamentoId/barbeiro/:barbeiroId
router.patch("/:pagamentoId/barbeiro/:barbeiroId", async (req, res) => {
  try {
    const { pagamentoId, barbeiroId } = req.params;
    const { pago, dataPagamento, atendimentoId } = req.body;

    const pagamento = await Pagamento.findById(pagamentoId);
    if (!pagamento)
      return res.status(404).json({ error: "Pagamento não encontrado" });

    const targetBarbeiroId = new mongoose.Types.ObjectId(barbeiroId);
    const barbeiro = pagamento.barbeiros.find(
      (b) =>
        b.barbeiroId.equals(targetBarbeiroId) &&
        (!atendimentoId || String(b.atendimentoId) === String(atendimentoId))
    );
    if (!barbeiro)
      return res
        .status(404)
        .json({ error: "Barbeiro/atendimento não encontrado no pagamento" });

    barbeiro.pago = pago;
    barbeiro.dataPagamento = dataPagamento;
    await pagamento.save();

    res.status(200).json(pagamento);
  } catch (err) {
    console.error("Erro ao atualizar barbeiro no pagamento:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// 6. PUT /api/pagamentos/:id → atualizar pagamento inteiro
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const atualizado = await Pagamento.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!atualizado)
      return res.status(404).json({ error: "Pagamento não encontrado" });
    res.status(200).json(atualizado);
  } catch (err) {
    console.error("Erro ao atualizar pagamento:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// 7. DELETE /api/pagamentos/:id → deletar pagamento
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletado = await Pagamento.findByIdAndDelete(id);
    if (!deletado)
      return res.status(404).json({ error: "Pagamento não encontrado" });
    res.status(200).json({ message: "Pagamento deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar pagamento:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// 8. GET /api/pagamentos/resumo/:anoMes → resumo mensal
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
      (acc, p) =>
        acc + p.barbeiros.reduce((s, b) => s + (b.pago ? b.valor : 0), 0),
      0
    );
    const faltavaSemanal = semanais.reduce(
      (acc, p) =>
        acc + p.barbeiros.reduce((s, b) => s + (!b.pago ? b.valor : 0), 0),
      0
    );

    res.status(200).json({
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
