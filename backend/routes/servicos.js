import mongoose from "mongoose";
import Servico from "../models/Servico.js";

// Conectar ao MongoDB usando variável de ambiente
mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  // 1. TRATAMENTO DO PREFLIGHT (OPTIONS)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // 2. GET /api/servicos → listar todos
  if (req.method === "GET" && req.url.endsWith("/servicos")) {
    try {
      const servicos = await Servico.find();
      return res.status(200).json(servicos);
    } catch (err) {
      console.error("Erro ao listar serviços:", err);
      return res.status(500).json({ erro: "Erro interno ao listar serviços." });
    }
  }

  // 3. POST /api/servicos → criar novo serviço
  if (req.method === "POST" && req.url.endsWith("/servicos")) {
    const { nome, preco, imageUrl } = req.body;
    if (!nome || !preco || !imageUrl) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
    }
    try {
      const novoServico = new Servico({ nome, preco, imageUrl });
      await novoServico.save();
      return res.status(201).json(novoServico);
    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
      return res.status(500).json({ erro: "Erro interno ao salvar serviço." });
    }
  }

  // 4. PUT /api/servicos/:id → atualizar serviço
  if (req.method === "PUT" && req.url.match(/\/servicos\/[a-zA-Z0-9]+$/)) {
    let { nome, preco, imageUrl } = req.body;

    if (preco !== undefined) {
      preco = Number(preco);
      if (isNaN(preco)) {
        return res.status(400).json({ erro: "Preço inválido." });
      }
    }

    if (!nome && preco === undefined && !imageUrl) {
      return res.status(400).json({ erro: "Nenhum campo para atualizar." });
    }

    try {
      const id = req.url.split("/").pop();
      const servicoAtualizado = await Servico.findByIdAndUpdate(
        id,
        {
          ...(nome && { nome }),
          ...(preco !== undefined && { preco }),
          ...(imageUrl && { imageUrl }),
        },
        { new: true }
      );

      if (!servicoAtualizado) {
        return res.status(404).json({ erro: "Serviço não encontrado." });
      }

      return res.status(200).json(servicoAtualizado);
    } catch (err) {
      console.error("Erro ao editar serviço:", err);
      return res.status(500).json({ erro: "Erro interno ao editar serviço." });
    }
  }

  // 5. DELETE /api/servicos/:id → remover serviço
  if (req.method === "DELETE" && req.url.match(/\/servicos\/[a-zA-Z0-9]+$/)) {
    try {
      const id = req.url.split("/").pop();
      const removido = await Servico.findByIdAndDelete(id);
      if (!removido) {
        return res.status(404).json({ erro: "Serviço não encontrado." });
      }
      return res.status(200).json({ sucesso: true });
    } catch (err) {
      console.error("Erro ao apagar serviço:", err);
      return res.status(500).json({ erro: "Erro interno ao apagar serviço." });
    }
  }

  // 6. MÉTODO NÃO SUPORTADO
  return res.status(405).end();
}

