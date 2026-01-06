import mongoose from "mongoose";
import Pagamento from "../models/Pagamento.js";

// Conectar ao MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  // 1. TRATAMENTO DO PREFLIGHT (OPTIONS)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // 2. POST /api/pagamentos → criar novo pagamento
  if (req.method === "POST" && req.url.endsWith("/pagamentos")) {
    try {
      const { tipo, periodo } = req.body;

      if (tipo === "mensal") {
        const existente = await Pagamento.findOne({
          tipo: "mensal",
          "periodo.inicio": periodo.inicio,
          "periodo.fim": periodo.fim,
        });
        if (existente) {
          return res.status(400).json({ error: "Pagamento mensal já registrado para este período." });
        }
      }

      const novo = new Pagamento(req.body);
      await novo.save();
      return res.status(201).json(novo);
    } catch (err) {
      console.error("Erro ao criar pagamento:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 3. GET /api/pagamentos → listar todos
  if (req.method === "GET" && req.url.endsWith("/pagamentos")) {
    try {
      const pagamentos = await Pagamento.find();
      return res.status(200).json(pagamentos);
    } catch (err) {
      console.error("Erro ao listar pagamentos:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 4. GET /api/pagamentos/:id → buscar por ID
  if (req.method === "GET" && req.url.match(/\/pagamentos\/[a-zA-Z0-9]+$/)) {
    try {
      const id = req.url.split("/").pop();
      const pagamento = await Pagamento.findById(id);
      if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });
      return res.status(200).json(pagamento);
    } catch (err) {
      console.error("Erro ao buscar pagamento:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 5. PATCH /api/pagamentos/:pagamentoId/barbeiro/:barbeiroId
  if (req.method === "PATCH" && req.url.includes("/pagamentos/") && req.url.includes("/barbeiro/")) {
    try {
      const parts = req.url.split("/");
      const pagamentoId = parts[2];
      const barbeiroId = parts[4];
      const { pago, dataPagamento, atendimentoId } = req.body;

      const pagamento = await Pagamento.findById(pagamentoId);
      if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });

      const targetBarbeiroId = new mongoose.Types.ObjectId(barbeiroId);
      const barbeiro = pagamento.barbeiros.find(
        (b) =>
          b.barbeiroId.equals(targetBarbeiroId) &&
          (!atendimentoId || String(b.atendimentoId) === String(atendimentoId))
      );
      if (!barbeiro) return res.status(404).json({ error: "Barbeiro/atendimento não encontrado no pagamento" });

      barbeiro.pago = pago;
      barbeiro.dataPagamento = dataPagamento;
      await pagamento.save();

      return res.status(200).json(pagamento);
    } catch (err) {
      console.error("Erro ao atualizar barbeiro no pagamento:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 6. PUT /api/pagamentos/:id → atualizar pagamento inteiro
  if (req.method === "PUT" && req.url.match(/\/pagamentos\/[a-zA-Z0-9]+$/)) {
    try {
      const id = req.url.split("/").pop();
      const atualizado = await Pagamento.findByIdAndUpdate(id, req.body, { new: true });
      if (!atualizado) return res.status(404).json({ error: "Pagamento não encontrado" });
      return res.status(200).json(atualizado);
    } catch (err) {
      console.error("Erro ao atualizar pagamento:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 7. DELETE /api/pagamentos/:id → deletar pagamento
  if (req.method === "DELETE" && req.url.match(/\/pagamentos\/[a-zA-Z0-9]+$/)) {
    try {
      const id = req.url.split("/").pop();
      const deletado = await Pagamento.findByIdAndDelete(id);
      if (!deletado) return res.status(404).json({ error: "Pagamento não encontrado" });
      return res.status(200).json({ message: "Pagamento deletado com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar pagamento:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 8. GET /api/pagamentos/resumo/:anoMes → resumo mensal
  if (req.method === "GET" && req.url.includes("/pagamentos/resumo/")) {
    try {
      const anoMes = req.url.split("/").pop(); // formato "2025-11"
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

      return res.status(200).json({
        mes: anoMes,
        jaPagoSemanal,
        faltavaSemanal,
        mensalRegistrado: !!mensal,
        mensal: mensal || null,
      });
    } catch (err) {
      console.error("Erro ao gerar resumo mensal:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  // 9. MÉTODO NÃO SUPORTADO
  return res.status(405).end();
}

