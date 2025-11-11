const express = require("express");
const router = express.Router();
const Servico = require("../models/Servico");

// GET /servicos
router.get("/", async (req, res) => {
  const servicos = await Servico.find();
  res.json(servicos);
});

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

// PUT /servicos/:id
router.put("/:id", async (req, res) => {
  let { nome, preco, imageUrl } = req.body;

  // Validação de tipo
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
      req.params.id,
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

    res.json(servicoAtualizado);
  } catch (err) {
    console.error("Erro ao editar serviço:", err);
    res.status(500).json({ erro: "Erro interno ao editar serviço." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const removido = await Servico.findByIdAndDelete(req.params.id);
    if (!removido)
      return res.status(404).json({ erro: "Serviço não encontrado." });
    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao apagar serviço:", err);
    res.status(500).json({ erro: "Erro interno ao apagar serviço." });
  }
});

module.exports = router;
