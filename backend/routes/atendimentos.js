import mongoose from "mongoose";
import Atendimento from "../models/Atendimento.js";

// Conectar ao MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  // 1. TRATAMENTO DO PREFLIGHT (OPTIONS)
  if (req.method === "OPTIONS") {
    // Cabeçalhos CORS já configurados no vercel.json
    return res.status(200).end();
  }

  // 2. GET /api/atendimentos → listar todos
  if (req.method === "GET" && req.url.endsWith("/atendimentos")) {
    try {
      const atendimentos = await Atendimento.find().sort({ data: -1 });
      return res.status(200).json(atendimentos);
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
      return res.status(500).json({ erro: "Erro ao buscar atendimentos" });
    }
  }

  // 3. GET /api/atendimentos/relatorio → gerar relatório com filtros
  if (req.method === "GET" && req.url.includes("/atendimentos/relatorio")) {
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
      return res.status(200).json(atendimentos);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      return res.status(500).json({ erro: "Erro ao gerar relatório" });
    }
  }

  // 4. POST /api/atendimentos → registrar atendimento finalizado
  if (req.method === "POST" && req.url.endsWith("/atendimentos")) {
    try {
      const { cliente, barbeiro, servicos } = req.body;

      const valorTotal = servicos.reduce((acc, s) => acc + s.preco, 0);

      const novoAtendimento = new Atendimento({
        cliente: {
          nome: cliente.nome,
          telefone: cliente.telefone,
        },
        barbeiro: {
          _id: barbeiro._id,
          nome: barbeiro.nome,
        },
        servicos,
        valorTotal,
        data: new Date(),
      });

      await novoAtendimento.save();
      return res.status(201).json(novoAtendimento);
    } catch (error) {
      console.error("Erro ao registrar atendimento:", error);
      return res.status(500).json({ erro: "Erro ao registrar atendimento" });
    }
  }

  // 5. MÉTODO NÃO SUPORTADO
  return res.status(405).end();
}

