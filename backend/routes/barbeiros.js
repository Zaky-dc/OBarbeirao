import mongoose from "mongoose";
import Barbeiro from "../models/Barbeiro.js";
import Atendimento from "../models/Atendimento.js";
import jwt from "jsonwebtoken";

// Conectar ao MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI);

// Função auxiliar para autenticação (substitui authMiddleware)
function verificarToken(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ erro: "Token não fornecido" });
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "segredoBarbearia");
    return decoded;
  } catch (err) {
    res.status(401).json({ erro: "Token inválido" });
    return null;
  }
}

export default async function handler(req, res) {
  // 1. TRATAMENTO DO PREFLIGHT (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 2. GET /api/barbeiros → listar barbeiros ativos
  if (req.method === "GET" && req.url.endsWith("/barbeiros")) {
    try {
      const barbeiros = await Barbeiro.find({ ativo: true });
      return res.status(200).json(barbeiros);
    } catch (err) {
      console.error("Erro ao listar barbeiros:", err);
      return res.status(500).json({ erro: "Erro ao listar barbeiros" });
    }
  }

  // 3. GET /api/barbeiros/fecho-mensal → protegido
  if (req.method === "GET" && req.url.includes("/barbeiros/fecho-mensal")) {
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
        data: { $gte: inicio, $lt: fim }
      });

      const barbeiros = await Barbeiro.find();

      const resumo = barbeiros.map((barbeiro) => {
        const atendimentosDoBarbeiro = atendimentos.filter((a) => {
          if (!a.barbeiro) return false;
          const idAtendimento = a.barbeiro._id ? a.barbeiro._id : a.barbeiro;
          return String(idAtendimento) === String(barbeiro._id);
        });

        const receita = atendimentosDoBarbeiro.reduce((acc, a) => acc + (a.valorTotal || 0), 0);
        const taxa = barbeiro.taxaComissao || 0.3;
        const comissao = receita * taxa;

        return {
          barbeiro: barbeiro.nome,
          totalAtendimentos: atendimentosDoBarbeiro.length,
          receita,
          comissao,
          taxaComissao: taxa
        };
      });

      return res.status(200).json(resumo);
    } catch (error) {
      console.error("Erro ao gerar fecho mensal:", error);
      return res.status(500).json({ erro: "Erro ao gerar fecho mensal" });
    }
  }

  // 4. GET /api/barbeiros/:id → buscar barbeiro por ID
  if (req.method === "GET" && req.url.match(/\/barbeiros\/[a-zA-Z0-9]+$/)) {
    try {
      const id = req.url.split("/").pop();
      const barbeiro = await Barbeiro.findById(id);
      if (!barbeiro) {
        return res.status(404).json({ erro: "Barbeiro não encontrado" });
      }
      return res.status(200).json(barbeiro);
    } catch (err) {
      console.error("Erro ao buscar barbeiro:", err);
      return res.status(500).json({ erro: "Erro ao buscar barbeiro" });
    }
  }

  // 5. POST /api/barbeiros → protegido
  if (req.method === "POST" && req.url.endsWith("/barbeiros")) {
    const decoded = verificarToken(req, res);
    if (!decoded) return;

    try {
      const { nome, contacto, taxaComissao, imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ erro: "URL da imagem é obrigatória" });
      }

      const novo = new Barbeiro({ nome, contacto, taxaComissao, imageUrl });
      await novo.save();
      return res.status(201).json(novo);
    } catch (err) {
      console.error("Erro ao cadastrar barbeiro:", err);
      return res.status(500).json({ erro: "Erro ao cadastrar barbeiro" });
    }
  }

  // 6. PUT /api/barbeiros/:id → protegido
  if (req.method === "PUT" && req.url.match(/\/barbeiros\/[a-zA-Z0-9]+$/)) {
    const decoded = verificarToken(req, res);
    if (!decoded) return;

    try {
      const id = req.url.split("/").pop();
      const { nome, contacto, taxaComissao } = req.body;
      const atualizado = await Barbeiro.findByIdAndUpdate(
        id,
        { nome, contacto, taxaComissao },
        { new: true }
      );
      return res.status(200).json(atualizado);
    } catch (err) {
      console.error("Erro ao atualizar barbeiro:", err);
      return res.status(500).json({ erro: "Erro ao atualizar barbeiro" });
    }
  }

  // 7. DELETE /api/barbeiros/:id → protegido
  if (req.method === "DELETE" && req.url.match(/\/barbeiros\/[a-zA-Z0-9]+$/)) {
    const decoded = verificarToken(req, res);
    if (!decoded) return;

    try {
      const id = req.url.split("/").pop();
      await Barbeiro.findByIdAndDelete(id);
      return res.status(200).json({ mensagem: "Barbeiro removido com sucesso" });
    } catch (err) {
      console.error("Erro ao remover barbeiro:", err);
      return res.status(500).json({ erro: "Erro ao remover barbeiro" });
    }
  }

  // 8. MÉTODO NÃO SUPORTADO
  return res.status(405).end();
}

