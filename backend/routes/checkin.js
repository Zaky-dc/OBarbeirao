import mongoose from "mongoose";
import Checkin from "../models/Checkin.js";
import Atendimento from "../models/Atendimento.js";

// Conectar ao MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  // 1. TRATAMENTO DO PREFLIGHT (OPTIONS)
  if (req.method === "OPTIONS") {
    // Configuração manual de CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // 🔹 POST /api/checkin → criar novo agendamento
  if (req.method === "POST" && req.url.endsWith("/checkin")) {
    try {
      const novo = new Checkin(req.body);
      await novo.save();
      return res.status(201).json(novo);
    } catch (err) {
      console.error("❌ Erro ao criar check-in:", err);
      return res.status(500).json({ erro: "Falha ao criar check-in." });
    }
  }

  // 🔹 GET /api/checkin?telefone=... → consultar agendamentos por telefone
  if (req.method === "GET" && req.url.endsWith("/checkin")) {
    let { telefone } = req.query;
    if (!telefone) {
      return res.status(400).json({ erro: "Telefone obrigatório para consulta." });
    }
    telefone = telefone.replace(/\D/g, "");
    try {
      const agendamentos = await Checkin.find({
        telefone,
        cancelado: { $ne: true }
      }).sort({ horario: -1 });

      if (agendamentos.length === 0) {
        return res.status(404).json({
          telefoneBuscado: telefone,
          mensagem: "Nenhum agendamento encontrado para este número."
        });
      }
      return res.json({ telefoneBuscado: telefone, total: agendamentos.length, dados: agendamentos });
    } catch (err) {
      console.error("❌ Erro ao consultar agendamentos:", err);
      return res.status(500).json({ erro: "Erro interno ao consultar agendamentos." });
    }
  }

  // 🔹 PATCH /api/checkin/cancelar/:id
  if (req.method === "PATCH" && req.url.includes("/checkin/cancelar/")) {
    try {
      const id = req.url.split("/").pop();
      const cancelado = await Checkin.findByIdAndUpdate(id, { cancelado: true }, { new: true });
      if (!cancelado) return res.status(404).json({ erro: "Agendamento não encontrado." });
      return res.json({ mensagem: "Agendamento cancelado com sucesso.", dados: cancelado });
    } catch (err) {
      console.error("❌ Erro ao cancelar agendamento:", err);
      return res.status(500).json({ erro: "Falha ao cancelar agendamento." });
    }
  }

  // 🔹 PATCH /api/checkin/:id → marcar como atendido
  if (req.method === "PATCH" && req.url.match(/\/checkin\/[a-zA-Z0-9]+$/)) {
    try {
      const id = req.url.split("/").pop();
      const atualizado = await Checkin.findByIdAndUpdate(id, { atendido: true }, { new: true });
      if (!atualizado) return res.status(404).json({ erro: "Check-in não encontrado." });
      return res.json(atualizado);
    } catch (err) {
      console.error("❌ Erro ao atualizar check-in:", err);
      return res.status(500).json({ erro: "Falha ao atualizar check-in." });
    }
  }

  // 🔹 PATCH /api/checkin/:id/servicos
  if (req.method === "PATCH" && req.url.includes("/checkin/") && req.url.includes("/servicos")) {
    try {
      const id = req.url.split("/")[2]; // /checkin/:id/servicos
      const checkin = await Checkin.findById(id);
      if (!checkin) return res.status(404).json({ erro: "Check-in não encontrado" });
      if (!Array.isArray(req.body.servicos)) return res.status(400).json({ erro: "Serviços inválidos" });

      checkin.servicos = req.body.servicos;
      if (req.body.barbeiro) checkin.barbeiro = req.body.barbeiro;
      await checkin.save();
      return res.json({ mensagem: "Serviços atualizados", dados: checkin });
    } catch (err) {
      console.error("Erro ao atualizar serviços:", err);
      return res.status(500).json({ erro: "Erro interno ao salvar serviços" });
    }
  }

  // 🔹 GET /api/checkin/relatorio?mes=...&ano=...
  if (req.method === "GET" && req.url.includes("/checkin/relatorio")) {
    const { mes, ano } = req.query;
    if (!mes || !ano) return res.status(400).json({ erro: "Mês e ano são obrigatórios." });
    const inicio = new Date(ano, mes - 1, 1);
    const fim = new Date(ano, mes, 1);
    try {
      const atendidos = await Checkin.find({
        createdAt: { $gte: inicio, $lt: fim },
        atendido: true,
        cancelado: { $ne: true }
      }).sort({ createdAt: -1 });
      return res.json({ total: atendidos.length, dados: atendidos });
    } catch (err) {
      console.error("❌ Erro ao gerar relatório:", err);
      return res.status(500).json({ erro: "Falha ao gerar relatório." });
    }
  }

  // 🔹 GET /api/checkin/fila-presencial
  if (req.method === "GET" && req.url.includes("/checkin/fila-presencial")) {
    try {
      const fila = await Checkin.find({
        origem: "presencial",
        cancelado: { $ne: true },
        atendido: false
      }).sort({ horario: 1 });
      return res.json({ total: fila.length, dados: fila });
    } catch (err) {
      console.error("❌ Erro ao consultar fila presencial:", err);
      return res.status(500).json({ erro: "Falha ao consultar fila." });
    }
  }

  // 🔹 POST /api/checkin-presencial
  if (req.method === "POST" && req.url.includes("/checkin-presencial")) {
    const { nome, telefone } = req.body;
    if (!nome || !telefone) return res.status(400).json({ erro: "Nome e telefone são obrigatórios." });
    const numeroLimpo = telefone.replace(/\D/g, "");
    try {
      const novo = new Checkin({ nome, telefone: numeroLimpo, horario: new Date(), origem: "presencial" });
      await novo.save();
      return res.status(201).json({ mensagem: "Check-in presencial registrado com sucesso.", dados: novo });
    } catch (err) {
      console.error("❌ Erro ao registrar check-in presencial:", err);
      return res.status(500).json({ erro: "Falha ao registrar check-in presencial." });
    }
  }

  // 🔹 POST /api/checkin/:id/finalizar
  if (req.method === "POST" && req.url.includes("/checkin/") && req.url.includes("/finalizar")) {
    try {
      const id = req.url.split("/")[2];
      const checkin = await Checkin.findById(id);
      if (!checkin) return res.status(404).json({ erro: "Check-in não encontrado" });
      const { barbeiro, servicos } = req.body;
      const valorTotal = servicos.reduce((acc, s) => acc + s.preco, 0);
      const atendimento = new Atendimento({
        cliente: { nome: checkin.nome, telefone: checkin.telefone },
        barbeiro,
        servicos,
        valorTotal,
        data: new Date()
      });
      await atendimento.save();
      await Checkin.findByIdAndDelete(id);
      return res.status(201).json(atendimento);
    } catch (err) {
      console.error("Erro ao finalizar atendimento:", err);
      return res.status(500).json({ erro: "Falha ao finalizar atendimento." });
    }
  }

  // 🔹 DELETE /api/checkin/:id
  if (req.method === "DELETE" && req.url.match(/\/checkin\/[a-zA-Z0-9]+$/)) {
    try {
      const id = req.url.split("/").pop();
      const removido = await Checkin.findByIdAndDelete(id);
      if (!removido) return res.status(404).json({ erro: "Check-in não encontrado" });
      return res.json({ mensagem: "Check-in removido com sucesso" });
    } catch (err) {
      console.error("Erro ao remover check-in:", err);
      return
