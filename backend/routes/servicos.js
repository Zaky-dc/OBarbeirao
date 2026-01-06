const express = require("express");
const mongoose = require("mongoose");
const Servico = require("../models/Servico");

const router = express.Router();

// GET /api/servicos → listar todos
router.get("/", async (req, res) => {
  try {
    const servicos = await Servico.find();
    res.status(200).json(servicos);
  } catch (err) {
    console.error("Erro ao listar serviços:", err);
    res.status(500).json({ erro: "Erro interno ao listar serviços." });
  }
});

// POST /api/servicos → criar novo serviço
router.post("/", async (req, res) => {
  const { nome, preco, imageUrl } = req.body;
  if (!nome || !preco || !imageUrl) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
  }
  try {
    const novoServico = new Servico({ nome, preco, imageUrl });
    await novoServico.save();
    res.status(201).json(novoServico);
  } catch (err) {
    console.error("Erro ao salvar serviço:", err);
    res.status(500).json({ erro: "Erro interno ao salvar serviço." });
  }
});

// PUT /api/servicos/:id → atualizar serviço
router.put("/:id", async (req, res) => {
  let { nome, preco, imageUrl } = req.body;
  const { id } = req.params;

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

    res.status(200).json(servicoAtualizado);
  } catch (err) {
    console.error("Erro ao editar serviço:", err);
    res.status(500).json({ erro: "Erro interno ao editar serviço." });
  }
});

// DELETE /api/servicos/:id → remover serviço
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removido = await Servico.findByIdAndDelete(id);
    if (!removido) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }
    res.status(200).json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao apagar serviço:", err);
    res.status(500).json({ erro: "Erro interno ao apagar serviço." });
  }
});

module.exports = router;
